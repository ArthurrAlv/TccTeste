// config/mqttClient.js
const mqtt = require('mqtt');

// Cria o cliente MQTT e se conecta ao broker
const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log('Conectado ao broker MQTT');
});

client.on('message', (topic, message) => {
  console.log(`Mensagem recebida no tópico ${topic}:`, message.toString());
});

client.on('error', (err) => {
  console.error('Erro de conexão MQTT:', err);
});

// Assinatura de tópicos que você espera receber
client.subscribe('digitais/#'); // Substitua pelo tópico correto

module.exports = client;
