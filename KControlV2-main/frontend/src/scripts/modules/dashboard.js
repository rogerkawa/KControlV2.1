import app from "../api/api.js";

let graficoSetores = null;

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.replace("../index.html");
        return;
    }

    try {
        const result = await app.findUserAuthenticator();

        if (result.user.role !== "admin") {
            window.location.replace("cadastro.html");
            return;
        }
        carregarDashboard();

    } catch (error) {
        localStorage.removeItem("token");
        window.location.replace("../index.html");
    }
});


export default function carregarDashboard() {
  const chaves = JSON.parse(localStorage.getItem("chaves")) || [];

  const pendentes = chaves.filter((chave) => {
    return !chave.hrsEntrega && !chave.entrega;
  });

  const totalPendentes = document.getElementById("totalPendentes");
  const listaPendentes = document.getElementById("listaPendentes");

  if (!totalPendentes || !listaPendentes) return;

  totalPendentes.textContent = pendentes.length;
  listaPendentes.innerHTML = "";

  pendentes.forEach((chave) => {
    listaPendentes.innerHTML += `
      <tr>
        <td>${chave.sala}</td>
        <td>${chave.responsavel || chave.pessoa}</td>
        <td>${chave.hrsRetirada || chave.retirada}</td>
      </tr>
    `;
  });

  carregarGraficoSetores();
  carregarGraficoDiasSemana()
  carregarRankingSalas();
}


function carregarGraficoSetores() {
  const chaves = JSON.parse(localStorage.getItem("chaves")) || [];

  const setores = {};

  chaves.forEach((chave) => {
    if (chave.setor) {
      setores[chave.setor] = (setores[chave.setor] || 0) + 1;
    }
  });

  const nomesSetores = Object.keys(setores);
  const totalRetiradas = Object.values(setores);

  const cores = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#7c3aed",
    "#0891b2"
  ];

  const canvas = document.getElementById("graficoSetores");

  if (!canvas) return;

  if (graficoSetores) {
    graficoSetores.destroy();
  }

  graficoSetores = new Chart(canvas, {
    type: "bar",
    data: {
      labels: nomesSetores,
      datasets: [
        {
          label: "Retiradas",
          data: totalRetiradas,
          backgroundColor: cores,
          borderRadius: 8,
          barThickness: 22,
          maxBarThickness: 28,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
          grid: {
            color: "#e5e7eb",
          },
        },
        y: {
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

let graficoDiasSemana = null;

function carregarGraficoDiasSemana() {
  const chaves = JSON.parse(localStorage.getItem("chaves")) || [];

  const dias = {
    Seg: 0,
    Ter: 0,
    Qua: 0,
    Qui: 0,
    Sex: 0,
    Sáb: 0,
    Dom: 0
  };

  chaves.forEach((chave) => {
  if (!chave.data) return;

  const dataCorrigida = new Date(chave.data + "T00:00:00");

  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const dia = diasSemana[dataCorrigida.getDay()];

  dias[dia]++;
});

  const canvas = document.getElementById("graficoDiasSemana");

  if (!canvas) return;

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
        backgroundColor: "rgba(37,99,235,.15)",
        fill: true,
        tension: .4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}
function carregarRankingSalas() {
    const chaves = JSON.parse(localStorage.getItem("chaves")) || [];

    const salas = {};

    chaves.forEach((chave) => {
        if (chave.sala) {
            salas[chave.sala] = (salas[chave.sala] || 0) + 1;
        }
    });

    const ranking = Object.entries(salas)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const container = document.getElementById("rankingSalas");

    if (!container) return;

    container.innerHTML = "";

    ranking.forEach(([sala, total], index) => {
        container.innerHTML += `
            <div class="ranking-item">
                <span class="ranking-posicao">
                    ${index + 1}°
                </span>

                <span class="ranking-sala">
                    ${sala}
                </span>

                <span class="ranking-total">
                    ${total}
                </span>
            </div>
        `;
    });
}