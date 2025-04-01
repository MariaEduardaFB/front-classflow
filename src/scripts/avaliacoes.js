document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa fazer login.");
        window.location.href = "./login.html";
        return;
    }

    // Seletores globais
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
    const modalOpcoes = document.getElementById("modalOpcoes");
    const btnEditar = document.getElementById("btnEditar");
    const btnExcluir = document.getElementById("btnExcluir");


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

                document.querySelectorAll(".options-icon").forEach((icon) => {
                    icon.addEventListener("click", (event) => {
                        event.stopPropagation();
                        const avaliacaoDiv = event.target.closest(".avaliacao-item");
                        const avaliacaoId = avaliacaoDiv.getAttribute("data-id");
                        avaliacaoSelecionada = avaliacaoId;
                
                        console.log("Avaliacao selecionada:", avaliacaoSelecionada); // Log para verificar o ID
                
                        // Posiciona o menu modal ao lado do ícone
                        const rect = event.target.getBoundingClientRect();
                        menuModal.style.top = `${rect.top + window.scrollY + 20}px`;
                        menuModal.style.left = `${rect.left + window.scrollX}px`;
                        menuModal.style.display = "block";
                    });
                });

                  document.addEventListener("click", (event) => {
                    if (!menuModal.contains(event.target) && !event.target.classList.contains("options-icon")) {
                        menuModal.style.display = "none";
                    }
                });
            });
        } catch (error) {
            console.error("Erro ao carregar avaliações:", error);
            avaliacoesContainer.innerHTML = "<p>Erro ao carregar avaliações. Tente novamente mais tarde.</p>";
        }
    }

    // Função para abrir o menu de opções
    

    // Evento para editar a avaliação
    btnEditar.addEventListener("click", () => {
        modalOpcoes.style.display = "none"; // Fecha o menu de opções
        console.log(`Editar avaliação com ID: ${avaliacaoSelecionada}`);
        // Adicione aqui a lógica para abrir o modal de edição
    });

    // Evento para excluir a avaliação
    btnExcluir.addEventListener("click", () => {
        modalOpcoes.style.display = "none"; // Fecha o menu de opções
        confirmDeleteModal.style.display = "flex"; // Abre o modal de exclusão
    });

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

    // Eventos para confirmar ou cancelar a exclusão
    confirmDeleteBtn.addEventListener("click", excluirAvaliacao);
    cancelDeleteBtn.addEventListener("click", () => {
        confirmDeleteModal.style.display = "none";
    });

    // Seletores globais
const modalEditarAvaliacao = document.getElementById("modalEditarAvaliacao");
const formEditarAvaliacao = document.getElementById("formEditarAvaliacao");
const cancelarEditarAvaliacao = document.getElementById("cancelarEditarAvaliacao");

// Função para abrir o modal de edição
function abrirModalEditarAvaliacao(avaliacao) {
    // Preenche os campos do modal com os dados da avaliação selecionada
    document.getElementById("editarNomeAvaliacao").value = avaliacao.nome;
    document.getElementById("editarProfessor").value = avaliacao.professor;
    document.getElementById("editarDataAvaliacao").value = avaliacao.data.split("T")[0]; // Remove o timestamp
    document.getElementById("editarNotaAvaliacao").value = avaliacao.nota;
    document.getElementById("editarDisciplinaAvaliacao").value = avaliacao.disciplinaId;

    // Exibe o modal
    modalEditarAvaliacao.style.display = "flex";
}

// Evento para fechar o modal de edição
cancelarEditarAvaliacao.addEventListener("click", () => {
    modalEditarAvaliacao.style.display = "none";
});

