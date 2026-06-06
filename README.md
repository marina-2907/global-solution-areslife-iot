# AresLife — API REST + Dashboard IoT

> Projeto IoT AresLife — API REST e dashboard web para monitoramento de um habitat marciano via ESP32.

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

## Conceito do Projeto

O **AresLife** é um protótipo IoT que representa um habitat marciano, simulando o monitoramento de condições essenciais para a sobrevivência de astronautas e turistas espaciais.

A solução utiliza um **ESP32** como base do protótipo, sensores para coleta de dados, uma **API REST** para recebimento e processamento das informações e um **dashboard web** para visualização dos indicadores do habitat.

O objetivo é simular desafios reais relacionados à colonização de Marte e ao turismo espacial, como controle de temperatura, oxigênio, energia, umidade, luminosidade e alertas de risco.

---

## Visão Geral

A aplicação recebe dados simulados dos sensores do ESP32, como temperatura, umidade, luminosidade, oxigênio e energia, e disponibiliza essas informações por meio de endpoints REST.

Esses dados são consumidos por um dashboard web, que exibe os indicadores do habitat de forma visual e permite acompanhar o status geral do ambiente em tempo real.

A solução é composta por três módulos principais:

| Módulo           | Descrição                                                                           |
| ---------------- | ----------------------------------------------------------------------------------- |
| IoT e Hardware   | Simulação do habitat marciano com ESP32, sensores, LEDs, display OLED e Wokwi       |
| Backend API REST | Recebimento dos dados do ESP32, endpoints JSON e regras de alerta                   |
| Dashboard Web    | Interface visual para monitoramento dos indicadores, alertas e histórico do habitat |

---

## Arquitetura da Solução

O fluxo da solução funciona da seguinte forma:

1. O ESP32 realiza a leitura dos sensores no ambiente simulado;
2. Os dados são enviados para a API REST por meio do endpoint `POST /dados`;
3. A API processa as informações e aplica as regras de alerta;
4. O dashboard consome os endpoints da API e exibe os dados em tempo real;
5. O usuário acompanha temperatura, umidade, luminosidade, oxigênio, energia, tripulantes, status e alertas do habitat.

```txt
ESP32/Wokwi -> API REST Node.js -> Dashboard Web
```

---

## Módulo IoT e Hardware

O módulo IoT representa o habitat marciano por meio de um protótipo com ESP32, sensores e atuadores.

### Entradas

* **Sensor DHT22**: mede temperatura e umidade;
* **Sensor LDR ou botão de emergência**: simula luminosidade ou acionamento manual de alerta.

### Saídas

* **LED verde**: indica condições normais do habitat;
* **LED vermelho**: indica situação de risco ou alerta.

### Interface Local

O protótipo também utiliza um display OLED para exibir informações importantes do habitat, como:

* Temperatura;
* Nível de recursos;
* Status geral do ambiente.

### Simulação

A simulação do circuito pode ser realizada no **Wokwi**, permitindo validar o funcionamento dos sensores, LEDs, display OLED e comunicação Wi-Fi do ESP32.

---

## Tecnologias

* **ESP32** — microcontrolador utilizado no protótipo IoT;
* **Wokwi** — simulação do circuito IoT;
* **DHT22** — sensor de temperatura e umidade;
* **LDR/Botão** — entrada para luminosidade ou alerta manual;
* **LEDs** — indicação visual de status;
* **OLED** — interface local do habitat;
* **Node.js** — ambiente de execução JavaScript;
* **Express** — framework para criação da API REST;
* **CORS** — liberação de acesso para o dashboard;
* **HTML, CSS e JavaScript** — desenvolvimento do dashboard web.

---

## Como Rodar o Projeto

Antes de executar os comandos, abra o terminal dentro da pasta principal do projeto, onde estão os arquivos `package.json`, `server.js` e a pasta `public`.

Se estiver usando o projeto baixado ou extraído no Windows, acesse a pasta correta com o comando:

```powershell
cd C:\Users\marin\Downloads\areslife-backend-final\areslife-backend-final
```

Se o projeto foi clonado do GitHub, entre na pasta onde o repositório foi salvo:

```powershell
cd caminho-da-pasta-do-projeto
```

Para conferir se está na pasta correta, execute:

```powershell
dir
```

A pasta correta deve conter arquivos como:

```txt
package.json
server.js
public
README.md
```

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o servidor

```bash
npm start
```

Para desenvolvimento, também é possível utilizar:

```bash
npm run dev
```

O servidor estará disponível em:

```txt
http://localhost:3000
```

Para acessar o dashboard, utilize:

```txt
http://localhost:3000/dashboard
```

---

## Dashboard Visual

Além dos endpoints JSON, a aplicação possui um dashboard web para visualização dos dados do habitat.

