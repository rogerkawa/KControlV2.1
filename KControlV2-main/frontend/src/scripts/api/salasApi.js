
async function verifyResponse(response) {
    if (!response.ok) {
        const erro = await response.json();

        throw new Error(erro.message || `Erro HTTP: ${response.status}`);
    }

    return response;
}

const url_base = 'https://kcontrolv2-1.onrender.com/salas';

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

const salasApi = {
    async listSalas() {
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

    async registerSala(sala) {
        try {
            const response = await fetch(`${url_base}`, {
                method: 'POST',
                headers: httpAuth(),
                body: JSON.stringify(sala)
            });

            await verifyResponse(response);
            return response.json();

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async updateStatusSala(id, status) {
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
    },

    async deleteSala(id) {
        try {
            const response = await fetch(`${url_base}/${id}`, {
                method: 'DELETE',
                headers: httpAuth()
            });

            await verifyResponse(response);
            return response.json();

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};

export default salasApi;
