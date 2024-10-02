const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const Digital = require('../models/digital');
const mqttClient = require('../config/mqttClient');


// Função para exibir mensagens no modal
function showModalMessage(message) {
  const modal = document.getElementById('status-modal');
  if (modal) {
      const messageElement = modal.querySelector('#status-message');
      if (messageElement) {
          messageElement.textContent = message;
      }
  }
}

// Função para tentar excluir a digital com múltiplas tentativas
function retryDeleteDigital(id, retries = 3) {
  if (retries === 0) {
      showModalMessage('Erro ao excluir a digital. Tente novamente.');
      return;
  }
  mqttClient.publish('digitais/excluir', JSON.stringify({ id }));
  showModalMessage('Tentando excluir a digital...');
  
  setTimeout(() => retryDeleteDigital(id, retries - 1), 2000); // Tentar novamente após 2 segundos
}

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
      
      // Enviar requisição de exclusão
      mqttClient.publish('digitais/excluir', JSON.stringify({ id }));
      res.status(200).json({ message: 'Tentando excluir a digital...' });
  
      const excluirDigitalListener = async (topic, message) => {
        if (topic === 'digitais/confirmacao_excluir') {
          const response = JSON.parse(message.toString());
          if (response.id === id) {
            if (response.success) {
              await Digital.destroy({ where: { id } });
              mqttClient.removeListener('message', excluirDigitalListener);
              res.json({ message: 'Digital excluída com sucesso!' });
            } else {
              res.json({ message: 'Erro ao excluir digital. Tentando novamente...' });
            }
          }
        }
      };
  
      mqttClient.on('message', excluirDigitalListener);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao excluir digital' });
    }
  },
};

module.exports = digitalController;
