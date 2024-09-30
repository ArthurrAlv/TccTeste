// config/mqttWebSocket.js
const WebSocket = require('ws');
const mqttClient = require('./mqttClient'); // Importando o cliente MQTT

// Configurar o servidor WebSocket
let wss;
function initializeWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', ws => {
    console.log('Cliente conectado ao WebSocket');
    
    ws.on('message', message => {
      console.log(`Mensagem recebida do cliente WebSocket: ${message}`);
    });

    ws.on('close', () => {
      console.log('Cliente desconectado do WebSocket');
    });
  });

  console.log('Servidor WebSocket inicializado');
}

// Lidando com mensagens MQTT recebidas
mqttClient.on('message', (topic, message) => {
  console.log(`Mensagem recebida do tópico ${topic}: ${message.toString()}`);
  
  // Envia a mensagem para todos os clientes conectados ao WebSocket
  if (wss) {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ topic, message: message.toString() }));
      }
    });
  }
});

// Inscreve-se nos tópicos de interesse
mqttClient.subscribe('digitais/+');

module.exports = {
  initializeWebSocket
};
