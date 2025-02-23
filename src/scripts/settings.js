import { getProfileInfo } from '../api/getProfileInfo.js';

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Você precisa fazer login.');
    window.location.href = './login.html';
    return;
  }

  // Função para buscar dados do aluno
  async function buscarDadosAluno() {
    const profileInfo = await getProfileInfo(token);
    if (!profileInfo.ok)
      throw new Error('Erro ao carregar informações do aluno');
    return await profileInfo.json();
  }

  // Função para renderizar dados na tela
  function renderizarDados(aluno) {
    const userInfoDiv = document.getElementById('user-info');
    if (!userInfoDiv) {
      throw new Error('Elemento user-info não encontrado');
    }

    userInfoDiv.innerHTML = `
      <div class="user-profile">
        <h2>${aluno.nome}</h2>
        <p>Email: ${aluno.email}</p>
        <p>Matrícula: ${aluno.matricula}</p>
        <p>Curso: ${aluno.curso}</p>
        <button id="editar-info">Editar Informações</button>
      </div>
    `;

    // Reatribui o event listener ao botão "Editar Informações"
    document.getElementById('editar-info').addEventListener('click', (e) => {
      e.preventDefault();
      // Preenche os campos do modal com os dados atuais
      document.getElementById('edit-nome').value = aluno.nome;
      document.getElementById('edit-email').value = aluno.email;
      document.getElementById('edit-matricula').value = aluno.matricula;
      document.getElementById('edit-curso').value = aluno.curso;
      document.getElementById('edit-senha').value = ''; // senha sempre iniciada vazia

      const modal = document.getElementById('edit-modal');
      modal.style.display = 'flex';
    });
  }

  // Função para pegar dados do modal
  function getDadosModal() {
    const nomeInput = document.getElementById('edit-nome');
    const emailInput = document.getElementById('edit-email');
    const matriculaInput = document.getElementById('edit-matricula');
    const senhaInput = document.getElementById('edit-senha');
    const cursoInput = document.getElementById('edit-curso');

    if (
      !nomeInput ||
      !emailInput ||
      !matriculaInput ||
      !senhaInput ||
      !cursoInput
    ) {
      throw new Error('Campos do formulário não encontrados');
    }

    return {
      nome: nomeInput.value.trim(),
      email: emailInput.value.trim(),
      matricula: matriculaInput.value.trim(),
      senha: senhaInput.value.trim(),
      curso: cursoInput.value.trim(),
    };
  }

  // Função para gerar dados modificados
  function gerarDadosModificados(dadosAtuais, dadosNovos) {
    const dadosModificados = {};

    if (dadosNovos.nome && dadosNovos.nome !== dadosAtuais.nome) {
      dadosModificados.nome = dadosNovos.nome;
    }
    if (dadosNovos.email && dadosNovos.email !== dadosAtuais.email) {
      dadosModificados.email = dadosNovos.email;
    }
    if (
      dadosNovos.matricula &&
      dadosNovos.matricula !== dadosAtuais.matricula
    ) {
      dadosModificados.matricula = dadosNovos.matricula;
    }
    if (dadosNovos.curso && dadosNovos.curso !== dadosAtuais.curso) {
      dadosModificados.curso = dadosNovos.curso;
    }
    if (dadosNovos.senha) {
      dadosModificados.senha = dadosNovos.senha;
    }

    return dadosModificados;
  }

  // Função para atualizar dados na API
  async function atualizarDados(dadosModificados) {
    const response = await fetch('http://localhost:3000/api/alunos/editar', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosModificados),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar dados');
    }

    return await response.json();
  }

  try {
    // Busca inicial dos dados
    const dadosAtuais = await buscarDadosAluno();
    renderizarDados(dadosAtuais);

    // Configuração do modal
    const modal = document.getElementById('edit-modal');
    const saveButton = modal.querySelector('.save-btn');
    const cancelButton = modal.querySelector('.cancel-btn');

    if (!modal || !saveButton || !cancelButton) {
      throw new Error('Elementos do modal não encontrados');
    }

    // Event Listeners
    cancelButton.addEventListener('click', (e) => {
      e.preventDefault();
      modal.style.display = 'none';
    });

    saveButton.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        const dadosNovos = getDadosModal();
        const dadosModificados = gerarDadosModificados(dadosAtuais, dadosNovos);

        if (Object.keys(dadosModificados).length === 0) {
          alert('Nenhuma alteração foi feita.');
          return;
        }

        await atualizarDados(dadosModificados);
        const dadosAtualizados = await buscarDadosAluno();
        renderizarDados(dadosAtualizados);

        modal.style.display = 'none';
        alert('Informações atualizadas com sucesso!');
      } catch (error) {
        console.error('Erro ao salvar alterações:', error);
        alert(`Erro ao salvar alterações: ${error.message}`);
      }
    });
  } catch (error) {
    console.error('Erro:', error);
    alert(`Erro: ${error.message}`);
    localStorage.removeItem('token');
    window.location.href = './login.html';
  }
});
