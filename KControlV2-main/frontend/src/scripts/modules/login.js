
import carregarDashboard from "./dashboard.js";

export default function login() {
  const setor = document.getElementById("setor");
  const sala = document.getElementById("sala");
  const responsavel = document.getElementById("nome");
  /*  */
  const data = document.getElementById("data");
  const hrsRetirada = document.getElementById("horasRetirada");
  const btnRegistro = document.querySelector(".btn-registrar");




  // pega registros já existentes ou um array vazio
  let chaves = JSON.parse(localStorage.getItem("chaves")) || [];

  class Login {
    constructor(setor, sala, responsavel, data, hrsRetirada) {
      this.setor = setor;
      this.sala = sala;
      this.responsavel = responsavel;
      this.data = data;
      this.hrsRetirada = hrsRetirada;
    }
    validarSetor() {
      if (this.setor == "" || this.setor == undefined || this.setor == null) {
        throw new Error("Preencha o campo de setor");
      }
    }

    validarSala() {
      if (this.sala == "" || this.sala == undefined || this.sala == null) {
        throw new Error("Preencha o campo de sala");
      }
    }
    validarResponsavel() {
      if (this.responsavel.trim() === "") {
        throw new Error("O campo responsável não pode está vazio");
      }
    }
    validarData() {
      if (this.data === "") {
        throw new Error("Preencha o campo de data");
      }
    }
    validarRetirada() {
      if (this.hrsRetirada === "") {
        throw new Error("Preencha o campo de retirada");
      }
    }

    validation() {
      this.validarSetor();
      this.validarSala();
      this.validarResponsavel();
      this.validarData();
      this.validarRetirada(); 
    }
  }

  btnRegistro.addEventListener("click", (e) => {
    e.preventDefault();

    const turno = document.querySelector('[name="turno"]:checked');
    console.log("clique");

    try {
      const login = new Login(
        setor.value,
        sala.value,
        responsavel.value,
        data.value,
        hrsRetirada.value,
      );
      login.validation();
      const existeRegistro = chaves.some(item =>
        item.sala === sala.value &&
        item.turno === turno.value
    );

    if (existeRegistro) {
        throw new Error(
            `A sala ${sala.value} já possui um registro no turno ${turno.value}`
        );
    }

    const stats = {
        setor: setor.value,
        sala: sala.value,
        turno: turno.value,
        pessoa: responsavel.value,
        retirada: hrsRetirada.value,
        entrega: '',
        data: data.value,
    };

    chaves.push(stats);
    console.log(chaves)
    localStorage.setItem("chaves",JSON.stringify(chaves));
    document.dispatchEvent(new Event("chavesAtualizadas"));

    renderizarAtividades()
    atualizarStatusPorTurno()
    renderizarSalasEmUso()
    carregarDashboard()

      Swal.fire({
        title: "Sucesso!",
        text: "Dados enviados com sucesso.",
        icon: "success",
      });
      setor.value = ''
      sala.value = ''
      responsavel.value = ''
      data.value = ''
      hrsRetirada.value = ''
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.name,
        text: error.message,
      });
    }
  });

  const atividade = document.querySelector("#atividade");
  function renderizarAtividades() {
    atividade.innerHTML = "";

    // cria uma copia do array e pega os 3 ultimos elementos
    const ultimos = chaves.slice(-3).reverse();

    ultimos.forEach((item) => {
      atividade.innerHTML += `

        <div class="atividade-item">

            <div>

                <div class="atividade-nome">
                    <i class="bi bi-person-fill"></i> ${item.pessoa}
                </div>

                <div class="atividade-info">
                    ${item.sala} • ${item.retirada}
                </div>

            </div>

        </div>
        `;
    });
  }
function atualizarStatusPorTurno() {
  const chaves = JSON.parse(localStorage.getItem("chaves")) || [];

  const turnoSelecionado = document.getElementById("filtroTurno").value;

  const totalSalas = document.querySelectorAll(
    "#sala option:not([value=''])"
  ).length;

  const salasEmUsoNoTurno = chaves.filter(item =>
    item.turno === turnoSelecionado &&
    item.entrega === ""
  );

  const emUso = salasEmUsoNoTurno.length;
  const disponiveis = totalSalas - emUso;

  document.getElementById("salasDisponiveis").textContent = disponiveis;
  document.getElementById("salasEmUso").textContent = emUso;
  document.getElementById("totalSalas").textContent = totalSalas;
}


function renderizarSalasEmUso() {
  const chaves = JSON.parse(localStorage.getItem("chaves")) || [];

  const lista = document.getElementById("listaSalasEmUso");
  const qtd = document.getElementById("qtdSalasEmUso");

  const salasEmUso = chaves.filter(item => item.entrega === "");

  qtd.textContent = `${salasEmUso.length} ativas`;

  if (salasEmUso.length === 0) {
    lista.innerHTML = `
      <div class="sala-uso-card">
        <strong>Nenhuma sala</strong>
        <span>Não há chaves em uso no momento.</span>
      </div>
    `;
    return;
  }

  lista.innerHTML = salasEmUso.map(item => `
    <article class="sala-uso-card">
      <strong>${item.sala}</strong>
      <span>${item.pessoa}</span>
      <small>${item.turno}</small>
    </article>
  `).join("");
}
function atualizarTelaRegistro() {
  chaves = JSON.parse(localStorage.getItem("chaves")) || [];

  renderizarAtividades();
  atualizarStatusPorTurno();
  renderizarSalasEmUso();
  carregarDashboard()
}

document
  .getElementById("filtroTurno")
  .addEventListener("change", atualizarStatusPorTurno);

document.addEventListener("chavesAtualizadas", atualizarTelaRegistro);

atualizarTelaRegistro();

}
