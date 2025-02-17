// models/admin.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Admin = sequelize.define('Admin', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  senha: { type: DataTypes.STRING(255), allowNull: false },
  resetToken: { type: DataTypes.STRING, allowNull: true },
  resetTokenExpiracao: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'admins',
  timestamps: false
});

module.exports = Admin;
