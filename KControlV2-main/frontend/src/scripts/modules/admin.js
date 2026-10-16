import registroApi from "../api/tableAdmin.js";

export default function registro() {
    const tabela = document.querySelector("#table");
    const botaoLimpar = document.querySelector(".clear");

    const modalEditar = document.getElementById("modalEditar");
    const editarNome = document.getElementById("editarNome");
    const editarSala = document.getElementById("editarSala");
    const editarEntrega = document.getElementById("editarEntrega");

    const salvarEdicao = document.getElementById("salvarEdicao");
    const fecharEditar = document.getElementById("fecharEditar");
    const cancelarEditar = document.getElementById("cancelarEditar");

    // Impede que o código seja inicializado em páginas sem a tabela.
    if (!tabela) {
        return;
    }

    let registros = [];
    let idAtual = null;

    // Escapa textos antes de inseri-los no HTML.
    function escaparHTML(valor) {
        return String(valor ?? "").replace(/[&<>"']/g, caractere => {
            const caracteres = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return caracteres[caractere];
        });
    }

    function formatarData(data) {
        if (!data) {
            return "--/--/----";
        }

        const texto = String(data).slice(0, 10);

        // Converte YYYY-MM-DD para DD/MM/YYYY.
        if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
            const [ano, mes, dia] = texto.split("-");
            return `${dia}/${mes}/${ano}`;
        }

        return texto;
    }

    function formatarHora(hora) {
        if (!hora) {
            return "--:--";
        }

        return String(hora).slice(0, 5);
    }

    function obterTurno(turno) {
        const turnos = {
            M: "Manhã",
            T: "Tarde",
            N: "Noite"
        };

        return turnos[turno] || turno || "--";
    }

    // Busca os registros na API e atualiza a tabela.
    async function carregarRegistros() {
        try {
            tabela.innerHTML = `
                <tr>
                    <td colspan="10">Carregando registros...</td>
                </tr>
            `;

            const resposta = await registroApi.getKeys();

            // O controller retorna { getKeys: [...] }.
            if (!Array.isArray(resposta.getKeys)) {
                throw new Error(
                    "A API não retornou uma lista válida de registros."
                );
            }

            registros = resposta.getKeys;

            renderizarTabela();

        } catch (erro) {
            console.error("Erro ao carregar registros:", erro);

            tabela.innerHTML = `
                <tr>
                    <td colspan="10">
                        Não foi possível carregar os registros.
                    </td>
                </tr>
            `;
        }
    }

    // Monta a tabela usando os dados retornados pelo banco.
    function renderizarTabela() {
        tabela.innerHTML = "";

        if (registros.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="10">
                        Nenhum registro encontrado.
                    </td>
                </tr>
            `;

            return;
        }

        registros.forEach(item => {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${escaparHTML(item.id_registro)}</td>
                <td>${escaparHTML(item.setor)}</td>
                <td>${escaparHTML(item.sala)}</td>
                <td>${escaparHTML(formatarData(item.data_retirada))}</td>
                <td>${escaparHTML(item.responsavel)}</td>
                <td>${escaparHTML(obterTurno(item.turno))}</td>
                <td>${escaparHTML(formatarHora(item.hora_retirada))}</td>
                <td>${escaparHTML(formatarHora(item.hora_entrega))}</td>

                 <td>
                    <button
                        type="button"
                        class="btn btn-primary editar"
                        data-id="${escaparHTML(item.id_registro)}"
                    >Editar</button>
                </td>

                <td>
                    <button
                        type="button"
                        class="btn btn-danger remover"
                        data-id="${escaparHTML(item.id_registro)}"
                    >Remover</button>
                </td>
            `;

            tabela.appendChild(linha);
        });
    }

    // Abre o modal de edição.
    tabela.addEventListener("click", event => {
        const botaoEditar = event.target.closest(".editar");
        const botaoRemover = event.target.closest(".remover");

        if (botaoEditar) {
            abrirEdicao(botaoEditar.dataset.id);
        }

        if (botaoRemover) {
            excluirRegistro(botaoRemover.dataset.id);
        }
    });

    function abrirEdicao(id) {
        const item = registros.find(
            registro => String(registro.id_registro) === String(id)
        );

        if (!item) {
            alert("Registro não encontrado.");
            return;
        }

        idAtual = item.id_registro;

        editarNome.value = item.responsavel || "";
        editarEntrega.value = formatarHora(item.hora_entrega) === "--:--"
            ? ""
            : formatarHora(item.hora_entrega);

        
        editarSala.innerHTML = "";

        const salasDisponiveis = new Map();

        registros.forEach(registro => {
            if (registro.id_sala != null) {
                salasDisponiveis.set(
                    String(registro.id_sala),
                    registro.sala || `Sala ${registro.id_sala}`
                );
            }
        });

        salasDisponiveis.forEach((nomeSala, idSala) => {
            const opcao = document.createElement("option");

            opcao.value = idSala;
            opcao.textContent = nomeSala;

            editarSala.appendChild(opcao);
        });

        editarSala.value = String(item.id_sala);

        if (modalEditar) {
            modalEditar.classList.remove("escondido");
        }
    }

    // Salva as alterações na API.
    if (salvarEdicao) {
        salvarEdicao.addEventListener("click", async event => {
            event.preventDefault();

            if (idAtual === null) {
                alert("Selecione um registro para editar.");
                return;
            }

            const responsavel = editarNome.value.trim();
            const id_sala = Number(editarSala.value);
            const hora_entrega = editarEntrega.value || null;

            if (!responsavel) {
                alert("Informe o nome do responsável.");
                return;
            }

            if (!Number.isInteger(id_sala) || id_sala <= 0) {
                alert("Selecione uma sala válida.");
                return;
            }

            try {
                salvarEdicao.disabled = true;

                await registroApi.updateKey(idAtual, {
                    responsavel,
                    id_sala,
                    hora_entrega
                });

                fecharModal();

                await carregarRegistros();

                alert("Registro atualizado com sucesso!");

            } catch (erro) {
                console.error("Erro ao atualizar registro:", erro);
                alert(erro.message || "Não foi possível atualizar o registro.");

            } finally {
                salvarEdicao.disabled = false;
            }
        });
    }

    // Exclui um registro pelo ID do banco.
    async function excluirRegistro(id) {
        const confirmar = window.confirm(
            "Tem certeza de que deseja excluir este registro?"
        );

        if (!confirmar) {
            return;
        }

        try {
            await registroApi.deleteKey(id);

            await carregarRegistros();

            alert("Registro excluído com sucesso!");

        } catch (erro) {
            console.error("Erro ao excluir registro:", erro);

            alert(erro.message || "Não foi possível excluir o registro.");
        }
    }

    function fecharModal() {
        if (modalEditar) {
            modalEditar.classList.add("escondido");
        }

        idAtual = null;
    }

    if (fecharEditar) {
        fecharEditar.addEventListener("click", fecharModal);
    }

    if (cancelarEditar) {
        cancelarEditar.addEventListener("click", fecharModal);
    }

    // Limpa todos os registros individualmente.
    if (botaoLimpar) {
        botaoLimpar.addEventListener("click", async event => {
            event.preventDefault();

            if (registros.length === 0) {
                alert("Não existem registros para excluir.");
                return;
            }

            const confirmar = window.confirm(
                "ATENÇÃO: isso excluirá todos os registros carregados. " +
                "Essa ação não poderá ser desfeita. Deseja continuar?"
            );

            if (!confirmar) {
                return;
            }

            try {
                botaoLimpar.disabled = true;

                for (const item of registros) {
                    await registroApi.deleteKey(item.id_registro);
                }

                await carregarRegistros();

                alert("Registros excluídos com sucesso!");

            } catch (erro) {
                console.error("Erro ao limpar registros:", erro);

                alert(
                    "Não foi possível excluir todos os registros. " +
                    "Recarregue a tabela e verifique quais foram removidos."
                );

                await carregarRegistros();

            } finally {
                botaoLimpar.disabled = false;
            }
        });
    }

    // Carrega os registros quando a função é inicializada.
    carregarRegistros();
    window.atualizarTabelaRegistros = carregarRegistros;
    
    return {
    carregarRegistros
};
}
const tabelaRegistros = registro();