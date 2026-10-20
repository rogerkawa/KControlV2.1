const botaoVerSenha = document.getElementById('botaoVerSenha')
const inputSenha = document.getElementById('senha')
botaoVerSenha.addEventListener('click',()=>{
    if(inputSenha.type === 'password'){
        inputSenha.type = 'text'
    }else if(inputSenha.type === 'text'){
        inputSenha.type = 'password'
    }
})