export function initNavigation() {
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', () => {
            goBack();
        });
    }
}
