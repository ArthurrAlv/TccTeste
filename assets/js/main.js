// assets/js/main.js
import { initNavigation } from './navigation.js';
import { goBack } from './helpers.js';
import { initializeSearch } from './search.js'; 
import { initializeWebSocket } from './mqttClient.js';
import { initializeDigitais } from './digitais.js'; // Importa a função de digitais
import { initializeUsuarios } from './usuarios.js';
import { esconderAlerta } from './alert.js';


document.addEventListener('DOMContentLoaded', () => {
    initNavigation();

    esconderAlerta();

    // Associa o evento de clique ao botão "Voltar"
    const backButton = document.querySelector('#back-button');
    if (backButton) {
        backButton.addEventListener('click', goBack);
    }

    // Inicializa a funcionalidade de pesquisa
    initializeSearch();


    if (window.location.pathname === '/digitais') {
        initializeDigitais();

        initializeWebSocket();
    }

    if (window.location.pathname === '/admin/usuarios') {
        initializeUsuarios();
    }


});
