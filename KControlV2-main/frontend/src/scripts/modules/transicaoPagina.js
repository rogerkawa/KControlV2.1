
const path = document.getElementById("transicaoPath");

const telaFechada = `
    M 0 0
    L 0 100
    Q 50 100 100 100
    L 100 0
    Z
`;

const telaAberta = `
    M 0 0
    L 0 0
    Q 50 0 100 0
    L 100 0
    Z
`;

/* Entrar */

/* Entrar */
function animarEntrada() {
    if (!path || !window.gsap) return;

    gsap.killTweensOf(path);

    gsap.set(path, {
        attr: {
            d: `
                M 0 0
                L 0 100
                Q 50 100 100 100
                L 100 0
                Z
            `
        }
    });

    gsap.timeline()
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
}

window.addEventListener("pageshow", animarEntrada);


/* Sair */
export function irParaPagina(url) {
    if (!path || !window.gsap) {
        window.location.href = url;
        return;
    }

    gsap.killTweensOf(path);

    gsap.timeline({
        onComplete: () => {
            window.location.href = url;
        }
    })
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
        attr: { d: telaFechada },
        ease: "power3.inOut"
    });
}
