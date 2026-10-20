import trocarTela from "./modules/alternarTela.js";
import navbar from "./modules/menu.js";
import carregarUltimosRegistros from "./modules/ultimosRegistros.js";
import carregarDashboard from "./modules/dashboard.js";
import carregarUsuario from "./modules/carregarUser.js";
import toggleTema from "./modules/config.js";


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




navbar()
trocarTela()
carregarUltimosRegistros()
carregarDashboard()
carregarUsuario()
toggleTema()
atualizarFavicon()