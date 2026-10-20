import { irParaPagina } from "./transicaoPagina.js";


const linkLogin =
    document.getElementById("linkLogin");


linkLogin.addEventListener("click", (evento) => {

    evento.preventDefault();

    irParaPagina("../index.html");

});