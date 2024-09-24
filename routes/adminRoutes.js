const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authAdmin = require('../middleware/authAdmin');

// Rotas de login e logout
router.get('/login', adminController.mostrarLogin);
router.post('/login', adminController.login);
router.get('/logout', adminController.logout);

// Rotas protegidas pelo middleware de autenticação
router.use(authAdmin);

// Rota para o painel de controle principal
router.get('/dashboard', adminController.dashboard);

// Rotas para gerenciar clientes
router.get('/clientes', adminController.listarClientes);
router.post('/clientes/adicionar', adminController.adicionarCliente);
router.get('/clientes/editar/:id', adminController.editarCliente); // Mudança para GET
router.post('/clientes/editar/:id', adminController.atualizarCliente); // Mudança para POST
router.post('/clientes/excluir/:id', adminController.excluirCliente);

// Rotas para gerenciar vendedores
router.get('/vendedores', adminController.listarVendedores);
router.post('/vendedores/adicionar', adminController.adicionarVendedor);
router.get('/vendedores/editar/:id', adminController.editarVendedor); // Mudança para GET
router.post('/vendedores/editar/:id', adminController.atualizarVendedor); // Mudança para POST
router.post('/vendedores/excluir/:id', adminController.excluirVendedor);

// Rotas para gerenciar produtos
router.get('/produtos', adminController.listarProdutos);
router.post('/produtos/adicionar', adminController.adicionarProduto);
router.get('/produtos/editar/:id', adminController.editarProduto); // Mudança para GET
router.post('/produtos/editar/:id', adminController.atualizarProduto); // Mudança para POST
router.post('/produtos/excluir/:id', adminController.excluirProduto);

// Rota para a página de relatórios
router.get('/relatorios', adminController.relatorioPedidos);

module.exports = router;
