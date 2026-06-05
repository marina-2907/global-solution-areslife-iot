// ============================================================
//  AresLife — Backend API REST
//  Habitat Marciano · Monitoramento IoT ESP32
// ============================================================

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ── Estado interno do habitat ────────────────────────────────
// Esses valores são atualizados pelo ESP32 via POST /dados
// e consultados pelos endpoints GET

let habitatState = {
  temperatura: 23,
  umidade: 45,
  luminosidade: 60,
  oxigenio: 85,
  energia: 70,
  ultimaAtualizacao: new Date().toISOString(),
};

// Tripulantes fixos (podem ser gerenciados via endpoints)
let tripulantes = {
  astronautas: 5,
  turistas: 2,
};

// Histórico dos últimos 50 registros (para gráficos no dashboard)
let historico = [];

// ── Funções auxiliares ───────────────────────────────────────

/**
 * Calcula o status do habitat com base na temperatura.
 * Regras definidas no enunciado do projeto.
 */
function calcularStatus(temperatura) {
  if (temperatura < 30) return "SEGURO";
  if (temperatura < 40) return "ATENCAO";
  return "CRITICO";
}

/**
 * Gera os alertas ativos com base no estado atual do habitat.
 * Retorna um array de strings descrevendo os riscos.
 */
function gerarAlertas(state) {
  const alertas = [];

  // ── Temperatura ──
  if (state.temperatura >= 40) {
    alertas.push("Risco crítico de superaquecimento");
  } else if (state.temperatura >= 30) {
    alertas.push("Temperatura elevada — atenção recomendada");
  }

  // ── Oxigênio ──
  if (state.oxigenio < 50) {
    alertas.push("Nível de oxigênio crítico — risco à tripulação");
  } else if (state.oxigenio < 65) {
    alertas.push("Oxigênio abaixo do ideal");
  }

  // ── Energia ──
  if (state.energia < 30) {
    alertas.push("Reserva de energia crítica — sistemas em risco");
  } else if (state.energia < 50) {
    alertas.push("Energia abaixo de 50% — monitorar consumo");
  }

  // ── Umidade ──
  if (state.umidade > 80) {
    alertas.push("Umidade excessiva — risco de condensação nos equipamentos");
  } else if (state.umidade < 20) {
    alertas.push("Umidade muito baixa — desconforto à tripulação");
  }

  if (alertas.length === 0) {
    alertas.push("Nenhum alerta ativo — habitat operando normalmente");
  }

  return alertas;
}

/**
 * Salva um snapshot no histórico (máx 50 registros).
 */
function salvarHistorico(state) {
  historico.push({
    ...state,
    status: calcularStatus(state.temperatura),
    timestamp: new Date().toISOString(),
  });
  if (historico.length > 50) historico.shift();
}

// ── Rotas ────────────────────────────────────────────────────

// --------------------------------------------------------
//  GET /
//  Rota raiz — documentação rápida da API
// --------------------------------------------------------
app.get("/", (req, res) => {
  res.json({
    projeto: "AresLife — Habitat Marciano",
    versao: "1.0.0",
    descricao: "API REST para monitoramento IoT do habitat marciano via ESP32",
    endpoints: {
      "GET  /habitat": "Dados atuais do habitat (temperatura, oxigênio, energia…)",
      "GET  /alertas": "Alertas ativos com base no estado atual",
      "GET  /tripulantes": "Número de astronautas e turistas a bordo",
      "GET  /historico": "Últimos 50 registros de telemetria",
      "GET  /status": "Status resumido do habitat (SEGURO / ATENCAO / CRITICO)",
      "POST /dados": "Recebe dados do ESP32 e atualiza o estado do habitat",
      "POST /tripulantes": "Atualiza o número de tripulantes",
      "GET  /dashboard": "Dashboard visual do habitat",
    },
    nota: "Use POST /dados para enviar leituras do ESP32.",
  });
});

// --------------------------------------------------------
//  GET /habitat
//  Retorna os dados atuais do habitat
// --------------------------------------------------------
app.get("/habitat", (req, res) => {
  res.json({
    temperatura: habitatState.temperatura,   // °C
    umidade: habitatState.umidade,           // %
    luminosidade: habitatState.luminosidade, // %
    oxigenio: habitatState.oxigenio,         // %
    energia: habitatState.energia,           // %
    status: calcularStatus(habitatState.temperatura),
    ultimaAtualizacao: habitatState.ultimaAtualizacao,
  });
});

// --------------------------------------------------------
//  GET /alertas
//  Retorna alertas gerados com base no estado atual
// --------------------------------------------------------
app.get("/alertas", (req, res) => {
  const status = calcularStatus(habitatState.temperatura);
  const alertas = gerarAlertas(habitatState);

  res.json({
    status,
    alertas,
    totalAlertas: alertas.length,
    timestamp: new Date().toISOString(),
  });
});

