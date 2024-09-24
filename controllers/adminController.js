const Cliente = require('../models/cliente');
const Vendedor = require('../models/vendedor');
const Produto = require('../models/produto');
const ItemPedido = require('../models/itemPedido');
const Pedido = require('../models/pedido');
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

  listarClientes: async (req, res) => {
    try {
      const clientes = await Cliente.findAll();
      res.render('admin/clientes', { clientes });
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  adicionarCliente: async (req, res) => {
    try {
      const { nome, email, senha } = req.body;
      await Cliente.create({ nome, email, senha });
      res.redirect('/admin/clientes');
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  editarCliente: async (req, res) => {
    try {
      const { id } = req.params;
      const cliente = await Cliente.findByPk(id);
      res.render('admin/editarCliente', { cliente });
    } catch (error) {
      console.error('Erro ao editar cliente:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  atualizarCliente: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, email, senha } = req.body;
      await Cliente.update({ nome, email, senha }, { where: { id } });
      res.redirect('/admin/clientes');
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  excluirCliente: async (req, res) => {
    try {
      const { id } = req.params;
      await Cliente.destroy({ where: { id } });
      res.redirect('/admin/clientes');
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  listarVendedores: async (req, res) => {
    try {
      const vendedores = await Vendedor.findAll();
      res.render('admin/vendedores', { vendedores });
    } catch (error) {
      console.error('Erro ao listar vendedores:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  adicionarVendedor: async (req, res) => {
    try {
      const { nome, email, senha } = req.body;
      await Vendedor.create({ nome, email, senha });
      res.redirect('/admin/vendedores');
    } catch (error) {
      console.error('Erro ao adicionar vendedor:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  editarVendedor: async (req, res) => {
    try {
      const { id } = req.params;
      const vendedor = await Vendedor.findByPk(id);
      res.render('admin/editarVendedor', { vendedor });
    } catch (error) {
      console.error('Erro ao editar vendedor:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  atualizarVendedor: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, email, senha } = req.body;
      await Vendedor.update({ nome, email, senha }, { where: { id } });
      res.redirect('/admin/vendedores');
    } catch (error) {
      console.error('Erro ao atualizar vendedor:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  excluirVendedor: async (req, res) => {
    try {
      const { id } = req.params;
      await Vendedor.destroy({ where: { id } });
      res.redirect('/admin/vendedores');
    } catch (error) {
      console.error('Erro ao excluir vendedor:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  listarProdutos: async (req, res) => {
    try {
      const produtos = await Produto.findAll();
      const vendedores = await Vendedor.findAll();
      res.render('admin/produtos', { produtos, vendedores });
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  adicionarProduto: async (req, res) => {
    try {
      const { nome, descricao, preco, vendedor_id, estoque } = req.body;
      await Produto.create({ nome, descricao, preco, vendedor_id, estoque });
      res.redirect('/admin/produtos');
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  editarProduto: async (req, res) => {
    try {
      const { id } = req.params;
      const produto = await Produto.findByPk(id);
      const vendedores = await Vendedor.findAll();
      res.render('admin/editarProduto', { produto, vendedores });
    } catch (error) {
      console.error('Erro ao editar produto:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  atualizarProduto: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, descricao, preco, vendedor_id, estoque } = req.body;
      await Produto.update({ nome, descricao, preco, vendedor_id, estoque }, { where: { id } });
      res.redirect('/admin/produtos');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  excluirProduto: async (req, res) => {
    try {
      const { id } = req.params;
      await Produto.destroy({ where: { id } });
      res.redirect('/admin/produtos');
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      res.status(500).send('Erro interno do servidor');
    }
  },

  relatorioPedidos: async (req, res) => {
    try {
      // Recupera os pedidos
      const pedidos = await Pedido.findAll({
        include: [
          { model: Cliente, as: 'cliente', attributes: ['nome'] },
          { model: Vendedor, as: 'vendedor', attributes: ['nome'] },
        ]
      });

      // Mapeia os pedidos para exibição
      const pedidosMapeados = pedidos.map(pedido => ({
        id: pedido.id,
        clienteNome: pedido.cliente ? pedido.cliente.nome : 'Desconhecido',
        vendedorNome: pedido.vendedor ? pedido.vendedor.nome : 'Desconhecido',
        total: parseFloat(pedido.total), // Converte para número
        status: pedido.status,
        createdAt: pedido.createdAt,
      }));

      // Recupera os produtos mais comprados
      const produtosMaisComprados = await ItemPedido.findAll({
        attributes: [
          'produto_id',
          [sequelize.fn('SUM', sequelize.col('quantidade')), 'totalVendido']
        ],
        include: [
          {
            model: Produto,
            attributes: ['nome', 'vendedor_id'],
            include: [
              { model: Vendedor, attributes: ['nome'] } // Inclui Vendedor aqui
            ]
          }
        ],
        group: ['produto_id'],
        order: [[sequelize.literal('totalVendido'), 'DESC']],
        limit: 10
      });

      // Mapeia os produtos para exibição
      const rankingProdutos = produtosMaisComprados.map((item, index) => {
        const produto = item.Produto || {}; // Protege contra undefined
        const vendedor = produto.Vendedor || {}; // Protege contra undefined
        return {
          posicao: index + 1,
          produtoNome: produto.nome || 'Desconhecido',
          vendedorNome: vendedor.nome || 'Desconhecido',
          totalVendido: item.get('totalVendido')
        };
      });

      res.render('admin/relatorios', { pedidos: pedidosMapeados, rankingProdutos });
    } catch (error) {
      console.error('Erro ao carregar os relatórios:', error);
      res.status(500).send('Erro no servidor');
    }
  },
};

module.exports = adminController;
