// Captura os botões de abrir o modal de login
const openLoginModalButton = document.getElementById('openLoginModal');

// Captura o modal de login
const loginModal = document.getElementById('loginModal');

// Captura o botão de fechar o modal de login
const closeLoginModalButton = document.getElementById('closeLoginModal');

// Função para abrir o modal de login
openLoginModalButton.addEventListener('click', () => {
  loginModal.style.display = 'block';
});

// Função para fechar o modal de login
closeLoginModalButton.addEventListener('click', () => {
  loginModal.style.display = 'none';
});

// Fechar o modal ao clicar fora dele
window.addEventListener('click', (event) => {
  if (event.target === loginModal) {
    loginModal.style.display = 'none';
  }
});

// Verifica se o modal deve ser aberto automaticamente ao carregar a página
window.onload = function () {
  if (localStorage.getItem('openLoginModal')) {
    localStorage.removeItem('openLoginModal');
    loginModal.style.display = 'block';
  }
};

// Captura o evento de envio do formulário de login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Limpa as mensagens de erro anteriores
  document.getElementById('emailError').textContent = '';
  document.getElementById('passwordError').textContent = '';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  let formIsValid = true;

  // Verifica se o email está vazio
  if (!email) {
    document.getElementById('emailError').textContent = 'Preencha todos os campos.';
    formIsValid = false;
  }

  // Verifica se a senha está vazia
  if (!password) {
    document.getElementById('passwordError').textContent = 'Preencha todos os campos.';
    formIsValid = false;
  }

  // Se o formulário não for válido, não envia a requisição
  if (!formIsValid) return;

  try {
    const response = await fetch('http://localhost:3000/api/alunos/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha: password }),
    });

    const data = await response.json();
    if (data.token) {
      console.log('Token recebido:', data.token);
      localStorage.setItem('token', data.token);

      // Navegar para a página inicial (home)
      window.location.href = 'home.html';
    } else {
      alert('Erro ao fazer login: ' + (data.error || 'Erro desconhecido.'));
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    alert('Erro ao fazer login. Tente novamente mais tarde.');
  }
});
