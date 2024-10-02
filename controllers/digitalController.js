const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const Digital = require('../models/digital');
const mqttClient = require('../config/mqttClient');

mqttClient.on('message', (topic, message) => {
  console.log(`Mensagem recebida no tópico ${topic}:`, message.toString());
});

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
    body('nome').notEmpty().withMessage('O nome é obrigatório.'),

    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const digitais = await Digital.findAll();
        return res.render('admin/gerenciarDigitais', { digitais, errors: errors.array() });
      }

      try {
        const { nome } = req.body;
        const id = uuidv4().slice(0, 8); // ID mais curto e único
        await Digital.create({ nome, id });

        // Publicar a nova digital via MQTT
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
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      try {
        const { id } = req.params;
        const { nome } = req.body;

        // Atualiza o nome da digital com base no ID
        await Digital.update({ nome }, { where: { id } });

        // Publica a atualização via MQTT
        mqttClient.publish('digitais/editar', JSON.stringify({ id, nome }));

        return res.json({ success: true });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Erro ao editar digital' });
      }
    }
  ],

  excluirDigital: async (req, res) => {
    try {
      const { id } = req.params;

      // Publicar a requisição de exclusão via MQTT
      mqttClient.publish('digitais/excluir', JSON.stringify({ id }));

      // Escutar confirmação do ESP para remover do banco
      const excluirDigitalListener = async (topic, message) => {
        if (topic === 'digitais/confirmacao_excluir') {
          const response = JSON.parse(message.toString());
          if (response.id === id && response.success) {
            await Digital.destroy({ where: { id } });
            mqttClient.removeListener('message', excluirDigitalListener); // Remover o listener após confirmação
            return res.redirect('/digitais');
          }
        }
      };

      mqttClient.on('message', excluirDigitalListener);

    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao excluir digital');
    }
  },
};

module.exports = digitalController;
