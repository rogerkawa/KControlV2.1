import { mostrarToast } from "../toast.js";
const url_base = "https://kcontrolv2-1.onrender.com";


function obterToken() {
    return localStorage.getItem("token");
}

function httpAuth() {
    const token = obterToken();

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}

function httpHeader() {
    return {
        "Content-Type": "application/json"
    };
}


// VERIFICAR RESPOSTA DA API
async function verifyResponse(response) {
    if (!response.ok) {
        let mensagem = `Erro HTTP: ${response.status}`;

        try {
            const erro = await response.json();
            mensagem = erro.message || mensagem;
        } catch {
            // A resposta pode não conter JSON.
        }

        throw new Error(mensagem);
    }

    return response;
}

let membrosCarregados = [];
let filtroMembrosAtual = "todos";
let buscaMembrosAtual = "";


// LISTAR MEMBROS NA API
async function listMembers() {
    const response = await fetch(`${url_base}/membros`, {
        method: "GET",
        headers: httpAuth()
    });

    await verifyResponse(response);

    return await response.json();
}


// CARREGAR MEMBROS NA TABELA

async function carregarMembros() {
    const listaMembros = document.querySelector("#listaMembros");

    if (!listaMembros) {
        console.error('Não encontrei o elemento "#listaMembros".');
        return;
    }

    try {
        const data = await listMembers();

        // Diagnóstico: confira estes valores no console
        console.log("Resposta completa da API:", data);
        console.log("Membros recebidos:", data?.users);

        const membros = data?.users;

        if (!Array.isArray(membros)) {
            throw new Error(
                "A resposta não contém um array em data.users. Confira o JSON no console."
            );
        }

        if (membros.length === 0) {
            listaMembros.innerHTML = `
                <tr>
                    <td colspan="5">
                        Nenhum membro encontrado.
                    </td>
                </tr>
            `;
            return;
        }
        membrosCarregados = membros;
        console.log(membrosCarregados);
        renderizarMembrosFiltrados();

        listaMembros.innerHTML = membros
            .map(membro => criarLinhaMembro(membro))
            .join("");

        console.log("Total de membros renderizados:", membros.length);

    } catch (error) {
        console.error("Erro ao carregar membros:", error);

        listaMembros.innerHTML = `
            <tr>
                <td colspan="5">
                    Não foi possível carregar os membros.
                </td>
            </tr>
        `;
    }
}



function renderizarMembrosFiltrados() {
    const lista = document.querySelector("#listaMembros");

    if (!lista) return;

    const busca = buscaMembrosAtual
        .trim()
        .toLocaleLowerCase("pt-BR");

    const filtrados = membrosCarregados.filter((membro) => {
        const nome = String(membro.nome ?? "").toLocaleLowerCase("pt-BR");
        const email = String(membro.email ?? "").toLocaleLowerCase("pt-BR");
        const role = String(membro.role ?? "user").toLowerCase();

        const correspondeBusca =
            nome.includes(busca) || email.includes(busca);

        const correspondeCargo =
            filtroMembrosAtual === "todos" ||
            role === filtroMembrosAtual;

        return correspondeBusca && correspondeCargo;
    });

    if (!filtrados.length) {
        lista.innerHTML = `
            <tr>
                <td colspan="5">Nenhum membro encontrado.</td>
            </tr>
        `;
        return;
    }

    lista.innerHTML = filtrados
        .map(criarLinhaMembro)
        .join("");
}

document.addEventListener("DOMContentLoaded", () => {
    const busca = document.querySelector("#buscarMembro");

    busca?.addEventListener("input", () => {
        buscaMembrosAtual = busca.value;
        renderizarMembrosFiltrados();
    });

    document.querySelectorAll(".membros-filtro").forEach((botao) => {
        botao.addEventListener("click", () => {
            filtroMembrosAtual = botao.dataset.filtro;

            document.querySelectorAll(".membros-filtro").forEach((item) => {
                item.classList.toggle("active", item === botao);
            });

            renderizarMembrosFiltrados();
        });
    });

    carregarMembros();
});




// CRIAR LINHA DA TABELA


