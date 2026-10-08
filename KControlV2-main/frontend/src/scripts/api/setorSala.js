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
    const response = await fetch(`${url_base}/salas`)

    await verifyResponse(response)

    const salas = await response.json()

    salas.forEach(sala => {
        const option = document.createElement('option')

        option.value = sala.id_sala
        option.textContent = sala.nome

        selectSalas.appendChild(option)
    });
} 

async function carregarSetores() {
    const response = await fetch(`${url_base}/setores`)

    await verifyResponse(response)

    const setores = await response.json()

    setores.forEach(setores => {
        const option = document.createElement('option')

        option.value = setores.id_setor
        option.textContent = setores.nome

        selectSetor.appendChild(option)
    });
} 

carregarSalas()
carregarSetores()