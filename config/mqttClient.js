// config/mqttClient.js
const mqtt = require('mqtt');

// Cria o cliente MQTT e se conecta ao broker
const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log('Conectado ao broker MQTT');
});

client.on('error', (err) => {
  console.error('Erro de conexão MQTT:', err);
});

module.exports = client;