// --------------------------------------------------------
//  GET /tripulantes
//  Retorna informações sobre a tripulação
// --------------------------------------------------------
app.get("/tripulantes", (req, res) => {
  res.json({
    astronautas: tripulantes.astronautas,
    turistas: tripulantes.turistas,
    total: tripulantes.astronautas + tripulantes.turistas,
  });
});

// --------------------------------------------------------
//  GET /historico
//  Retorna os últimos registros de telemetria
// --------------------------------------------------------
app.get("/historico", (req, res) => {
  const limite = parseInt(req.query.limite) || 20;
  const registros = historico.slice(-Math.min(limite, 50));

  res.json({
    total: registros.length,
    registros,
  });
});

// --------------------------------------------------------
//  GET /status
//  Retorna apenas o status atual de forma resumida
// --------------------------------------------------------
app.get("/status", (req, res) => {
  const status = calcularStatus(habitatState.temperatura);
  res.json({
    status,
    temperatura: habitatState.temperatura,
    ultimaAtualizacao: habitatState.ultimaAtualizacao,
  });
});

// --------------------------------------------------------
//  POST /dados
//  ESP32 envia leituras dos sensores para este endpoint
//
//  Body esperado (JSON):
//  {
//    "temperatura": 23.5,
//    "umidade": 48.2,
//    "luminosidade": 62,
//    "oxigenio": 84,
//    "energia": 71
//  }
// --------------------------------------------------------
app.post("/dados", (req, res) => {
  const { temperatura, umidade, luminosidade, oxigenio, energia } = req.body;

  // Validação: temperatura é obrigatória (lida pelo DHT22)
  if (temperatura === undefined || temperatura === null) {
    return res.status(400).json({
      erro: "Campo 'temperatura' é obrigatório.",
      exemplo: {
        temperatura: 23.5,
        umidade: 48.2,
        luminosidade: 62,
        oxigenio: 84,
        energia: 71,
      },
    });
  }

  // Atualiza o estado global
  habitatState = {
    temperatura: parseFloat(temperatura),
    umidade: umidade !== undefined ? parseFloat(umidade) : habitatState.umidade,
    luminosidade: luminosidade !== undefined ? parseFloat(luminosidade) : habitatState.luminosidade,
    oxigenio: oxigenio !== undefined ? parseFloat(oxigenio) : habitatState.oxigenio,
    energia: energia !== undefined ? parseFloat(energia) : habitatState.energia,
    ultimaAtualizacao: new Date().toISOString(),
  };

  // Persiste no histórico
  salvarHistorico(habitatState);

  const status = calcularStatus(habitatState.temperatura);

  res.status(200).json({
    mensagem: "Dados recebidos com sucesso",
    status,
    dadosRecebidos: habitatState,
  });
});

// --------------------------------------------------------
//  POST /tripulantes
//  Atualiza o número de tripulantes no habitat
//
//  Body esperado:
//  { "astronautas": 5, "turistas": 2 }
// --------------------------------------------------------
app.post("/tripulantes", (req, res) => {
  const { astronautas, turistas } = req.body;

  if (astronautas !== undefined) tripulantes.astronautas = parseInt(astronautas);
  if (turistas !== undefined) tripulantes.turistas = parseInt(turistas);

  res.json({
    mensagem: "Tripulação atualizada",
    tripulantes: {
      ...tripulantes,
      total: tripulantes.astronautas + tripulantes.turistas,
    },
  });
});


// --------------------------------------------------------
//  GET /dashboard
//  Interface visual para monitoramento do habitat
// --------------------------------------------------------
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// ── Rota 404 ─────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    erro: "Endpoint não encontrado",
    sugestao: "Acesse GET / para ver todos os endpoints disponíveis",
  });
});

// ── Iniciar servidor ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║       AresLife — Backend API REST        ║");
  console.log("║         Habitat Marciano · IoT           ║");
  console.log("╠══════════════════════════════════════════╣");
  console.log(`║  Servidor rodando em http://localhost:${PORT} ║`);
  console.log("╠══════════════════════════════════════════╣");
  console.log("║  Endpoints disponíveis:                  ║");
  console.log("║   GET  /habitat                          ║");
  console.log("║   GET  /alertas                          ║");
  console.log("║   GET  /tripulantes                      ║");
  console.log("║   GET  /historico                        ║");
  console.log("║   GET  /status                           ║");
  console.log("║   POST /dados      ← ESP32 envia aqui   ║");
  console.log("║   POST /tripulantes                      ║");
  console.log("║   GET  /dashboard                        ║");
  console.log("╚══════════════════════════════════════════╝");
});
