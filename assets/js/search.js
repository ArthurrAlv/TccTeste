export function initializeSearch() {
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    const usuariosTable = document.getElementById('usuarios-table');

    // Função para filtrar usuários
    function filterUsers() {
        const filter = searchInput.value.toLowerCase(); // Converte para minúsculas
        const rows = usuariosTable.getElementsByTagName('tr');

        // Loop por todas as linhas da tabela (exceto a primeira, que é o cabeçalho)
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            let found = false;

            // Verifica se o nome ou email contém o texto de pesquisa
            for (let j = 1; j < cells.length - 1; j++) { // Começa do índice 1 para ignorar ID e termina antes do último (Ações)
                if (cells[j].textContent.toLowerCase().includes(filter)) {
                    found = true;
                    break;
                }
            }

            // Mostra ou oculta a linha com base na pesquisa
            rows[i].style.display = found ? '' : 'none';
        }
    }

    // Adiciona evento de clique ao botão de pesquisa
    searchButton.addEventListener('click', filterUsers);

    // Adiciona evento de tecla (Enter) no campo de busca
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            filterUsers();
        }
    });
}
