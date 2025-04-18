document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa fazer login.");
    window.location.href = "./login.html";
    return;
  }

  // Função para exibir alertas personalizados
  function showCustomAlert(message, type = "success") {
    const customAlert = document.getElementById("customAlert");
    const alertMessage = document.getElementById("alertMessage");

    alertMessage.textContent = message;
    customAlert.className = `custom-alert ${type}`;
    customAlert.style.display = "flex";

    setTimeout(() => {
      customAlert.style.display = "none";
    }, 3000);

    document.getElementById("closeAlert").addEventListener("click", () => {
      customAlert.style.display = "none";
    });
  }

  function showConfirmSaveModal(onConfirm, onCancel) {
    const confirmSaveModal = document.getElementById("confirmSaveModal");
    confirmSaveModal.style.display = "flex"; // Exibe o modal

    // Configura o botão "Sim"
    document.getElementById("confirmSave").onclick = () => {
      confirmSaveModal.style.display = "none"; // Fecha o modal
      if (onConfirm) onConfirm(); // Executa a função de confirmação
      showCustomAlert("Disciplina cadastrada com sucesso!", "success"); // Mensagem de sucesso (verde)
    };

    // Configura o botão "Não"
    document.getElementById("cancelSave").onclick = () => {
      confirmSaveModal.style.display = "none"; // Fecha o modal
      if (onCancel) onCancel(); // Executa a função de cancelamento
      showCustomAlert("Disciplina não cadastrada.", "error"); // Mensagem de erro (vermelho)
    };

    // Fecha o modal se clicar fora dele
    document.addEventListener("click", (event) => {
      if (confirmSaveModal.style.display === "flex" && !confirmSaveModal.contains(event.target)) {
        confirmSaveModal.style.display = "none"; // Fecha o modal
      }
    });
  }

  // Carregar o nome do usuário
  try {
    const response = await fetch("http://localhost:3000/api/alunos/perfil", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Erro da API:", error);
      throw new Error("Erro ao carregar informações do aluno.");
    }

    const aluno = await response.json();
    console.log("Dados do aluno:", aluno);

    // Atualizar o título com o nome do aluno
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `
      <h1>Oi, ${aluno.nome}!</h1>
      <p>Vamos gerenciar a sua vida acadêmica?</p>
    `;
  } catch (error) {
    console.error("Erro ao carregar informações:", error);
    alert("Erro ao carregar informações. Faça login novamente.");
    localStorage.removeItem("token");
    window.location.href = "./login.html";
  }

  const listaDisciplinas = document.getElementById("listaDisciplinas");
  const btnAbrirModal = document.getElementById("btnAbrirModal");
  const btnFecharModal = document.querySelector(".close");
  const formDisciplina = document.getElementById("formDisciplina");
  const filtroStatus = document.getElementById("filtro");
  const modal = document.getElementById("modal");
  const menuModal = document.getElementById("menuModal");
  const editModal = document.getElementById("editModal");
  let disciplinaSelecionada = null;
  let disciplinas = [];

  // Inicialize os modais como escondidos
  modal.style.display = "none";
  menuModal.style.display = "none";
  editModal.style.display = "none";

  // Event listener para o formulário de cadastro (adicionado apenas uma vez)
  formDisciplina.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const codigo = document.getElementById("codigo").value.trim();
    const cargaHoraria = document.getElementById("cargaHoraria").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const status = document.getElementById("status").value;

    const alunoId = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).id;

    if (!nome || !codigo || !cargaHoraria || !descricao || !status) {
      showCustomAlert("Por favor, preencha todos os campos.", "error"); // ADICIONADO
      return;
    }

    // Exibe o modal de confirmação personalizado
    showConfirmSaveModal(async () => {
      try {
        const response = await fetch("http://localhost:3000/api/disciplinas/cadastrar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome,
            codigo,
            cargaHoraria,
            descricao,
            status,
            alunoId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro ao cadastrar disciplina:", errorData);
          showCustomAlert(errorData.error || "Erro ao cadastrar disciplina.", "error"); // ADICIONADO
          return;
        }

        showCustomAlert("Disciplina cadastrada com sucesso!", "success"); // ADICIONADO
        formDisciplina.reset(); // Limpa o formulário
        modal.style.display = "none"; // Fecha o modal
        await carregarDisciplinas(); // Atualiza a lista de disciplinas
      } catch (error) {
        console.error("Erro na requisição:", error);
        showCustomAlert("Erro ao cadastrar disciplina.", "error"); // ADICIONADO
      }
    }, () => {
      showCustomAlert("Cadastro não realizado.", "warning"); // ADICIONADO: Ação ao cancelar
    });
  });

  // Função para carregar as disciplinas
  async function carregarDisciplinas() {
    try {
      console.log("Fazendo requisição para carregar disciplinas...");
      const response = await fetch("http://localhost:3000/api/disciplinas/disciplinas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error("Erro na resposta:", response.status, response.statusText);
        throw new Error("Você ainda não possui nenhuma disciplina.");
      }

      disciplinas = await response.json();
      console.log("Disciplinas recebidas:", disciplinas);

      listaDisciplinas.innerHTML = "";

      if (disciplinas.length === 0) {
        console.log("Nenhuma disciplina encontrada.");
        listaDisciplinas.innerHTML = "<p>Nenhuma disciplina cadastrada.</p>";
        return;
      }

      disciplinas.forEach((disciplina) => {
        console.log("Renderizando disciplina:", disciplina);
        const li = document.createElement("li");

        let statusClass = "";
        switch (disciplina.status.trim()) {
          case "Pendente":
            statusClass = "status-pendente";
            break;
          case "Em Andamento":
          case "Andamento":
            statusClass = "status-andamento";
            break;
          case "Concluída":
          case "Concluida":
            statusClass = "status-concluida";
            break;
          default:
            statusClass = "";
        }

        li.innerHTML = `
          <div class="disciplina-content" data-id="${disciplina.id}">
            <img src="../assets/icons/Icone_Disciplinas.png" alt="Ícone da disciplina" class="disciplina-icon">
            <div class="disciplina-info">
              <span class="disciplina-nome">${disciplina.nome}</span>
              <span class="disciplina-codigo">COD: ${disciplina.codigo}</span>
              <p class="disciplina-carga">CARGA HORÁRIA: ${disciplina.cargaHoraria} horas</p>
            </div>
            <div class="disciplina-options" data-id="${disciplina.id}">
              <img src="../assets/icons/Meatballs_menu.png" alt="Opções" class="options-icon">
            </div>
            <span class="disciplina-status ${statusClass}">${disciplina.status}</span>
          </div>
        `;

        listaDisciplinas.appendChild(li);
      });

      // Adiciona event listeners para os ícones de opções
      document.querySelectorAll(".options-icon").forEach((icon) => {
        icon.addEventListener("click", (event) => {
          event.stopPropagation();
          const disciplinaDiv = event.target.closest(".disciplina-content");
          const disciplinaId = disciplinaDiv.getAttribute("data-id");
          disciplinaSelecionada = disciplinaId;

          // Posiciona o menu modal ao lado do ícone
          const rect = event.target.getBoundingClientRect();
          menuModal.style.top = `${rect.top + window.scrollY + 20}px`;
          menuModal.style.left = `${rect.left + window.scrollX}px`;
          menuModal.style.display = "block";
        });
      });
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
      listaDisciplinas.innerHTML = "<p>Cadastre suas disciplinas para visualia-las aqui.</p>";
    }
  }

  // Abrir o modal de adicionar disciplina
  btnAbrirModal.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Fechar o modal de adicionar disciplina
  btnFecharModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  document.getElementById("btnEditar").addEventListener("click", () => {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "flex"; // Torna o modal visível

    if (disciplinaSelecionada) {
      // Encontra a disciplina selecionada na lista de disciplinas
      const disciplina = disciplinas.find(d => d.id === disciplinaSelecionada);

      if (disciplina) {
        // Preenche o modal de edição com os dados da disciplina
        document.getElementById("editNome").value = disciplina.nome;
        document.getElementById("editCodigo").value = disciplina.codigo;
        document.getElementById("editCargaHoraria").value = disciplina.cargaHoraria;
        document.getElementById("editDescricao").value = disciplina.descricao;
        document.getElementById("editStatus").value = disciplina.status;

        // Exibe o modal de edição
        editModal.style.display = "block";
      } else {
        console.error("Disciplina não encontrada.");
      }
    } else {
      console.error("Nenhuma disciplina selecionada.");
    }

    // Esconde o menu de opções
    menuModal.style.display = "none";
  });

  // Fechar o modal de edição
  document.getElementById("closeEditModal").addEventListener("click", () => {
    editModal.style.display = "none";
    disciplinaSelecionada = null; // Reseta o estado
  });

  // Cancelar a edição
  document.getElementById("cancelEdit").addEventListener("click", () => {
    editModal.style.display = "none";
    disciplinaSelecionada = null; // Reseta o estado
  });

  // Salvar a edição
  document.getElementById("formEditDisciplina").addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("editNome").value.trim();
    const codigo = document.getElementById("editCodigo").value.trim();
    const cargaHoraria = document.getElementById("editCargaHoraria").value.trim();
    const descricao = document.getElementById("editDescricao").value.trim();
    const status = document.getElementById("editStatus").value;

    try {
      const response = await fetch(`http://localhost:3000/api/disciplinas/${disciplinaSelecionada}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          codigo,
          cargaHoraria,
          descricao,
          status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro ao editar disciplina:", errorData);
        alert(errorData.error || "Erro ao editar disciplina.");
        return;
      }

      alert("Disciplina editada com sucesso!");
      editModal.style.display = "none";
      disciplinaSelecionada = null; // Reseta o estado
      await carregarDisciplinas(); // Atualiza a lista de disciplinas
    } catch (error) {
      console.error("Erro ao editar disciplina:", error);
      alert("Erro ao editar disciplina.");
    }
  });

  // Excluir disciplina
  document.getElementById("btnExcluir").addEventListener("click", async () => {
    // Exibe o modal de confirmação
    const confirmModal = document.getElementById("confirmModal");
    confirmModal.style.display = "flex"; // Torna o modal visível

    // Esconde o menu de opções quando clicar no botão de excluir
    menuModal.style.display = "none"; // Isso oculta o menu de opções

    // Ação de exclusão ao confirmar
    document.getElementById("confirmDelete").addEventListener("click", async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/disciplinas/${disciplinaSelecionada}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erro ao excluir disciplina.");

        alert("Disciplina excluída com sucesso!"); // Usa o alert nativo
        disciplinaSelecionada = null; // Reseta o estado
        confirmModal.style.display = "none"; // Fecha o modal
        await carregarDisciplinas(); // Atualiza a lista de disciplinas
      } catch (error) {
        console.error("Erro ao excluir disciplina:", error);
        alert("Erro ao excluir disciplina.");
      }
    });

    // Fecha o modal se clicar em "Não"
    document.getElementById("cancelDelete").addEventListener("click", () => {
      confirmModal.style.display = "none"; // Fecha o modal
      disciplinaSelecionada = null; // Reseta o estado
    });

    // Fechar o modal se clicar fora dele
    document.addEventListener("click", (event) => {
      // Verifica se o clique foi fora do modal
      if (confirmModal.style.display === "flex" && !confirmModal.contains(event.target) && event.target !== document.getElementById("btnExcluir")) {
        confirmModal.style.display = "none"; // Fecha o modal se o clique for fora dele
        disciplinaSelecionada = null; // Reseta o estado
      }
    });
  });

  // Filtrar disciplinas por status
  filtroStatus.addEventListener("change", () => {
    const status = filtroStatus.value.toLowerCase(); // Converte o valor do filtro para minúsculas
    const todasDisciplinas = listaDisciplinas.querySelectorAll("li");

    todasDisciplinas.forEach((disciplina) => {
      const statusDisciplina = disciplina.querySelector(".disciplina-status").textContent.trim().toLowerCase(); // Converte o status da disciplina para minúsculas

      // Verifica se o filtro é "todos" ou se o status da disciplina corresponde ao filtro
      if (status === "todos" || status === statusDisciplina) {
        disciplina.style.display = "block"; // Mostra a disciplina
      } else {
        disciplina.style.display = "none"; // Oculta a disciplina
      }
    });
  });

  // Carregar as disciplinas ao iniciar a página
  carregarDisciplinas();
});