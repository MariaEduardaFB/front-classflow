// loadMenu.js
document.addEventListener('DOMContentLoaded', () => {
  fetch('../pages/menu.html') // Caminho atualizado para a pasta 'pages'
      .then(response => response.text())
      .then(data => {
          document.getElementById('sidebar-container').innerHTML = data;

          // Garante que o botão de logout foi carregado antes de adicionar o evento
          setTimeout(() => {
              const logoutBtn = document.getElementById("logout-btn");
              if (logoutBtn) {
                  logoutBtn.addEventListener("click", function() {
                      if (confirm("Tem certeza que deseja sair?")) {
                          window.location.href = "./login.html"; // Redireciona para a página de login
                      }
                  });
              } else {
                  console.error("Botão de logout não encontrado!");
              }
          }, 100);
      })
      .catch(error => console.error('Erro ao carregar o menu:', error));
});
