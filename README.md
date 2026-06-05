# 🚀 AresLife — Backend API REST + Dashboard

> **Projeto IoT AresLife** — API REST e dashboard web para monitoramento de um habitat marciano via ESP32.

---

## Integrantes

| Nome                          | RM        |
| ----------------------------- | --------- |
| Felipe Maglio Filho           | RM 563512 |
| João Pedro Bitencourt Goldoni | RM 564339 |
| Marina Tamagnini Magalhães    | RM 561786 |
| Mateus Granja dos Santos      | RM 564930 |
| Vitória Valentina Maglio      | RM 563509 |

---

## 🌌 Conceito do Projeto

O AresLife é um protótipo IoT que representa um habitat marciano, monitorando condições essenciais para a sobrevivência de astronautas e turistas espaciais.

O ESP32 coleta dados simulados por sensores, envia essas informações para uma API REST e o dashboard web exibe os indicadores de forma visual, permitindo acompanhar o estado geral do habitat.

---

## 📋 Visão Geral

Esta API recebe dados dos sensores do ESP32, como temperatura, umidade, luminosidade, oxigênio e energia, e disponibiliza essas informações via endpoints REST para o dashboard web.

A solução está dividida em três partes:

| Parte | Responsável | Entrega |
|-------|-------------|---------|
| Parte 1 — IoT/Hardware | Integrante 1 | ESP32, sensores, LEDs, OLED e simulação no Wokwi |
| Parte 2 — Backend API | Integrante 2 | API REST, endpoints JSON e regras de alerta |
| Parte 3 — Dashboard, Documentação e Apresentação** | Integrante 3 | Interface web, README, vídeo e apresentação |

---

## 🛠️ Tecnologias

- **Node.js** (v16+)
- **Express** — framework HTTP
- **CORS** — liberação de acesso para o dashboard
- **HTML, CSS e JavaScript** — dashboard web
- **ESP32/Wokwi** — simulação IoT

---

## ⚙️ Como rodar

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o servidor

```bash
# Produção
npm start

# Desenvolvimento
npm run dev
```

O servidor estará disponível em:

```txt
http://localhost:3000
```

---

## 📊 Dashboard Visual — Parte 3

Além dos endpoints JSON, a API possui um dashboard web para visualização dos dados do habitat.

Com o servidor rodando, acesse:

```txt
http://localhost:3000/dashboard
```

O dashboard exibe:

- Temperatura;
- Umidade;
- Luminosidade;
- Oxigênio;
- Energia;
- Status geral do habitat;
- Alertas ativos;
- Tripulantes;
- Histórico de telemetria.

O painel também possui botões de simulação que enviam dados para o endpoint `POST /dados`, representando o mesmo formato JSON enviado pelo ESP32.

### Objetivo do Dashboard

O objetivo do dashboard é transformar os dados recebidos da API em informações visuais, facilitando o acompanhamento das condições do habitat marciano e permitindo identificar rapidamente situações de risco.

### Funcionalidades da Parte 3

- Consumo dos endpoints da API REST;
- Exibição dos dados em tempo real;
- Apresentação visual dos indicadores do habitat;
- Exibição de alertas de risco;
- Histórico dos últimos registros;
- Botões para simular estados seguro, atenção e crítico;
- Organização da documentação no README;
- Apoio para gravação do vídeo e apresentação final.

---

## 📡 Endpoints da API

### `GET /habitat`

Retorna os dados atuais do habitat.

**Resposta:**

```json
{
  "temperatura": 23,
  "umidade": 45,
  "luminosidade": 60,
  "oxigenio": 85,
  "energia": 70,
  "status": "SEGURO",
  "ultimaAtualizacao": "2025-01-01T12:00:00.000Z"
}
```

---

### `GET /alertas`

Retorna os alertas ativos com base no estado atual do habitat.

**Resposta:**

