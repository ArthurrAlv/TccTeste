// controllers/userController.js
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');

const userController = {
    renderizarMain: (req, res) => {
      res.render('usuario/main'); // Renderiza a página main.ejs que está na pasta 'views/usuario'
    },
  };
  
  module.exports = userController;
  