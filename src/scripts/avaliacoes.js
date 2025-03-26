document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa fazer login.");
        window.location.href = "./login.html";
        return;
    }

    const avaliacoesContainer = document.getElementById("avaliacoesContainer");
    const modalAvaliacao = document.getElementById("modalAvaliacao");
    const btnAbrirModalAvaliacao = document.getElementById("btnAbrirModalAvaliacao");
    const fecharModalAvaliacao = document.getElementById("fecharModalAvaliacao");
    const cancelarAvaliacao = document.getElementById("cancelarAvaliacao");
    const formAvaliacao = document.getElementById("formAvaliacao");
    const disciplinaSelect = document.getElementById("disciplinaAvaliacao");
    const confirmDeleteModal = document.getElementById("confirmDeleteModal");
    const confirmDeleteBtn = document.getElementById("confirmDelete");
    const cancelDeleteBtn = document.getElementById("cancelDelete");

    let avaliacaoSelecionada = null;

    // Função para carregar o nome do aluno
    async function carregarDadosAluno() {
        try {
            const response = await fetch("http://localhost:3000/api/alunos/perfil", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Erro ao carregar informações do aluno.");
            }

            const aluno = await response.json();
            const mainContent = document.getElementById("main-content");
            mainContent.innerHTML = `
                <h1>Oi, ${aluno.nome}!</h1>
                <p>Gerencie suas avaliações aqui.</p>
            `;
        } catch (error) {
            console.error("Erro ao carregar informações do aluno:", error);
            alert("Erro ao carregar informações. Faça login novamente.");
            localStorage.removeItem("token");
            window.location.href = "./login.html";
        }
    }

    // Função para carregar as disciplinas
    async function carregarDisciplinas() {
        try {
            const response = await fetch("http://localhost:3000/api/disciplinas", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Erro ao carregar disciplinas.");
            }

            const disciplinas = await response.json();
            disciplinas.forEach((disciplina) => {
                const option = document.createElement("option");
                option.value = disciplina.id;
                option.textContent = disciplina.nome;
                disciplinaSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Erro ao carregar disciplinas:", error);
            alert("Erro ao carregar disciplinas. Tente novamente mais tarde.");
        }
    }

    // Função para carregar as avaliações
    async function carregarAvaliacoes() {
        try {
            const response = await fetch("http://localhost:3000/api/avaliacoes", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Erro ao carregar avaliações.");
            }

            const avaliacoes = await response.json();
            avaliacoesContainer.innerHTML = "";

            if (avaliacoes.length === 0) {
                avaliacoesContainer.innerHTML = "<p>Nenhuma avaliação cadastrada.</p>";
                return;
            }

            avaliacoes.forEach((avaliacao) => {
                const div = document.createElement("div");
                div.className = "avaliacao-item";
                div.dataset.id = avaliacao.id;
                div.innerHTML = `
                    <div class="avaliacao-header">
                        <div class="avaliacao-title-container">
                            <h3>${avaliacao.nome}</h3>
                            <div class="avaliacao-actions">
                                <img src="../assets/icons/Meatballs_menu.png" 
                                     alt="Opções" 
                                     class="options-icon" 
                                     data-id="${avaliacao.id}"
                                     width="25" 
                                     height="25">
                            </div>
                        </div>
                        <p class="avaliacao-info-left">Disciplina: ${avaliacao.Disciplina.nome}</p>
                        <p class="avaliacao-info-left">Professor: ${avaliacao.professor}</p>
                        <div class="avaliacao-meta">
                            <span class="avaliacao-data">
                                <img src="../assets/icons/note-2.png" alt="Data" class="meta-icon">
                                ${new Date(avaliacao.data).toLocaleDateString()}
                            </span>
                            <span class="avaliacao-nota">
                                <img src="../assets/icons/Star 1.png" alt="Nota" class="meta-icon">
                                ${avaliacao.nota}
                            </span>
                        </div>
                    </div>
                `;
                avaliacoesContainer.appendChild(div);
            });
        } catch (error) {
            console.error("Erro ao carregar avaliações:", error);
            avaliacoesContainer.innerHTML = "<p>Erro ao carregar avaliações. Tente novamente mais tarde.</p>";
        }
    }

    // Função para cadastrar uma nova avaliação
    async function cadastrarAvaliacao() {
        const nome = document.getElementById("nomeAvaliacao").value;
        const professor = document.getElementById("professor").value;
        const data = document.getElementById("dataAvaliacao").value;
        const nota = document.getElementById("notaAvaliacao").value;
        const disciplinaId = disciplinaSelect.value;

        if (!nome || !professor || !data || !nota || !disciplinaId) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/avaliacoes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ nome, professor, data, nota, disciplinaId }),
            });

            if (!response.ok) {
                throw new Error("Erro ao cadastrar avaliação.");
            }

            alert("Avaliação cadastrada com sucesso!");
            formAvaliacao.reset();
            modalAvaliacao.style.display = "none";
            carregarAvaliacoes();
        } catch (error) {
            console.error("Erro ao cadastrar avaliação:", error);
            alert("Erro ao cadastrar avaliação. Tente novamente.");
        }
    }

    // Função para excluir uma avaliação
    async function excluirAvaliacao() {
        try {
            const response = await fetch(`http://localhost:3000/api/avaliacoes/${avaliacaoSelecionada}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Erro ao excluir avaliação.");
            }

            alert("Avaliação excluída com sucesso!");
            confirmDeleteModal.style.display = "none";
            carregarAvaliacoes();
        } catch (error) {
            console.error("Erro ao excluir avaliação:", error);
            alert("Erro ao excluir avaliação. Tente novamente.");
        }
    }

    // Eventos para abrir e fechar o modal de cadastro
    btnAbrirModalAvaliacao.addEventListener("click", () => {
        modalAvaliacao.style.display = "flex";
    });

    fecharModalAvaliacao.addEventListener("click", () => {
        modalAvaliacao.style.display = "none";
    });

    cancelarAvaliacao.addEventListener("click", () => {
        modalAvaliacao.style.display = "none";
    });

    // Evento para enviar o formulário de cadastro
    formAvaliacao.addEventListener("submit", (event) => {
        event.preventDefault();
        cadastrarAvaliacao();
    });

    // Evento para abrir o modal de exclusão
    avaliacoesContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("excluir-avaliacao")) {
            avaliacaoSelecionada = event.target.closest(".avaliacao-item").dataset.id;
            confirmDeleteModal.style.display = "flex";
        }
    });

    // Eventos para confirmar ou cancelar a exclusão
    confirmDeleteBtn.addEventListener("click", excluirAvaliacao);
    cancelDeleteBtn.addEventListener("click", () => {
        confirmDeleteModal.style.display = "none";
    });

    // Fechar o modal ao clicar fora do conteúdo
    window.addEventListener("click", (event) => {
        if (event.target === modalAvaliacao) {
            modalAvaliacao.style.display = "none";
        }
        if (event.target === confirmDeleteModal) {
            confirmDeleteModal.style.display = "none";
        }
    });

    // Carregar os dados iniciais
    carregarDadosAluno();
    carregarDisciplinas();
    carregarAvaliacoes();
});