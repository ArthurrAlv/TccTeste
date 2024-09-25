// authController.js
const crypto = require('crypto');
const Usuario = require('../models/usuario'); // Importando Usuario
const bcrypt = require('bcrypt');
const transporter = require('../config/email');
const { Op } = require('sequelize');

const sanitize = (input) => input.trim();

const authController = {
  renderizarAvisoAutenticacao: (req, res) => {
    res.render('auth/avisoAutenticacao', { error: false });
  },

  renderizarLogin: (req, res) => {
    const successMessage = req.flash('success');
    res.render('auth/login', { 
        error: req.flash('error'), 
        success: successMessage, 
        email: req.query.email || '' 
    });
  },

  efetuarLogin: async (req, res) => {
    const { email, senha } = req.body;
    const sanitizedEmail = sanitize(email);
    const sanitizedSenha = sanitize(senha);
  
    try {
      const usuario = await Usuario.findOne({ where: { email: sanitizedEmail } });
  
      if (usuario && usuario.verificado && bcrypt.compareSync(sanitizedSenha, usuario.senha)) {
        req.session.usuario = { id: usuario.id };
        req.flash('error', '');
        return res.redirect('/produtos/listar');
      } else {
        const mensagem = usuario && !usuario.verificado
          ? 'Por favor, verifique seu e-mail antes de fazer login.'
          : 'Credenciais inválidas.';
        req.flash('error', mensagem);
        return res.redirect('/auth/login');
      }
    } catch (err) {
      console.error('Erro ao consultar o banco de dados:', err);
      req.flash('error', 'Ocorreu um erro ao processar sua solicitação.');
      return res.redirect('/auth/login');
    }
  },

  renderizarRegistro: (req, res) => {
    res.render('auth/registro');
  },

  efetuarRegistro: async (req, res) => {
    const { nome, email, senha, confirmarSenha } = req.body;
  
    if (senha !== confirmarSenha) {
      return res.status(400).send('As senhas não coincidem.');
    }
  
    const sanitizedNome = sanitize(nome);
    const sanitizedEmail = sanitize(email);
    const hashedSenha = bcrypt.hashSync(sanitize(senha), 10);
  
    try {
      const usuarioExistente = await Usuario.findOne({ where: { email: sanitizedEmail } });
  
      if (usuarioExistente) {
        return res.status(400).send('Este e-mail já está em uso. Tente fazer login ou use um e-mail diferente.');
      }
  
      const tokenVerificacao = crypto.randomBytes(20).toString('hex');
      const usuario = await Usuario.create({ nome: sanitizedNome, email: sanitizedEmail, senha: hashedSenha, tokenVerificacao });
  
      const mailOptions = {
        to: sanitizedEmail,
        from: process.env.EMAIL_USER,
        subject: 'Verificação de E-mail',
        text: `Obrigado por se registrar. Por favor, verifique seu e-mail clicando no link abaixo:\n\n` +
              `http://${req.headers.host}/auth/verificar-email/${tokenVerificacao}\n\n` +
              `Se você não solicitou isso, ignore este e-mail.`
      };
  
      await transporter.sendMail(mailOptions);
  
      req.flash('success', 'Um e-mail de verificação foi enviado para ' + sanitizedEmail);
      res.redirect('/auth/login');
    } catch (error) {
      console.error('Erro ao criar o registro:', error);
      res.status(500).send('Erro ao criar o registro.');
    }
  },  

  verificarEmail: async (req, res) => {
    const { token } = req.params;

    try {
      const usuario = await Usuario.findOne({ where: { tokenVerificacao: token } });

      if (!usuario) {
        return res.status(400).send('Token inválido ou expirado.');
      }

      usuario.verificado = true;
      usuario.tokenVerificacao = null;
      await usuario.save();

      req.flash('success', 'E-mail verificado com sucesso! Você pode fazer login agora.');
      res.redirect(`/auth/login?email=${usuario.email}`);
    } catch (err) {
      console.error('Erro ao verificar e-mail:', err);
      res.status(500).send('Erro ao verificar e-mail.');
    }
  },

  efetuarLogout: (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send('Erro ao finalizar sessão.');
      }
      res.redirect('/auth/login');
    });
  },

  solicitarRecuperacaoSenha: async (req, res) => {
    const { email } = req.body;
    const sanitizedEmail = sanitize(email);
  
    try {
      const usuario = await Usuario.findOne({ where: { email: sanitizedEmail } });
  
      if (!usuario) {
        return res.status(404).send('Usuário não encontrado.');
      }
  
      const token = crypto.randomBytes(20).toString('hex');
      const expiration = Date.now() + 3600000; // 1 hora
  
      usuario.passwordResetToken = token;
      usuario.passwordResetExpires = expiration;
      await usuario.save();
  
      const mailOptions = {
        to: sanitizedEmail,
        from: process.env.EMAIL_USER,
        subject: 'Recuperação de Senha',
        text: `Você solicitou uma recuperação de senha. Clique no link abaixo para redefinir sua senha:\n\n` +
              `http://${req.headers.host}/auth/redefinir-senha/${token}\n\n` +
              `Se você não solicitou isso, ignore este e-mail.`
      };
  
      await transporter.sendMail(mailOptions);
  
      res.send('Um e-mail foi enviado para ' + sanitizedEmail + ' com mais instruções.');
    } catch (err) {
      console.error('Erro ao enviar e-mail de recuperação:', err);
      res.status(500).send('Erro ao enviar e-mail.');
    }
  },  

  redefinirSenha: async (req, res) => {
    const { token } = req.params;
    const { novaSenha } = req.body;

    try {
      const usuario = await Usuario.findOne({
        where: {
          passwordResetToken: token,
          passwordResetExpires: { [Op.gt]: Date.now() },
        },
      });

      if (!usuario) {
        return res.status(400).send('Token inválido ou expirado.');
      }

      const hashedSenha = bcrypt.hashSync(sanitize(novaSenha), 10);
      usuario.senha = hashedSenha;
      usuario.passwordResetToken = null;
      usuario.passwordResetExpires = null;
      await usuario.save();

      req.flash('success', 'Senha redefinida com sucesso!');
      res.redirect('/auth/login');
    } catch (err) {
      console.error('Erro ao redefinir senha:', err);
      res.status(500).send('Erro ao redefinir senha.');
    }
  },
};

module.exports = authController;