```json
{
  "status": "ATENCAO",
  "alertas": [
    "Temperatura elevada — atenção recomendada"
  ],
  "totalAlertas": 1,
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

**Regras de alerta:**

| Condição | Alerta gerado |
|----------|--------------|
| Temperatura ≥ 40°C | Risco crítico de superaquecimento |
| 30°C ≤ Temperatura < 40°C | Temperatura elevada — atenção recomendada |
| Oxigênio < 50% | Nível de oxigênio crítico |
| Oxigênio < 65% | Oxigênio abaixo do ideal |
| Energia < 30% | Reserva de energia crítica |
| Energia < 50% | Energia abaixo de 50% |
| Umidade > 80% | Umidade excessiva |
| Umidade < 20% | Umidade muito baixa |

---

### `GET /tripulantes`

Retorna a tripulação atual do habitat.

**Resposta:**

```json
{
  "astronautas": 5,
  "turistas": 2,
  "total": 7
}
```

---

### `GET /historico?limite=20`

Retorna os últimos registros de telemetria, com limite máximo de 50 registros.

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `limite` | int | 20 | Quantidade de registros retornados |

**Resposta:**

```json
{
  "total": 5,
  "registros": [
    {
      "temperatura": 23,
      "umidade": 45,
      "luminosidade": 60,
      "oxigenio": 85,
      "energia": 70,
      "status": "SEGURO",
      "timestamp": "2025-01-01T12:00:00.000Z"
    }
  ]
}
```

---

### `GET /status`

Retorna apenas o status resumido do habitat.

**Resposta:**

```json
{
  "status": "SEGURO",
  "temperatura": 23,
  "ultimaAtualizacao": "2025-01-01T12:00:00.000Z"
}
```

**Possíveis valores de `status`:**

| Status | Condição |
|--------|----------|
| `SEGURO` | Temperatura < 30°C |
| `ATENCAO` | 30°C ≤ Temperatura < 40°C |
| `CRITICO` | Temperatura ≥ 40°C |

---

### `POST /dados`

Recebe os dados dos sensores do ESP32 e atualiza o estado do habitat.

**Body (JSON):**

```json
{
  "temperatura": 23.5,
  "umidade": 48.2,
  "luminosidade": 62,
  "oxigenio": 84,
  "energia": 71
}
```

> O campo `temperatura` é obrigatório. Os demais são opcionais; se não enviados, mantêm o valor anterior.

**Resposta:**

```json
{
  "mensagem": "Dados recebidos com sucesso",
  "status": "SEGURO",
  "dadosRecebidos": {
    "temperatura": 23.5,
    "umidade": 48.2,
    "luminosidade": 62,
    "oxigenio": 84,
    "energia": 71,
    "ultimaAtualizacao": "2025-01-01T12:00:00.000Z"
  }
}
```

---

### `POST /tripulantes`

Atualiza o número de tripulantes no habitat.

**Body (JSON):**

```json
{
  "astronautas": 5,
  "turistas": 3
}
```

**Resposta:**

```json
{
  "mensagem": "Tripulação atualizada",
  "tripulantes": {
    "astronautas": 5,
    "turistas": 3,
    "total": 8
  }
}
```

---

## 🔌 Integração ESP32 → API

O endpoint responsável por receber os dados do ESP32 é:

```txt
POST /dados
```

Exemplo de JSON esperado:

```json
{
  "temperatura": 24,
  "umidade": 40,
  "luminosidade": 24,
  "oxigenio": 54,
  "energia": 39
}
```

### Trecho para envio no ESP32

```cpp
void enviarDados(float temp, float umid, int luzPerc, int oxigenio, int energia) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin("http://SEU_IP:3000/dados");
    http.addHeader("Content-Type", "application/json");

    String payload = "{";
    payload += "\"temperatura\":" + String(temp, 1) + ",";
    payload += "\"umidade\":" + String(umid, 1) + ",";
    payload += "\"luminosidade\":" + String(luzPerc) + ",";
    payload += "\"oxigenio\":" + String(oxigenio) + ",";
    payload += "\"energia\":" + String(energia);
    payload += "}";

    int httpCode = http.POST(payload);
    Serial.print("POST /dados → HTTP ");
    Serial.println(httpCode);

    http.end();
  }
}
```

> Chamar `enviarDados(temp, umid, luzPercentual, oxigenio, energia);` dentro do `loop()` existente.

---

## ⚠️ Observação sobre Wokwi e API Local

No Wokwi, a simulação roda em um ambiente de rede isolado e normalmente não acessa diretamente uma API local em `localhost` ou no IP privado do computador.

Por isso, a validação da comunicação com a API pode ser demonstrada de duas formas:

1. Usando os botões do dashboard, que enviam exatamente o mesmo JSON para o endpoint `POST /dados`;
2. Usando `curl` ou ferramentas como Postman/Insomnia para enviar dados manualmente para a API.

Exemplo com `curl`:

```bash
curl -X POST http://localhost:3000/dados \
-H "Content-Type: application/json" \
-d "{\"temperatura\":42,\"umidade\":55,\"luminosidade\":70,\"oxigenio\":45,\"energia\":25}"
```

Para ESP32 físico na mesma rede Wi-Fi do computador, basta usar no código o IP local do computador onde a API está rodando, por exemplo:

```cpp
const char* serverUrl = "http://192.168.1.152:3000/dados";
```

---

## 🧪 Como testar

Com o servidor rodando, acesse:

```txt
http://localhost:3000/dashboard
```

Teste também os endpoints no navegador:

```txt
http://localhost:3000/habitat
http://localhost:3000/alertas
http://localhost:3000/tripulantes
http://localhost:3000/historico
http://localhost:3000/status
```

Para testar o envio de dados:

```bash
curl -X POST http://localhost:3000/dados \
-H "Content-Type: application/json" \
-d "{\"temperatura\":24,\"umidade\":40,\"luminosidade\":24,\"oxigenio\":54,\"energia\":39}"
```

---

## 🗂️ Estrutura do Projeto

```txt
areslife-backend/
├── public/
│   └── dashboard.html      ← Interface web do dashboard
├── server.js               ← API principal com todos os endpoints
├── package.json            ← Dependências e scripts
├── package-lock.json       ← Controle das versões instaladas
└── README.md               ← Documentação do projeto
```



*AresLife — Habitat Marciano · Projeto IoT com ESP32*
