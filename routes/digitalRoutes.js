// routes/digitalRoutes.js
const express = require('express');
const router = express.Router();
const digitalController = require('../controllers/digitalController');
const authAdmin = require('../middleware/authAdmin');

// Rotas para gerenciamento de digitais
router.get('/', digitalController.listarDigitais);
router.post('/cadastrar', digitalController.cadastrarDigital);
router.put('/editar/:id', digitalController.editarDigital);
router.delete('/excluir/:id', digitalController.excluirDigital);

module.exports = router;


/*
// Rotas para gerenciamento de digitais
router.get('/', authAdmin, digitalController.listarDigitais);
router.post('/cadastrar', authAdmin, digitalController.cadastrarDigital);
router.put('/editar/:id', authAdmin, digitalController.editarDigital);
router.delete('/excluir/:id', authAdmin, digitalController.excluirDigital);
*/