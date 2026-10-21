import carregarUltimosRegistros from "../modules/ultimosRegistros.js";

async function verifyResponse(response) {
    if(!response.ok){
        const erro = await response.json()

        throw new Error(erro.message || `erro HTTP: ${response.status}`)
    }

    return response
}

const url_base = 'https://kcontrolv2-1.onrender.com'

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

document.addEventListener("DOMContentLoaded", () => {
    carregarUltimosRegistros();
});


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

  
let temporizadorToast;

function mostrarToast(titulo, mensagem, tipo = "sucesso") {
    let toast = document.getElementById("toastNotificacao");

    if (!toast) {
        toast = document.createElement("div");

        toast.id = "toastNotificacao";
        toast.className = "toast-notificacao";

        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");

        toast.innerHTML = `
            <div class="toast-icone">
                <i class="ti ti-check"></i>
            </div>

            <div class="toast-conteudo">
                <p class="toast-titulo"></p>
                <p class="toast-mensagem"></p>
            </div>

            <button
                type="button"
                class="toast-fechar"
                aria-label="Fechar notificação"
            >
                &times;
            </button>
        `;

        document.body.appendChild(toast);

        toast.querySelector(".toast-fechar")
            .addEventListener("click", () => {
                toast.classList.remove("visivel");
            });
    }

    toast.querySelector(".toast-titulo").textContent = titulo;
    toast.querySelector(".toast-mensagem").textContent = mensagem;
    toast.classList.remove("sucesso", "erro");
    toast.classList.add(tipo);
    

    clearTimeout(temporizadorToast);

    toast.classList.add("visivel");

    temporizadorToast = setTimeout(() => {
        toast.classList.remove("visivel");
    }, 4000);
}



async function keyRegister(event) {
    event.preventDefault();

    try {
        const turnoSelecionado = document.querySelector(
            '[name="turno"]:checked'
        );

        if (!turnoSelecionado) {
            throw new Error("Selecione um turno.");
        }

        const turno = turnoSelecionado.value;

        const login = new Login(
            setor.value,
            sala.value,
            responsavel.value,
            data_retirada.value,
            hora_retirada.value
        );

        login.validation();

        const register = {
            id_setor: Number(setor.value),
            id_sala: Number(sala.value),
            responsavel: responsavel.value.trim(),
            turno,
            data_retirada: data_retirada.value,
            hora_retirada: hora_retirada.value
        };

        console.log("Registro salvo na API:", register);

        // Só continua se a API confirmar o registro.
        await registerUser(register);
        await carregarUltimosRegistros()
        document.dispatchEvent(new Event("registrosAtualizados"));
        if (typeof window.atualizarTabelaRegistros === "function") {
    await window.atualizarTabelaRegistros();
} else {
    console.error("A função de atualização da tabela não foi inicializada.");
}
        

        mostrarToast(
            "Retirada registrada!",
            "O registro da chave foi salvo com sucesso."
        );

        // Limpa os campos após o sucesso.
        document.getElementById("chavesRegistro").reset();

    } catch (error) {
        console.error("Erro ao registrar:", error);
        
        mostrarToast(
            "Não foi possível registrar",
            error.message || "Ocorreu um erro ao registrar a retirada.",
            "erro"
        );

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