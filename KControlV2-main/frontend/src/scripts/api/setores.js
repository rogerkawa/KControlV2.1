async function verifyResponse(response) {
    if (!response.ok) {
        const erro = await response.json();

        throw new Error(erro.message || `Erro HTTP: ${response.status}`);
    }

    return response;
}

const url_base = 'https://kcontrolv2-1.onrender.com/setores';

function obterToken() {
    return localStorage.getItem('token');
}

function httpAuth() {
    const token = obterToken();

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

const setoresApi = {
    async listSetores() {
        try {
            const response = await fetch(`${url_base}`, {
                method: 'GET',
                headers: httpAuth()
            });

            await verifyResponse(response);
            return response.json();

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async registerSetor(setor) {
        try {
            const response = await fetch(`${url_base}`, {
                method: 'POST',
                headers: httpAuth(),
                body: JSON.stringify(setor)
            });

            await verifyResponse(response);
            return response.json();

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async updateSetor(id, setor) {
        try {
            const response = await fetch(`${url_base}/${id}`, {
                method: 'PUT',
                headers: httpAuth(),
                body: JSON.stringify(setor)
            });

            await verifyResponse(response);
            return response.json();

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async updateStatusSetor(id, status) {
        try {
            const response = await fetch(`${url_base}/${id}/status`, {
                method: 'PATCH',
                headers: httpAuth(),
                body: JSON.stringify({ status })
            });

            await verifyResponse(response);
            return response.json();

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};

export default setoresApi;