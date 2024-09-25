// /models/usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  nome: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  senha: { type: DataTypes.STRING, allowNull: false },
  verificado: { type: DataTypes.BOOLEAN, defaultValue: false },
  tokenVerificacao: { type: DataTypes.STRING },
  passwordResetToken: { type: DataTypes.STRING },
  passwordResetExpires: { type: DataTypes.DATE },
}, {
  tableName: 'usuarios',
});

module.exports = Usuario;