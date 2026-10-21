const selectSalas = document.getElementById('sala')
const selectSetor = document.getElementById('setor')

const cardDisponiveis = document.getElementById('salasDisponiveis');
const cardEmUso = document.getElementById('salasEmUso');
const cardTotal = document.getElementById('totalSalas');

const listaSalasEmUso = document.getElementById('listaSalasEmUso');
const quantidadeSalasEmUso = document.getElementById('qtdSalasEmUso');

const filtroTurno = document.getElementById('filtroTurno');

async function carregarStatusSalas() {
    try {
        const response = await fetch(`${url_base}/salas`);
        await verifyResponse(response);
        const salas = await response.json();

        const disponiveis = salas.filter(
            sala => sala.status === 'disponivel'
        ).length;

        const emUso = salas.filter(
            sala => sala.status === 'retirada'
        ).length;

        const total = salas.length;

        cardDisponiveis.textContent = disponiveis;
        cardEmUso.textContent = emUso;
        cardTotal.textContent = total;

        

    } catch (erro) {
        console.error('Erro ao carregar status das salas:', erro);
    }
}
async function carregarSalasEmUso() {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${url_base}/get/registro`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        await verifyResponse(response);

        const dados = await response.json();
        const registros = dados.getKeys;

        renderizarSalasEmUso(registros, filtroTurno.value);

    } catch (erro) {
        console.error('Erro ao carregar salas em uso:', erro);
    }
}

async function renderizarSalasEmUso(registros, turnoSelecionado) {
    const dataAtual = new Date();

    const dataHoje = [
        dataAtual.getFullYear(),
        String(dataAtual.getMonth() + 1).padStart(2, '0'),
        String(dataAtual.getDate()).padStart(2, '0')
    ].join('-');
    
    const salasAtivas = registros.filter(registro =>
        registro.turno === turnoSelecionado &&
        registro.status === 'retirada'
    );

    quantidadeSalasEmUso.textContent = `${salasAtivas.length} ativas`;
    listaSalasEmUso.replaceChildren();

    if (salasAtivas.length === 0) {
        const mensagem = document.createElement('p');
        mensagem.className = 'mensagem-vazia';
        mensagem.textContent = 'Nenhuma sala em uso neste turno.';
        listaSalasEmUso.appendChild(mensagem);
        return;
    }

    salasAtivas.forEach(registro => {
        const card = document.createElement('article');
        card.className = 'sala-uso-card';

        const sala = document.createElement('h4');
        sala.textContent = registro.sala;

        const responsavel = document.createElement('p');
        responsavel.textContent = `Responsável: ${registro.responsavel}`;

        const setor = document.createElement('p');
        setor.textContent = `Setor: ${registro.setor}`;

        const turno = document.createElement('p');
        const nomesTurnos = {
            M: 'Manhã',
            T: 'Tarde',
            N: 'Noite'
        };
        turno.textContent = `Turno: ${nomesTurnos[registro.turno]}`;

        const horario = document.createElement('p');
        horario.textContent = `Retirada: ${registro.hora_retirada}`;

        card.append(sala, responsavel, setor, turno, horario);
        listaSalasEmUso.appendChild(card);
    });
}


async function verifyResponse(response) {
    if(!response.ok){
        const erro = await response.json()

        throw new Error(erro.message || `erro HTTP: ${response.status}`)
    }

    return response
}

const url_base = 'https://kcontrolv2-1.onrender.com'


async function carregarSalas() {
    const response = await fetch(`${url_base}/salas`);

    await verifyResponse(response);

    const salas = await response.json();

    // Limpa as opções antigas, mantendo a primeira opção do select
    selectSalas.querySelectorAll('option:not(:first-child)').forEach(option => {
        option.remove();
    });

    const salasPermitidas = salas.filter((sala) => {
        return sala.status !== "inativa" &&
               sala.status !== "manutencao"
    });

    salasPermitidas.forEach(sala => {
        const option = document.createElement('option');

        option.value = sala.id_sala;
        option.textContent = sala.nome;

        selectSalas.appendChild(option);
    });
}
 


async function carregarSetores() {
    const response = await fetch(`${url_base}/setores`);

    await verifyResponse(response);

    const setores = await response.json();

    selectSetor
        .querySelectorAll('option:not(:first-child)')
        .forEach(option => option.remove());

    const setoresAtivos = setores.filter(
        setor => setor.status === "ativo"
    );

    setoresAtivos.forEach(setor => {
        const option = document.createElement("option");

        option.value = setor.id_setor;
        option.textContent = setor.nome;

        selectSetor.appendChild(option);
    });
}


carregarSalas()
carregarSetores()
carregarStatusSalas()
carregarSalasEmUso()

filtroTurno.addEventListener('change', () => {
    carregarSalasEmUso();
});

document.addEventListener("salasAtualizadas", async () => {
    await carregarSalas();
    await carregarStatusSalas();
});

window.addEventListener("storage", (evento) => {
    if (evento.key === "salasAtualizadas") {
        carregarSalas();
        carregarStatusSalas();
    }
});

document.addEventListener("registrosAtualizados", async () => {
    await carregarSalasEmUso();
    await carregarStatusSalas();
});