Com o servidor rodando, acesse:

```txt
http://localhost:3000/dashboard
```

O dashboard exibe:

* Temperatura;
* Umidade;
* Luminosidade;
* Oxigênio;
* Energia;
* Status geral do habitat;
* Alertas ativos;
* Tripulantes;
* Histórico de telemetria.

O painel também possui botões de simulação que enviam dados para o endpoint `POST /dados`, representando o mesmo formato JSON enviado pelo ESP32.

### Objetivo do Dashboard

O objetivo do dashboard é transformar os dados recebidos da API em informações visuais, facilitando o acompanhamento das condições do habitat marciano e permitindo identificar rapidamente situações de risco.

### Funcionalidades do Dashboard

* Consumo dos endpoints da API REST;
* Exibição dos dados do habitat;
* Apresentação visual dos indicadores;
* Exibição do status geral;
* Exibição de alertas de risco;
* Histórico dos últimos registros;
* Botões para simular estados seguro, atenção e crítico;
* Visualização da quantidade de astronautas e turistas.

---

## Endpoints da API

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

### Regras de Alerta

| Condição                   | Alerta gerado                             |
| -------------------------- | ----------------------------------------- |
| Temperatura >= 40°C        | Risco crítico de superaquecimento         |
| 30°C <= Temperatura < 40°C | Temperatura elevada — atenção recomendada |
| Oxigênio < 50%             | Nível de oxigênio crítico                 |
| Oxigênio < 65%             | Oxigênio abaixo do ideal                  |
| Energia < 30%              | Reserva de energia crítica                |
| Energia < 50%              | Energia abaixo de 50%                     |
| Umidade > 80%              | Umidade excessiva                         |
| Umidade < 20%              | Umidade muito baixa                       |

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

| Parâmetro | Tipo | Padrão | Descrição                          |
| --------- | ---- | ------ | ---------------------------------- |
| `limite`  | int  | 20     | Quantidade de registros retornados |

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

### Possíveis valores de `status`

| Status    | Condição                   |
| --------- | -------------------------- |
| `SEGURO`  | Temperatura < 30°C         |
| `ATENCAO` | 30°C <= Temperatura < 40°C |
| `CRITICO` | Temperatura >= 40°C        |

---

### `POST /dados`

Recebe os dados dos sensores do ESP32 e atualiza o estado do habitat.

**Body JSON:**

```json
{
  "temperatura": 23.5,
  "umidade": 48.2,
  "luminosidade": 62,
  "oxigenio": 84,
  "energia": 71
}
```

> O campo `temperatura` é obrigatório. Os demais campos são opcionais; se não forem enviados, mantêm o valor anterior.

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

**Body JSON:**

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

## Integração ESP32 para API

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
    Serial.print("POST /dados -> HTTP ");
    Serial.println(httpCode);

    http.end();
  }
}
```

> Chamar `enviarDados(temp, umid, luzPercentual, oxigenio, energia);` dentro do `loop()` existente.

---

## Observação sobre Wokwi e API Local

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

## Como Testar

Com o servidor rodando, acesse o dashboard:

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

Para testar o envio de dados manualmente:

```bash
curl -X POST http://localhost:3000/dados \
-H "Content-Type: application/json" \
-d "{\"temperatura\":24,\"umidade\":40,\"luminosidade\":24,\"oxigenio\":54,\"energia\":39}"
```

Também é possível testar diretamente pelo dashboard usando os botões de simulação:

* Simular estado seguro;
* Simular estado de atenção;
* Simular estado crítico.

---

## Vídeo Demonstrativo

O vídeo demonstrativo apresenta o funcionamento do projeto AresLife, mostrando o dashboard web consumindo os dados da API REST e exibindo os indicadores do habitat marciano.

Durante a demonstração, são apresentados os estados **seguro**, **atenção** e **crítico**, além dos alertas ativos, histórico de telemetria e endpoints JSON da API.

**Link do vídeo:**
[Assistir ao vídeo demonstrativo](https://youtu.be/1XyA26oryxM)

---

## Estrutura do Projeto

```txt
areslife-backend/
├── public/
│   └── dashboard.html      <- Interface web do dashboard
├── server.js               <- API principal com todos os endpoints
├── package.json            <- Dependências e scripts
├── package-lock.json       <- Controle das versões instaladas
└── README.md               <- Documentação do projeto
```

---

## Status da Entrega

* Protótipo IoT com ESP32 simulado;
* API REST com endpoints JSON;
* Regras de alerta implementadas;
* Dashboard web para visualização dos dados;
* Testes de endpoints realizados;
* Documentação organizada no README;
* Apresentação e vídeo demonstrativo da solução.

---

*AresLife — Habitat Marciano · Projeto IoT com ESP32*
