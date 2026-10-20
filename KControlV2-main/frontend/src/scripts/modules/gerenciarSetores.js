
import setoresApi from "../api/setores.js";

export default function gerenciarSetores() {
  const form = document.getElementById("formSetor");
  const inputId = document.getElementById("idSetor");
  const inputNome = document.getElementById("nomeSetor");

  const tituloForm = document.getElementById("tituloFormSetor");
  const btnSalvar = document.getElementById("btnSalvarSetor");
  const btnCancelar = document.getElementById("btnCancelarEdicaoSetor");
  const btnAtualizar = document.getElementById("btnAtualizarSetores");

  const busca = document.getElementById("buscarSetor");
  const filtro = document.getElementById("filtroSetor");
  const tabela = document.getElementById("listaSetores");
  const mensagem = document.getElementById("mensagemSetores");

  const total = document.getElementById("totalSetores");
  const ativos = document.getElementById("setoresAtivos");
  const inativos = document.getElementById("setoresInativos");

  if (!form || !tabela) return;

  let setores = [];
  let carregando = false;

  function mostrarMensagem(texto, tipo = "") {
    mensagem.textContent = texto;
    mensagem.className = `setores-message ${tipo}`.trim();
    mensagem.hidden = false;
  }

  function escaparHTML(valor) {
    return String(valor).replace(/[&<>"']/g, (caractere) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[caractere]);
  }

  function atualizarIndicadores() {
    total.textContent = setores.length;
    ativos.textContent = setores.filter(
      (setor) => setor.status === "ativo"
    ).length;

    inativos.textContent = setores.filter(
      (setor) => setor.status === "inativo"
    ).length;
  }

  function renderizar() {
    const termo = busca.value.trim().toLowerCase();
    const situacao = filtro.value;

    const filtrados = setores.filter((setor) => {
      const correspondeNome = setor.nome.toLowerCase().includes(termo);

      const correspondeStatus =
        situacao === "todos" || setor.status === situacao;

      return correspondeNome && correspondeStatus;
    });

    if (!filtrados.length) {
      tabela.innerHTML = `
        <tr>
          <td colspan="3" class="setores-empty">
            Nenhum setor encontrado.
          </td>
        </tr>
      `;
      return;
    }

    tabela.innerHTML = filtrados.map((setor) => {
      const inativo = setor.status === "inativo";

      return `
        <tr>
          <td>
            <div class="setores-identificacao">
              <div class="setores-avatar">
                <i class="ti ti-building-community"></i>
              </div>

              <div>
                <span class="setores-nome">
                  ${escaparHTML(setor.nome)}
                </span>

                <span class="setores-descricao">
                  Setor #${Number(setor.id_setor)}
                </span>
              </div>
            </div>
          </td>

          <td>
            <span class="setores-status ${inativo ? "inativo" : "ativo"}">
              ${inativo ? "Inativo" : "Ativo"}
            </span>
          </td>

          <td>
            <div class="setores-acoes">
              <button
                type="button"
                class="setores-btn-acao"
                data-acao="editar"
                data-id="${Number(setor.id_setor)}"
                title="Editar setor"
                aria-label="Editar ${escaparHTML(setor.nome)}"
                ${inativo ? "disabled" : ""}
              >
                <i class="ti ti-pencil"></i>
              </button>

              <button
                type="button"
                class="setores-btn-acao"
                data-acao="status"
                data-id="${Number(setor.id_setor)}"
                title="${inativo ? "Ativar setor" : "Desativar setor"}"
                aria-label="${inativo ? "Ativar" : "Desativar"} ${escaparHTML(setor.nome)}"
              >
                <i class="ti ${inativo ? "ti-check" : "ti-ban"}"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  async function carregarSetores() {
    if (carregando) return;

    carregando = true;
    btnAtualizar.disabled = true;

    try {
      setores = await setoresApi.listSetores();

      atualizarIndicadores();
      renderizar();
      mensagem.hidden = true;
    } catch (error) {
      mostrarMensagem(error.message, "erro");
    } finally {
      carregando = false;
      btnAtualizar.disabled = false;
    }
  }

  function limparFormulario() {
    form.reset();
    inputId.value = "";
    tituloForm.textContent = "Adicionar setor";
    btnSalvar.innerHTML = `
      <i class="ti ti-plus"></i>
      Cadastrar setor
    `;
    btnCancelar.hidden = true;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = inputNome.value.trim();
    const id = inputId.value;

    if (!nome) {
      mostrarMensagem("Informe o nome do setor.", "erro");
      inputNome.focus();
      return;
    }

    btnSalvar.disabled = true;

    try {
      if (id) {
        await setoresApi.updateSetor(id, {nome});
        mostrarMensagem("Setor atualizado com sucesso.", "sucesso");
      } else {
        await setoresApi.registerSetor({nome});
        mostrarMensagem("Setor cadastrado com sucesso.", "sucesso");
      }

      limparFormulario();
      await carregarSetores();
    } catch (error) {
      mostrarMensagem(error.message, "erro");
    } finally {
      btnSalvar.disabled = false;
    }
  });

  btnCancelar.addEventListener("click", limparFormulario);
  btnAtualizar.addEventListener("click", carregarSetores);
  busca.addEventListener("input", renderizar);
  filtro.addEventListener("change", renderizar);

  tabela.addEventListener("click", async (event) => {
    const botao = event.target.closest("button[data-acao]");
    if (!botao) return;

    const id = Number(botao.dataset.id);
    const acao = botao.dataset.acao;
    const setor = setores.find(
      (item) => Number(item.id_setor) === id
    );

    if (!setor) return;

    if (acao === "editar") {
      if (setor.status !== "ativo") return;

      inputId.value = setor.id_setor;
      inputNome.value = setor.nome;

      tituloForm.textContent = "Editar setor";
      btnSalvar.innerHTML = `
        <i class="ti ti-check"></i>
        Salvar alterações
      `;

      btnCancelar.hidden = false;

      form.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      inputNome.focus();
      return;
    }

    const novoStatus =
      setor.status === "ativo" ? "inativo" : "ativo";

    const acaoTexto =
      novoStatus === "inativo" ? "desativar" : "ativar";

    const confirmado = window.Swal
      ? await Swal.fire({
          title: `${acaoTexto[0].toUpperCase()}${acaoTexto.slice(1)} setor?`,
          text: `Deseja ${acaoTexto} "${setor.nome}"?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Confirmar",
          cancelButtonText: "Cancelar",
          reverseButtons: true,
        }).then((resultado) => resultado.isConfirmed)
      : window.confirm(`Deseja ${acaoTexto} "${setor.nome}"?`);

    if (!confirmado) return;

    botao.disabled = true;

    try {
      await setoresApi.updateStatusSetor(id, novoStatus);
      document.dispatchEvent(new Event("setoresAtualizados"));

      if (String(inputId.value) === String(id)) {
        limparFormulario();
      }

      mostrarMensagem(
        `Setor ${novoStatus === "ativo" ? "ativado" : "desativado"} com sucesso.`,
        "sucesso"
      );

      await carregarSetores();
    } catch (error) {
      mostrarMensagem(error.message, "erro");
    } finally {
      botao.disabled = false;
    }
  });

  carregarSetores();
}

gerenciarSetores();
