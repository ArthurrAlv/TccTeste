// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  console.log('Verificando autenticação...');
  if (req.session && req.session.usuario) {
    req.user = req.session.usuario;
    console.log('Usuário autenticado:', req.user.tipoUsuario);
    next();
  } else {
    console.log('Usuário não autenticado, redirecionando para login.');
    return res.redirect('/auth/login'); // Redireciona diretamente para a página de login
  }
};

// Middleware para redirecionamento de usuários autenticados
const redirectIfAuthenticated = (req, res, next) => {
  if (req.session && req.session.usuario) {
    console.log('Usuário autenticado, redirecionando...');
    return redirectAuthenticatedUser(req, res);
  }
  console.log('Usuário não autenticado, permitindo acesso ao login...');
  next();
};

const redirectAuthenticatedUser = (req, res) => {
  console.log('Usuário autenticado(2), redirecionando...');
  const tipoUsuario = req.session.usuario.tipoUsuario; // Obtém o tipo de usuário
  if (tipoUsuario === 'usuarios') {
    return res.redirect('/usuarios/principal'); // Redireciona para a página principal dos usuários
  } else if (tipoUsuario === 'admin') {
    return res.redirect('/admin/painel'); // Redireciona admins para o painel administrativo
  } else {
    return res.redirect('/auth/login'); // Redireciona para a página de login se o tipo de usuário for desconhecido
  }
};

module.exports = { authMiddleware, redirectIfAuthenticated, redirectAuthenticatedUser };
