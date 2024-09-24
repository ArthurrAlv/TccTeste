// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { redirectIfAuthenticated } = require('../middleware/auth');

// Rota para renderizar a página de login
router.get('/login', redirectIfAuthenticated, authController.renderizarLogin);

// Rota para processar o formulário de login
router.post('/login', redirectIfAuthenticated, authController.efetuarLogin);

// Rota para renderizar a página de registro
router.get('/registro', redirectIfAuthenticated, authController.renderizarRegistro);

// Rota para processar o formulário de registro
router.post('/registro', redirectIfAuthenticated, authController.efetuarRegistro);

// Rota para aviso de autenticação
router.get('/aviso-autenticacao', authController.renderizarAvisoAutenticacao);

// Rota para logout
router.get('/logout', authController.efetuarLogout);

// Rota para verificar o e-mail
router.get('/verificar-email/:token', authController.verificarEmail);

// Rotas para recuperação de senha
router.get('/recuperar-senha', (req, res) => res.render('auth/recuperarSenha'));
router.post('/recuperar-senha', authController.solicitarRecuperacaoSenha);
router.get('/redefinir-senha/:token', (req, res) => res.render('auth/redefinirSenha', { token: req.params.token }));
router.post('/redefinir-senha/:token', authController.redefinirSenha);

module.exports = router;