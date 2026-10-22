import trocarTela from "./modules/alternarTela.js";
import navbar from "./modules/menu.js";
import carregarUltimosRegistros from "./modules/ultimosRegistros.js";
import carregarDashboard from "./modules/dashboard.js";
import carregarUsuario from "./modules/carregarUser.js";
import toggleTema from "./modules/config.js";
import iniciarMeuPerfil from "./modules/meuPerfil.js";
import { carregarAvatarSalvo } from "./api/avatar.js";


export function atualizarFavicon() {
    const favicon = document.getElementById("favicon");
    const tema = document.documentElement.getAttribute("data-theme");

    if (tema === "light") {
        favicon.href = "../assets/images/kcontrol_icone_preto_transparente.png";
    } else {
        favicon.href = "../assets/images/kcontrol_icone_branco_transparente.png";
    }
}

export function atualizarBoasVindas() {
    const elementoNome = document.getElementById("nomeBoasVindas");
    const nomeUsuario = document.getElementById("user-name");

    if (!elementoNome) return;

    const nome = nomeUsuario?.textContent.trim();

    elementoNome.textContent =
        nome && nome !== "" ? nome : "por aqui";
}

document.addEventListener("DOMContentLoaded", atualizarBoasVindas);





async function iniciarAplicacao() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.replace("../index.html");
        return;
    }

    try {
        const resposta = await fetch(
            "https://kcontrolv2-1.onrender.com/users/login/auth",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                cache: "no-store"
            }
        );

        if (!resposta.ok) {
            localStorage.removeItem("token");
            window.location.replace("../index.html");
            return;
        }

        const dados = await resposta.json();
        const usuario = dados.user;

        if (!usuario) {
            localStorage.removeItem("token");
            window.location.replace("../index.html");
            return;
        }

        await carregarAvatarSalvo();

        // Os usuários comuns não devem acessar páginas administrativas.
        const paginasAdmin = [
            "dashboard",
            "admin",
            "Membros",
            "Gerenciar Salas",
            "Gerenciar Setores"
        ];

        if (usuario.role !== "admin") {
            document.querySelectorAll("[data-page]").forEach((link) => {
                if (paginasAdmin.includes(link.dataset.page)) {
                    link.hidden = true;
                }
            });

            document.querySelectorAll(".page").forEach((pagina) => {
                if (paginasAdmin.includes(pagina.id)) {
                    pagina.classList.remove("active");
                }
            });

            const registro = document.getElementById("registro");

            if (registro) {
                registro.classList.add("active");
            }
        }

        navbar();
        trocarTela();
        carregarUltimosRegistros();
        carregarDashboard();
        carregarUsuario();
        iniciarMeuPerfil();
        toggleTema();
        atualizarFavicon();
        atualizarBoasVindas();

    } catch (erro) {
        console.error("Erro ao validar a sessão:", erro);
        localStorage.removeItem("token");
        window.location.replace("../index.html");
    }
}

document.addEventListener("DOMContentLoaded", iniciarAplicacao);
