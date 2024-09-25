// main.js
import { initNavigation } from './navigation.js';
import { goBack } from './helpers.js';
import { initializeMQTT } from './mqttClient.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();

    // Associa o evento de clique ao botão "Voltar"
    const backButton = document.querySelector('#back-button');
    if (backButton) {
        backButton.addEventListener('click', goBack);
    }

    // Inicializa a conexão MQTT
    initializeMQTT();
});
