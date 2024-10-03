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
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const nomeCell = form.closest('tr').querySelector('td:nth-child(2)');
            const nomeDigital = nomeCell ? nomeCell.textContent : 'Nome não encontrado';
            const id = form.closest('tr').querySelector('td:nth-child(1)').textContent;
        
            // Mostrar o modal de confirmação para exclusão
            showProcessModal('Tem certeza que deseja excluir esta digital?', nomeDigital, async () => {
                // Mostrar mensagem de progresso
                showStatusModal('Aguarde, excluindo a digital...');
        
                // Enviar comando para o servidor via MQTT
                window.socket.publish('digitais/excluir', JSON.stringify({ id }));
        
                // Aguarda a resposta assíncrona
                return new Promise((resolve) => {
                    // Escutar resposta do dispositivo
                    window.socket.subscribe('digitais/confirmacao_excluir', (topic, message) => {
                        try {
                            const response = JSON.parse(message.toString());
                            if (response.id === id) {
                                if (response.success) {
                                    showStatusModal('Digital excluída com sucesso!', true);
                                    setTimeout(() => location.reload(), 2000);
                                } else {
                                    showStatusModal('Erro ao excluir a digital. Tente novamente.', false);
                                }
                                resolve();  // Finaliza o processo para fechar o modal
                            }
                        } catch (e) {
                            showStatusModal('Erro na resposta do dispositivo. Tente novamente.', false);
                            resolve();  // Finaliza o processo para fechar o modal
                        }
                    });
                });
            });
        });        
    });

    // Função para mostrar modal de status do processo
    function showStatusModal(message, success = null) {
        removeExistingModals();

        const modal = document.createElement('div');
        modal.id = 'overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <p>${message}</p>
                ${success === null ? '' : `<p>${success ? 'Operação bem-sucedida!' : 'Operação falhou. Tente novamente.'}</p>`}
            </div>
        `;
        document.body.appendChild(modal);

        if (success !== null) {
            setTimeout(() => removeExistingModals(), 3000); // Fechar automaticamente após 3 segundos
        }
    }

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

        const statusMessage = document.getElementById('status-message');

        document.getElementById('confirm-add').addEventListener('click', () => {
            const name = document.getElementById('add-name').value.trim();

            if (name) {
                const id = gerarID();
                statusMessage.textContent = 'Conectando ao dispositivo...';

                // Enviar comando para o servidor via MQTT
                window.socket.publish('digitais/cadastrar', JSON.stringify({ id, nome: name }));
                statusMessage.textContent = 'Aguarde, cadastrando a digital...';

                // Escutar resposta do dispositivo
                window.socket.subscribe('digitais/confirmacao', (topic, message) => {
                    try {
                        const response = JSON.parse(message.toString());
                        if (response.id === id) {
                            if (response.success) {
                                statusMessage.textContent = 'Digital cadastrada com sucesso!';
                                setTimeout(() => location.reload(), 2000);
                            } else {
                                statusMessage.textContent = 'Erro ao cadastrar a digital. Tentando novamente...';
                            }
                        }
                    } catch (e) {
                        statusMessage.textContent = 'Erro na resposta do dispositivo. Tente novamente.';
                    }
                });
            } else {
                statusMessage.textContent = 'O campo de nome é obrigatório.';
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
                <p>${message}</p>
                <div class="digital-name">Digital: <strong>${name}</strong></div>
                <div class="button-modal">
                    <button id="confirm-process">Sim</button>
                    <button id="cancel-process">Não</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('confirm-process').addEventListener('click', async () => {
            // Mantém o modal aberto enquanto o processo de exclusão ocorre
            await onConfirm();
            // Somente após a confirmação, o modal será fechado
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
