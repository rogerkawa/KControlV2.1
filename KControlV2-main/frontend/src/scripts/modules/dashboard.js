
const API_URL = "https://kcontrolv2-1.onrender.com/get/registro";

let graficoSetores = null;
let graficoDiasSemana = null;
let dashboardInicializado = false;

// Busca os registros na API usando o token de autenticação.
async function buscarRegistros() {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Você precisa estar autenticado para acessar o dashboard.");
    }

    const resposta = await fetch(API_URL, {
        method: "GET",
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!resposta.ok) {
        throw new Error(`Erro ao buscar registros: HTTP ${resposta.status}`);
    }

    const dados = await resposta.json();

    // Compatível com a resposta que contém { getKeys: [...] }.
    const registros = dados.getKeys ?? dados.registros ?? dados;

    if (!Array.isArray(registros)) {
        throw new Error("A API não retornou uma lista válida de registros.");
    }

    return registros;
}

// Obtém um nome de sala ou setor, se a API o fornecer.
function obterNome(registro, tipo) {
    if (tipo === "sala") {
        return registro.nome_sala
            ?? registro.sala_nome
            ?? registro.sala
            ?? registro.nomeSala
            ?? null;
    }

    return registro.nome_setor
        ?? registro.setor_nome
        ?? registro.setor
        ?? registro.nomeSetor
        ?? null;
}

// Identifica registros ainda não devolvidos.
function estaPendente(registro) {
    const status = String(registro.status ?? "")
        .trim()
        .toLowerCase();

    if (["devolvida", "devolvido", "entregue", "devolvido"].includes(status)) {
        return false;
    }

    if (["retirada", "pendente", "em uso"].includes(status)) {
        return true;
    }

    // Compatibilidade caso a API não retorne status.
    return !registro.hora_entrega && !registro.entrega;
}

// Atualiza o contador e a tabela de pendências.
function renderizarPendentes(registros) {
    const totalPendentes = document.getElementById("totalPendentes");
    const listaPendentes = document.getElementById("listaPendentes");

    if (!totalPendentes || !listaPendentes) return;

    const pendentes = registros.filter(estaPendente);

    totalPendentes.textContent = pendentes.length;
    listaPendentes.replaceChildren();

    if (pendentes.length === 0) {
        const linha = document.createElement("tr");
        const celula = document.createElement("td");

        celula.colSpan = 3;
        celula.textContent = "Nenhuma sala pendente de devolução.";

        linha.appendChild(celula);
        listaPendentes.appendChild(linha);
        return;
    }

    pendentes.forEach((registro) => {
        const linha = document.createElement("tr");

        const sala = obterNome(registro, "sala");
        const setor = obterNome(registro, "setor");

        // Prioriza os nomes; usa o ID apenas como último recurso.
        const local = sala
            ?? setor
            ?? (registro.id_sala != null
                ? `Sala #${registro.id_sala}`
                : registro.id_setor != null
                    ? `Setor #${registro.id_setor}`
                    : "Local não informado");

        const responsavel =
            registro.responsavel
            ?? registro.nome_usuario
            ?? registro.nome
            ?? "Não informado";

        const horario =
            registro.hora_retirada
            ?? registro.horaRetirada
            ?? registro.retirada
            ?? "--:--";

        [local, responsavel, horario].forEach((valor) => {
            const celula = document.createElement("td");
            celula.textContent = String(valor);
            linha.appendChild(celula);
        });

        listaPendentes.appendChild(linha);
    });
}

