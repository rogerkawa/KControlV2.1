import app from "./api.js"


async function verifyResponse(response) {
    if(!response.ok){
        const erro = await response.json()

        throw new Error(erro.message || `erro HTTP: ${response.status}`)
    }

    return response
}

const url_base = 'http://localhost:3333'

function obterToken(){
    return localStorage.getItem('token')
}

function httpAuth(){
    const token = obterToken()

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

function httpHeader(){
    return {
        'Content-Type': 'application/json',
    }
}


const setor = document.getElementById('setor')
const sala = document.getElementById('sala')
const responsavel = document.getElementById('nome')
const data_retirada = document.getElementById('data')
const hora_retirada = document.getElementById('horasRetirada')


const form = document.getElementById('chavesRegistro');

console.log("Arquivo registerkey.js executado");
console.log("Formulário encontrado:", form);

if (!form) {
    console.error("Formulário #chavesRegistro não encontrado!");
} else {
    form.addEventListener("submit", keyRegister);
    console.log("Evento submit registrado!");
}

/* Verificação de campos */

  class Login {
    constructor(setor, sala, responsavel, data_retirada, horas_retirada) {
      this.setor = setor;
      this.sala = sala;
      this.responsavel = responsavel;
      this.data = data_retirada;
      this.hrsRetirada = horas_retirada;
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

async function keyRegister(event) {
  console.log('prestou')
  
    event.preventDefault()

    console.log("Submit executado!");

    const result = await app.findUserAuthenticator();

    console.log("Resultado da autenticação:", result);
    console.log("Resultado da autenticação:", result);
    console.log("Usuário:", result?.user);
    console.log("ID do usuário:", result?.user?.id);
    console.log("ID do setor:", setor.value);
    console.log("ID da sala:", sala.value);


    try {
    const turno = document.querySelector('[name="turno"]:checked').value

    if (!turno) {
    throw new Error("Selecione um turno.");
}

    const login = new Login(
        setor.value,
        sala.value,
        responsavel.value,
        data_retirada.value,
        hora_retirada.value,
      );
      
      login.validation()

      /* Vem da api */
      /* const existeRegistro = chaves.some(item =>
        item.sala === sala.value &&
        item.turno === turno.value
    ); */
    /* if (existeRegistro) {
        throw new Error(
            `A sala ${sala.value} já possui um registro no turno ${turno.value}`
        );
    } */

    const register = {
        id_setor: Number(setor.value),
        id_sala: Number(sala.value),
        responsavel: responsavel.value.trim(),
        turno,
        data_retirada: data_retirada.value,
        hora_retirada: hora_retirada.value
}

    await registerUser(register)

    } catch (error) {
        console.error("Erro ao registrar:", error);
        alert(error.message || "Erro ao registrar a movimentação.");
    }
}



async function listUsers() {
        try {
            const response = await fetch(`${url_base}/get/registro`,{
            method: 'GET',
            headers: httpAuth()
        })

        await verifyResponse(response)
        return response.json()

        } catch (error) {
            console.error(error)
            throw error
        }
    }

async function registerUser(register){
    console.log("Dados enviados:", register);
        try {
            const response = await fetch(`${url_base}/registro`,{
                method: 'POST',
                headers: httpAuth(),
                body: JSON.stringify(register)
            })
            console.log("Status HTTP:", response.status);

            await verifyResponse(response)
            return response.json()

        } catch (error) {
            console.error(error)
            throw error
        }
    }