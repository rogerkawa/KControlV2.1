async function verifyResponse(response) {
    if (!response.ok) {
        const erro = await response.json();

        throw new Error(
            erro.message || `Erro HTTP: ${response.status}`
        );
    }

    return response;
}

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

const registroApi = {
    // Listar registros
    async getKeys() {
        const response = await fetch(
            `${url_base}/get/registro`,
            {
                method: "GET",
                headers: httpAuth()
            }
        );

        await verifyResponse(response);
        return response.json();
    },

    // Atualizar um registro
    async updateKey(id, dados) {
        const response = await fetch(
            `${url_base}/registro/update/${id}`,
            {
                method: "PUT",
                headers: httpAuth(),
                body: JSON.stringify(dados)
            }
        );

        await verifyResponse(response);
        document.dispatchEvent(new Event("registrosAtualizados"));
        return response.json();
    },

    // Excluir um registro
    async deleteKey(id) {
        const response = await fetch(
            `${url_base}/registro/delete/${id}`,
            {
                method: "DELETE",
                headers: httpAuth()
            }
        );

        await verifyResponse(response);
        return response.json();
    }
};

export default registroApi;