// Conta as retiradas por setor.
function renderizarGraficoSetores(registros) {
    const canvas = document.getElementById("graficoSetores");
    if (!canvas || typeof Chart === "undefined") return;

    const totais = {};

    registros.forEach((registro) => {
        const setor = obterNome(registro, "setor");

        if (setor) {
            totais[setor] = (totais[setor] || 0) + 1;
        }
    });

    if (graficoSetores) {
        graficoSetores.destroy();
    }

    graficoSetores = new Chart(canvas, {
        type: "bar",
        data: {
            labels: Object.keys(totais),
            datasets: [{
                label: "Retiradas",
                data: Object.values(totais),
                backgroundColor: [
                    "#2563eb",
                    "#16a34a",
                    "#f59e0b",
                    "#dc2626",
                    "#7c3aed",
                    "#0891b2"
                ],
                borderRadius: 8,
                barThickness: 22,
                maxBarThickness: 28
            }]
        },
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Conta as retiradas por dia da semana.
function renderizarGraficoDiasSemana(registros) {
    const canvas = document.getElementById("graficoDiasSemana");
    if (!canvas || typeof Chart === "undefined") return;

    const dias = {
        Seg: 0,
        Ter: 0,
        Qua: 0,
        Qui: 0,
        Sex: 0,
        "Sáb": 0,
        Dom: 0
    };

    const nomesDias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    registros.forEach((registro) => {
        const data = registro.data_retirada
            ?? registro.data
            ?? registro.created_at;

        if (!data) return;

        // Evita que a data seja interpretada no fuso horário errado.
const dataTexto = String(data);
const partesData = dataTexto.match(/^(\d{4})-(\d{2})-(\d{2})/);

let dataLocal;

if (partesData) {
    const ano = Number(partesData[1]);
    const mes = Number(partesData[2]) - 1;
    const dia = Number(partesData[3]);

    dataLocal = new Date(ano, mes, dia);
} else {
    dataLocal = new Date(dataTexto);
}

if (Number.isNaN(dataLocal.getTime())) return;

// Conta a retirada no dia correto da semana.
const diaSemana = nomesDias[dataLocal.getDay()];
dias[diaSemana]++;
    });

    if (graficoDiasSemana) {
        graficoDiasSemana.destroy();
    }

    graficoDiasSemana = new Chart(canvas, {
        type: "line",
        data: {
            labels: Object.keys(dias),
            datasets: [{
                label: "Retiradas",
                data: Object.values(dias),
                borderColor: "#2563eb",
                backgroundColor: "rgba(37, 99, 235, 0.15)",
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

// Ranking das cinco salas mais utilizadas.
function renderizarRankingSalas(registros) {
    const container = document.getElementById("rankingSalas");
    if (!container) return;

    const totais = {};

    registros.forEach((registro) => {
        const sala = obterNome(registro, "sala");

        if (sala) {
            totais[sala] = (totais[sala] || 0) + 1;
        }
    });

    const ranking = Object.entries(totais)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    container.replaceChildren();

    if (ranking.length === 0) {
        container.textContent = "Ainda não há dados de salas para exibir.";
        return;
    }

    ranking.forEach(([sala, total], indice) => {
        const item = document.createElement("div");
        item.className = "ranking-item";

        const posicao = document.createElement("span");
        posicao.className = "ranking-posicao";
        posicao.textContent = `${indice + 1}º`;

        const nome = document.createElement("span");
        nome.className = "ranking-sala";
        nome.textContent = sala;

        const quantidade = document.createElement("span");
        quantidade.className = "ranking-total";
        quantidade.textContent = total;

        item.append(posicao, nome, quantidade);
        container.appendChild(item);
    });
}

// Função principal exportada para o app.js.
export default async function carregarDashboard() {
    try {
        const registros = await buscarRegistros();

        renderizarPendentes(registros);
        renderizarGraficoSetores(registros);
        renderizarGraficoDiasSemana(registros);
        renderizarRankingSalas(registros);

    } catch (error) {
        console.error("Erro ao carregar dashboard:", error);

        const lista = document.getElementById("listaPendentes");

        if (lista) {
            lista.replaceChildren();

            const linha = document.createElement("tr");
            const celula = document.createElement("td");

            celula.colSpan = 3;
            celula.textContent = "Não foi possível carregar os registros.";

            linha.appendChild(celula);
            lista.appendChild(linha);
        }
    }
}

// Registra os eventos uma única vez.
if (!dashboardInicializado) {
    document.addEventListener("registrosAtualizados", carregarDashboard);
    dashboardInicializado = true;
}
