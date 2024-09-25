// routes/admin.js
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

// Rotas para gerenciar usuários
router.get('/usuarios', adminController.listarUsuarios);
router.post('/usuarios/adicionar', adminController.adicionarUsuario);
router.get('/usuarios/editar/:id', adminController.editarUsuario); // Mudança para GET
router.post('/usuarios/editar/:id', adminController.atualizarUsuario); // Mudança para POST
router.post('/usuarios/excluir/:id', adminController.excluirUsuario);


module.exports = router;