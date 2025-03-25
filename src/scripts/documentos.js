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
<<<<<<< HEAD
        customAlert.className = `custom-alert ${type}`;
=======
        customAlert.className = custom-alert ${type};
>>>>>>> 778c750cfb32e17b41b1d1d9e00278a729c82fcd
        customAlert.style.display = "flex";

        setTimeout(() => {
            customAlert.style.display = "none";
        }, 3000);

        document.getElementById("closeAlert").addEventListener("click", () => {
            customAlert.style.display = "none";
        });
    }

    // Carregar o nome do usuário e o ID do aluno
    let alunoId = null; // Variável para armazenar o ID do aluno
    try {
        const response = await fetch("http://localhost:3000/api/alunos/perfil", {
<<<<<<< HEAD
            headers: { Authorization: `Bearer ${token}` },
=======
            headers: { Authorization: Bearer ${token} },
>>>>>>> 778c750cfb32e17b41b1d1d9e00278a729c82fcd
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
            <p>Vamos gerenciar seus documentos?</p>
        `;
    } catch (error) {
        console.error("Erro ao carregar informações:", error);
        showCustomAlert("Erro ao carregar informações. Faça login novamente.", "error");
        localStorage.removeItem("token");
        window.location.href = "./login.html";
    }

    const listaDocumentos = document.getElementById("listaDocumentos");
    const btnAbrirModal = document.getElementById("btnAbrirModal");
    const btnFecharModal = document.querySelector(".close");
    const formDocumento = document.getElementById("formDocumento");
    const modal = document.getElementById("modal");
    const cancelarBtn = document.getElementById("cancelarBtn");

    // Modal de edição
    const modalEdicao = document.getElementById("modalEdicao");
    const formEdicaoDocumento = document.getElementById("formEdicaoDocumento");
    const btnFecharModalEdicao = modalEdicao.querySelector(".close");
    const cancelarEdicaoBtn = document.getElementById("cancelarEdicaoBtn");
    let documentoIdEdicao = null;

    // Inicialize o modal como escondido
    modal.style.display = "none";
    modalEdicao.style.display = "none";

    async function cadastrarDocumento() {
        const nome = document.getElementById("nome").value;
        const arquivoInput = document.getElementById("arquivo");
    
        if (!arquivoInput.files.length) {
            showCustomAlert("Por favor, selecione um arquivo.", "error");
            return;
        }
    
        const formData = new FormData();
        formData.append("nome", nome);
        formData.append("arquivo", arquivoInput.files[0]); 
    
        try {
            const response = await fetch("http://localhost:3000/api/documentos", {
                method: "POST",
                headers: {
<<<<<<< HEAD
                    Authorization: `Bearer ${token}`, // Token enviado no cabeçalho
=======
                    Authorization: Bearer ${token}, // Token enviado no cabeçalho
>>>>>>> 778c750cfb32e17b41b1d1d9e00278a729c82fcd
                },
                body: formData, // Envia os dados como FormData
            });
    
            const data = await response.json();
    
            if (response.ok) {
                showCustomAlert("Documento cadastrado com sucesso!", "success");
                console.log(data);
                formDocumento.reset(); // Limpa o formulário de cadastro
                modal.style.display = "none"; // Fecha o modal de cadastro
                carregarDocumentos(); // Recarrega a lista de documentos
            } else {
                throw new Error(data.error || "Erro desconhecido");
            }
        } catch (error) {
            console.error("Erro ao cadastrar documento:", error);
<<<<<<< HEAD
            showCustomAlert(`Erro ao cadastrar documento: ${error.message}`, "error");
=======
            showCustomAlert(Erro ao cadastrar documento: ${error.message}, "error");
>>>>>>> 778c750cfb32e17b41b1d1d9e00278a729c82fcd
        }
    }

    async function editarDocumento() {
        const nome = document.getElementById("nomeEdicao").value;
        const arquivoInput = document.getElementById("arquivoEdicao");

        const formData = new FormData();
        formData.append("nome", nome);
        if (arquivoInput.files.length) {
            formData.append("arquivo", arquivoInput.files[0]);
        }

        try {
<<<<<<< HEAD
            const response = await fetch(`http://localhost:3000/api/documentos/${documentoIdEdicao}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`, // Token enviado no cabeçalho
=======
            const response = await fetch(http://localhost:3000/api/documentos/${documentoIdEdicao}, {
                method: "PUT",
                headers: {
                    Authorization: Bearer ${token}, // Token enviado no cabeçalho
>>>>>>> 778c750cfb32e17b41b1d1d9e00278a729c82fcd
                },
                body: formData, // Envia os dados como FormData
            });

            const data = await response.json();

            if (response.ok) {
                showCustomAlert("Documento editado com sucesso!", "success");
                console.log(data);
                formEdicaoDocumento.reset(); // Limpa o formulário de edição
                modalEdicao.style.display = "none"; // Fecha o modal de edição
                carregarDocumentos(); // Recarrega a lista de documentos
            } else {
                throw new Error(data.error || "Erro desconhecido");
            }
        } catch (error) {
            console.error("Erro ao editar documento:", error);
<<<<<<< HEAD
            showCustomAlert(`Erro ao editar documento: ${error.message}`, "error");
=======
            showCustomAlert(Erro ao editar documento: ${error.message}, "error");
>>>>>>> 778c750cfb32e17b41b1d1d9e00278a729c82fcd
        }
    }

    async function excluirDocumento(documentoId) {
        try {
<<<<<<< HEAD
            const response = await fetch(`http://localhost:3000/api/documentos/${documentoId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`, // Token enviado no cabeçalho
=======
            const response = await fetch(http://localhost:3000/api/documentos/${documentoId}, {
                method: "DELETE",
                headers: {
                    Authorization: Bearer ${token}, // Token enviado no cabeçalho
>>>>>>> 778c750cfb32e17b41b1d1d9e00278a729c82fcd
                },
            });

            const data = await response.json();

            if (response.ok) {
                showCustomAlert("Documento excluído com sucesso!", "success");
                console.log(data);
                carregarDocumentos(); // Recarrega a lista de documentos
            } else {
                throw new Error(data.error || "Erro desconhecido");
            }
        } catch (error) {
            console.error("Erro ao excluir documento:", error);
<<<<<<< HEAD
            showCustomAlert(`Erro ao excluir documento: ${error.message}`, "error");
=======
            showCustomAlert(Erro ao excluir documento: ${error.message}, "error");
>>>>>>> 778c750cfb32e17b41b1d1d9e00278a729c82fcd
        }
    }

    // Função para carregar os documentos
    async function carregarDocumentos() {
        try {
            const response = await fetch("http://localhost:3000/api/documentos", {
<<<<<<< HEAD
                headers: { Authorization: `Bearer ${token}` },
=======
                headers: { Authorization: Bearer ${token} },
>>>>>>> 778c750cfb32e17b41b1d1d9e00278a729c82fcd
            });

            if (!response.ok) {
                console.error("Erro na resposta:", response.status, response.statusText);
                throw new Error("Você ainda não possui nenhum documento.");
            }

            const documentos = await response.json(); // Guarda os documentos retornados da API

            listaDocumentos.innerHTML = ""; // Limpa a lista antes de adicionar os novos documentos

            if (documentos.length === 0) {
                listaDocumentos.innerHTML = "<p>Nenhum documento cadastrado.</p>";
                return;
            }

            // Itera sobre os documentos e cria os elementos HTML
            documentos.forEach((documento) => {
                const li = document.createElement("li");

                // Verifique se a URL do documento está definida
<<<<<<< HEAD
                const documentoUrl = documento.url ? documento.url : `http://localhost:3000/uploads/${documento.src}`;
=======
                const documentoUrl = documento.url ? documento.url : http://localhost:3000/uploads/${documento.src};
>>>>>>> 778c750cfb32e17b41b1d1d9e00278a729c82fcd

                li.innerHTML = `
                    <img src="../assets/icons/note-2.png" class="documento-icon" alt="Ícone do Documento">
                    <div class="documento-content" data-id="${documento.id}">
                        <span class="nome">${documento.nome}</span>
                        <div class="documento-actions">
                            <a href="${documentoUrl}" target="_blank" title="Ver Documento"><i class="fas fa-eye"></i></a>
                            <a href="${documentoUrl}" download="${documento.nome}" title="Baixar Documento"><i class="fas fa-download"></i></a>
                        </div>
                    </div>
                    <img src="../assets/icons/Meatballs_menu.png" class="options-icon" alt="Opções">
                    <div class="options-menu">
                        <a href="#" class="editar">Editar</a>
                        <a href="#" class="excluir">Excluir</a>
                    </div>
                `;

                listaDocumentos.appendChild(li); // Adiciona o novo documento à lista

                // Adiciona evento de clique para o ícone de opções
                const optionsIcon = li.querySelector('.options-icon');
                const optionsMenu = li.querySelector('.options-menu');
                optionsIcon.addEventListener('click', (event) => {
                    event.stopPropagation(); // Impede que o clique no ícone feche o menu
                    optionsMenu.style.display = optionsMenu.style.display === 'block' ? 'none' : 'block';
                });

                // Adiciona eventos de clique para as opções do menu
                const editarLink = li.querySelector('.editar');
                const excluirLink = li.querySelector('.excluir');
                editarLink.addEventListener('click', (event) => {
                    event.preventDefault();
                    // Lógica para abrir o modal de edição
                    documentoIdEdicao = documento.id;
                    document.getElementById("nomeEdicao").value = documento.nome;
                    modalEdicao.style.display = "flex";
                });
                excluirLink.addEventListener('click', (event) => {
                    event.preventDefault();
                    // Lógica para excluir o documento
                    excluirDocumento(documento.id);
                });

                // Fecha o menu de opções ao clicar fora dele
                document.addEventListener('click', (event) => {
                    if (!li.contains(event.target)) {
                        optionsMenu.style.display = 'none';
                    }
                });
            });
        } catch (error) {
            console.error("Erro ao carregar documentos:", error);
            listaDocumentos.innerHTML = "<p>Cadastre seus documentos para visualizá-los aqui.</p>";
        }
    }

<<<<<<< HEAD
    // Fechar o modal de cadastro de documento
=======
// Fechar o modal de cadastro de documento
>>>>>>> 778c750cfb32e17b41b1d1d9e00278a729c82fcd
    btnAbrirModal.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    btnFecharModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Fechar o modal de edição de documento
    btnFecharModalEdicao.addEventListener("click", () => {
        modalEdicao.style.display = "none";
    });

    // Salvar o documento quando o formulário for enviado
    formDocumento.addEventListener("submit", (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário
        cadastrarDocumento(); // Chama a função para cadastrar o documento
    });

    // Salvar as alterações do documento quando o formulário de edição for enviado
    formEdicaoDocumento.addEventListener("submit", (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário
        editarDocumento(); // Chama a função para editar o documento
    });

    // Fechar o modal de cadastro de documento ao clicar no botão de cancelar
    cancelarBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Fechar o modal de edição de documento ao clicar no botão de cancelar
    cancelarEdicaoBtn.addEventListener("click", () => {
        modalEdicao.style.display = "none";
    });

    // Carregar os documentos ao iniciar a página
    carregarDocumentos();
<<<<<<< HEAD
});
=======
});
>>>>>>> 778c750cfb32e17b41b1d1d9e00278a729c82fcd
