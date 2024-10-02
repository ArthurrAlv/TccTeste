// assets/js/mqttClient.js
import mqtt from 'mqtt';

export function initializeWebSocket() {
    // Conecta ao broker MQTT usando a URL WebSocket apropriada
    const socket = mqtt.connect('ws://localhost:3000'); // Altere para a porta correta

    window.socket = socket;

    socket.on('connect', () => {
        console.log('Conectado ao broker MQTT');
    });

    socket.on('message', (topic, message) => {
        console.log(`Mensagem recebida do tópico ${topic}: ${message.toString()}`);
        // Faça o que precisar com a mensagem recebida
    });

    socket.on('error', (error) => {
        console.error('Erro no cliente MQTT:', error);
    });

    socket.on('close', () => {
        console.log('Desconectado do broker MQTT');
    });
}
