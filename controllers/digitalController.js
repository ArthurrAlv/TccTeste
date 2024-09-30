const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const Digital = require('../models/digital');
const mqttClient = require('../config/mqttClient');

const digitalController = {
  listarDigitais: async (req, res) => {
    try {
      const digitais = await Digital.findAll();
      res.render('admin/gerenciarDigitais', { digitais });
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao listar digitais');
    }
  },

  cadastrarDigital: [
    // Validações
    body('nome').notEmpty().withMessage('O nome é obrigatório.'),

    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const digitais = await Digital.findAll();
        return res.render('admin/gerenciarDigitais', { digitais, errors: errors.array() });
      }

      try {
        const { nome } = req.body;
        const id = uuidv4().slice(0, 8); // ID mais profissional e curto
        await Digital.create({ nome, id });

        mqttClient.publish('digitais/cadastrar', JSON.stringify({ id, nome }));

        res.redirect('/digitais');
      } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao cadastrar digital');
      }
    }
  ],

  editarDigital: [
    body('nome').notEmpty().withMessage('O nome é obrigatório.'),
    
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const digitais = await Digital.findAll();
        return res.render('admin/gerenciarDigitais', { digitais, errors: errors.array() });
      }
  
      try {
        const { id } = req.params;
        const { nome } = req.body;
  
        // Atualiza o nome com base no ID
        await Digital.update({ nome }, { where: { id } });
  
        // Publica a atualização via MQTT
        mqttClient.publish('digitais/editar', JSON.stringify({ id, nome }));
  
        // Redireciona após a edição
        res.redirect('/digitais');
      } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao editar digital');
      }
    }
  ],  


  excluirDigital: async (req, res) => {
    try {
      const { id } = req.params;
      await Digital.destroy({ where: { id } });

      mqttClient.publish('digitais/excluir', JSON.stringify({ id }));

      res.redirect('/digitais');
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao excluir digital');
    }
  },
};

module.exports = digitalController;
