import { initNavigation } from './navigation.js';
import { goBack } from './helpers.js';
import { confirmDelete, confirmEdit, adicionarAoCarrinho, atualizarQuantidade, initDetalhesQuantidade } from './product.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();

    // Associa o evento de clique ao botão "Voltar"
    const backButton = document.querySelector('#back-button');
    if (backButton) {
        backButton.addEventListener('click', goBack);
    }

    // Adiciona o evento de confirmação ao formulário de edição
    const editForm = document.querySelector('.edit-form');
    if (editForm) {
        editForm.addEventListener('submit', confirmEdit);
    }

    // Associa o evento de clique aos botões de excluir
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            confirmDelete(productId);
        });
    });

    // Inicializa o controle de quantidade na página de detalhes, se estiver presente
    const quantidadeDetalhes = document.getElementById('quantidade-detalhes');
    if (quantidadeDetalhes) {
        initDetalhesQuantidade();
    }

    // Associa o evento ao formulário de adicionar ao carrinho
    const addToCartForm = document.getElementById('add-to-cart-form');
    if (addToCartForm) {
        addToCartForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const produto_id = addToCartForm.querySelector('input[name="produto_id"]').value;
            const quantidade = addToCartForm.querySelector('input[name="quantidade"]').value;

            adicionarAoCarrinho(produto_id, quantidade);
        });
    }

    const csrfMetaTag = document.querySelector('meta[name="csrf-token"]');
    const csrfToken = csrfMetaTag ? csrfMetaTag.getAttribute('content') : null;

    document.querySelectorAll('.increment, .decrement').forEach(button => {
        button.addEventListener('click', (event) => {
            const produtoId = event.target.getAttribute('data-produto-id');
            const isIncrement = event.target.classList.contains('increment');
            const inputQuantidade = document.getElementById(`quantidade-${produtoId}`);
            const quantidadeAtual = parseInt(inputQuantidade.value);

            const novaQuantidade = isIncrement ? quantidadeAtual + 1 : quantidadeAtual - 1;

            atualizarQuantidade(produtoId, novaQuantidade, csrfToken);
        });
    });
});
