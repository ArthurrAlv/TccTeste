// Função para inicializar a funcionalidade de usuários
export function initializeUsuarios() {
    document.addEventListener("DOMContentLoaded", function() {
      const searchInput = document.getElementById('search');
      const searchButton = document.getElementById('search-button');
      const usuariosTableBody = document.querySelector('#usuarios-table tbody');
  
      // Função para pesquisar usuários na tabela
      function searchUsers() {
        const searchTerm = searchInput.value.toLowerCase();
        const rows = usuariosTableBody.getElementsByTagName('tr');
  
        for (let i = 0; i < rows.length; i++) {
          const nome = rows[i].getElementsByTagName('td')[1].textContent.toLowerCase();
          const email = rows[i].getElementsByTagName('td')[2].textContent.toLowerCase();
  
          if (nome.includes(searchTerm) || email.includes(searchTerm)) {
            rows[i].style.display = '';
          } else {
            rows[i].style.display = 'none';
          }
        }
      }
  
      // Event listener para o botão de pesquisa
      searchButton.addEventListener('click', searchUsers);
  
      // Event listener para pesquisa ao digitar (pressionar uma tecla)
      searchInput.addEventListener('keyup', searchUsers);
    });
  }
  