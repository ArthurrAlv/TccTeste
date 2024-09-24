require('dotenv').config();
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const sequelize = require('../config/db');

(async () => {
  try {
    // Conecta ao banco de dados
    await sequelize.authenticate();

    // Gera o hash da senha
    const senhaHash = bcrypt.hashSync('admin123', 10);

    // Cria o administrador
    await Admin.create({
      nome: 'Administrador',
      email: 'admin@gmail.com',
      senha: senhaHash
    });

    console.log('Administrador criado com sucesso!');
    process.exit();
  } catch (error) {
    console.error('Erro ao criar o administrador:', error);
    process.exit(1);
  }
})();


/*
//atualizar dados do admin
//codigo  ----   'node updateAdminPassword.js'

const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const sequelize = require('../config/db');

(async () => {
  try {
    await sequelize.authenticate();

    const novaSenha = 'novaSenhaSegura123';
    const senhaHash = bcrypt.hashSync(novaSenha, 10);

    await Admin.update(
      { senha: senhaHash },
      { where: { email: 'admin@exemplo.com' } } // Atualiza o administrador pelo email
    );

    console.log('Senha do administrador atualizada com sucesso!');
    process.exit();
  } catch (error) {
    console.error('Erro ao atualizar a senha do administrador:', error);
    process.exit(1);
  }
})();

*/