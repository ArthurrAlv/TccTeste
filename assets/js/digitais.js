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

    // Adicionar evento de confirmação antes de excluir uma digital
    document.querySelectorAll('.delete-form').forEach(form => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const nomeCell = form.closest('tr').querySelector('td:nth-child(2)');
            const nomeDigital = nomeCell ? nomeCell.textContent : 'Nome não encontrado';
            const id = form.closest('tr').querySelector('td:nth-child(1)').textContent;

            showProcessModal('Tem certeza que deseja excluir esta digital?', nomeDigital, () => {
                window.socket.publish('digitais/excluir', JSON.stringify({ id }));

                window.socket.subscribe('digitais/confirmacao_excluir', (topic, message) => {
                    const response = JSON.parse(message.toString());
                    if (response.id === id) {
                        if (response.success) {
                            alert('Digital excluída com sucesso!');
                            location.reload();
                        } else {
                            alert('Erro ao excluir a digital. Tente novamente.');
                        }
                    }
                });
            });
        });
    });

    // Função para mostrar o modal de edição
    function showEditModal(digitalId, currentName) {
        removeExistingModals();
    
        const modal = document.createElement('div');
        modal.id = 'overlay';
        modal.innerHTML = `
            <div id="edit-modal" class="modal-content">
                <h2>Editar Digital</h2>
                <input type="text" id="edit-name" value="${currentName}" />
                <div class="button-modal">
                    <button id="confirm-edit">OK</button>
                    <button id="cancel-edit">Cancelar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    
        document.getElementById('confirm-edit').addEventListener('click', async () => {
            const newName = document.getElementById('edit-name').value.trim();
            if (newName) {
                try {
                    // Fazendo a requisição PUT para a rota correta
                    const response = await fetch(`/digitais/editar/${digitalId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ nome: newName })
                    });
    
                    const result = await response.json();
    
                    if (result.success) {
                        alert('Digital editada com sucesso!');
                        location.reload();
                    } else {
                        alert('Erro ao editar a digital. Tente novamente.');
                    }
                } catch (error) {
                    console.error('Erro ao editar digital:', error);
                    alert('Erro ao editar a digital.');
                }
            }
            removeExistingModals();
        });
    
        document.getElementById('cancel-edit').addEventListener('click', removeExistingModals);
    }

    // Função para mostrar o modal de cadastro de digital
    function showAddModal(nomeInicial = '') {
        removeExistingModals();

        const modal = document.createElement('div');
        modal.id = 'overlay';
        modal.innerHTML = `
            <div id="add-modal" class="modal-content">
                <h2>Adicionar Digital</h2>
                <input type="text" id="add-name" placeholder="Nome da Digital" value="${nomeInicial}" />
                <div class="button-modal">
                    <button id="confirm-add">Cadastrar</button>
                    <button id="cancel-add">Cancelar</button>
                </div>
                <p id="status-message"></p>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('confirm-add').addEventListener('click', () => {
            const name = document.getElementById('add-name').value.trim();
            const statusMessage = document.getElementById('status-message');

            if (name) {
                const id = gerarID();
                window.socket.publish('digitais/cadastrar', JSON.stringify({ id, nome: name }));
                statusMessage.textContent = 'Aguarde, cadastrando a digital...';

                window.socket.subscribe('digitais/confirmacao', (topic, message) => {
                    const response = JSON.parse(message.toString());
                    if (response.id === id) {
                        if (response.success) {
                            alert('Digital cadastrada com sucesso!');
                            location.reload();
                        } else {
                            alert('Erro ao cadastrar a digital. Tente novamente.');
                        }
                        removeExistingModals();
                    }
                });
            } else {
                alert('O campo de nome é obrigatório.');
            }
        });

        document.getElementById('cancel-add').addEventListener('click', removeExistingModals);
    }

    // Função para mostrar o modal de processos (exclusão e mensagens gerais)
    function showProcessModal(message, name, onConfirm) {
        removeExistingModals();

        const modal = document.createElement('div');
        modal.id = 'overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <p class"digital-name">${message} Digital: <strong>${name}</strong></p>
                <div class="button-modal">
                    <button id="confirm-process">Sim</button>
                    <button id="cancel-process">Não</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('confirm-process').addEventListener('click', () => {
            onConfirm();
            removeExistingModals();
        });

        document.getElementById('cancel-process').addEventListener('click', removeExistingModals);
    }

    // Função para remover modais existentes
    function removeExistingModals() {
        const existingModal = document.getElementById('overlay');
        if (existingModal) {
            existingModal.remove();
        }
    }

    // Associar evento de clique para o botão de adicionar digital
    document.getElementById('add-digital-btn').addEventListener('click', (event) => {
        event.preventDefault();
        const nomeInicial = document.querySelector('input[name="nome"]').value.trim();
        showAddModal(nomeInicial);
    });

    // Adicionar eventos de clique para os botões de edição
    document.querySelectorAll('.edit-icon-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const form = button.closest('form');
            const digitalId = form.getAttribute('data-id');
            const currentName = form.querySelector('input[name="nome"]').value;
            showEditModal(digitalId, currentName);
        });
    });
}

export { initializeDigitais };
