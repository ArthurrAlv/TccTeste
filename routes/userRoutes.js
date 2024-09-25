// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth'); // Middleware de autenticação para garantir que o usuário esteja logado

// Rota para renderizar a página 'usuario/main'
router.get('/main', authMiddleware.authMiddleware, userController.renderizarMain);

module.exports = router;
