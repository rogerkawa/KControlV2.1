
let containerToast;

const estilosToast = `
    #kcontrol-toasts {
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: min(390px, calc(100vw - 32px));
        pointer-events: none;
    }

    .k-toast {
        --toast-color: #60a5fa;
        position: relative;
        display: flex;
        align-items: flex-start;
        gap: 13px;
        padding: 16px 42px 19px 16px;
        overflow: hidden;
        color: #f8fafc;
        background: #17191f;
        border: 1px solid #30333d;
        border-radius: 14px;
        box-shadow: 0 12px 40px rgba(0, 0, 0, .28);
        pointer-events: auto;
        animation: kToastEntrada .35s cubic-bezier(.2,.8,.2,1) both;
    }

    .k-toast.sucesso { --toast-color: #4ade80; }
    .k-toast.erro { --toast-color: #fb7185; }
    .k-toast.aviso { --toast-color: #fbbf24; }
    .k-toast.info { --toast-color: #60a5fa; }

    .k-toast__icone {
        display: grid;
        place-items: center;
        flex-shrink: 0;
        width: 36px;
        height: 36px;
        color: var(--toast-color);
        background: color-mix(in srgb, var(--toast-color) 13%, transparent);
        border-radius: 10px;
    }

    .k-toast__icone svg {
        width: 21px;
        height: 21px;
        stroke: currentColor;
        stroke-width: 1.8;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .k-toast__conteudo {
        flex: 1;
        min-width: 0;
    }

    .k-toast__titulo {
        display: block;
        margin: 1px 0 4px;
        font-size: 14px;
        font-weight: 650;
        line-height: 1.4;
    }

    .k-toast__mensagem {
        display: block;
        color: #a7aab5;
        font-size: 13px;
        line-height: 1.5;
        overflow-wrap: anywhere;
    }

    .k-toast__fechar {
        position: absolute;
        top: 12px;
        right: 12px;
        display: grid;
        place-items: center;
        width: 26px;
        height: 26px;
        padding: 0;
        color: #9699a5;
        background: transparent;
        border: 0;
        border-radius: 7px;
        cursor: pointer;
        font-size: 20px;
        transition: background .2s, color .2s;
    }

    .k-toast__fechar:hover {
        color: #fff;
        background: #30333d;
    }

    .k-toast__progresso {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 3px;
        background: #30333d;
    }

    .k-toast__progresso span {
        display: block;
        width: 100%;
        height: 100%;
        background: var(--toast-color);
        transform-origin: left;
        animation: kToastProgresso linear forwards;
    }

    .k-toast.saindo {
        animation: kToastSaida .25s ease forwards;
    }

    @keyframes kToastEntrada {
        from { opacity: 0; transform: translateX(24px) scale(.97); }
        to { opacity: 1; transform: translateX(0) scale(1); }
    }

    @keyframes kToastSaida {
        to { opacity: 0; transform: translateX(24px) scale(.97); }
    }

    @keyframes kToastProgresso {
        from { transform: scaleX(1); }
        to { transform: scaleX(0); }
    }

    @media (max-width: 480px) {
        #kcontrol-toasts {
            top: 12px;
            right: 12px;
            width: calc(100vw - 24px);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .k-toast,
        .k-toast.saindo,
        .k-toast__progresso span {
            animation-duration: .01ms !important;
        }
    }
`;

const configuracoesToast = {
    sucesso: {
        titulo: "Sucesso",
        icone: `<path d="m5 12 4 4L19 6"/>`
    },
    erro: {
        titulo: "Erro",
        icone: `
            <circle cx="12" cy="12" r="9"/>
            <path d="m15 9-6 6m0-6 6 6"/>
        `
    },
    aviso: {
        titulo: "Atenção",
        icone: `
            <path d="M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z"/>
            <path d="M12 9v4m0 3h.01"/>
        `
    },
    info: {
        titulo: "Informação",
        icone: `
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 11v5m0-8h.01"/>
        `
    }
};

function prepararToasts() {
    if (containerToast) return;

    const estilos = document.createElement("style");
    estilos.id = "kcontrol-toast-estilos";
    estilos.textContent = estilosToast;
    document.head.appendChild(estilos);

    containerToast = document.createElement("div");
    containerToast.id = "kcontrol-toasts";
    containerToast.setAttribute("aria-live", "polite");
    containerToast.setAttribute("aria-relevant", "additions");
    document.body.appendChild(containerToast);
}

export function mostrarToast(
    mensagem,
    tipo = "info",
    duracao = 4000
) {
    prepararToasts();

    const tipoValido = Object.hasOwn(configuracoesToast, tipo)
        ? tipo
        : "info";

    const config = configuracoesToast[tipoValido];
    const toast = document.createElement("div");

    toast.className = `k-toast ${tipoValido}`;
    toast.setAttribute(
        "role",
        tipoValido === "erro" ? "alert" : "status"
    );

    const icone = document.createElement("div");
    icone.className = "k-toast__icone";
    icone.setAttribute("aria-hidden", "true");
    icone.innerHTML = `
        <svg viewBox="0 0 24 24">
            ${config.icone}
        </svg>
    `;

    const conteudo = document.createElement("div");
    conteudo.className = "k-toast__conteudo";

    const titulo = document.createElement("strong");
    titulo.className = "k-toast__titulo";
    titulo.textContent = config.titulo;

    const texto = document.createElement("span");
    texto.className = "k-toast__mensagem";
    texto.textContent = String(mensagem);

    const fechar = document.createElement("button");
    fechar.className = "k-toast__fechar";
    fechar.type = "button";
    fechar.setAttribute("aria-label", "Fechar notificação");
    fechar.textContent = "×";

    conteudo.append(titulo, texto);
    toast.append(icone, conteudo, fechar);

    let temporizador;

    function fecharToast() {
        clearTimeout(temporizador);

        if (!toast.isConnected || toast.classList.contains("saindo")) {
            return;
        }

        toast.classList.add("saindo");

        toast.addEventListener("animationend", () => {
            toast.remove();
        }, { once: true });

        // Fallback caso a animação não seja executada.
        setTimeout(() => toast.remove(), 350);
    }

    fechar.addEventListener("click", fecharToast);

    const tempo = Number.isFinite(Number(duracao))
        ? Math.max(0, Number(duracao))
        : 4000;

    if (tempo > 0) {
        const progresso = document.createElement("div");
        progresso.className = "k-toast__progresso";

        const barra = document.createElement("span");
        barra.style.animationDuration = `${tempo}ms`;

        progresso.appendChild(barra);
        toast.appendChild(progresso);

        temporizador = setTimeout(fecharToast, tempo);
    }

    containerToast.appendChild(toast);

    return fecharToast;
}
