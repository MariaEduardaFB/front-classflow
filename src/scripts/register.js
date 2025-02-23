document.addEventListener("DOMContentLoaded", () => {
  const registerModal = document.getElementById("registerModal");
  const closeRegisterModal = document.getElementById("closeRegisterModal");
  const successModal = document.getElementById("successModal");
  const registerForm = document.getElementById("registerForm");
  const errorMessage = document.getElementById("errorMessage");

  // Exibir modal de cadastro automaticamente
  registerModal.style.display = "flex";

  // Fechar modal de cadastro e redirecionar ao clicar no "X"
  closeRegisterModal.addEventListener("click", () => {
    window.location.href = "login.html";
  });

  // Fechar modal de cadastro ao clicar fora dele
  window.addEventListener("click", (event) => {
    if (event.target === registerModal) {
      registerModal.style.display = "none";
    }
  });

  // Evento para envio do formulário
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita recarregar a página

    const nome = document.getElementById("username").value.trim();
    const matricula = document.getElementById("matricula").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const senha = document.getElementById("registerPassword").value.trim();
    const curso = document.getElementById("curso").value.trim();

    // Validação: verificar se todos os campos estão preenchidos
    if (!nome || !matricula || !email || !senha || !curso) {
      errorMessage.style.display = "block";
      errorMessage.textContent = "Todos os campos devem ser preenchidos.";
      return;
    } else {
      errorMessage.style.display = "none";
    }

    // Criando objeto do aluno
    const aluno = { nome, matricula, email, senha, curso };

    try {
      const response = await fetch("http://localhost:3000/api/alunos/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aluno),
      });

      const data = await response.json();
      if (response.ok) {
        // Exibir modal de sucesso
        successModal.style.display = "flex";

        // Fechar modal de sucesso e redirecionar após 3 segundos
        setTimeout(() => {
          successModal.style.display = "none";
          window.location.href = "login.html";
        }, 3000);
      } else {
        throw new Error(data.error || "Erro desconhecido ao registrar.");
      }
    } catch (error) {
      console.error("Erro no registro:", error);
      alert("Erro no registro: " + error.message);
    }
  });
});