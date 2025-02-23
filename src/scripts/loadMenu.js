// loadMenu.js
document.addEventListener('DOMContentLoaded', () => {
  // Ajuste do caminho para o arquivo 'menu.html' que agora está dentro da pasta 'pages'
  fetch('../pages/menu.html') // Caminho atualizado para a pasta 'pages'
    .then(response => response.text()) // Transforma a resposta em texto
    .then(data => {
      document.getElementById('sidebar-container').innerHTML = data; // Insere o conteúdo na página
    })
    .catch(error => console.error('Erro ao carregar o menu:', error)); // Log de erro
});
