
import salasApi from "../api/salasApi.js";

const formSala = document.querySelector("#formSala");
const nomeSala = document.querySelector("#nomeSala");
const listaSalas = document.querySelector("#listaSalas");
const filtroStatus = document.querySelector("#filtroStatus");
const mensagem = document.querySelector("#mensagem");
const btnCadastrar = document.querySelector("#btnCadastrar");
const btnAtualizar = document.querySelector("#btnAtualizar");

const totalSalas = document.getElementById("totalSalasGerenciar");
const totalDisponiveis = document.querySelector("#totalDisponiveis");
const totalManutencao = document.querySelector("#totalManutencao");
const totalRetiradas = document.querySelector("#totalRetiradas");

let salas = [];

function notificarSalasAtualizadas() {
    localStorage.setItem(
        "salasAtualizadas",
        JSON.stringify({ timestamp: Date.now() })
    );

    document.dispatchEvent(new Event("salasAtualizadas"));
}


const nomesStatus = {
  disponivel: "Disponível",
  retirada: "Chave retirada",
  manutencao: "Em manutenção",
  inativa: "Inativa",
};

function mostrarMensagem(texto, tipo = "sucesso") {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
  mensagem.hidden = false;
}

function ocultarMensagem() {
  mensagem.hidden = true;
  mensagem.textContent = "";
}

function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);

  if (classe) {
    elemento.className = classe;
  }

  if (texto !== undefined) {
    elemento.textContent = texto;
  }

  return elemento;
}

function atualizarResumo() {
  totalSalas.textContent = salas.length;

  totalDisponiveis.textContent = salas.filter(
    (sala) => sala.status === "disponivel",
  ).length;

  totalManutencao.textContent = salas.filter(
    (sala) => sala.status === "manutencao",
  ).length;

  totalRetiradas.textContent = salas.filter(
    (sala) => sala.status === "retirada",
  ).length;
}

function criarBotaoAcao(texto, icone, acao, id, opcoes = {}) {
  const botao = criarElemento("button", "botao-acao");
  botao.type = "button";
  botao.dataset.action = acao;
  botao.dataset.id = id;
  botao.disabled = Boolean(opcoes.disabled);

  if (opcoes.perigo) {
    botao.classList.add("perigo");
  }

  const simbolo = criarElemento("i");
  simbolo.classList.add("bi", icone);
  simbolo.setAttribute("aria-hidden", "true");

  botao.append(simbolo, document.createTextNode(texto));

  return botao;
}

function renderizarSalas() {
  atualizarResumo();
  listaSalas.replaceChildren();

  const filtro = filtroStatus.value;

  const salasFiltradas = salas.filter((sala) => {
    return filtro === "todas" || sala.status === filtro;
  });

  if (salasFiltradas.length === 0) {
    const linha = document.createElement("tr");
    const celula = criarElemento(
      "td",
      "estado-vazio",
      "Nenhuma sala encontrada para este filtro.",
    );

    celula.colSpan = 3;
    linha.appendChild(celula);
    listaSalas.appendChild(linha);
    return;
  }

  salasFiltradas.forEach((sala) => {
    const linha = document.createElement("tr");

    const celulaNome = criarElemento("td");
    celulaNome.appendChild(
      criarElemento("span", "nome-sala", sala.nome),
    );

    const celulaStatus = document.createElement("td");
    const status = criarElemento(
      "span",
      `status ${sala.status}`,
      nomesStatus[sala.status] || sala.status,
    );

    celulaStatus.appendChild(status);

    const celulaAcoes = criarElemento("td", "coluna-acoes");
    const acoes = criarElemento("div", "acoes");

    if (sala.status === "disponivel") {
      acoes.appendChild(
        criarBotaoAcao(
          "Manutenção",
          "bi-tools",
          "manutencao",
          sala.id_sala,
        ),
      );
    }

    if (sala.status === "manutencao") {
      acoes.appendChild(
        criarBotaoAcao(
          "Liberar",
          "bi-check-circle",
          "liberar",
          sala.id_sala,
        ),
      );
    }

    if (sala.status === "retirada") {
      acoes.appendChild(
        criarBotaoAcao(
          "Manutenção",
          "bi-tools",
          "manutencao",
          sala.id_sala,
          { disabled: true },
        ),
      );
    }
    
    if (sala.status === "inativa") {
        acoes.appendChild(
            criarBotaoAcao(
                "Ativar",
                "bi-arrow-counterclockwise",
                "ativar",
                sala.id_sala
            )
        );
    }


    if (sala.status !== "inativa") {
      acoes.appendChild(
        criarBotaoAcao(
          "Desativar",
          "bi-trash",
          "remover",
          sala.id_sala,
          {
            perigo: true,
            disabled: sala.status === "retirada",
          },
        ),
      );
    }

    celulaAcoes.appendChild(acoes);
    linha.append(celulaNome, celulaStatus, celulaAcoes);
    listaSalas.appendChild(linha);
  });
}

