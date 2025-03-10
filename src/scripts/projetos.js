document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        showCustomAlert("Você precisa fazer login.", "error");
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
            showCustomAlert("Projeto cadastrado com sucesso!", "success"); // Mensagem de sucesso (verde)
        };
    
        // Configura o botão "Não"
        document.getElementById("cancelSave").onclick = () => {
            confirmSaveModal.style.display = "none"; // Fecha o modal
            if (onCancel) onCancel(); // Executa a função de cancelamento
            showCustomAlert("Projeto não cadastrado.", "error"); // Mensagem de erro (vermelho)
        };
    
        // Fecha o modal se clicar fora dele
        document.addEventListener("click", (event) => {
            if (confirmSaveModal.style.display === "flex" && !confirmSaveModal.contains(event.target)) {
                confirmSaveModal.style.display = "none"; // Fecha o modal
            }
        });
    }

    // Carregar o nome do usuário e o ID do aluno
    let alunoId = null; // Variável para armazenar o ID do aluno
    try {
        const response = await fetch("http://localhost:3000/api/alunos/perfil", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Erro da API:", error);
            throw new Error("Erro ao carregar informações do usuário.");
        }

        const usuario = await response.json();
        console.log("Dados do usuário:", usuario);

        alunoId = usuario.id; // Armazena o ID do aluno

        // Atualizar o título com o nome do usuário
        const mainContent = document.getElementById("main-content");
        mainContent.innerHTML = `
            <h1>Oi, ${usuario.nome}!</h1>
            <p>Vamos gerenciar seus projetos?</p>
        `;
    } catch (error) {
        console.error("Erro ao carregar informações:", error);
        showCustomAlert("Erro ao carregar informações. Faça login novamente.", "error");
        localStorage.removeItem("token");
        window.location.href = "./login.html";
    }

    const listaProjetos = document.getElementById("listaProjetos");
    const btnAbrirModal = document.getElementById("btnAbrirModal");
    const btnFecharModal = document.querySelector(".close");
    const formProjeto = document.getElementById("formProjeto");
    const filtroStatus = document.getElementById("filtro");
    const modal = document.getElementById("modal");
    const menuModal = document.getElementById("menuModal");
    const editModal = document.getElementById("editModal");
    const btnEditar = document.getElementById("btnEditar");
    const btnExcluir = document.getElementById("btnExcluir");
    const closeEditModal = document.getElementById("closeEditModal");
    const cancelEdit = document.getElementById("cancelEdit");
    const formEditProjeto = document.getElementById("formEditProjeto");
    const confirmModal = document.getElementById("confirmModal");
    const confirmDelete = document.getElementById("confirmDelete");
    const cancelDelete = document.getElementById("cancelDelete");
    const cancelarBtn = document.getElementById("cancelarBtn");
    let projetoSelecionado = null;
    let projetos = [];

    // Inicialize os modais como escondidos
    modal.style.display = "none";
    menuModal.style.display = "none";
    editModal.style.display = "none";
    confirmModal.style.display = "none";

    async function cadastrarProjeto() {
        const titulo = document.getElementById("titulo").value;
        const descricao = document.getElementById("descricao").value;
        const notas = document.getElementById("notas").value;
        const status = document.getElementById("status").value;
        const arquivoInput = document.getElementById("arquivo");
    
        if (!arquivoInput.files.length) {
            showCustomAlert("Por favor, selecione um arquivo.", "error");
            return;
        }
    
        const formData = new FormData();
        formData.append("titulo", titulo);
        formData.append("descricao", descricao);
        formData.append("notas", notas);
        formData.append("status", status);
        formData.append("arquivo", arquivoInput.files[0]); 
    
        try {
            const response = await fetch("http://localhost:3000/api/projeto", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // Token enviado no cabeçalho
                },
                body: formData, // Envia os dados como FormData
            });
    
            const data = await response.json();
    
            if (response.ok) {
                showCustomAlert("Projeto cadastrado com sucesso!", "success");
                console.log(data);
                formProjeto.reset(); // Limpa o formulário de cadastro
                modal.style.display = "none"; // Fecha o modal de cadastro
                carregarProjetos(); // Recarrega a lista de projetos
            } else {
                throw new Error(data.error || "Erro desconhecido");
            }
        } catch (error) {
            console.error("Erro ao cadastrar projeto:", error);
            showCustomAlert(`Erro ao cadastrar projeto: ${error.message}`, "error");
        }
    }

    // Função para carregar os projetos
    async function carregarProjetos() {
        try {
            const response = await fetch("http://localhost:3000/api/projetos", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                console.error("Erro na resposta:", response.status, response.statusText);
                throw new Error("Você ainda não possui nenhum projeto.");
            }

            projetos = await response.json(); // Guarda os projetos retornados da API

            listaProjetos.innerHTML = ""; // Limpa a lista antes de adicionar os novos projetos

            if (projetos.length === 0) {
                listaProjetos.innerHTML = "<p>Nenhum projeto cadastrado.</p>";
                return;
            }

            // Itera sobre os projetos e cria os elementos HTML
            projetos.forEach((projeto) => {
                const li = document.createElement("li");

                let statusClass = "";
                switch (projeto.status.trim()) {
                    case "Pendente":
                        statusClass = "status-pendente";
                        break;
                    case "Em Andamento":
                        statusClass = "status-andamento";
                        break;
                    case "Concluído":
                        statusClass = "status-concluida";
                        break;
                    default:
                        statusClass = "";
                }

                li.innerHTML = `
                    <div class="projeto-content" data-id="${projeto.id}">
                        <img src="../assets/icons/projetos-icon.png" alt="Ícone do projeto" class="projeto-icon">
                        <div class="projeto-info">
                            <span class="titulo">${projeto.titulo}</span>
                            <span class="notas">Nota: ${projeto.notas}</span>
                            <p class="descricao">${projeto.descricao}</p>
                        </div>
                        <div class="projeto-options" data-id="${projeto.id}">
                            <img src="../assets/icons/Meatballs_menu.png" alt="Opções" class="options-icon">
                        </div>
                        <span class="status ${statusClass}">${projeto.status}</span>
                    </div>
                `;

                listaProjetos.appendChild(li); // Adiciona o novo projeto à lista

                // Adicionando o evento de clique para abrir o menu modal
                li.querySelector(".options-icon").addEventListener("click", (event) => {
                    event.stopPropagation(); // Impede a propagação do clique

                    // Obtém a posição do ícone de opções
                    const rect = event.target.getBoundingClientRect();
                    
                    // Posiciona o menu modal
                    menuModal.style.top = `${rect.top + window.scrollY + 20}px`;
                    menuModal.style.left = `${rect.left + window.scrollX}px`;
                    menuModal.style.display = "block"; // Exibe o menu modal
                    
                    // Salva o ID do projeto selecionado
                    projetoSelecionado = projeto.id;
                });
            });
        } catch (error) {
            console.error("Erro ao carregar projetos:", error);
            listaProjetos.innerHTML = "<p>Cadastre seus projetos para visualizá-los aqui.</p>";
        }
    }

    // Fechar o modal de cadastro de projeto
    btnAbrirModal.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    btnFecharModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Salvar o projeto quando o formulário for enviado
    formProjeto.addEventListener("submit", (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário
        cadastrarProjeto(); // Chama a função para cadastrar o projeto
    });

    // Fechar o menu modal se o usuário clicar fora dele
    document.addEventListener("click", (event) => {
        if (menuModal.style.display === "block" && !menuModal.contains(event.target)) {
            menuModal.style.display = "none"; // Fecha o menu modal
        }
    });

    // Função para excluir um projeto
    async function excluirProjeto(projetoId) {
        const token = localStorage.getItem('token'); // Assume que o token JWT está armazenado no localStorage
    
        if (!token) {
            showCustomAlert("Você precisa estar logado para excluir um projeto!", "error");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3000/api/projetos/${projetoId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Adiciona o token de autorização no cabeçalho
                },
            });
    
            if (!response.ok) {
                throw new Error('Erro ao excluir o projeto');
            }
    
            const data = await response.json();
            showCustomAlert(data.message, "success"); // Exibe mensagem de sucesso
            // Atualizar a lista de projetos ou redirecionar para a página inicial
            carregarProjetos(); // Chame sua função para carregar os projetos após a exclusão
        } catch (error) {
            console.error('Erro ao excluir projeto:', error);
            showCustomAlert('Erro ao excluir o projeto!', "error");
        }
    }

    // Função para abrir o modal de edição e preencher os dados do projeto
    if (btnEditar) {
        btnEditar.addEventListener("click", () => {
            if (projetoSelecionado) {
                // Encontra o projeto selecionado na lista de projetos
                const projeto = projetos.find(p => p.id === projetoSelecionado);

                if (projeto) {
                    // Preenche o modal de edição com os dados do projeto
                    document.getElementById("editTitulo").value = projeto.titulo;
                    document.getElementById("editDescricao").value = projeto.descricao;
                    document.getElementById("editNotas").value = projeto.notas;
                    document.getElementById("editStatus").value = projeto.status;

                    // Exibe o modal de edição
                    editModal.style.display = "flex";
                } else {
                    console.error("Projeto não encontrado.");
                }
            } else {
                console.error("Nenhum projeto selecionado.");
            }

            // Esconde o menu de opções
            menuModal.style.display = "none";
        });
    } else {
        console.error("Elemento btnEditar não encontrado.");
    }

    // Fechar o modal de edição
    if (closeEditModal) {
        closeEditModal.addEventListener("click", () => {
            editModal.style.display = "none";
            projetoSelecionado = null; // Reseta o estado
        });
    } else {
        console.error("Elemento closeEditModal não encontrado.");
    }

    // Cancelar a edição
    if (cancelEdit) {
        cancelEdit.addEventListener("click", () => {
            editModal.style.display = "none";
            projetoSelecionado = null; // Reseta o estado
        });
    } else {
        console.error("Elemento cancelEdit não encontrado.");
    }

    // Salvar a edição
    if (formEditProjeto) {
        formEditProjeto.addEventListener("submit", async (event) => {
            event.preventDefault();

            const titulo = document.getElementById("editTitulo").value.trim();
            const descricao = document.getElementById("editDescricao").value.trim();
            const notas = document.getElementById("editNotas").value.trim();
            const status = document.getElementById("editStatus").value;

            try {
                const response = await fetch(`http://localhost:3000/api/projetos/${projetoSelecionado}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        titulo,
                        descricao,
                        notas,
                        status,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Erro ao editar projeto:", errorData);
                    showCustomAlert(errorData.error || "Erro ao editar projeto.", "error");
                    return;
                }

                showCustomAlert("Projeto editado com sucesso!", "success");
                editModal.style.display = "none";
                projetoSelecionado = null; // Reseta o estado
                await carregarProjetos(); // Atualiza a lista de projetos
            } catch (error) {
                console.error("Erro ao editar projeto:", error);
                showCustomAlert("Erro ao editar projeto.", "error");
            }
        });
    } else {
        console.error("Elemento formEditProjeto não encontrado.");
    }

    // Função para abrir o modal de confirmação de exclusão
    if (btnExcluir) {
        btnExcluir.addEventListener("click", () => {
            if (projetoSelecionado) {
                confirmModal.style.display = "flex";
            } else {
                console.error("Nenhum projeto selecionado.");
            }

            // Esconde o menu de opções
            menuModal.style.display = "none";
        });
    } else {
        console.error("Elemento btnExcluir não encontrado.");
    }

    // Confirmar exclusão do projeto
    if (confirmDelete) {
        confirmDelete.addEventListener("click", async () => {
            if (projetoSelecionado) {
                await excluirProjeto(projetoSelecionado);
                confirmModal.style.display = "none";
                projetoSelecionado = null; // Reseta o estado
            } else {
                console.error("Nenhum projeto selecionado.");
            }
        });
    } else {
        console.error("Elemento confirmDelete não encontrado.");
    }

    // Cancelar exclusão do projeto
    if (cancelDelete) {
        cancelDelete.addEventListener("click", () => {
            confirmModal.style.display = "none";
            projetoSelecionado = null; // Reseta o estado
        });
    } else {
        console.error("Elemento cancelDelete não encontrado.");
    }

    // Fechar o modal de cadastro de projeto ao clicar no botão de cancelar
    if (cancelarBtn) {
        cancelarBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    } else {
        console.error("Elemento cancelarBtn não encontrado.");
    }

    // Carregar os projetos ao iniciar a página
    carregarProjetos();
});