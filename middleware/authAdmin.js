// middleware/authAdmin.js
module.exports = (req, res, next) => {
    if (req.session.usuario && req.session.usuario.tipoUsuario === 'admin') {
        next(); // Usuário autenticado, pode prosseguir
    } else {
        res.redirect('/admin/login'); // Redireciona para a página de login
    }
};
