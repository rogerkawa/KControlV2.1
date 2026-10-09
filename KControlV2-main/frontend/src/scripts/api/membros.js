
const url_base = "http://localhost:3333";

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



// CRIAR LINHA DA TABELA

function criarLinhaMembro(membro) {
    const id = membro.id_usuario ?? membro.id;
    const nome = membro.nome ?? "Nome não informado";
    const email = membro.email ?? "E-mail não informado";
    const role = String(membro.role ?? "user").toLowerCase();

    // Gera as iniciais do avatar
    const iniciais = nome
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(palavra => palavra[0])
        .join("")
        .toUpperCase() || "?";

    // Define o texto e o estilo do cargo
    const ehAdmin = ["admin", "administrador"].includes(role);
    const textoRole = ehAdmin ? "Administrador" : "Usuário";
    const classeRole = ehAdmin ? "admin" : "user";
    const iconeRole = ehAdmin ? "ti-shield-check" : "ti-user";

    // Formata a identificação
    const identificacao = id != null
        ? `#${String(id).padStart(3, "0")}`
        : "—";

    // Evita inserir texto da API como HTML
    const escaparHTML = (valor) => String(valor).replace(
        /[&<>"']/g,
        caractere => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[caractere]
    );

    return `
        <tr>
            <td>
                <div class="membro-identidade">
                    <div class="membro-avatar">
                        ${escaparHTML(iniciais)}
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

    // Considera que o backend responde com JSON.
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
            alert("Não foi possível identificar o membro.");
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
            const membro = data.user ?? data.membro ?? data;

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
            alert(error.message);
        }
    });


    // ENVIAR EDIÇÃO
    formEditar.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!membroSelecionadoId) {
            alert("Selecione um membro para editar.");
            return;
        }

        const nome = campoNome.value.trim();
        const email = campoEmail.value.trim();
        const role = campoRole.value;

        if (!nome || !email || !role) {
            alert("Preencha todos os campos.");
            return;
        }

        const botaoSalvar = formEditar.querySelector(
            '[type="submit"]'
        );

        if (botaoSalvar) {
            botaoSalvar.disabled = true;
        }

        try {
            await updateMembers(
                membroSelecionadoId,
                nome,
                email,
                role
            );

            alert("Membro atualizado com sucesso!");

            modalEditar.hidden = true;
            membroSelecionadoId = null;

            await carregarMembros();

        } catch (error) {
            console.error("Erro ao atualizar membro:", error);
            alert(error.message);

        } finally {
            if (botaoSalvar) {
                botaoSalvar.disabled = false;
            }
        }
    });


    // CARREGAR TABELA QUANDO A PÁGINA ABRIR
    carregarMembros();
});
