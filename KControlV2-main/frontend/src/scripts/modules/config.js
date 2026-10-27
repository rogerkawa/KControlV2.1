import app from '../api/api.js';
import { mostrarToast } from '../toast.js';

const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const userRole = document.getElementById('user-role');
const novoNome = document.getElementById('novoNome');
const formNome = document.getElementById('formNome');
const formSenha = document.getElementById('formSenha');


formSenha.addEventListener('submit', async (event) => {
    event.preventDefault();

    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (novaSenha !== confirmarSenha) {
        mostrarToast('A nova senha e a confirmação não coincidem.', 'erro', 3000)
        return;
    }

    try {
        const resposta = await app.updatePassword({
            senhaAtual,
            novaSenha
        });

        formSenha.reset();

        mostrarToast(resposta.message || 'Senha atualizada com sucesso!', 'sucesso', 2500)

    } catch (error) {
        console.error('Erro ao atualizar senha:', error);
        mostrarToast(error.message || 'Não foi possível atualizar a senha.', 'erro', 3000)
    }
});


// CARREGAR PERFIL
    async function carregarPerfil() {
        try {
            const resposta = await app.findUserAuthenticator();
            const user = resposta.user;

            userName.textContent = user.nome;
            userEmail.textContent = user.email;

            userRole.textContent =
                user.role === 'admin' ? 'Administrador' : 'Usuário';

            novoNome.value = user.nome;

        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            mostrarToast('Não foi possível carregar os dados do perfil.', 'erro', 3000)
        }
    }

// ATUALIZAR NOME
    formNome.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = novoNome.value.trim();

        if (nome.length < 2) {
            mostrarToast('O nome deve ter pelo menos 2 caracteres.', 'aviso', 3000)
            return;
        }

        try {
            const resposta = await app.updateProfile({ nome });

            // Atualiza o nome em todos os elementos da página
            document.querySelectorAll(".user-name, #user-name").forEach((elemento) => {
                elemento.textContent = nome;
            });

            // Atualiza o campo de edição
            novoNome.value = nome;

            // Atualiza a saudação, se existir
            const nomeBoasVindas = document.getElementById("nomeBoasVindas");

            if (nomeBoasVindas) {
                nomeBoasVindas.textContent = nome;
            }

            mostrarToast(resposta.message || "Nome atualizado com sucesso!", 'sucesso', 3000)

        } catch (error) {
            console.error("Erro ao atualizar nome:", error);
            mostrarToast(error.message || "Não foi possível atualizar o nome.", 'erro', 3000)
        }

    });

    carregarPerfil();

export default function toggleTema() {
    const btnTema = document.querySelectorAll('.btnToggleTema');
    const html = document.documentElement;

    const temaSalvo = localStorage.getItem('tema');
    const temaInicial = temaSalvo || html.getAttribute('data-theme') || 'light';

    html.setAttribute('data-theme', temaInicial);

    btnTema.forEach((button) => {
        button.addEventListener('click', () => {
            const temaAtual = html.getAttribute('data-theme');

            const novoTema = temaAtual === 'dark' ? 'light' : 'dark';

            html.setAttribute('data-theme', novoTema);

            localStorage.setItem('tema', novoTema);
        });
    });
}



