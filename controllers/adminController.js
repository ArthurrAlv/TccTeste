// adminController.js
const Usuario = require('../models/usuario');
const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');

const adminController = {
  mostrarLogin: (req, res) => {
    const erro = req.query.erro || null;
    res.render('admin/login', { erro });
  },

  login: async (req, res) => {
    const { email, senha } = req.body;

    try {
      const admin = await Admin.findOne({ where: { email } });

      if (admin && bcrypt.compareSync(senha, admin.senha)) {
        req.session.usuario = { id: admin.id, nome: admin.nome, tipoUsuario: 'admin' };
        res.redirect('/admin/dashboard');
      } else {
        res.redirect('/admin/login?erro=Email ou senha inválidos.');
      }
    } catch (error) {
      console.error('Erro no login do administrador:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
  },

  dashboard: (req, res) => {
    res.render('admin/dashboard');
  },

  listarUsuarios: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll();
      res.render('admin/usuarios', { usuarios });
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  adicionarUsuario: async (req, res) => {
    try {
      const { nome, email, senha } = req.body;
      await Usuario.create({ nome, email, senha });
      res.redirect('/admin/usuarios');
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  editarUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);
      res.render('admin/editarUsuario', { usuario });
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  atualizarUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, email, senha } = req.body;
      await Usuario.update({ nome, email, senha }, { where: { id } });
      res.redirect('/admin/usuarios');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  excluirUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      await Usuario.destroy({ where: { id } });
      res.redirect('/admin/usuarios');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },
};

module.exports = adminController;