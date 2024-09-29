// assets/js/mqttClient.js
import mqtt from 'mqtt/dist/mqtt.min.js';


export function initializeMQTT() {
    const client = mqtt.connect('ws://localhost:9001'); // Adaptar para o protocolo WebSocket

    client.on('connect', () => {
        console.log('Conectado ao broker MQTT via WebSocket');
    });

    client.subscribe('digitais/+', (err) => {
        if (!err) {
            console.log('Inscrito nos tópicos de digitais');
        }
    });

    client.on('message', (topic, message) => {
        console.log(`Mensagem recebida do tópico ${topic}: ${message.toString()}`);
    });
}
