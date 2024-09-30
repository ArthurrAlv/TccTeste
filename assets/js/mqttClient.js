// assets/js/mqttClient.js

export function initializeWebSocket() {
    const socket = new WebSocket('ws://localhost:3000');

    socket.onopen = () => {
        console.log('Conectado ao WebSocket do servidor');
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(`Mensagem recebida do tópico ${data.topic}: ${data.message}`);
        // Faça o que precisar com a mensagem recebida
    };

    socket.onclose = () => {
        console.log('Desconectado do WebSocket do servidor');
    };

    socket.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
    };
}
