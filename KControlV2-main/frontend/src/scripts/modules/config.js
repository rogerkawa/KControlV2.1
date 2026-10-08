export default function toggleTema(){
const btnTema = document.querySelectorAll('.btnToggleTema')
const avatarInput = document.querySelector("#avatarInput");
const avatar = document.querySelector("#avatarConfig");

btnTema.forEach((button)=>{
    button.addEventListener('click',()=>{
    const html = document.documentElement

    const temaAtual = html.getAttribute('data-theme')

    if(temaAtual === 'dark'){
        html.setAttribute('data-theme', 'light')
    }else {
        html.setAttribute('data-theme', 'dark')
    }
})
})


const avatarSalvo = localStorage.getItem("avatar");
// Carregar avatar salvo

if (avatarSalvo) {
    avatar.src = avatarSalvo;
         document.querySelectorAll(".user-avatar").forEach(avatar => {
            avatar.src = avatarSalvo;
        }); 
}

// Alterar avatar
avatarInput.addEventListener("change", () => {
    const arquivo = avatarInput.files[0];

    if (!arquivo) return;

    const reader = new FileReader();

    reader.onload = () => {
        avatar.src = reader.result;

        localStorage.setItem("avatar", reader.result);
    };

    reader.readAsDataURL(arquivo);
});
}