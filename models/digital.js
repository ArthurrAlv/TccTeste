// models/digital.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Digital = sequelize.define('Digital', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Digital;
