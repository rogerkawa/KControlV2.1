
const URL_BASE = "http://localhost:3333";

const elementos = {
    total: document.getElementById("perfilTotal"),
    pendentes: document.getElementById("perfilPendentes"),
    devolvidas: document.getElementById("perfilDevolvidas"),
    tabela: document.getElementById("listaMeuHistorico"),
    filtro: document.getElementById("filtroMeuHistorico"),
    atualizar: document.getElementById("atualizarMeuHistorico"),
    mensagem: document.getElementById("mensagemMeuHistorico")
};

let registrosPessoais = [];

function obterToken() {
    return localStorage.getItem("token");
}

function formatarData(data) {
    if (!data) return "—";

    // Evita deslocamento de dia ao interpretar datas YYYY-MM-DD.
    const valor = String(data).slice(0, 10);
    const partes = valor.split("-");

    if (partes.length !== 3) return valor;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatarHora(hora) {
    if (!hora) return "—";
    return String(hora).slice(0, 5);
}

function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}

function definirMensagem(texto) {
    if (elementos.mensagem) {
        elementos.mensagem.textContent = texto;
    }
}

function atualizarResumo(registros) {
    if (elementos.total) {
        elementos.total.textContent = registros.length;
    }

    if (elementos.pendentes) {
        elementos.pendentes.textContent = registros.filter(
            registro => registro.status === "retirada"
        ).length;
    }

    if (elementos.devolvidas) {
        elementos.devolvidas.textContent = registros.filter(
            registro => registro.status === "devolvida"
        ).length;
    }
}


function renderizarTabela() {
    if (!elementos.tabela) return;

    const filtro = elementos.filtro?.value || "todos";

    const registrosFiltrados = registrosPessoais.filter(registro => {
        const status = String(registro.status ?? "")
            .trim()
            .toLowerCase();

        return filtro === "todos" || status === filtro;
    });

    if (registrosFiltrados.length === 0) {
        elementos.tabela.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="perfil-vazio">
                        <i class="ti ti-key-off"></i>
                        <h3>Nenhum registro encontrado</h3>
                        <p>
                            ${
                                filtro === "todos"
                                    ? "Você ainda não possui retiradas registradas."
                                    : "Não existem registros com esse status."
                            }
                        </p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    elementos.tabela.innerHTML = registrosFiltrados.map(registro => {
        const statusOriginal = String(registro.status ?? "")
            .trim()
            .toLowerCase();

        const devolvida = statusOriginal === "devolvida";

        const classeStatus = devolvida ? "devolvida" : "pendente";

        const textoStatus = devolvida
            ? "Devolvida"
            : statusOriginal === "retirada"
                ? "Pendente"
                : `Status: ${statusOriginal || "Não informado"}`;

        console.log("Status do registro:", {
            id: registro.id_registro,
            status: registro.status
        });

        return `
            <tr>
                <td>${escaparHTML(registro.setor || "—")}</td>
                <td class="perfil-sala">
                    ${escaparHTML(registro.sala || "—")}
                </td>
                <td>${formatarData(registro.data_retirada)}</td>
                <td>${formatarHora(registro.hora_retirada)}</td>
                <td>${formatarHora(registro.hora_entrega)}</td>
                <td class="perfil-status-celula">
                    <span class="perfil-status ${classeStatus}">
                        ${escaparHTML(textoStatus)}
                    </span>
                </td>
            </tr>
        `;
    }).join("");
}


async function carregarMeuPerfil() {
    if (!elementos.tabela) return;

    const token = obterToken();

    if (!token) {
        definirMensagem("Sua sessão expirou. Entre novamente para consultar seus registros.");
        return;
    }

    if (elementos.atualizar) {
        elementos.atualizar.disabled = true;
        elementos.atualizar.innerHTML = `
            <i class="ti ti-loader-2"></i>
            Carregando...
        `;
    }

    definirMensagem("Carregando seu histórico...");

    try {
        const resposta = await fetch(`${URL_BASE}/meus-registros`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.message || `Erro HTTP: ${resposta.status}`
            );
        }

        registrosPessoais = Array.isArray(dados.registros)
            ? dados.registros
            : [];

        atualizarResumo(registrosPessoais);
        renderizarTabela();
        definirMensagem("");

    } catch (erro) {
        console.error("Erro ao carregar histórico pessoal:", erro);

        definirMensagem(
            erro.message || "Não foi possível carregar seu histórico."
        );

    } finally {
        if (elementos.atualizar) {
            elementos.atualizar.disabled = false;
            elementos.atualizar.innerHTML = `
                <i class="ti ti-refresh"></i>
                Atualizar
            `;
        }
    }
}

export default function iniciarMeuPerfil() {
    if (!elementos.tabela) return;

    elementos.atualizar?.addEventListener(
        "click",
        carregarMeuPerfil
    );

    elementos.filtro?.addEventListener(
        "change",
        renderizarTabela
    );

    document.addEventListener(
        "registrosAtualizados",
        carregarMeuPerfil
    );

    carregarMeuPerfil();
}
