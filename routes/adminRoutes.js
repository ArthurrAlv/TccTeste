// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authAdmin = require('../middleware/authAdmin');

// Rotas de login e logout
router.get('/login', adminController.mostrarLogin);
router.post('/login', adminController.login);
router.get('/logout', adminController.logout);

// Rotas de recuperação de senha do administrador
router.get('/recuperar-senha', adminController.mostrarRecuperarSenha);
router.post('/recuperar-senha', adminController.enviarEmailRecuperacao); // Enviar e-mail com token
router.get('/redefinir-senha/:token', adminController.mostrarRedefinirSenha);
router.post('/redefinir-senha/:token', adminController.redefinirSenha);

// Middleware para proteger as rotas abaixo
router.use(authAdmin);

// Dashboard e gerenciamento de usuários
router.get('/dashboard', adminController.dashboard);
router.get('/usuarios', adminController.listarUsuarios);
router.post('/usuarios/adicionar', adminController.adicionarUsuario);
router.get('/confirmar/:token', adminController.confirmarCadastro);
router.get('/usuarios/editar/:id', adminController.editarUsuario);
router.post('/usuarios/atualizar/:id', adminController.atualizarUsuario);
router.post('/usuarios/excluir/:id', adminController.excluirUsuario);

module.exports = router;
