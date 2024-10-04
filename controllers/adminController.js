// adminController.js
const crypto = require('crypto');
const Usuario = require('../models/usuario');
const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const transporter = require('../config/email');
const { Op } = require('sequelize');

const adminController = {
  mostrarLogin: (req, res) => {
    const erro = req.query.erro || null;
    res.render('admin/login', { erro });
  },

  login: async (req, res) => {
    const { email, senha } = req.body;

    try {
        const admin = await Admin.findOne({ where: { email: email.toLowerCase() } });

        if (admin && bcrypt.compareSync(senha, admin.senha)) {
            req.session.usuario = { id: admin.id, nome: admin.nome, tipoUsuario: 'admin' };
            return res.redirect('/admin/dashboard'); // Mantenha aqui se você quer redirecionar para o dashboard após o login
        } 
        // Mensagem de erro a ser renderizada na mesma página
        return res.render('admin/login', { erro: 'Email ou senha inválidos.' });
    } catch (error) {
        console.error('Erro no login do administrador:', error);
        return res.status(500).send('Erro interno do servidor');
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
    const { nome, email, senha } = req.body;

    try {
        // Verificar se o e-mail já existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'Este e-mail já está cadastrado.' });
        }

        // Hash da senha antes de salvar
        const hashedSenha = await bcrypt.hash(senha, 10);
        
        // Criação do token de confirmação
        const token = crypto.randomBytes(20).toString('hex');
        const expiracao = Date.now() + 3600000; // 1 hora

        // Criação do novo usuário (não confirmado ainda)
        const novoUsuario = await Usuario.create({ nome, email, senha: hashedSenha, token, tokenExpiracao: expiracao });

        // Configurando o email de confirmação
        const confirmUrl = `http://${req.headers.host}/admin/confirmar/${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Confirmação de Cadastro',
            html: `<p>Olá ${nome},</p>
                   <p>Para confirmar seu cadastro, clique no link abaixo:</p>
                   <a href="${confirmUrl}">${confirmUrl}</a>`
        };

        // Enviando o email de confirmação
        await transporter.sendMail(mailOptions);

        res.json({ message: 'Cadastro realizado com sucesso! Verifique seu e-mail para confirmar.' });
    } catch (error) {
        console.error('Erro ao adicionar usuário:', error);
        res.status(500).send('Erro interno do servidor');
    }
  },

  confirmarCadastro: async (req, res) => {
    const { token } = req.params;

    try {
      const usuario = await Usuario.findOne({ where: { token, tokenExpiracao: { [Op.gt]: Date.now() } } });

      if (!usuario) {
        return res.status(400).send('Token inválido ou expirado.');
      }

      // Atualiza o usuário como confirmado
      usuario.token = null;
      usuario.tokenExpiracao = null;
      await usuario.save();

      res.send('Cadastro confirmado com sucesso! Agora você pode fazer login.');
    } catch (error) {
      console.error('Erro ao confirmar cadastro:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  editarUsuario: async (req, res) => {
    const { id } = req.params;

    try {
      const usuario = await Usuario.findByPk(id);
      res.render('admin/editarUsuario', { usuario });
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },
  
  atualizarUsuario: async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    try {
      // Verifica se o usuário existe
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).send('Usuário não encontrado');
      }

      // Mantém a senha antiga se o campo estiver em branco
      const dadosAtualizados = {
        nome,
        email,
        senha: senha ? await bcrypt.hash(senha, 10) : usuario.senha,
      };

      await Usuario.update(dadosAtualizados, { where: { id } });
      res.redirect('/admin/usuarios');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  excluirUsuario: async (req, res) => {
    const { id } = req.params;

    try {
      await Usuario.destroy({ where: { id } });
      res.redirect('/admin/usuarios');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  mostrarRecuperarSenha: (req, res) => {
    res.render('admin/recuperar-senha', { sucesso: null, erro: null });
  },

  enviarEmailRecuperacao: async (req, res) => {
    const { email } = req.body;

    try {
        const admin = await Admin.findOne({ where: { email: email.toLowerCase() } });

        if (!admin) {
            return res.render('admin/recuperar-senha', { erro: 'E-mail não encontrado', sucesso: null });
        }

      const token = crypto.randomBytes(20).toString('hex');
      const expiracao = Date.now() + 3600000; // 1 hora

      admin.resetToken = token;
      admin.resetTokenExpiracao = expiracao;
      await admin.save();

      const resetUrl = `http://${req.headers.host}/admin/redefinir-senha/${token}`;

      await transporter.sendMail({
        to: email,
        from: process.env.EMAIL_USER,
        subject: 'Redefinir sua senha - Administrador',
        html: `<p>Você solicitou a redefinição de senha. Clique no link abaixo para redefinir sua senha:</p><a href="${resetUrl}">${resetUrl}</a>`,
      });

      // Renderiza a página com a mensagem de sucesso
      res.render('admin/recuperar-senha', { sucesso: 'Email de recuperação enviado. Verifique sua caixa de entrada.', erro: null });
    } catch (error) {
        console.error('Erro ao enviar e-mail de recuperação:', error);
        res.status(500).send('Erro interno do servidor');
    }
  },

  mostrarRedefinirSenha: async (req, res) => {
    const { token } = req.params;

    try {
      const admin = await Admin.findOne({
        where: { resetToken: token, resetTokenExpiracao: { [Op.gt]: Date.now() } },
      });

      if (!admin) {
        return res.send('Token inválido ou expirado.');
      }

      res.render('admin/redefinir-senha', { token });
    } catch (error) {
      console.error('Erro ao mostrar redefinição de senha:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  redefinirSenha: async (req, res) => {
    const { token } = req.params;
    const { novaSenha } = req.body;

    try {
        const admin = await Admin.findOne({
            where: { resetToken: token, resetTokenExpiracao: { [Op.gt]: Date.now() } },
        });

        if (!admin) {
            return res.render('admin/redefinir-senha', { token, erro: 'Token inválido ou expirado.', sucesso: null });
        }

        const salt = await bcrypt.genSalt(10);
        admin.senha = await bcrypt.hash(novaSenha, salt);
        admin.resetToken = null;
        admin.resetTokenExpiracao = null;
        await admin.save();

        return res.render('admin/redefinir-senha', { token, sucesso: 'Senha redefinida com sucesso.', erro: null });
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        res.status(500).send('Erro interno do servidor');
    }
  },
};

module.exports = adminController;