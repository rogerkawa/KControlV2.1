import { mostrarToast } from "../toast";

async function verifyResponse(response) {
    if (!response.ok) {
        const texto = await response.text();

        let erro;

        try {
            erro = JSON.parse(texto);
        } catch {
            erro = null;
        }

        throw new Error(
            erro?.message ||
            `Erro HTTP ${response.status}: ${
                response.status === 413
                    ? "A imagem ultrapassa o limite permitido pelo servidor."
                    : "Não foi possível concluir a operação."
            }`
        );
    }

    return response;
}

const url_base = "https://kcontrolv2-1.onrender.com";

function obterToken() {
    return localStorage.getItem("token");
}

function httpAuthArquivo() {
    const token = obterToken();

    if (!token || token === "null" || token === "undefined") {
        throw new Error("Token não encontrado. Faça login novamente.");
    }

    return {
        Authorization: `Bearer ${token}`
    };
}

function atualizarAvatares(avatarUrl) {
    if (!avatarUrl) return;

    const imagens = document.querySelectorAll(".user-avatar");
    const urlCompleta = new URL(avatarUrl, url_base);

    // Evita reutilizar uma imagem antiga do cache.
    urlCompleta.searchParams.set("v", Date.now());

    imagens.forEach((imagem) => {
        imagem.onerror = () => {
            console.error(
                "Não foi possível carregar o avatar:",
                imagem.src
            );
        };

        imagem.src = urlCompleta.href;
    });

    console.log("Avatares atualizados:", imagens.length);
}

export async function carregarAvatarSalvo() {
    try {
        const response = await fetch(`${url_base}/avatar`, {
            method: "GET",
            headers: httpAuthArquivo(),
            cache: "no-store"
        });

        await verifyResponse(response);

        const dados = await response.json();
        const avatarUrl = dados.usuario?.avatar_url;

        if (avatarUrl) {
            atualizarAvatares(avatarUrl);
        } else {
            console.warn(
                "A API não retornou usuario.avatar_url:",
                dados
            );
        }
    } catch (erro) {
        console.error("Erro ao carregar avatar salvo:", erro);
    }
}

const avatarInput = document.querySelector("#avatarInput");

avatarInput?.addEventListener("change", async () => {
    const arquivo = avatarInput.files?.[0];

    if (!arquivo) return;

    if (arquivo.size > 5 * 1024 * 1024) {
        mostrarToast('A imagem deve ter no máximo 5 MB.', 'aviso', 3000)
        avatarInput.value = "";
        return;
    }

    const formData = new FormData();
    formData.append("avatar", arquivo);

    try {
        const response = await fetch(`${url_base}/avatar/update`, {
            method: "PUT",
            headers: httpAuthArquivo(),
            body: formData
        });

        await verifyResponse(response);

        const dados = await response.json();

        if (!dados.avatar_url) {
            throw new Error(
                "A API não retornou o caminho do avatar."
            );
        }

        atualizarAvatares(dados.avatar_url);

        mostrarToast('Foto de perfil atualizada!', 'sucesso', 2500)
    } catch (erro) {
        console.error("Erro ao atualizar avatar:", erro);
        mostrarToast(erro.message, 'erro', 3000)
    } finally {
        avatarInput.value = "";
    }
});
