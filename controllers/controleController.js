// controllers/controleController.js
const usuarios = []; // Aqui você pode armazenar os dados dos usuários temporariamente

// Função para adicionar um novo usuário
const adicionarUsuario = (req, res) => {
    const { id, nome } = req.body;
    usuarios.push({ id, nome });
    res.json({ success: true, usuarios });
};

// Função para excluir um usuário
const excluirUsuario = (req, res) => {
    const { id } = req.body;
    const index = usuarios.findIndex(usuario => usuario.id === id);
    if (index !== -1) {
        usuarios.splice(index, 1);
        res.json({ success: true, usuarios });
    } else {
        res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
};

// Função para listar todos os usuários
const listarUsuarios = (req, res) => {
    res.json({ usuarios });
};

module.exports = { adicionarUsuario, excluirUsuario, listarUsuarios };
