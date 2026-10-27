import app from "./api.js";

import { mostrarToast } from "../toast.js";

const form = document.getElementById("formularioCadastro");

document.addEventListener("DOMContentLoaded", () => {
  form.addEventListener("submit", manipulaForm);
});

async function manipulaForm(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const confirmaSenha = document.getElementById("confirmarSenha").value;

  if (!nome || !email || !senha || !confirmaSenha) {
    mostrarToast('Todos os campos são obrigatórios!', 'aviso', 3000)
    return;
  }

  if (senha !== confirmaSenha) {
    mostrarToast('As senhas não coincidem!', 'erro', 3000)
    return;
  }
  try {
    await app.registerUser({ nome, email, senha });
    form.reset()
    mostrarToast(
        "Cadastro realizado!",
        "sucesso",
        2500
    );

    setTimeout(() => {
        window.location.href = "../index.html";
    }, 1500);
  } catch (error) {
    console.error(error);
    mostrarToast(`Erro ao cadastrar usuário: ${error.message}`, 'erro', 3000)
  }
}

