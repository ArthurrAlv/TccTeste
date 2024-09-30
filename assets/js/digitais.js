// assets/js/digitais.js

// Função para gerar um ID automático
function gerarID() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Inicializa a funcionalidade de gerenciamento de digitais
function initializeDigitais() {
    // Preenche automaticamente o campo de ID no formulário ao carregar a página
    const idInput = document.querySelector('input[name="id"]');
    if (idInput) {
        idInput.value = gerarID();
        idInput.readOnly = true; // Impede que o usuário altere o ID
    }

    // Função de pesquisa de digitais
    const searchInput = document.getElementById('search');
    const tableRows = document.querySelectorAll('#digitais-table tbody tr');

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            tableRows.forEach(row => {
                const nameCell = row.querySelector('td:nth-child(2)');
                const name = nameCell.textContent.toLowerCase();
                row.style.display = name.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Adicionar confirmação antes de excluir uma digital
    const deleteForms = document.querySelectorAll('.delete-form');
    deleteForms.forEach(form => {
        form.addEventListener('submit', (event) => {
            const confirmed = confirm('Tem certeza que deseja excluir esta digital?');
            if (!confirmed) {
                event.preventDefault();
            }
        });
    });

    // Função para mostrar a caixa de edição flutuante
    function showEditModal(digitalId, currentName) {
        // Criar o fundo escuro
        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '9999';

        // Criar a caixa de edição
        const modal = document.createElement('div');
        modal.id = 'edit-modal';
        modal.style.backgroundColor = '#fff';
        modal.style.padding = '20px';
        modal.style.borderRadius = '5px';
        modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        modal.style.width = '400px';
        modal.innerHTML = `
            <h2>Editar Digital</h2>
            <input type="text" id="edit-name" value="${currentName}" />
            <div class="button-modal">
            <button id="confirm-edit">OK</button>
            <button id="cancel-edit">Cancelar</button>
            </div>
        `;

        // Adicionar a caixa e o fundo ao corpo do documento
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Ações dos botões
        document.getElementById('confirm-edit').addEventListener('click', () => {
            const newName = document.getElementById('edit-name').value;
            const confirmed = confirm('Tem certeza que deseja confirmar a edição?');
        
            if (confirmed) {
                // Atualiza o valor do campo oculto 'nome'
                document.querySelector(`form.edit-form[data-id="${digitalId}"] input[name="nome"]`).value = newName;
        
                // Submete o formulário
                document.querySelector(`form.edit-form[data-id="${digitalId}"]`).submit();
            }
            document.body.removeChild(overlay);
        });        

        document.getElementById('cancel-edit').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
    }

    // Adicionar evento de clique para edição
    const editButtons = document.querySelectorAll('.edit-icon-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Impede a submissão do formulário padrão
    
            const form = button.closest('form');
            const digitalId = form.getAttribute('data-id'); // ID do digital
            const currentName = form.querySelector('input[name="nome"]').value; // Acessa o campo oculto
    
            // Mostrar a caixa de edição
            showEditModal(digitalId, currentName);
        });
    });      
}

export { initializeDigitais };
