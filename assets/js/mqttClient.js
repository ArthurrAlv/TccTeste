// assets/js/mqttClient.js

export function initializeWebSocket() {
    const socket = mqtt.connect('ws://localhost:3000'); // Use o caminho correto
    window.socket = socket;

    socket.on('connect', () => {
        console.log('Conectado ao broker MQTT');
    });

    socket.on('message', (topic, message) => {
        console.log(`Mensagem recebida do tópico ${topic}: ${message.toString()}`);
    });

    socket.on('error', (error) => {
        console.error('Erro no cliente MQTT:', error);
    });

    socket.on('close', () => {
        console.log('Desconectado do broker MQTT');
    });
}
