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
        customAlert.className = custom-alert ${type};
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
            headers: { Authorization: Bearer ${token} },
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