// Evento para salvar as alterações
formEditarAvaliacao.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Obtém os valores dos campos
    const nome = document.getElementById("editarNomeAvaliacao").value;
    const professor = document.getElementById("editarProfessor").value;
    const data = document.getElementById("editarDataAvaliacao").value;
    const nota = document.getElementById("editarNotaAvaliacao").value;
    const disciplinaId = document.getElementById("editarDisciplinaAvaliacao").value;

    try {
        const response = await fetch(`http://localhost:3000/api/avaliacoes/${avaliacaoSelecionada}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ nome, professor, data, nota, disciplinaId }),
        });

        if (!response.ok) {
            throw new Error("Erro ao editar avaliação.");
        }

        alert("Avaliação editada com sucesso!");
        modalEditarAvaliacao.style.display = "none";
        carregarAvaliacoes(); // Recarrega as avaliações
    } catch (error) {
        console.error("Erro ao editar avaliação:", error);
        alert("Erro ao editar avaliação. Tente novamente.");
    }
});

// Adiciona evento ao botão de editar no menu de opções
btnEditar.addEventListener("click", async () => {
    menuModal.style.display = "none"; // Fecha o menu de opções

    console.log("ID da avaliação selecionada:", avaliacaoSelecionada); // Verifica o ID

    try {
        // Busca os dados da avaliação selecionada
        const response = await fetch(`http://localhost:3000/api/avaliacoes/${avaliacaoSelecionada}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar dados da avaliação.");
        }

        const avaliacao = await response.json();
        abrirModalEditarAvaliacao(avaliacao); // Abre o modal com os dados da avaliação
    } catch (error) {
        console.error("Erro ao buscar dados da avaliação:", error);
        alert("Erro ao buscar dados da avaliação. Tente novamente.");
    }
});

// Função para carregar as disciplinas no modal de edição
async function carregarDisciplinasEditar() {
    try {
        const response = await fetch("http://localhost:3000/api/disciplinas", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error("Erro ao carregar disciplinas.");
        }

        const disciplinas = await response.json();
        const disciplinaSelect = document.getElementById("editarDisciplinaAvaliacao");

        // Limpa as opções existentes
        disciplinaSelect.innerHTML = '<option value="" disabled>Selecione uma disciplina</option>';

        // Adiciona as disciplinas disponíveis
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

// Modifique a função abrirModalEditarAvaliacao para carregar as disciplinas
function abrirModalEditarAvaliacao(avaliacao) {
    // Preenche os campos do modal com os dados da avaliação selecionada
    document.getElementById("editarNomeAvaliacao").value = avaliacao.nome;
    document.getElementById("editarProfessor").value = avaliacao.professor;
    document.getElementById("editarDataAvaliacao").value = avaliacao.data.split("T")[0]; // Remove o timestamp
    document.getElementById("editarNotaAvaliacao").value = avaliacao.nota;

    // Carrega as disciplinas disponíveis e seleciona a atual
    carregarDisciplinasEditar().then(() => {
        document.getElementById("editarDisciplinaAvaliacao").value = avaliacao.disciplinaId;
    });

    // Exibe o modal
    modalEditarAvaliacao.style.display = "flex";
}

// Função para excluir uma avaliação
async function excluirAvaliacao() {
    if (!avaliacaoSelecionada) {
        alert("Nenhuma avaliação selecionada!");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/avaliacoes/${avaliacaoSelecionada}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error("Erro ao excluir avaliação.");
        }

        alert("Avaliação excluída com sucesso!");
        confirmDeleteModal.style.display = "none"; // Fecha o modal de confirmação
        carregarAvaliacoes(); // Recarrega as avaliações
    } catch (error) {
        console.error("Erro ao excluir avaliação:", error);
        alert("Erro ao excluir avaliação. Tente novamente.");
    }
}

// Evento para confirmar a exclusão
confirmDeleteBtn.addEventListener("click", excluirAvaliacao);

// Evento para abrir o modal de confirmação de exclusão
btnExcluir.addEventListener("click", () => {
    menuModal.style.display = "none"; // Fecha o menu de opções
    confirmDeleteModal.style.display = "flex"; // Abre o modal de confirmação
});

// Evento para cancelar a exclusão
cancelDeleteBtn.addEventListener("click", () => {
    confirmDeleteModal.style.display = "none"; // Fecha o modal de confirmação
});
    

    // Carregar os dados iniciais
    carregarDadosAluno();
    carregarDisciplinas();
    carregarAvaliacoes();
});