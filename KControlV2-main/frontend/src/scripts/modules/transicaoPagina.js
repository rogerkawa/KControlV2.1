const path = document.getElementById("transicaoPath");


/* Entrar */
window.addEventListener("DOMContentLoaded", () => {

    if (!path) return;


    gsap.timeline()

        .set(path, {
            attr: {
                d: `
                    M 0 0
                    L 0 100
                    Q 50 100 100 100
                    L 100 0
                    Z
                `
            }
        })

        .to(path, {
            duration: 0.6,

            attr: {
                d: `
                    M 0 0
                    L 0 0
                    Q 50 35 100 0
                    L 100 0
                    Z
                `
            },

            ease: "power3.inOut"
        })

        .to(path, {
            duration: 0.4,

            attr: {
                d: `
                    M 0 0
                    L 0 0
                    Q 50 0 100 0
                    L 100 0
                    Z
                `
            },

            ease: "power3.inOut"
        });

});


/* Sair */

export function irParaPagina(url) {

    if (!path) {
        window.location.href = url;
        return;
    }


    const timeline = gsap.timeline({

        onComplete: () => {
            window.location.href = url;
        }

    });


    timeline

        .to(path, {

            duration: 0.4,

            attr: {
                d: `
                    M 0 100
                    L 0 100
                    Q 50 65 100 100
                    L 100 100
                    Z
                `
            },

            ease: "power3.inOut"

        })

        .to(path, {

            duration: 0.6,

            attr: {
                d: `
                    M 0 0
                    L 0 100
                    Q 50 100 100 100
                    L 100 0
                    Z
                `
            },

            ease: "power3.inOut"

        });

}