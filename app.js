// app.js
const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const sequelize = require('./config/db'); // Importando o sequelize
const app = express();

dotenv.config();

// Configuração da sessão
app.use(session({
  secret: 'segredo', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(flash());

// Middleware para passar mensagens flash e sessão para os templates
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.session = req.session; // Torna a sessão disponível em todas as views
  next();
});

// Middleware para lidar com o corpo das requisições
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Esta linha já abrange o body-parser

// Configurar o middleware para servir arquivos estáticos
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Importar e usar as rotas
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const digitalRoutes = require('./routes/digitalRoutes');
const userRoutes = require('./routes/userRoutes');

// Rota raiz que redireciona para /auth/login
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

// Registro das rotas
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/digitais', digitalRoutes);
app.use('/usuario', userRoutes);

/*
// Importar e definir associações
require('./models/associations');
*/

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Sincronização do Sequelize (opcional, útil durante o desenvolvimento)
sequelize.sync({ force: false }) // Use { force: true } para reiniciar tabelas a cada execução (cuidado!)
  .then(() => {
    console.log('Banco de dados sincronizado');
  })
  .catch(err => {
    console.error('Erro ao sincronizar banco de dados:', err);
  });


