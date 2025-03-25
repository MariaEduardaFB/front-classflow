document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa fazer login.");
        window.location.href = "./login.html";
        return;
    }

    // Função para carregar as disciplinas do aluno
    async function carregarDisciplinas() {
        try {
            const response = await fetch("http://localhost:3000/api/disciplinas", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const error = await response.json();
                console.error("Erro ao carregar disciplinas:", error);
                throw new Error("Erro ao carregar disciplinas.");
            }

            const disciplinas = await response.json();
            console.log("Disciplinas do aluno:", disciplinas);

            // Preencher o seletor de disciplinas
            const disciplinaSelect = document.getElementById("disciplina");
            disciplinas.forEach((disciplina) => {
                const option = document.createElement("option");
                option.value = disciplina.id; // Use o ID da disciplina como valor
                option.textContent = disciplina.nome; // Use o nome da disciplina como texto
                disciplinaSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Erro ao carregar disciplinas:", error);
            alert("Erro ao carregar disciplinas. Tente novamente mais tarde.");
        }
    }

    // Função para carregar os dados do aluno
    async function carregarDadosAluno() {
        try {
            const response = await fetch("http://localhost:3000/api/alunos/perfil", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const error = await response.json();
                console.error("Erro ao carregar dados do aluno:", error);
                throw new Error("Erro ao carregar informações do aluno.");
            }

            const aluno = await response.json();
            console.log("Dados do aluno:", aluno);

            // Atualizar o título com o nome do aluno
            const mainContent = document.getElementById("main-content");
            mainContent.innerHTML = `
                <h1>Oi, ${aluno.nome}!</h1>
                <p>Vamos gerenciar seus horários?</p>
            `;
        } catch (error) {
            console.error("Erro ao carregar informações do aluno:", error);
            alert("Erro ao carregar informações do aluno. Faça login novamente.");
            localStorage.removeItem("token");
            window.location.href = "./login.html";
        }
    }

    // Função para carregar os horários
    async function carregarHorarios() {
        try {
            const response = await fetch("http://localhost:3000/api/horarios", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                console.error("Erro na resposta:", response.status, response.statusText);
                throw new Error("Você ainda não possui nenhum horário cadastrado.");
            }

            const horarios = await response.json(); // Guarda os horários retornados da API

            const horariosContainer = document.getElementById("horariosContainer");

            // Limpa o contêiner antes de adicionar os novos horários
            horariosContainer.innerHTML = "";

            if (horarios.length === 0) {
                horariosContainer.innerHTML += "<p>Nenhum horário cadastrado.</p>";
                return;
            }

            // Itera sobre os horários e cria os elementos HTML
            horarios.forEach((horario) => {
                const div = document.createElement("div");
                div.className = "horario-item";
                div.dataset.id = horario.id; // Certifique-se de que o ID está sendo atribuído aqui
                div.innerHTML = `
                    <div class="horario-header">
                        <h3 class="disciplina-nome">${horario.Disciplina.nome}</h3>
                        <img src="../assets/icons/Meatballs_menu.png" alt="Menu" class="menu-icon" />
                        <div class="menu-opcoes">
                            <button class="editar-horario">Editar</button>
                            <button class="excluir-horario">Excluir</button>
                        </div>
                    </div>
                    <p class="carga-horaria">Disciplina de ${horario.cargaHoraria} horas</p>
                    <hr class="horario-separador">
                    <div class="horario-info">
                        <p class="horario-dia">Dia: ${horario.diaSemana}</p>
                        <p class="horario-detalhes">${horario.hInicio} às ${horario.hFim}</p>
                    </div>
                `;
                horariosContainer.appendChild(div); // Adiciona o novo horário ao contêiner
            });
        } catch (error) {
            console.error("Erro ao carregar horários:", error);
            const horariosContainer = document.getElementById("horariosContainer");
            horariosContainer.innerHTML += "<p>Erro ao carregar os horários. Tente novamente mais tarde.</p>";
        }
    }

    // Função para excluir um horário
    async function excluirHorario(horarioId) {
        if (confirm("Tem certeza que deseja excluir este horário?")) {
            try {
                const response = await fetch(`http://localhost:3000/api/horarios/${horarioId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error("Erro ao excluir o horário.");
                }

                showCustomAlert("Horário excluído com sucesso!");
                carregarHorarios(); // Atualiza a lista de horários
            } catch (error) {
                console.error("Erro ao excluir horário:", error);
                showCustomAlert("Erro ao excluir o horário. Tente novamente.", "error");
            }
        }
    }

    // Função para editar um horário (exemplo básico)
    function editarHorario(horarioId) {
        // Busca os dados do horário para edição
        fetch(`http://localhost:3000/api/horarios/${horarioId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar os dados do horário.");
                }
                return response.json();
            })
            .then((horario) => {
                abrirModalEdicao(horario); // Chama a função para abrir o modal e preencher os dados
            })
            .catch((error) => {
                console.error("Erro ao buscar os dados do horário:", error);
                showCustomAlert("Erro ao buscar os dados do horário. Tente novamente.", "error");
            });
    }

    // Adicionar eventos aos botões de excluir e editar
    document.getElementById("horariosContainer").addEventListener("click", (event) => {
        if (event.target.classList.contains("excluir-horario")) {
            const horarioId = event.target.closest(".horario-item").dataset.id;
            excluirHorario(horarioId);
        }

        if (event.target.classList.contains("editar-horario")) {
            const horarioId = event.target.closest(".horario-item").dataset.id;
            editarHorario(horarioId);
        }
    });

    // Adicionar evento de clique ao ícone do menu
    document.getElementById("horariosContainer").addEventListener("click", (event) => {
        if (event.target.classList.contains("menu-icon")) {
            const menuOpcoes = event.target.nextElementSibling;

            // Verifica se o próximo elemento é realmente o menu de opções
            if (menuOpcoes && menuOpcoes.classList.contains("menu-opcoes")) {
                // Fecha todos os outros menus antes de abrir o atual
                document.querySelectorAll(".menu-opcoes").forEach((menu) => {
                    menu.style.display = "none";
                });

                // Alterna a visibilidade do menu clicado
                menuOpcoes.style.display =
                    menuOpcoes.style.display === "block" ? "none" : "block";
            }
        }
    });

    // Fechar o menu ao clicar fora dele
    document.addEventListener("click", (event) => {
        if (!event.target.classList.contains("menu-icon") && !event.target.closest(".menu-opcoes")) {
            document.querySelectorAll(".menu-opcoes").forEach((menu) => {
                menu.style.display = "none";
            });
        }
    });

    // Função para cadastrar um novo horário
    async function cadastrarHorario() {
        const disciplina = document.getElementById("disciplina").value;
        const diaSemana = document.getElementById("diaSemana").value;
        const hInicio = document.getElementById("hInicio").value;
        const hFim = document.getElementById("hFim").value;
        const cargaHoraria = document.getElementById("cargaHoraria").value;

        if (!disciplina || !diaSemana || !hInicio || !hFim || !cargaHoraria) {
            showCustomAlert("Todos os campos são obrigatórios!", "error");
            return;
        }

        const formData = {
            disciplinaId: disciplina,
            diaSemana,
            hInicio,
            hFim,
            cargaHoraria,
        };

        try {
            const response = await fetch("http://localhost:3000/api/horarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Erro ao cadastrar horário.");
            }

            showCustomAlert("Horário cadastrado com sucesso!", "success");
            document.getElementById("formHorario").reset(); // Limpa o formulário
            modalHorario.style.display = "none"; // Fecha o modal
            carregarHorarios(); // Atualiza a lista de horários
        } catch (error) {
            console.error("Erro ao cadastrar horário:", error);
            showCustomAlertalert(`Erro ao cadastrar horário: ${error.message}`);
        }
    }

    // Elementos do modal
    const modalHorario = document.getElementById("modalHorario");
    const btnAbrirModalHorario = document.getElementById("btnAbrirModalHorario");
    const btnFecharModalHorario = modalHorario.querySelector(".close");
    const cancelarHorarioBtn = document.getElementById("cancelarHorarioBtn");

    // Abrir o modal ao clicar no botão
    btnAbrirModalHorario.addEventListener("click", () => {
        modalHorario.style.display = "flex"; // Exibe o modal
    });

    // Fechar o modal ao clicar no botão de fechar
    btnFecharModalHorario.addEventListener("click", () => {
        modalHorario.style.display = "none"; // Esconde o modal
    });

    // Fechar o modal ao clicar no botão de cancelar
    cancelarHorarioBtn.addEventListener("click", () => {
        modalHorario.style.display = "none"; // Esconde o modal
    });

    // Fechar o modal ao clicar fora do conteúdo do modal
    window.addEventListener("click", (event) => {
        if (event.target === modalHorario) {
            modalHorario.style.display = "none"; // Esconde o modal
        }
    });

    

    

    // Carregar os dados do aluno ao iniciar a página
    carregarDadosAluno();

    // Carregar as disciplinas ao iniciar a página
    carregarDisciplinas();

    // Carregar os horários ao iniciar a página
    carregarHorarios();

    // Adicionar evento de envio ao formulário
    const formHorario = document.getElementById("formHorario");
    formHorario.addEventListener("submit", (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário
        cadastrarHorario(); // Chama a função para cadastrar o horário
    });

    function abrirModalEdicao(horario) {
        const modalEdicao = document.getElementById("modalEdicao");
        const disciplinaInput = document.getElementById("editarDisciplina");
        const diaSemanaInput = document.getElementById("editarDiaSemana");
        const hInicioInput = document.getElementById("editarHInicio");
        const hFimInput = document.getElementById("editarHFim");
        const cargaHorariaInput = document.getElementById("editarCargaHoraria");
    
        // Fecha todos os menus de opções
        document.querySelectorAll(".menu-opcoes").forEach((menu) => {
            menu.style.display = "none";
        });
    
        // Limpa as opções existentes no campo de seleção
        disciplinaInput.innerHTML = '<option value="" disabled>Selecione uma disciplina</option>';
    
        // Busca as disciplinas e preenche o campo de seleção
        fetch("http://localhost:3000/api/disciplinas", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar disciplinas.");
                }
                return response.json();
            })
            .then((disciplinas) => {
                disciplinas.forEach((disciplina) => {
                    const option = document.createElement("option");
                    option.value = disciplina.id;
                    option.textContent = disciplina.nome;
    
                    // Seleciona a disciplina do horário atual
                    if (disciplina.id === horario.Disciplina.id) {
                        option.selected = true;
                    }
    
                    disciplinaInput.appendChild(option);
                });
            })
            .catch((error) => {
                console.error("Erro ao carregar disciplinas:", error);
                alert("Erro ao carregar disciplinas. Tente novamente mais tarde.");
            });
    
        // Preenche os campos do formulário com os dados do horário
        diaSemanaInput.value = horario.diaSemana;
        hInicioInput.value = horario.hInicio;
        hFimInput.value = horario.hFim;
        cargaHorariaInput.value = horario.cargaHoraria;
    
        // Exibe o modal
        modalEdicao.style.display = "flex";
    
        // Adiciona o evento de salvar as alterações
        const salvarEdicaoBtn = document.getElementById("salvarEdicao");
        salvarEdicaoBtn.onclick = async () => {
            try {
                const formData = {
                    disciplinaId: disciplinaInput.value,
                    diaSemana: diaSemanaInput.value,
                    hInicio: hInicioInput.value,
                    hFim: hFimInput.value,
                    cargaHoraria: cargaHorariaInput.value,
                };
    
                const response = await fetch(`http://localhost:3000/api/horarios/${horario.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                });
    
                if (!response.ok) {
                    throw new Error("Erro ao editar o horário.");
                }
    
                showCustomAlert("Horário editado com sucesso!", "success");
                modalEdicao.style.display = "none"; // Fecha o modal
                carregarHorarios(); // Atualiza a lista de horários
            } catch (error) {
                console.error("Erro ao editar horário:", error);
                showCustomAlert("Erro ao editar o horário. Tente novamente.", "error");
            }
        };
    }

    // Fechar o modal de edição ao clicar no botão de cancelar
    const cancelarEdicaoBtn = document.getElementById("cancelarEdicao");
    cancelarEdicaoBtn.addEventListener("click", () => {
        const modalEdicao = document.getElementById("modalEdicao");
        modalEdicao.style.display = "none"; // Esconde o modal
    });

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
});