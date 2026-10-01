import { irParaPagina } from "./transicaoPagina.js";
export default function trocarTela(){
const links = document.querySelectorAll("[data-page]");
const pages = document.querySelectorAll(".page");

links.forEach((link) => {
  link.addEventListener("click", () => {
    const pageId = link.dataset.page;

    pages.forEach((page) => page.classList.remove("active"));

    document.getElementById(pageId).classList.add("active");
    document.dispatchEvent(new Event("chavesAtualizadas"));
  });
});
}

/* Animação */
/* const linkCadastro =
    document.getElementById("linkCadastro");


linkCadastro.addEventListener("click", (evento) => {

    evento.preventDefault();

    irParaPagina("./pages/cadastro.html");

}); */