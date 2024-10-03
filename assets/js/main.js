// assets/js/main.js
import { initNavigation } from './navigation.js';
import { goBack } from './helpers.js';
import { initializeSearch } from './search.js'; 
import { initializeWebSocket } from './mqttClient.js';
import { initializeDigitais } from './digitais.js'; // Importa a função de digitais
import { initializeUsuarios } from './usuarios.js';


document.addEventListener('DOMContentLoaded', () => {
    initNavigation();

    initializeUsuarios();

    // Associa o evento de clique ao botão "Voltar"
    const backButton = document.querySelector('#back-button');
    if (backButton) {
        backButton.addEventListener('click', goBack);
    }

    // Inicializa a funcionalidade de pesquisa
    initializeSearch();

    // Inicializa a funcionalidade de digitais
    initializeDigitais();

    // Inicializa o WebSocket
    initializeWebSocket();
});
