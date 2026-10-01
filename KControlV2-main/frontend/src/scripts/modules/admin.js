import carregarDashboard from "./dashboard.js";
export default function registro() {
  let chaves = JSON.parse(localStorage.getItem("chaves")) || [];

  let tableRow = document.querySelector("#table");

  function renderizarTabela() {
    tableRow.innerHTML = "";

    chaves.forEach((chaves, indice) => {
      tableRow.innerHTML += `
            <tr>
                <td>${indice + 1}</td>
                <td>${chaves.setor}</td>
                <td>${chaves.sala}</td>
                <td>${chaves.data}</td>
                <td>${chaves.pessoa}</td>
                <td>${chaves.turno}</td>
                <td>${chaves.retirada}</td>
                <td>${chaves.entrega || "--:--"}</td>
                <td>
                <button class="btn btn-primary editar" data-id="${indice}">
                            Editar
                </button>
                </td>
                <td>
                <button class="btn btn-danger remover" data-id="${indice}">
                            Remover
                </button>
                </td>
            </tr>
        `;
    });

    const botoesRemover = document.querySelectorAll(".remover");

    botoesRemover.forEach((botao) => {
      botao.addEventListener("click", (e) => {
        e.preventDefault();
        const id = botao.dataset.id;

        chaves.splice(id, 1);

        localStorage.setItem("chaves", JSON.stringify(chaves)) || [];
        document.dispatchEvent(new Event("chavesAtualizadas"));

        renderizarTabela();
        carregarDashboard()
      });
    });

    /* Editar */
    const botoesEditar = document.querySelectorAll(".editar");

    botoesEditar.forEach((botao) => {
      botao.addEventListener("click", () => {
        const id = botao.dataset.id;
        idAtual = id;

        const registro = chaves[id];

        editarNome.value = registro.pessoa;

        editarSala.value = registro.sala;

        editarEntrega.value = registro.entrega || "";
        localStorage.setItem("chaves", JSON.stringify(chaves));

        document.dispatchEvent(new Event("chavesAtualizadas"));
        console.log(registro.sala)
        modalEditar.classList.remove("escondido");
        renderizarTabela()
        carregarDashboard()
      });
    });
  }

  const clear = document.querySelector(".clear");
  clear.addEventListener("click", (e) => {
    e.preventDefault();
    chaves = [];
    localStorage.removeItem("chaves");
    document.dispatchEvent(new Event("chavesAtualizadas"));

    renderizarTabela();
    carregarDashboard()
  });
  let dados = document.querySelector("#admin");

  renderizarTabela();

  const modalEditar = document.getElementById("modalEditar");

  const editarNome = document.getElementById("editarNome");

  const editarSala = document.getElementById("editarSala");

  const editarEntrega = document.getElementById("editarEntrega");
  let idAtual = null;

  const salvarEdicao = document.getElementById("salvarEdicao");

  salvarEdicao.addEventListener("click", (e) => {
    e.preventDefault();
    chaves[idAtual].pessoa = editarNome.value;
    chaves[idAtual].sala = editarSala.value;
    chaves[idAtual].entrega = editarEntrega.value;

    localStorage.setItem("chaves", JSON.stringify(chaves));

    modalEditar.classList.add("escondido");

    renderizarTabela();
    carregarDashboard()
  });

  /* Fechar modal Editar */
  const fecharEditar = document.getElementById("fecharEditar");
  const cancelarEditar = document.getElementById("cancelarEditar");

  fecharEditar.addEventListener("click", () => {
    modalEditar.classList.add("escondido");
  });

  cancelarEditar.addEventListener("click", () => {
    modalEditar.classList.add("escondido");
  });

  /* DarkMode */
/* 
  const toggleTema = document.getElementById("toggleTema");

  toggleTema.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      localStorage.setItem("tema", "dark");
    } else {
      localStorage.setItem("tema", "light");
    }
  });

  if (localStorage.getItem("tema") === "dark") {
    document.body.classList.add("dark");
  } */

  /* Limpeza automatica */

  function limpezaAutomatica() {
    console.log("inicio");
    const horaLimpeza = 23; // 23h
    const agora = new Date();
    const horaAtual = agora.getHours();
    const hoje = agora.toLocaleDateString();

    console.log(horaAtual);
    console.log(hoje);

    const ultimaLimpeza = localStorage.getItem("ultimaLimpeza");
    console.log(ultimaLimpeza);

    if (horaAtual >= horaLimpeza && ultimaLimpeza !== hoje) {
      localStorage.removeItem("chaves");
      tableRow.innerHTML = "";
      chaves = [];
      renderizarTabela();
      localStorage.setItem("ultimaLimpeza", hoje);
      console.log("dados apagados");
    }
    console.log("ate aqui foi");
  }
  setInterval(() => {
    limpezaAutomatica();
  }, 60000);

  limpezaAutomatica();

  //Dispara o evento de atualizar a pagina
  document.addEventListener("chavesAtualizadas", () => {
  chaves = JSON.parse(localStorage.getItem("chaves")) || [];
  renderizarTabela();
});
}
