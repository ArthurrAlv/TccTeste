// assets/js/alert.js
export const esconderAlerta = () => {
    const alert = document.getElementById('alert');
    if (alert) {
        setTimeout(() => {
            alert.style.display = 'none';
        }, 5000); // Alerta desaparece após 5 segundos
    }
};

