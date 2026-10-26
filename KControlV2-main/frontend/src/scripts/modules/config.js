import app from '../api/api.js';

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

    if (novaSenha.length < 8) {
        alert('A nova senha deve ter pelo menos 8 caracteres.');
        return;
    }

    if (novaSenha !== confirmarSenha) {
        alert('A nova senha e a confirmação não coincidem.');
        return;
    }

    try {
        const resposta = await app.updatePassword({
            senhaAtual,
            novaSenha
        });

        formSenha.reset();

        alert(resposta.message || 'Senha atualizada com sucesso!');

    } catch (error) {
        console.error('Erro ao atualizar senha:', error);
        alert(error.message || 'Não foi possível atualizar a senha.');
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
            alert('Não foi possível carregar os dados do perfil.');
        }
    }

// ATUALIZAR NOME
    formNome.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = novoNome.value.trim();

        if (nome.length < 2) {
            alert('O nome deve ter pelo menos 2 caracteres.');
            return;
        }

        try {
            const resposta = await app.updateProfile({ nome });

            userName.textContent = nome;
            novoNome.value = nome;

            alert(resposta.message || 'Nome atualizado com sucesso!');
            
        } catch (error) {
            console.error('Erro ao atualizar nome:', error);
            alert(error.message || 'Não foi possível atualizar o nome.');
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
