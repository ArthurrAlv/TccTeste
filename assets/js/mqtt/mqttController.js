// assets/js/mqtt/mqttController.js
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883'); // URL do broker MQTT

client.on('connect', () => {
    console.log('Conectado ao broker MQTT');
    client.subscribe('controle/lanches', (err) => {
        if (err) {
            console.error('Erro ao se inscrever:', err);
        }
    });
});

client.on('message', (topic, message) => {
    console.log(`Mensagem recebida em ${topic}: ${message.toString()}`);
    // Lógica para atualizar a lista de lanches na página
});

// Função para publicar uma nova ID
function adicionarID(id, nome) {
    const data = { id, nome };
    client.publish('controle/lanches', JSON.stringify(data));
}

// Função para excluir uma ID
function excluirID(id) {
    const data = { id };
    client.publish('controle/lanches/excluir', JSON.stringify(data));
}