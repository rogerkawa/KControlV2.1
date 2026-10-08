import app from "../api/api.js";

export default async function carregarUsuario() {
  try {
    const result = await app.findUserAuthenticator();

    const user = result.user;

    const userName = document.querySelectorAll(".user-name");
    const userRole = document.querySelectorAll(".user-role");
    //const avatar = document.querySelector(".avatar");


    userName.forEach((usuario)=>{
       if (userName) {
      usuario.textContent = user.nome;
    } 
    
  })
    
  userRole.forEach(element => {
      if (element) {
      element.textContent =
        user.role === "admin"
          ? "Administrador"
          : "Usuário";
}
    
});

    /* if (avatar) {
      avatar.textContent = gerarIniciais(user.nome);
    } */

  } catch (error) {
    console.error("Erro ao carregar usuário:", error);
  }
}

function gerarIniciais(nome) {
  if (!nome) return "US";

  const partes = nome.trim().split(" "); //Remove os espaços externos separa o nome em array, visando os espaços

  if (partes.length === 1) {
    return partes[0][0].toUpperCase();
  }

  const primeiraInicial = partes[0][0];//["caio", "nascimento"]
  const segundaInicial = partes[1][0];

  return `${primeiraInicial}${segundaInicial}`.toUpperCase();
}