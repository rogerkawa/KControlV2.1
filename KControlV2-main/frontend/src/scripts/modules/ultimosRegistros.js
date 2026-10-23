
const API_URL = "https://kcontrolv2-1.onrender.com/meus-registros";

export default async function carregarUltimosRegistros() {
    const atividade = document.getElementById("atividade");

    if (!atividade) return;

    const token = localStorage.getItem("token");

    if (!token) {
        atividade.textContent = "Faça login para visualizar os registros.";
        return;
    }

    atividade.textContent = "Carregando registros...";

    try {
        const resposta = await fetch(API_URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (resposta.status === 401 || resposta.status === 403) {
            atividade.textContent = "Sua sessão expirou. Faça login novamente.";
            return;
        }

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os registros.");
        }

        const resultado = await resposta.json();

        // Aceita os formatos mais comuns de resposta da API.
        const registros =
            resultado.getKeys ??
            resultado.registros ??
            resultado;

        if (!Array.isArray(registros)) {
            throw new Error("A API retornou um formato inesperado.");
        }

        atividade.replaceChildren();

        if (registros.length === 0) {
            atividade.textContent = "Nenhum registro encontrado.";
            return;
        }

        // Ordena pelos IDs e seleciona os três mais recentes.
        const ultimos = [...registros]
            .sort((a, b) =>
                Number(b.id_registro) - Number(a.id_registro)
            )
            .slice(0, 3);

        ultimos.forEach((registro) => {
            const item = document.createElement("div");
            item.className = "atividade-item";

            const detalhes = document.createElement("div");

            const nome = document.createElement("div");
            nome.className = "atividade-nome";
            nome.textContent = registro.responsavel || "Responsável não informado";

            const info = document.createElement("div");
            info.className = "atividade-info";

            const sala = registro.sala ?? registro.nome_sala ?? "Sala não informada";
            const horario = registro.hora_retirada ?? "--:--";

            info.textContent = `${sala} • ${horario}`;

            detalhes.append(nome, info);
            item.append(detalhes);
            atividade.append(item);
        });

    } catch (erro) {
        console.error("Erro ao carregar últimos registros:", erro);
        atividade.textContent = "Erro ao carregar os registros.";
    }
}
