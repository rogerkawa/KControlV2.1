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

const url_base = 'http://localhost:3333'

function obterToken(){
    return localStorage.getItem('token')
}

function httpAuth(){
    const token = obterToken()

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

function httpHeader(){
    return {
        'Content-Type': 'application/json',
    }
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




const avatarInput = document.querySelector("#avatarInput");

avatarInput.addEventListener("change", async () => {
    const arquivo = avatarInput.files[0];

    if (!arquivo) return;

    if (arquivo.size > 5 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 5 MB.");
        avatarInput.value = "";
        return;
    }

    const formData = new FormData();

    formData.append("avatar", arquivo);

    try {
        const response = await fetch(
            `${url_base}/avatar/update`,
            {
                method: "PUT",
                headers: httpAuthArquivo(),
                body: formData
            }
        );

        await verifyResponse(response)

        const dados = await response.json();
        console.log("Resposta da API:", dados);
        console.log("URL do avatar:", dados.avatar_url);

        if (!dados.avatar_url) {
                throw new Error(
                    "A API não retornou o caminho do avatar."
                );
            }

        atualizarAvatares(dados.avatar_url);

        alert("Foto de perfil atualizada!");
    } catch (erro) {
        console.error(erro);
        alert(erro.message);
    } finally {
        avatarInput.value = "";
    }
});

function atualizarAvatares(avatarUrl) {
    const imagens = document.querySelectorAll(".user-avatar");

    if (!avatarUrl) return;

    const urlCompleta = new URL(avatarUrl, url_base);

    // Evita o cache da imagem anterior.
    urlCompleta.searchParams.set("v", Date.now());

    imagens.forEach((imagem) => {
        imagem.src = urlCompleta.href;
    });

    console.log("Avatares atualizados:", imagens.length);
}

async function carregarAvatarSalvo() {
    try {
        const response = await fetch(`${url_base}/avatar`, {
            method: "GET",
            headers: httpAuthArquivo()
        });

        await verifyResponse(response);

        const dados = await response.json();
        const avatarUrl = dados.usuario?.avatar_url;

        if (avatarUrl) {
            atualizarAvatares(avatarUrl);
        }
    } catch (erro) {
        console.error("Erro ao carregar avatar salvo:", erro);
    }
}

carregarAvatarSalvo()