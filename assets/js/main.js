// main.js
import { initNavigation } from './navigation.js';
import { goBack } from './helpers.js';
import { initializeSearch } from './search.js'; // Importa a função de pesquisa

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();

    // Associa o evento de clique ao botão "Voltar"
    const backButton = document.querySelector('#back-button');
    if (backButton) {
        backButton.addEventListener('click', goBack);
    }

    // Inicializa a funcionalidade de pesquisa
    initializeSearch();
});
