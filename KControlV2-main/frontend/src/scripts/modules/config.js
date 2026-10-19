export default function toggleTema(){
const btnTema = document.querySelectorAll('.btnToggleTema')
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

}