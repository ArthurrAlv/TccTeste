// controllers/digitalController.js
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

  cadastrarDigital: async (req, res) => {
    try {
      const { nome, id } = req.body;
      await Digital.create({ nome, id });

      // Envia a mensagem via MQTT para cadastrar a digital
      mqttClient.publish('digitais/cadastrar', JSON.stringify({ id, nome }));

      res.redirect('/digitais');
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao cadastrar digital');
    }
  },

  editarDigital: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome } = req.body;
      await Digital.update({ nome }, { where: { id } });

      // Envia a mensagem via MQTT para editar a digital
      mqttClient.publish('digitais/editar', JSON.stringify({ id, nome }));

      res.redirect('/digitais');
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao editar digital');
    }
  },

  excluirDigital: async (req, res) => {
    try {
      const { id } = req.params;
      await Digital.destroy({ where: { id } });

      // Envia a mensagem via MQTT para excluir a digital
      mqttClient.publish('digitais/excluir', JSON.stringify({ id }));

      res.redirect('/digitais');
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao excluir digital');
    }
  },
};

module.exports = digitalController;
