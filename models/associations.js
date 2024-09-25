// models/associations
const Produto = require('./produto');
const Cliente = require('./cliente');
const Vendedor = require('./vendedor');
const Carrinho = require('./carrinho');
const Pedido = require('./pedido');
const ItemPedido = require('./itemPedido');

// Associando Produto e Carrinho
Produto.hasMany(Carrinho, { foreignKey: 'produto_id' });
Carrinho.belongsTo(Produto, { foreignKey: 'produto_id' });

// Associando Cliente e Carrinho
Cliente.hasMany(Carrinho, { foreignKey: 'cliente_id' });
Carrinho.belongsTo(Cliente, { foreignKey: 'cliente_id' });

// Associando Cliente e Pedido
Cliente.hasMany(Pedido, { foreignKey: 'cliente_id' });
Pedido.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

// Associando Vendedor e Pedido
Vendedor.hasMany(Pedido, { foreignKey: 'vendedor_id' });
Pedido.belongsTo(Vendedor, { foreignKey: 'vendedor_id', as: 'vendedor' });

// Associando Pedido e ItemPedido
Pedido.hasMany(ItemPedido, { foreignKey: 'pedido_id' });
ItemPedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });

// Associando Produto e ItemPedido
Produto.hasMany(ItemPedido, { foreignKey: 'produto_id' });
ItemPedido.belongsTo(Produto, { foreignKey: 'produto_id' });

// Associando Produto e Vendedor
Vendedor.hasMany(Produto, { foreignKey: 'vendedor_id' });
Produto.belongsTo(Vendedor, { foreignKey: 'vendedor_id' });