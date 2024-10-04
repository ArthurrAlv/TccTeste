export function initializeUsuarios() {
  const addUserButton = document.getElementById('confirm-add');
  const editButtons = document.querySelectorAll('.fas.fa-pencil-alt');
  const deleteButtons = document.querySelectorAll('.fas.fa-trash-alt');

  // Modal Helper Functions
  function openModal(content, onConfirm) {
    // Criação do overlay e do modal
    const overlay = document.createElement('div');
    overlay.id = 'overlay';

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modalContent.innerHTML = content;

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('button-modal');

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirmar';
    confirmButton.addEventListener('click', () => {
      onConfirm();
      closeModal(overlay);
    });

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancelar';
    cancelButton.addEventListener('click', () => closeModal(overlay));

    buttonsDiv.append(confirmButton, cancelButton);
    modalContent.appendChild(buttonsDiv);
    overlay.appendChild(modalContent);
    document.body.appendChild(overlay);
  }

  function closeModal(overlay) {
    document.body.removeChild(overlay);
  }

  // Modal para adicionar usuário
  addUserButton.addEventListener('click', async () => {
    const nome = document.getElementById('add-name').value;
    const email = document.getElementById('add-email').value;
    const senha = document.getElementById('add-password').value;

    // Validação do email pelo próprio input (com pattern no HTML) + validação extra em JS
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailPattern.test(email)) {
        alert("Por favor, insira um email válido.");
        return;
    }

    if (nome && email && senha) {
        openModal(`Cadastrar "${nome}"?`, async () => {
            try {
                // Submeter o formulário com fetch
                const response = await fetch('/admin/usuarios/adicionar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nome, email, senha }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert(data.message); // Alerta de sucesso
                    // Redirecionar ou atualizar a lista de usuários, se necessário
                } else {
                    alert(data.message); // Alerta de erro (email duplicado, etc.)
                }
            } catch (error) {
                alert('Erro ao tentar cadastrar o usuário.'); // Tratamento de erro
            }
        });
    } else {
        alert("Preencha todos os campos.");
    }
  });

  // Modal para editar usuário
  editButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const row = button.closest('tr');
      const id = row.querySelector('td:first-child').textContent;
      const nome = row.querySelector('td:nth-child(2)').textContent;
      const email = row.querySelector('td:nth-child(3)').textContent;

      openModal(`
        <h2>Editar Usuário</h2>
        <input type="text" id="edit-name" value="${nome}" placeholder="Nome">
        <input type="email" id="edit-email" value="${email}" placeholder="Email">
        <input type="password" id="edit-password" placeholder="Nova Senha">
      `, () => {
        const newNome = document.getElementById('edit-name').value;
        const newEmail = document.getElementById('edit-email').value;
        const newSenha = document.getElementById('edit-password').value;

        // Cria um formulário oculto para submeter a edição
        const form = document.createElement('form');
        form.action = `/admin/usuarios/editar/${id}`;
        form.method = 'POST';

        const nomeInput = document.createElement('input');
        nomeInput.name = 'nome';
        nomeInput.value = newNome;
        form.appendChild(nomeInput);

        const emailInput = document.createElement('input');
        emailInput.name = 'email';
        emailInput.value = newEmail;
        form.appendChild(emailInput);

        if (newSenha) {
          const senhaInput = document.createElement('input');
          senhaInput.name = 'senha';
          senhaInput.value = newSenha;
          form.appendChild(senhaInput);
        }

        document.body.appendChild(form);
        form.submit();
      });
    });
  });

  // Modal para excluir usuário
  deleteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const row = button.closest('tr');
      const nome = row.querySelector('td:nth-child(2)').textContent;
      const id = row.querySelector('td:first-child').textContent;

      openModal(`Deseja excluir "<strong>${nome}</strong>"?`, () => {
        // Submete o formulário de exclusão
        const deleteForm = row.querySelector('.delete-form-usu');
        deleteForm.submit();
      });
    });
  });
}
