document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  console.log('Token carregado do LocalStorage:', token);

  if (!token) {
    alert('Você precisa fazer login.');
    window.location.href = './login.html';
    return;
  }

  // Obter informações do aluno
  try {
    const response = await fetch('http://localhost:3000/api/alunos/perfil', {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Resposta da API:', response);

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro da API:', error);
      throw new Error('Erro ao carregar informações do aluno.');
    }

    const aluno = await response.json();
    console.log('Dados do aluno:', aluno);

    // Atualizar o título com o nome do aluno (sem os botões)
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
      <h1>Oi, ${aluno.nome}!</h1>
      <p>Vamos gerenciar a sua vida acadêmica?</p>
      <img src="../assets/fotoDeFundo.png" alt="Imagem de exemplo" id="imagem-principal">
      <h2> Acompanhe seu semestre 
      <p> Relatório Semanal </p>
      </h2>
      
    `;

    // Se você quiser adicionar mais lógica sem os botões, pode incluir aqui.
    // Por exemplo, carregar dados adicionais ou exibir outro conteúdo.

  } catch (error) {
    console.error('Erro ao carregar informações:', error);
    alert('Erro ao carregar informações. Faça login novamente.');
    localStorage.removeItem('token');
    window.location.href = './login.html';
  }
});