function criarLinhaMembro(membro) {
    const id = membro.id_usuario ?? membro.id;
    const nome = membro.nome ?? "Nome não informado";
    const email = membro.email ?? "E-mail não informado";
    const role = String(membro.role ?? "user").toLowerCase();

    const escaparHTML = (valor) => String(valor ?? "").replace(
        /[&<>"']/g,
        caractere => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[caractere]
    );

    // Gera as iniciais do membro.
    const partesNome = nome.trim().split(/\s+/).filter(Boolean);

    const iniciais = partesNome.length > 1
        ? `${partesNome[0][0]}${partesNome[partesNome.length - 1][0]}`
        : (partesNome[0] || "?").slice(0, 2);

    // Prepara a URL da foto.
    let avatarUrl = "";

    if (membro.avatar_url) {
        try {
            avatarUrl = new URL(
                membro.avatar_url,
                url_base
            ).href;
        } catch (erro) {
            console.error("URL de avatar inválida:", membro.avatar_url);
        }
    }

    // Cargo.
    const ehAdmin = ["admin", "administrador"].includes(role);
    const textoRole = ehAdmin ? "Administrador" : "Usuário";
    const classeRole = ehAdmin ? "admin" : "user";
    const iconeRole = ehAdmin ? "ti-shield-check" : "ti-user";

    // Identificação.
    const identificacao = id != null
        ? `#${String(id).padStart(3, "0")}`
        : "—";

    return `
        <tr>
            <td>
                <div class="membro-identidade">
                    <div class="membro-avatar">

                        <img
                            class="membro-avatar-img"
                            src="${escaparHTML(avatarUrl)}"
                            alt="Foto de ${escaparHTML(nome)}"
                            ${avatarUrl ? "" : "hidden"}
                        >

                        <span
                            class="membro-avatar-iniciais"
                            ${avatarUrl ? "" : ""}
                        >${escaparHTML(iniciais.toUpperCase())}</span>

                    </div>

                    <div class="membro-dados">
                        <strong>${escaparHTML(nome)}</strong>
                        <span>Membro do sistema</span>
                    </div>
                </div>
            </td>

            <td>
                <span class="membro-email">
                    ${escaparHTML(email)}
                </span>
            </td>

            <td>
                <span class="membro-role ${classeRole}">
                    <i class="ti ${iconeRole}"></i>
                    ${textoRole}
                </span>
            </td>

            <td>
                <span class="membro-id">
                    ${escaparHTML(identificacao)}
                </span>
            </td>

            <td>
                <div class="membro-acoes">
                    <button
                        type="button"
                        class="membro-btn-editar"
                        data-id="${escaparHTML(id ?? "")}"
                        aria-label="Editar ${escaparHTML(nome)}"
                        title="Editar membro"
                    >
                        <i class="ti ti-pencil"></i>
                    </button>

                    <button
                        type="button"
                        class="membro-btn-remover"
                        data-id="${escaparHTML(id ?? "")}"
                        aria-label="Remover ${escaparHTML(nome)}"
                        title="Remover membro"
                    >
                        <i class="ti ti-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}


document.addEventListener("load", (event) => {
    const imagem = event.target;

    if (!imagem.matches?.(".membro-avatar-img")) return;

    imagem.hidden = false;

    const iniciais = imagem.parentElement.querySelector(
        ".membro-avatar-iniciais"
    );

    if (iniciais) {
        iniciais.hidden = true;
    }
}, true);

document.addEventListener("error", (event) => {
    const imagem = event.target;

    if (!imagem.matches?.(".membro-avatar-img")) return;

    imagem.hidden = true;

    const iniciais = imagem.parentElement.querySelector(
        ".membro-avatar-iniciais"
    );

    if (iniciais) {
        iniciais.hidden = false;
    }
}, true);



// EDITAR MEMBRO NA API
async function updateMembers(id_usuario, nome, email, role) {
    const response = await fetch(
        `${url_base}/membros/update/${id_usuario}`,
        {
            method: "PUT",
            headers: httpAuth(),
            body: JSON.stringify({
                nome,
                email,
                role
            })
        }
    );

    await verifyResponse(response);

    return await response.json();
}


// EXCLUIR MEMBRO NA API
async function deleteMembers(id_usuario) {
    const response = await fetch(
        `${url_base}/membros/delete/${id_usuario}`,
        {
            method: "DELETE",
            headers: httpAuth()
        }
    );

    await verifyResponse(response);

    return await response.json();
}


async function carregarTotais() {
    try {
        const response = await fetch(`${url_base}/membros/totais`,
            {
                headers: httpAuth()
            }
        )

        await verifyResponse(response)

        const dados = await response.json();

        document.querySelector("#totalMembros").textContent =
            dados.totalUsuarios;
        document.querySelector("#contadorMembros").textContent =
            `${dados.totalUsuarios} membros`

        document.querySelector("#totalAdmins").textContent =
            dados.totalAdmins

    } catch (error) {
        console.error("Erro ao carregar totais:", error);
    }
}

carregarTotais();


// INICIALIZAÇÃO DA PÁGINA
document.addEventListener("DOMContentLoaded", () => {
    const formEditar = document.querySelector("#formEditarMembro");
    const modalEditar = document.querySelector("#modalEditarMembro");

    const campoNome = document.querySelector("#editarMembroNome");
    const campoEmail = document.querySelector("#editarMembroEmail");
    const campoRole = document.querySelector("#editarMembroRole");

    const listaMembros = document.querySelector("#listaMembros");

    // Guarda o ID do membro selecionado.
    let membroSelecionadoId = null;

    // FECHAR MODAL DE EDIÇÃO
function fecharModalEditar() {
    modalEditar.hidden = true;
    membroSelecionadoId = null;
}

// Botão X do cabeçalho
const botaoFechar = modalEditar.querySelector(
    ".membros-modal-fechar"
);

botaoFechar.addEventListener("click", fecharModalEditar);

// Botão Cancelar
const botaoCancelar = modalEditar.querySelector(
    ".membros-btn-cancelar"
);

botaoCancelar.addEventListener("click", fecharModalEditar);

// Fechar ao clicar no fundo escuro, fora do cartão
modalEditar.addEventListener("click", (event) => {
    if (event.target === modalEditar) {
        fecharModalEditar();
    }
});

// Fechar ao pressionar Esc
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modalEditar.hidden) {
        fecharModalEditar();
    }
});


    // ABRIR MODAL DE EDIÇÃO
    listaMembros.addEventListener("click", async (event) => {
        const botaoEditar = event.target.closest(
            ".membro-btn-editar"
        );

        if (!botaoEditar) return;

        membroSelecionadoId = botaoEditar.dataset.id;

        if (
            !membroSelecionadoId ||
            membroSelecionadoId === "undefined"
        ) {
            mostrarToast("Não foi possível identificar o membro.", "erro", 3000);
            return;
        }

        try {
            const response = await fetch(
                `${url_base}/membros/${membroSelecionadoId}`,
                {
                    method: "GET",
                    headers: httpAuth()
                }
            );

            await verifyResponse(response);

            const data = await response.json();

            // Aceita { user: {...} }, { membro: {...} }
            // ou o próprio objeto do membro.
            const membro = data.user;
            console.log(membro)

            if (!membro || !membro.nome) {
                throw new Error(
                    "Os dados do membro não foram encontrados."
                );
            }

            campoNome.value = membro.nome;
            campoEmail.value = membro.email;
            campoRole.value = membro.role;

            modalEditar.hidden = false;

        } catch (error) {
            console.error("Erro ao buscar membro:", error);
            mostrarToast(error.message, "erro", 3000);
        }
    });


    // ENVIAR EDIÇÃO
    formEditar.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!membroSelecionadoId) {
            mostrarToast("Selecione um membro para editar.", "aviso", 3000);
            return;
        }

        const nome = campoNome.value.trim();
        const email = campoEmail.value.trim();
        const role = campoRole.value;

        if (!nome || !email || !role) {
            mostrarToast("Preencha todos os campos.", "aviso", 3000);
            return;
        }

        const botaoSalvar = formEditar.querySelector(
            '[type="submit"]'
        );

        if (botaoSalvar) {
            botaoSalvar.disabled = true;
        }

        try {
            console.log(membroSelecionadoId)
            await updateMembers(
                membroSelecionadoId,
                nome,
                email,
                role
            );

            mostrarToast("Membro atualizado com sucesso!", "sucesso", 3000);

            modalEditar.hidden = true;
            membroSelecionadoId = null;

            await carregarMembros();

        } catch (error) {
            console.error("Erro ao atualizar membro:", error);
            mostrarToast(error.message, "erro", 3000);

        } finally {
            if (botaoSalvar) {
                botaoSalvar.disabled = false;
            }
        }
    });


    // CARREGAR TABELA QUANDO A PÁGINA ABRIR
    carregarMembros();
});