async function carregarSalas() {
  btnAtualizar.disabled = true;
  btnAtualizar.innerHTML =
    '<i class="bi bi-arrow-clockwise"></i> Atualizando';

  try {
    const resultado = await salasApi.listSalas();

    if (!Array.isArray(resultado)) {
      throw new Error("A API não retornou uma lista válida de salas.");
    }

    salas = resultado;
    renderizarSalas();
  } catch (erro) {
    console.error("Erro ao carregar salas:", erro);
    mostrarMensagem(erro.message, "erro");
  } finally {
    btnAtualizar.disabled = false;
    btnAtualizar.innerHTML =
      '<i class="bi bi-arrow-clockwise"></i> Atualizar';
  }
}

formSala.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  ocultarMensagem();

  const nome = nomeSala.value.trim();

  if (!nome) {
    mostrarMensagem("Informe o nome da sala.", "erro");
    return;
  }

  btnCadastrar.disabled = true;

  try {
    await salasApi.registerSala(nome);

    document.dispatchEvent(new Event("salasAtualizadas"));
    mostrarMensagem(`Sala "${nome}" cadastrada com sucesso.`);

    formSala.reset();
    await carregarSalas();

    mostrarMensagem(`Sala "${nome}" cadastrada com sucesso.`);
  } catch (erro) {
    console.error("Erro ao cadastrar sala:", erro);
    mostrarMensagem(erro.message, "erro");
  } finally {
    btnCadastrar.disabled = false;
  }
});

filtroStatus.addEventListener("change", renderizarSalas);

btnAtualizar.addEventListener("click", async () => {
  ocultarMensagem();
  await carregarSalas();
});

listaSalas.addEventListener("click", async (evento) => {
  const botao = evento.target.closest("button[data-action]");

  if (!botao || botao.disabled) {
    return;
  }

  const id = botao.dataset.id;
  const acao = botao.dataset.action;
  const sala = salas.find(
    (item) => String(item.id_sala) === String(id),
  );

  if (!sala) {
    mostrarMensagem("Sala não encontrada na lista atual.", "erro");
    return;
  }

  ocultarMensagem();

  try {
    botao.disabled = true;

    if (acao === "manutencao") {
      const confirmar = window.confirm(
        `Deseja colocar "${sala.nome}" em manutenção?`,
      );

      if (!confirmar) return;

      await salasApi.updateStatusSala(id, "manutencao");
      mostrarMensagem(`${sala.nome} está em manutenção.`);
    }

    if (acao === "liberar") {
      const confirmar = window.confirm(
        `Deseja encerrar a manutenção de "${sala.nome}"?`,
      );

      if (!confirmar) return;

      await salasApi.updateStatusSala(id, "disponivel");
      mostrarMensagem(`${sala.nome} foi liberada.`);
    }

    
    if (acao === "ativar") {
        const confirmar = window.confirm(
            `Deseja reativar "${sala.nome}"?`
        );

        if (!confirmar) return;

        await salasApi.updateStatusSala(id, "disponivel");

        mostrarMensagem(`${sala.nome} foi reativada com sucesso.`);
    }


    if (acao === "remover") {
      const confirmar = window.confirm(
        `Deseja desativar "${sala.nome}"? O histórico de retiradas será preservado.`,
      );

      if (!confirmar) return;

      await salasApi.deleteSala(id);
      mostrarMensagem(`${sala.nome} foi desativada.`);
    }

    
    notificarSalasAtualizadas();
    await carregarSalas();
  } catch (erro) {
    console.error("Erro ao executar ação na sala:", erro);
    mostrarMensagem(erro.message, "erro");
  } finally {
    // A tabela pode ter sido recriada após carregarSalas().
    botao.disabled = false;
  }
});

carregarSalas();
