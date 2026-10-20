const selectSalas = document.getElementById('sala')
const selectSetor = document.getElementById('setor')

async function verifyResponse(response) {
    if(!response.ok){
        const erro = await response.json()

        throw new Error(erro.message || `erro HTTP: ${response.status}`)
    }

    return response
}

const url_base = 'http://localhost:3333'


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
               sala.status !== "manutencao" &&
               sala.status !== "retirada";
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

document.addEventListener("salasAtualizadas", () => {
    carregarSalas();
});

window.addEventListener("storage", (evento) => {
    if (evento.key === "salasAtualizadas") {
        carregarSalas();
    }
});
document.addEventListener("setoresAtualizados", () => {
    carregarSetores();
});