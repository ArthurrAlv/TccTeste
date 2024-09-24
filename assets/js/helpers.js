// js/helpers.js
function goBack(event) {
    const button = event.target;
    const backUrl = button.getAttribute('data-back-url');

    if (backUrl) {
        window.location.href = backUrl;  // Redireciona para a URL especificada
    } else if (window.history.length > 1) {
        window.history.back();  // Volta para a página anterior no histórico
    } else {
        console.warn('Não há página anterior no histórico.');
    }
}

export { goBack };