import { useState, useEffect, useRef, createContext, useContext } from "react";
import fotoSantander from './assets/quem-sou/eu no santander.jpeg';
import fotoPerfil from './assets/quem-sou/eu.jpeg';
import fotoPollo from './assets/quem-sou/davi-de-pollo.jpeg';

// Carrossel da seção "Quem Sou": apenas fotos com postura profissional.
const MEDIA_ITEMS = [
  { src: fotoSantander, type: 'image' },
  { src: fotoPerfil, type: 'image' },
  { src: fotoPollo, type: 'image' },
];

/* ══ LINKS CONFIGURÁVEIS ══════════════════════════════════════════════ */
// Currículos servidos a partir da pasta /public (dinâmico por idioma).
const CV_URLS = {
  pt: "/Curriculo_Davi_Freitas.pdf",
  en: "/Resume_Davi_Freitas_EN.pdf",
};
// Número do WhatsApp no formato internacional, só dígitos (DDI + DDD + número).
const WHATSAPP_NUMBER = "5511900000000";
const whatsappLink = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

// Logos e Mídias
// Isso importa as imagens e vídeos de dentro do sistema de pastas do React para usar no código.
import logoAgno from './assets/logos/agno.png';
import logoAws from './assets/logos/aws.png';
import logoDatabase from './assets/logos/database.webp';
import logoDocker from './assets/logos/docker.png';
import logoGithub from './assets/logos/github.png';
import logoLangchain from './assets/logos/langchain.png';
import logoLanggrafic from './assets/logos/langgrafic.png';
import logoN8n from './assets/logos/n8n png.png';
import logoNext from './assets/logos/nextjs.png';
import logoNode from './assets/logos/node2.png';
import logoPython from './assets/logos/python.png';
import logoReact from './assets/logos/react.png';
import logoClaude from './assets/logos/claude.png';
import logoGemini from './assets/logos/gemini-color.png';
import logoOpenai from './assets/logos/openai.webp';
import logoPostman from './assets/logos/postman.webp';
import logoFastApi from './assets/logos/fast api.png';
import logoPostgress from './assets/logos/postgress.png';
import logoSupabase from './assets/logos/supabase.webp';

/* ══ FONTES EXTERNAS ══════════════════════════════════════════════════ */
// Puxa as fontes bonitas do Google Fonts direto para o documento
const injectFonts = () => {
  if (document.getElementById("pf-fonts")) return;
  const l = document.createElement("link");
  l.id = "pf-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,300;1,700&family=Bebas+Neue&family=DM+Mono:wght@300;400&display=swap";
  document.head.appendChild(l);
};

/* ══ TOKENS (Paleta de Cores) ══════════════════════════════════════════════════ */
// Aqui ficam as cores padrão do site. Se quiser mudar o tom de dourado geral, é só mudar o hexadecimal do 'gold' aqui que propaga para o site todo.
const T = {
  black:"#080808", dark:"#0d0d0d", card:"#111111",
  border:"#1c1c1c", border2:"#252525",
  gold:"#c9a84c", goldL:"#e2c97e", goldD:"#8a6f2e", goldXD:"#4a3a15",
  cream:"#f4ead5", muted:"#4a4a4a", muted2:"#666", white:"#f5f3ee",
};

/* ══ CSS Global ══════════════════════════════════════════════════════ */
// Um textão contendo todas as regras brutas de estilo (Keyframes de animação e classes padrão) que são injetadas direto na página.
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:${T.black};color:${T.white};font-family:'Cormorant Garamond',Georgia,serif;overflow-x:hidden;cursor:none;}
html,body{scrollbar-width:none;}
::selection{background:${T.goldD}55;color:${T.goldL};}
::-webkit-scrollbar{width:0;height:0;background:transparent;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:transparent;}
a{color:inherit;text-decoration:none;cursor:none;}
input,textarea{font-family:'Cormorant Garamond',serif;outline:none;}

#cur-dot{position:fixed;pointer-events:none;z-index:9999;width:5px;height:5px;border-radius:50%;background:${T.gold};transform:translate(-50%,-50%);mix-blend-mode:difference;}
#cur-ring{position:fixed;pointer-events:none;z-index:9998;width:30px;height:30px;border-radius:50%;border:1px solid ${T.gold}55;transform:translate(-50%,-50%);transition:width .35s,height .35s,border-color .35s,opacity .35s;}
#cur-ring.big{width:54px;height:54px;border-color:${T.gold};opacity:.7;}
#cur-ring.click{width:18px;height:18px;border-color:${T.goldL};opacity:1;}
#progress-line{position:fixed;top:0;left:0;width:2px;height:0%;background:linear-gradient(to bottom,${T.goldD},${T.gold});z-index:300;}

@keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
@keyframes ticker{from{transform:translateX(0);}to{transform:translateX(-50%);}}
@keyframes fadeUp{from{opacity:0;transform:translateY(40px);}to{opacity:1;transform:translateY(0);}}
@keyframes scaleIn{from{opacity:0;transform:scale(.93);}to{opacity:1;transform:scale(1);}}
@keyframes drawLine{from{transform:scaleX(0);}to{transform:scaleX(1);}}
@keyframes goldPulse{0%,100%{opacity:.7;}50%{opacity:1;box-shadow:0 0 8px 2px ${T.goldD}66;}}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-9px);}}
@keyframes particleFly{0%{opacity:0;transform:translateY(0) scale(0);}20%{opacity:1;}100%{opacity:0;transform:translateY(-80px) scale(1.4);}}
@keyframes fromRight{from{opacity:0;transform:translateX(55px);}to{opacity:1;transform:translateX(0);}}
@keyframes fromLeft{from{opacity:0;transform:translateX(-55px);}to{opacity:1;transform:translateX(0);}}
@keyframes fromDown{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}

@keyframes floatZeroG1 {
  0%   { transform: translate(0px, 0px) rotate(0deg); }
  33%  { transform: translate(40px, -60px) rotate(15deg); }
  66%  { transform: translate(-30px, 40px) rotate(-10deg); }
  100% { transform: translate(50px, 20px) rotate(25deg); }
}
@keyframes floatZeroG2 {
  0%   { transform: translate(0px, 0px) rotate(0deg); }
  33%  { transform: translate(-50px, 30px) rotate(-20deg); }
  66%  { transform: translate(30px, -40px) rotate(10deg); }
  100% { transform: translate(-20px, 50px) rotate(-15deg); }
}
@keyframes floatZeroG3 {
  0%   { transform: translate(0px, 0px) rotate(0deg); }
  33%  { transform: translate(40px, 50px) rotate(10deg); }
  66%  { transform: translate(-40px, -30px) rotate(-25deg); }
  100% { transform: translate(20px, -60px) rotate(15deg); }
}

.gold-text{background:linear-gradient(90deg,${T.goldD},${T.gold},${T.goldL},${T.gold},${T.goldD});background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 5s linear infinite;}
.sdiv{width:100%;height:1px;background:linear-gradient(90deg,transparent,${T.goldD}88,${T.gold}cc,${T.goldD}88,transparent);transform-origin:left;animation:drawLine .9s cubic-bezier(.77,0,.18,1) both;}

/* ── Horizontal slider ── */
.hs-wrap{position:relative;width:100%;overflow:hidden;}
.hs-track{display:flex;width:200%;transition:transform .85s cubic-bezier(.77,0,.18,1);}
.hs-pane{width:50%;flex-shrink:0;min-height:100vh;}

/* arrows */
.hs-arrow{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;border:1px solid ${T.border};background:${T.card};display:flex;align-items:center;justify-content:center;cursor:none;z-index:10;font-size:16px;color:${T.muted};transition:border-color .3s,background .3s,color .3s;}
.hs-arrow:hover{border-color:${T.gold};background:${T.goldXD};color:${T.gold};}
.hs-arrow-l{left:20px;}
.hs-arrow-r{right:20px;}

/* dots */
.hs-dots{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);display:flex;gap:10px;z-index:10;}
.hs-dot{width:7px;height:7px;border-radius:50%;border:1px solid ${T.goldD};background:transparent;transition:background .3s,border-color .3s;cursor:none;}
.hs-dot.active{background:${T.gold};border-color:${T.gold};}

/* panel items — animated via inline style + animationName */
.fr{animation:fromRight .7s cubic-bezier(.16,1,.3,1) both;}
.fl{animation:fromLeft  .7s cubic-bezier(.16,1,.3,1) both;}
.fd{animation:fromDown  .65s cubic-bezier(.16,1,.3,1) both;}

/* ── contact ── */
.cphr{font-family:'Cormorant Garamond',serif;font-size:clamp(20px,2.8vw,34px);font-weight:300;color:${T.white};line-height:2;display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 10px;}
.cfield{background:none;border:none;border-bottom:1.5px solid ${T.border};color:${T.goldL};font-family:'Cormorant Garamond',serif;font-size:clamp(20px,2.8vw,34px);font-weight:300;padding:0 6px 2px;min-width:110px;transition:border-color .3s;caret-color:${T.gold};cursor:none;}
.cfield:focus{border-bottom-color:${T.gold};}
.cfield::placeholder{color:${T.muted};}
.tbtn{padding:9px 24px;border-radius:40px;border:1.5px solid ${T.border};background:transparent;color:${T.muted};font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;cursor:none;transition:all .3s;}
.tbtn.sel{background:${T.gold};border-color:${T.gold};color:${T.black};}
.tbtn:hover:not(.sel){border-color:${T.goldD};color:${T.gold};}
.cbtn{padding:9px 22px;border-radius:40px;border:1.5px solid ${T.border};background:transparent;color:${T.muted};font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;cursor:none;transition:all .3s;}
.cbtn.sel{background:${T.gold};border-color:${T.gold};color:${T.black};}
.cbtn:hover:not(.sel){border-color:${T.goldD};color:${T.gold};}
.sbtn{font-family:'Bebas Neue',sans-serif;font-size:clamp(44px,7vw,88px);letter-spacing:.04em;color:${T.white};background:none;border:none;cursor:none;display:inline-flex;align-items:center;gap:16px;transition:color .3s;line-height:1;}
.sbtn:hover{color:${T.gold};}
.sbtn .sarr{display:inline-flex;align-items:center;justify-content:center;width:.8em;height:.8em;border:2px solid currentColor;border-radius:50%;font-size:.55em;transition:transform .3s,background .3s;}
.sbtn:hover .sarr{transform:rotate(45deg);background:${T.gold};border-color:${T.gold};color:${T.black};}

/* ── nav: idioma & CV ── */
.lang-sw{display:inline-flex;align-items:center;gap:8px;border:1px solid ${T.border};padding:6px 12px;}
.lang-btn{background:none;border:none;cursor:none;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.2em;color:${T.muted};transition:color .3s;padding:0;}
.lang-btn:hover{color:${T.goldL};}
.lang-btn.sel{color:${T.gold};}
.nav-cv{display:inline-flex;align-items:center;gap:8px;border:1px solid ${T.goldD};padding:6px 14px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:${T.gold};transition:background .3s,border-color .3s,color .3s;}
.nav-cv:hover{background:${T.goldXD};border-color:${T.gold};color:${T.goldL};}

/* ── serviços: CTA ── */
.svc-cta{display:inline-flex;align-items:center;gap:14px;border:1.5px solid ${T.gold};padding:18px 30px;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:${T.gold};background:${T.goldXD}33;white-space:nowrap;transition:background .35s,color .35s,box-shadow .35s;}
.svc-cta:hover{background:${T.gold};color:${T.black};box-shadow:0 10px 36px -12px ${T.gold}88;}
.svc-cta .svc-arr{transition:transform .35s;}
.svc-cta:hover .svc-arr{transform:translate(3px,-3px);}
`;

/* ══ SMOOTH NAV GLOBAL & TIMELINE DO SCROLL ══════════════════════════════ */
/**
 * DOCUMENTAÇÃO DE NAVEGAÇÃO E ANIMAÇÃO:
 * O portfólio utiliza um sistema de scroll "virtual" guiado pela rolagem do mouse.
 * A página real ("#bio") possui uma altura absoluta massiva (ex: 2040vh) para forçar uma longa rolagem.
 * A métrica \`p\` (Math.min(..., 1)) reflete a porcentagem exata de descida entre 0.0 e 1.0 (0 a 100%).
 * 
 * Cada componente abaixo é ativado por \`enterT\` e \`leaveT\`, calculados subtraindo o ponto inicial de \`p\`
 * divididos pela duração que devem ficar visíveis.
 * 
 * O \`SECTION_SCROLL_MAP\` abaixo define o gatilho dos botões de navegação lateral (ancoragem), indicando em qual porcentagem
 * da barra de rolagem a tela será tele-transportada ao serem clicados.
 */
const SECTION_SCROLL_MAP = {
  hero: 0,          // Voltar ao topo
  bio: 0.12,        // Quem Sou (Exatamente na foto 1)
  trajetoria: 0.312,// Trajetória (Exatamente na foto 2)
  projetos: 0.488,  // Cards dos Projetos
  skills: 0.64,     // Habilidades Stack
  servicos: 0.92,   // Serviços & Soluções (offsetTop de #bio é relativo à <section>, então o p real fica ~0.10 abaixo)
  contatos: 1.3,    // Rodapé de Contato (Exatamente na foto 3)
};

/**
 * Linha do tempo dos painéis dentro de "#bio" (valores de p entre 0 e 1).
 * Cada painel entra no seu marco e sai quando o próximo entra; STAGE_DUR é a duração da transição.
 */
const STAGE_DUR = 0.12;
const STAGES = { carreira: 0.08, projetos: 0.28, skills: 0.48, servicos: 0.68, contatos: 0.88 };
const stageT = (p, start) => Math.max(0, Math.min((p - start) / STAGE_DUR, 1));

// Easing solicitado: ease in/out cúbico.
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Guarda o requestAnimationFrame atual para cancelar animações antigas quando clicar várias vezes.
let activeScrollRaf = null;

/**
 * scrollToSection: navegação interna suave e previsível para o layout sticky/virtual.
 * @param {string} id - id da seção (chave do SECTION_SCROLL_MAP)
 * @param {number} durationMs - duração da animação em ms (padrão 1200)
 */
function scrollToSection(id, durationMs = 600) {
  const startY = window.scrollY;
  let targetY = startY;

  if (id === "hero") {
    targetY = 0;
  } else if (Object.prototype.hasOwnProperty.call(SECTION_SCROLL_MAP, id)) {
    const bio = document.getElementById("bio");
    if (!bio) return;

    const sectionProgress = SECTION_SCROLL_MAP[id];
    const maxScroll = Math.max(0, bio.offsetHeight - window.innerHeight);
    targetY = bio.offsetTop + maxScroll * sectionProgress;
  } else {
    // Fallback para IDs comuns fora do mapa virtual
    const el = document.getElementById(id);
    if (!el) return;
    targetY = el.getBoundingClientRect().top + window.scrollY;
  }

  // Clampa no range real do documento
  const docMax = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  targetY = Math.min(docMax, Math.max(0, targetY));

  if (Math.abs(targetY - startY) < 1) return;

  if (activeScrollRaf) {
    cancelAnimationFrame(activeScrollRaf);
    activeScrollRaf = null;
  }

  const startTime = performance.now();
  const distance = targetY - startY;

  const tick = (now) => {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / durationMs);
    const eased = easeInOutCubic(t);
    const nextY = startY + distance * eased;

    window.scrollTo(0, nextY);

    if (t < 1) {
      activeScrollRaf = requestAnimationFrame(tick);
    } else {
      activeScrollRaf = null;
      window.scrollTo(0, targetY);
    }
  };

  activeScrollRaf = requestAnimationFrame(tick);
}

/* ══ HOOKS Customizados ═══════════════════════════════════════════════════ */
// Hooks são funções do React que começam com "use". Eles guardam lógicas que podemos reutilizar em várias partes do site.

/**
 * useSmoothNav: expõe scrollToSection e liga automaticamente elementos com [data-scroll-to].
 */
function useSmoothNav() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("[data-scroll-to]"));

    const onClick = (e) => {
      e.preventDefault();
      const id = e.currentTarget.getAttribute("data-scroll-to");
      if (!id) return;
      scrollToSection(id);
    };

    elements.forEach((el) => el.addEventListener("click", onClick));

    return () => {
      elements.forEach((el) => el.removeEventListener("click", onClick));
    };
  }, []);

  return { scrollToSection };
}

/**
 * useInView: Olheiro de Tela
 * O que faz: Avisa quando um elemento (como uma imagem ou texto) aparece na tela enquanto você rola para baixo.
 * Uso prático: "Se essa div aparecer na tela, comece a animação X".
 * @param {number} thresh - Porcentagem (0 a 1) do elemento que precisa estar visível para ativar.
 */
function useInView(thresh = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setV(true); },
      { threshold: thresh }
    );
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return [ref, v];
}

/**
 * useParallax: Efeito de Profundidade
 * O que faz: Faz um elemento se mover numa velocidade diferente da rolagem da página.
 * Uso prático: Cria a ilusão de profundidade, como as montanhas que passam devagar atrás de uma janela de carro.
 */
function useParallax(speed = 0.2) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const fn = () => { el.style.transform = `translateY(${el.getBoundingClientRect().top * speed}px)`; };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [speed]);
  return ref;
}

/**
 * useScrollProgress: Barra de Progresso Dourada
 * O que faz: Mede o quanto você rolou a página até o fundo e empurra essa porcentagem para aquela linhazinha vertical no canto da tela.
 */
function useScrollProgress() {
  useEffect(() => {
    const bar = document.getElementById("progress-line");
    const fn = () => {
      if (bar) bar.style.height = (
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      ) + "%";
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
}

function useNotebook() {
  const [nb, setNb] = useState(() => window.innerWidth <= 1440);
  useEffect(() => {
    const fn = () => setNb(window.innerWidth <= 1440);
    window.addEventListener('resize', fn, { passive: true });
    return () => window.removeEventListener('resize', fn);
  }, []);
  return nb;
}

/**
 * useCursor: O Mouse Mágico
 * O que faz: Substitui o ponteiro do mouse feio do Windows por uma bolinha dourada com um anel flutuante que te segue.
 * Quando você passa por cima de um botão, o anel incha (classList.add("big")).
 */
function useCursor() {
  useEffect(() => {
    const dot = document.getElementById("cur-dot");
    const ring = document.getElementById("cur-ring");
    let rx = 0, ry = 0, dx = 0, dy = 0, af;
    const move = (e) => {
      dx = e.clientX; dy = e.clientY;
      if (dot) { dot.style.left = dx + "px"; dot.style.top = dy + "px"; }
    };
    const lag = () => {
      rx += (dx - rx) * .1; ry += (dy - ry) * .1; // "rx += ..." Cria aquele efeito gomo elástico para seguir meio em atraso suave
      if (ring) { ring.style.left = rx + "px"; ring.style.top = ry + "px"; }
      af = requestAnimationFrame(lag);
    };
    const big = () => ring?.classList.add("big");
    const sm  = () => ring?.classList.remove("big");
    const clk = () => { ring?.classList.add("click"); setTimeout(() => ring?.classList.remove("click"), 200); };
    
    // Rastreadores de evento (Ouvidos da página pro mouse)
    window.addEventListener("mousemove", move);
    window.addEventListener("click", clk);
    
    // Toca tudo que for 'clicável' para o mouse inchar na hora que passa por cima
    document.querySelectorAll("a,button,[data-h]").forEach(el => {
      el.addEventListener("mouseenter", big);
      el.addEventListener("mouseleave", sm);
    });
    af = requestAnimationFrame(lag);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(af); };
  }, []);
}

/**
 * useCounter: Hodômetro Numérico
 * O que faz: Conta números do 0 até o alvo rapidamente, num tempo 'ms' definido. Usado para o número "100" enorme atrás do início.
 */
function useCounter(target, active, ms = 1900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let s; let af;
    const step = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / ms, 1);
      setV(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) af = requestAnimationFrame(step); else setV(target);
    };
    af = requestAnimationFrame(step);
    return () => cancelAnimationFrame(af);
  }, [active, target]);
  return v;
}

/* ══ UTILITÁRIOS VISUAIS ══════════════════════════════════════════════ */
// Componentes pequenos e sem estado que servem apenas para decoração.

/**
 * Componente: Diamond
 * O que faz: Desenha aquele pequeno losango (ou diamante) dourado usado para decoração ao redor da página.
 */
const Diamond = ({ size = 8, color = T.gold, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" style={{ flexShrink: 0, ...style }}>
    <rect x="1.5" y="1.5" width="7" height="7" fill={color} transform="rotate(45 5 5)" />
  </svg>
);

const LockIcon = ({ size = 12, color = T.gold, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ArrowExternalIcon = ({ size = 12, color = T.gold, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

// Base comum dos ícones de traço fino (herdam a cor via `color`, inclusive currentColor).
const LineIcon = ({ size = 20, color = T.gold, strokeWidth = "1.8", style = {}, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
    {children}
  </svg>
);

const DownloadIcon = (props) => (
  <LineIcon {...props}>
    <path d="M12 3v12" />
    <polyline points="7 10 12 15 17 10" />
    <path d="M5 21h14" />
  </LineIcon>
);

const ChatIcon = (props) => (
  <LineIcon {...props}>
    <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.44L3 21l2.06-5.4A8.5 8.5 0 1 1 21 11.5z" />
    <path d="M8.5 10.5h7M8.5 13.5h4.5" />
  </LineIcon>
);

const WorkflowIcon = (props) => (
  <LineIcon {...props}>
    <rect x="3" y="3" width="6" height="6" rx="1.2" />
    <rect x="15" y="3" width="6" height="6" rx="1.2" />
    <rect x="9" y="15" width="6" height="6" rx="1.2" />
    <path d="M9 6h6M6 9v3a3 3 0 0 0 3 3M18 9v3a3 3 0 0 1-3 3" />
  </LineIcon>
);

const AgentIcon = (props) => (
  <LineIcon {...props}>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
    <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />
  </LineIcon>
);

const ServerIcon = (props) => (
  <LineIcon {...props}>
    <rect x="3" y="4" width="18" height="6" rx="1.5" />
    <rect x="3" y="14" width="18" height="6" rx="1.5" />
    <path d="M7 7h.01M7 17h.01M11 7h6M11 17h6" />
  </LineIcon>
);

const TrendIcon = (props) => (
  <LineIcon {...props}>
    <path d="M3 3v18h18" />
    <polyline points="7 15 11 11 14 14 20 7" />
    <polyline points="16 7 20 7 20 11" />
  </LineIcon>
);

const SERVICE_ICONS = [WorkflowIcon, AgentIcon, ServerIcon, TrendIcon];

/* ══ IDIOMA (PT | EN) ══════════════════════════════════════════════ */
// Destaque dourado usado dentro dos parágrafos traduzidos.
const Em = ({ children }) => <em style={{ color: T.goldL }}>{children}</em>;

const I18N = {
  pt: {
    nav: { bio: "Quem Sou", trajetoria: "Trajetória", servicos: "Serviços", contatos: "Contato", cv: "Baixar CV" },
    hero: {
      badge: "AI & Full Stack Developer",
      sub: "Desenvolvedor Full Stack especializado em Inteligência Artificial. Construo soluções inovadoras utilizando Machine Learning, IAs Generativas e sistemas automatizados focados em resolver problemas reais.",
    },
    hint: "Continue rolando o mouse",
    bio: {
      label: "Quem Sou",
      title: ["TECNOLOGIA &", "INTELIGÊNCIA", "ARTIFICIAL"],
      p1: <>Sou desenvolvedor Full Stack com forte inclinação para IA e especialista em <Em>automações de sistemas</Em>. Crio arquiteturas escaláveis e integro modelos de <Em>Machine Learning</Em> e <Em>IAs Generativas</Em> para otimizar processos e automatizar fluxos complexos.</>,
      p2: "Da configuração de robôs operacionais ao treinamento de modelos e criação de interfaces intuitivas, conecto dados a soluções tecnológicas autônomas.",
      metrics: [
        { v: "+30k", l: "Registros / Alunos Impactados" },
        { v: "99.5%", l: "Confiabilidade em Pipelines" },
        { v: "+15", l: "Agentes & Fluxos em Produção" },
      ],
      photoAlt: "Foto de Davi Freitas",
    },
    career: { label: "Carreira", title: ["TRAJETÓRIA", "PROFISSIONAL"], note: "2 anos entregando soluções inovadoras." },
    projects: { label: "Projetos", title: ["TRABALHOS", "SELECIONADOS"], note: "Projetos reais, resultados reais.", view: "Ver Projeto", soon: "Em Breve" },
    skills: { label: "Stack", title: ["FERRAMENTAS", "& SKILLS"], note: "Domínio das ferramentas mais relevantes do ecossistema moderno." },
    services: {
      label: "Serviços",
      title: ["SERVIÇOS &", "SOLUÇÕES"],
      note: "Freelance & consultoria para empresas que querem escalar operações com IA e automação.",
      items: [
        { title: "Automação Inteligente de Processos", kicker: "n8n & Workflows", desc: "Integração de CRMs, ERPs, APIs e mensageria (WhatsApp/Telegram), eliminando gargalos operacionais manuais." },
        { title: "Engenharia de Agentes & GenAI", kicker: "LLMs & RAG", desc: "Agentes autônomos para atendimento, triagem, análise documental e assistentes conectados a bases de dados corporativas." },
        { title: "APIs & Microsserviços Escaláveis", kicker: "Python · FastAPI · Docker", desc: "Backends em Python (FastAPI), arquitetura limpa, conteinerização Docker e modelagem de bancos relacionais (PostgreSQL/SQL Server)." },
        { title: "Machine Learning Aplicado ao Negócio", kicker: "Modelos Preditivos", desc: "Modelos preditivos para previsão de churn/evasão, scoring e suporte à tomada de decisão analítica." },
      ],
      processLabel: "Processo",
      steps: [
        { title: "Diagnóstico & Escopo Técnico", desc: "Mapeamento do problema, requisitos e arquitetura da solução." },
        { title: "Desenvolvimento Ágil & Sprints", desc: "Entregas incrementais com validação contínua." },
        { title: "Deploy, Documentação & Handoff", desc: "Produção, documentação técnica e transferência de conhecimento." },
      ],
      cta: "Solicitar Proposta",
      waMsg: "Olá, Davi! Vi seu portfólio e gostaria de solicitar um orçamento/proposta de serviço. Meu projeto é sobre: ",
    },
    contact: {
      label: "Contato",
      title: ["VAMOS", "CONVERSAR?"],
      sub: "Estou sempre aberto a novas oportunidades, colaborações ou apenas para trocar uma ideia.",
      links: ["Explore meus repositórios e open-source.", "Conecte-se comigo profissionalmente.", "Mande uma mensagem direta para mim."],
    },
    footer: { rights: "Todos os direitos reservados", made: "Feito com precisão" },
  },
  en: {
    nav: { bio: "About", trajetoria: "Journey", servicos: "Services", contatos: "Contact", cv: "Download CV" },
    hero: {
      badge: "AI & Full Stack Developer",
      sub: "Full Stack Engineer specialized in Artificial Intelligence. I build production-grade solutions powered by Predictive Machine Learning, Generative AI and Autonomous AI Agents, focused on solving real business problems.",
    },
    hint: "Keep scrolling",
    bio: {
      label: "About",
      title: ["TECHNOLOGY &", "ARTIFICIAL", "INTELLIGENCE"],
      p1: <>I'm a Full Stack Engineer with a strong focus on AI and a specialist in <Em>End-to-End Automation</Em>. I design scalable architectures and integrate <Em>Machine Learning</Em> and <Em>Generative AI</Em> models to streamline operations and automate complex workflows.</>,
      p2: "From operational bots to model training and intuitive interfaces, I turn data into autonomous, production-ready systems.",
      metrics: [
        { v: "+30k", l: "Records / Students Impacted" },
        { v: "99.5%", l: "Pipeline Reliability" },
        { v: "+15", l: "Agents & Workflows in Production" },
      ],
      photoAlt: "Photo of Davi Freitas",
    },
    career: { label: "Career", title: ["PROFESSIONAL", "JOURNEY"], note: "2 years shipping innovative solutions." },
    projects: { label: "Projects", title: ["SELECTED", "WORK"], note: "Real projects, real results.", view: "View Case Study", soon: "Coming Soon" },
    skills: { label: "Stack", title: ["TOOLS", "& SKILLS"], note: "Hands-on command of the most relevant tools in the modern engineering ecosystem." },
    services: {
      label: "Services",
      title: ["SERVICES &", "SOLUTIONS"],
      note: "Freelance & consulting for companies ready to scale operations with AI and automation.",
      items: [
        { title: "Intelligent Process Automation", kicker: "n8n & Workflows", desc: "CRM, ERP, API and messaging integrations (WhatsApp/Telegram) that eliminate manual operational bottlenecks." },
        { title: "AI Agents & GenAI Engineering", kicker: "LLMs & RAG", desc: "Autonomous AI Agents for customer support, triage, document analysis and assistants grounded in corporate knowledge bases." },
        { title: "Scalable APIs & Microservices", kicker: "Python · FastAPI · Docker", desc: "Python (FastAPI) backends, clean architecture, Docker containerization and relational data modeling (PostgreSQL/SQL Server)." },
        { title: "Applied Machine Learning", kicker: "Predictive Models", desc: "Predictive Machine Learning for churn/dropout forecasting, scoring and data-driven decision support." },
      ],
      processLabel: "Process",
      steps: [
        { title: "Discovery & Technical Scoping", desc: "Problem mapping, requirements and solution architecture." },
        { title: "Agile Development & Sprints", desc: "Incremental delivery with continuous validation." },
        { title: "Deploy, Documentation & Handoff", desc: "Production release, technical docs and knowledge transfer." },
      ],
      cta: "Request a Proposal",
      waMsg: "Hi Davi! I came across your portfolio and would like to request a quote/proposal. My project is about: ",
    },
    contact: {
      label: "Contact",
      title: ["GET IN", "TOUCH"],
      sub: "Always open to new opportunities, collaborations or simply a good conversation about technology.",
      links: ["Explore my repositories and open-source work.", "Connect with me professionally.", "Send me a direct message."],
    },
    footer: { rights: "All rights reserved", made: "Crafted with precision" },
  },
};

const LangContext = createContext({ lang: "pt", setLang: () => {}, t: I18N.pt });
const useLang = () => useContext(LangContext);
// Resolve campos bilíngues ({ pt, en }) dos arrays de dados; strings simples passam direto.
const tr = (v, lang) => (v && typeof v === "object" && "pt" in v ? v[lang] : v);

/**
 * Componente: SDivider (Divisor de Seção)
 * O que faz: Desenha e anima a linha horizontal dourada e fina que aparece entre algumas áreas.
 */
const SDivider = ({ delay = 0 }) => (
  <div style={{ padding: "0 48px", overflow: "hidden" }}>
    <div className="sdiv" style={{ animationDelay: delay + "s" }} />
  </div>
);

/**
 * Componente: SecLabel (Etiqueta de Seção)
 * O que faz: Título pequeno formatado (Ex: "03 ---- PROJETOS") usado no topo das seções.
 */
const SecLabel = ({ num, label }) => (
  <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:36 }}>
    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:"0.4em", color:T.gold, textTransform:"uppercase" }}>{num}</span>
    <div style={{ width:40, height:"1px", background:`linear-gradient(to right,${T.goldD},transparent)` }} />
    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:"0.4em", color:T.muted, textTransform:"uppercase" }}>{label}</span>
  </div>
);

/**
 * Componente: GoldParticles
 * O que faz: Gera bolinhas douradas animadas que sobem na tela, usadas como efeito de faísca visual.
 */
function GoldParticles({ active }) {
  if (!active) return null;
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
      {[0,1,2,3,4,5,6].map(i => (
        <div key={i} style={{ position:"absolute", bottom:"25%", left:(12+i*12)+"%", width:2+(i%3), height:2+(i%3), borderRadius:"50%", background:T.gold, animation:`particleFly 2s ${i*.13}s ease-out infinite` }} />
      ))}
    </div>
  );
}

/* ══ NAV ══════════════════════════════════════════════════════ */
/**
 * Componente: Nav (Menu de Navegação Principal)
 * O que faz: Fica sempre presa no topo (sticky). Rastreia o scroll para aplicar o fundo translúcido (efeito de vidro rolando para baixo) 
 * e calcula milimetricamente em que parte do site matemático ("p") você está lendo para manter a palavra (Ex: Trajetória) sublinhada em ouro.
 */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const { scrollToSection } = useSmoothNav();
  const nb = useNotebook();
  const { lang, setLang, t } = useLang();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      
      const bio = document.getElementById("bio");
      if (!bio) return;

      const rect = bio.getBoundingClientRect();
      const bH = bio.offsetHeight - window.innerHeight;

      // Se estamos acima da seção 'bio'
      if (rect.top > window.innerHeight / 2) {
        setActive("hero");
        return;
      }

      // Calcula o exato progresso da rolagem baseado no topo da Bio
      let p = bH > 0 ? -rect.top / bH : 0;
      if (p < 0) p = 0;
      if (p > 1) p = 1;
      
      if (p < STAGES.carreira + 0.04) setActive("bio");
      else if (p < STAGES.servicos + 0.04) setActive("trajetoria");
      else if (p < STAGES.contatos + 0.04) setActive("servicos");
      else setActive("contatos");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Roda uma vez pra garantir caso a tela já começe rolada
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const go = (id) => {
    scrollToSection(id);
  };

  const links = ["bio", "trajetoria", "servicos", "contatos"].map(id => ({ id, label: t.nav[id] }));

  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, padding: nb ? "14px 28px" : "16px 48px", display:"flex", justifyContent:"space-between", alignItems:"center", background:scrolled?`${T.dark}f2`:"transparent", backdropFilter:scrolled?"blur(20px)":"none", borderBottom:`1px solid ${scrolled?T.border:"transparent"}`, transition:"all .5s" }}>
      <button data-h onClick={() => go("hero")} style={{ background:"none", border:"none", cursor:"none", fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:"0.15em" }}>
        <span className="gold-text">Davi</span><span style={{ color:T.white }}>Freitas</span>
      </button>
      <div style={{ display:"flex", gap: nb ? 20 : 32, alignItems:"center" }}>
        {links.map(l => (
          <button key={l.id} data-h onClick={() => go(l.id)} style={{ background:"none", border:"none", cursor:"none", fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:"0.25em", textTransform:"uppercase", color:active===l.id?T.gold:T.muted, transition:"color .3s", position:"relative", padding:"4px 0" }}>
            {l.label}
            <span style={{ position:"absolute", bottom:0, left:0, right:0, height:"1px", background:T.gold, transformOrigin:"left", transform:active===l.id?"scaleX(1)":"scaleX(0)", transition:"transform .4s cubic-bezier(.77,0,.18,1)" }} />
          </button>
        ))}
        <div style={{ width:1, height:18, background:T.border2 }} />
        <div className="lang-sw" role="group" aria-label="Idioma / Language">
          {["pt", "en"].map((code, i) => (
            <span key={code} style={{ display:"inline-flex", alignItems:"center", gap:8 }}>
              {i > 0 && <span style={{ width:1, height:10, background:T.border2 }} />}
              <button data-h className={`lang-btn${lang === code ? " sel" : ""}`} onClick={() => setLang(code)} aria-pressed={lang === code}>
                {code.toUpperCase()}
              </button>
            </span>
          ))}
        </div>
        <a
          data-h
          className="nav-cv"
          href={CV_URLS[lang] || CV_URLS.pt}
          download={lang === "en" ? "Resume_Davi_Freitas_EN.pdf" : "Curriculo_Davi_Freitas.pdf"}
          target="_blank"
          rel="noreferrer"
        >
          <DownloadIcon size={12} color="currentColor" strokeWidth="2" />
          {t.nav.cv}
        </a>
      </div>
    </nav>
  );
}

/* ══ HERO ═════════════════════════════════════════════════════ */
/**
 * Componente: Hero (Apresentação Inicial)
 * O que faz: É aquela primeira tela enorme de entrada quando o site carrega.
 * Nela estão os títulos gigantes, seu nome, a contagem do "100" que sobe rapidinho e as partículas de luxo.
 * Ela vai sumindo devagarinho pra cima quando você rola o botão.
 */
function Hero() {
  const [ref, vis] = useInView(0.01);
  const count = useCounter(100, vis, 2200);
  const [mp, setMp] = useState({ x: 0.5, y: 0.5 });
  const [p, setP] = useState(0);
  const nb = useNotebook();
  const { t: tx } = useLang();

  useEffect(() => {
    const fn = (e) => setMp({ x: e.clientX/window.innerWidth, y: e.clientY/window.innerHeight });
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  useEffect(() => {
    let af;
    const current = { p: 0 };
    const target = { p: 0 };
    const loop = () => {
      current.p += (target.p - current.p) * 0.08;
      if (Math.abs(target.p - current.p) > 0.001) {
        setP(current.p);
      }
      af = requestAnimationFrame(loop);
    };
    af = requestAnimationFrame(loop);

    const onScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      let progress = scrollY / (vh * 2.0); // Aumentou a área de interatividade do Hero
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;
      target.p = progress;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(af); };
  }, []);

  const t = Math.min(p / 0.8, 1); // Hero finishes animating slightly before section end
  const e = t * t * t; // Curva suavizada

  const mag = (dx, dy, s=16) => ({
    transform:`translate(${(mp.x-.5)*dx*s}px,${(mp.y-.5)*dy*s}px)`,
    transition:"transform .9s cubic-bezier(.16,1,.3,1)"
  });

  return (
    <div id="hero" ref={ref} style={{ height: "300vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: nb ? "72px 32px 64px" : "120px 48px 100px", background: T.black }}>
        
        <div style={{ position:"absolute", inset:"-20%", backgroundImage:`linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`, backgroundSize:"80px 80px", opacity:.28, transform: `translateY(${e * 800}px)` }} />
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 52% 62% at ${mp.x*100}% ${mp.y*100}%,${T.goldD}26 0%,transparent 65%)`, transition:"background .7s ease", pointerEvents:"none", opacity: Math.max(0, 1 - t*2) }} />

        {/* número decorativo */}
        <div style={{ position:"absolute", right:-20, top:"50%", transform: `translate(${e*1500}px, ${-e*800}px) rotate(${e*45}deg)`, opacity: Math.max(0, 1 - t*1.5), zIndex: 0 }}>
          <div style={{ ...mag(1,.5,10), fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(180px,32vw,400px)", lineHeight:1, color:T.border, userSelect:"none", pointerEvents:"none", letterSpacing:"-0.04em", opacity:vis?1:0, transition:"opacity 1.1s .3s, transform .9s cubic-bezier(.16,1,.3,1)" }}>
            {String(count).padStart(3,"0")}
          </div>
        </div>

        <div style={{ position:"absolute", top:"22%", right:"28%", transform: `translate(${-e*1200}px, ${-e*900}px)`, opacity: Math.max(0, .5 - t) }}>
          <Diamond size={6} color={T.goldD} style={{ animation:"float 4.2s ease-in-out infinite" }} />
        </div>
        <div style={{ position:"absolute", top:"64%", right:"19%", transform: `translate(${e*1400}px, ${e*800}px)`, opacity: Math.max(0, .35 - t) }}>
          <Diamond size={4} color={T.goldD} style={{ animation:"float 5.5s ease-in-out infinite .9s" }} />
        </div>

        <div style={{ position:"relative", maxWidth:960, zIndex: 10, pointerEvents: t > 0.5 ? "none" : "auto" }}>
          
          <div style={{ transform: `translate(${-e * 1000}px, ${-e * 400}px)`, opacity: Math.max(0, 1 - t*1.8) }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:12, border:`1px solid ${T.border}`, padding:"8px 18px", marginBottom:36, background:`${T.goldXD}28`, opacity:vis?1:0, transition:"opacity .6s .15s" }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:T.gold, animation:"goldPulse 2.2s infinite" }} />
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:"0.4em", color:T.gold, textTransform:"uppercase" }}>{tx.hero.badge}</span>
            </div>
          </div>

          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(72px,13vw,156px)", lineHeight:.88, letterSpacing:"0.02em" }}>
            {[{t:"INTELLIGENT",g:false,d:".28s"},{t:"SYSTEMS",g:true,d:".48s"},{t:"ENGINEERING",g:false,d:".68s"}].map(({t,g,d}, i) => (
              <div key={t} style={{ overflow:"hidden" }}>
                <div style={{ transform: `translate(${-e * (1200 + i*400)}px, ${-e * (200 + i*150)}px) rotate(${-e * (i * 3)}deg)`, opacity: Math.max(0, 1 - t*1.2) }}>
                  <div style={{ opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(80px)", transition:`opacity .85s ${d} cubic-bezier(.16,1,.3,1),transform .85s ${d} cubic-bezier(.16,1,.3,1)` }}>
                    {g ? <span className="gold-text">{t}</span> : <span style={{color:T.white}}>{t}</span>}
                  </div>
                </div>
              </div>
            ))}
          </h1>

          <div style={{ transform: `translate(${e * 1200}px, ${e * 300}px)`, opacity: Math.max(0, 1 - t*1.5) }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(17px,2vw,22px)", fontWeight:300, fontStyle:"italic", color:T.cream, lineHeight:1.8, maxWidth:500, marginTop:36, marginBottom:52, opacity:vis?1:0, transition:"opacity .8s 1.05s" }}>
              {tx.hero.sub}
            </p>
          </div>
        </div>

        {/* ticker */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, borderTop:`1px solid ${T.border}`, overflow:"hidden", background:`${T.dark}cc`, padding:"11px 0", transform: `translateY(${e * 500}px)`, opacity: Math.max(0, 1 - t*2) }}>
          <div style={{ display:"flex", animation:"ticker 36s linear infinite", width:"max-content" }}>
            {Array(2).fill(["Python","TensorFlow","Pandas","PyTorch","Random Forest","OpenAI","RAG","React","Node.js","N8N","SQL Server","LLMs","Machine Learning","Generative AI","Docker","AWS","PostgreSQL"]).flat().map((t,i)=>(
              <span key={i} style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.28em", textTransform:"uppercase", color:(t === "N8N" || (i%5===0 && t !== "Node.js" && t !== "SQL Server")) ? T.gold : T.muted, padding:"0 24px" }}>
                {t}{i%6===5 ? <Diamond size={5} color={T.goldD} style={{ display:"inline-block", marginLeft:10, verticalAlign:"middle" }} /> : " ·"}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ SOBRE (painel esquerdo do slider) ════════════════════════ */

/**
 * Componente: MetricCard (Cardzinho de Métrica)
 * O que faz: Aqueles quadradinhos de status que mostram números. (Ex: "3 - Trabalhos"). Brilham quando você passa o mouse.
 */
function MetricCard({ v, l, last }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ padding:"24px 16px", textAlign:"center", borderRight:last?"none":`1px solid ${T.border}`, background:hov?`${T.goldD}18`:T.card, transition:"background .4s" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div className="gold-text" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:36, lineHeight:1 }}>{v}</div>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.2em", lineHeight:1.6, color:T.muted, textTransform:"uppercase", marginTop:8 }}>{l}</div>
    </div>
  );
}

/**
 * Componente: PanelSobre (Sua biografia visual)
 * O que faz: É a primeira parada do seu "túnel" de scroll. Aqui ficam as suas fotos e vídeos rodando em loop do lado esquerdo, e o texto de "Quem Sou eu" no lado direito,
 * Ele some flutuando suavemente pra cima/esquerda pra dar lugar a seção da "Carreira".
 * @param {number} p - O pulso de rolagem (de 0 a 1) passado pelo motorzão do "BioSection".
 */
function PanelSobre({ p }) {
  const nb = useNotebook();
  const imgRef = useParallax(0.08);
  const { t: tx } = useLang();
  const mediaItems = MEDIA_ITEMS;
  const [currentPhoto, setCurrentPhoto] = useState(0);

  const containerRef = useRef(null);
  
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    // Função para rodar no evento wheel
    const handleWheelNative = (e) => {
      // Impede a rolagem padrão da página (scroll)
      e.preventDefault(); 
      e.stopPropagation();

      // Roda a lógica de mudar a imagem
      if (e.deltaY > 0) {
        setCurrentPhoto(prev => (prev === mediaItems.length - 1 ? 0 : prev + 1));
      } else if (e.deltaY < 0) {
        setCurrentPhoto(prev => (prev === 0 ? mediaItems.length - 1 : prev - 1));
      }
    };
    
    // Precisamos de passive: false para o preventDefault funcionar sem erro do browser
    el.addEventListener('wheel', handleWheelNative, { passive: false });
    
    return () => {
      el.removeEventListener('wheel', handleWheelNative);
    };
  }, [mediaItems.length]);

  const t = stageT(p, STAGES.carreira);
  const e = t * t;
  const isGone = p > STAGES.carreira + 0.16;

  return (
    <div style={{ position: "absolute", inset: 0, background: T.black, display:"flex", alignItems:"center", justifyContent:"center", padding: nb ? "60px 24px" : "100px 40px", pointerEvents: isGone ? "none" : "auto", zIndex: isGone ? 0 : 10 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.15fr", gap: nb ? 64 : 120, alignItems:"center", maxWidth:1440, width:"100%", margin:"auto" }}>

        {/* foto: voa pra esquerda e pra baixo fugindo e rotacionando */}
        <div style={{ transform: `translate(${-e * 400}px, ${e * 200}px) rotate(${-e * 10}deg) scale(${1 - e * 0.1})`, opacity: Math.max(0, 1 - t*1.5) }}>
          <SecLabel num="01" label={tx.bio.label} />
          <div style={{ width:"100%", paddingBottom:"128%", position:"relative", overflow:"hidden", border:`1px solid ${T.border}` }}>
            <div ref={imgRef} style={{ position:"absolute", inset:"-10%", background:T.card }}>
              <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${T.border2} 1px,transparent 1px),linear-gradient(90deg,${T.border2} 1px,transparent 1px)`, backgroundSize:"28px 28px", opacity:.7 }} />
              <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 65% 65% at 50% 65%,${T.goldD}35,transparent)` }} />
              <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}>
                
                <div 
                  ref={containerRef}
                  style={{ width: nb ? 340 : 480, height: nb ? 340 : 480, position:'relative', marginBottom:36, zIndex: 2 }}
                >
                  {mediaItems.map((media, i) => {
                    const dist = i - currentPhoto;
                    let normDist = dist;
                    // Essa lógica faz com que o carrossel seja infinito calculando as pontas
                    if (Math.abs(dist) > Math.floor(mediaItems.length / 2)) {
                      normDist = dist > 0 ? dist - mediaItems.length : dist + mediaItems.length;
                    }

                    let offset = normDist * (nb ? 200 : 280); // Quanto desliza pro lado
                    let sc = 1 - Math.abs(normDist) * 0.25; // cria profundidade encolhendo os lados
                    let op = 1 - Math.abs(normDist) * 0.7; // opacidade para clarear os lados
                    let zi = 10 - Math.abs(normDist);
                    if (op < 0) op = 0;

                    const isCurrent = normDist === 0;

                    const mediaStyle = { 
                      width: '100%', 
                      height: '100%', 
                      objectFit: "cover", 
                      border: `3px solid ${isCurrent ? T.gold : T.border2}`, 
                      borderRadius: "12px", 
                      boxShadow: isCurrent ? `0 4px 32px ${T.goldD}55` : 'none',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      opacity: op,
                      transform: `translateX(${offset}px) scale(${sc})`,
                      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      pointerEvents: isCurrent ? 'auto' : 'none',
                      zIndex: zi
                    };

                    return media.type === 'video' ? (
                      <video 
                        key={i}
                        src={media.src} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        style={mediaStyle} 
                      />
                    ) : (
                      <img 
                        key={i}
                        src={media.src} 
                        alt={tx.bio.photoAlt}
                        style={mediaStyle} 
                      />
                    );
                  })}
                  
                  {/* Indicadores do carrossel */}
                  <div style={{ position:'absolute', bottom:-18, left:'50%', transform:'translateX(-50%)', display:'flex', gap:6 }}>
                    {mediaItems.map((_, i) => (
                      <div 
                        key={i} 
                        onClick={() => setCurrentPhoto(i)}
                        style={{ 
                          width: currentPhoto === i ? 16 : 6, 
                          height: 6, 
                          borderRadius: 3, 
                          background: currentPhoto === i ? T.gold : T.muted,
                          transition: 'all 0.3s ease',
                          cursor: 'none' 
                        }} 
                      />
                    ))}
                  </div>
                </div>

                <span className="gold-text" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize: nb ? 76 : 104, lineHeight:1, letterSpacing:".08em" }}>Davi Freitas</span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, letterSpacing:"0.4em", color:T.muted, textTransform:"uppercase" }}>davizinhoow</span>
              </div>
              {[{top:14,left:14},{top:14,right:14},{bottom:14,left:14},{bottom:14,right:14}].map((s,i)=>(
                <div key={i} style={{ position:"absolute", width:22, height:22, ...s, borderTop:i<2?`1px solid ${T.goldD}`:"none", borderBottom:i>=2?`1px solid ${T.goldD}`:"none", borderLeft:i%2===0?`1px solid ${T.goldD}`:"none", borderRight:i%2===1?`1px solid ${T.goldD}`:"none" }} />
              ))}
            </div>
          </div>
        </div>

        {/* texto: voam pela direita se dispersando */}
        <div style={{ display:"flex", flexDirection:"column" }}>
          <div style={{ transform: `translate(${e * 400}px, ${-e * 50}px)`, opacity: Math.max(0, 1 - t*1.2) }}>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(52px,7vw,100px)", lineHeight:.9, color:T.white, marginBottom:32 }}>
              {tx.bio.title[0]}<br /><span className="gold-text">{tx.bio.title[1]}</span><br />{tx.bio.title[2]}
            </h2>
          </div>
          <div style={{ transform: `translate(${e * 500}px, ${e * 20}px)`, opacity: Math.max(0, 1 - t*1.4) }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:23, fontWeight:300, lineHeight:1.8, color:T.cream, marginBottom:22 }}>
              {tx.bio.p1}
            </p>
          </div>
          <div style={{ transform: `translate(${e * 600}px, ${e * 60}px)`, opacity: Math.max(0, 1 - t*1.6) }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:21, fontWeight:300, fontStyle:"italic", color:T.muted, lineHeight:1.75 }}>
              {tx.bio.p2}
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, marginTop:56, border:`1px solid ${T.border}`, transform: `translate(${e * 700}px, ${e * 100}px)`, opacity: Math.max(0, 1 - t*1.8) }}>
            {tx.bio.metrics.map((m,i)=>(
              <MetricCard key={i} v={m.v} l={m.l} last={i===2} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ CARREIRA (painel direito do slider) ══════════════════════ */
const CAREER = [
  {
    year: "2026",
    role: "AI & Software Engineer",
    company: "UNIANCHIETA",
    type: { pt: "Engenharia", en: "Engineering" },
    desc: {
      pt: "Desenvolvimento de modelos preditivos com Machine Learning para retenção e análise preditiva, automação de pipelines de dados em larga escala (Python/n8n) e arquitetura de agentes autônomos integrados a sistemas corporativos.",
      en: "Development of Predictive Machine Learning models for retention and predictive analytics, large-scale data pipeline automation (Python/n8n) and architecture of Autonomous AI Agents integrated with enterprise systems.",
    },
    tags: ["Python", "Machine Learning", "FastAPI", "N8N", "PostgreSQL", "React"]
  },
  {
    year: "2025",
    role: "Software & Automation Developer",
    company: "UNIANCHIETA",
    type: { pt: "Desenvolvimento", en: "Development" },
    desc: {
      pt: "Engenharia de integrações e automação de processos corporativos. Modelagem e otimização de dados relacionais em SQL Server, desenvolvimento de serviços web e APIs para fluxos institucionais.",
      en: "Integration engineering and enterprise process automation. Relational data modeling and optimization on SQL Server, plus web services and APIs powering institutional workflows.",
    },
    tags: ["SQL Server", "Python", "APIs", "JavaScript", "Integrações"]
  },
];

/**
 * Componente: CareerItem (Item da Carreira)
 * O que faz: Desenha e anima cada "degrau" da sua experiência de trabalho (Estágios, empresas, etc.).
 * @param {object} item - Os dados do trabalho (ano, descrição).
 * @param {number} animP - Animação de Entrada.
 * @param {number} leaveP - Animação de Saída.
 */
function CareerItem({ item, index, animP, leaveP = 0 }) {
  const [hov, setHov] = useState(false);
  const { lang } = useLang();
  
  // animP vai de 0 pra 1 conforme vai chegando na tela
  const offset = (1 - animP) * (150 + index * 120); // Vem de baixo pra cima em escadinha
  
  // Foge pros lados e pra cima/baixo
  const flyX = leaveP * (300 + index * 100) * (index % 2 === 0 ? -1 : 1);
  const flyY = leaveP * (200 + index * 80) * -1;
  const rotate = leaveP * (10 + index * 5) * (index % 2 === 0 ? -1 : 1);

  const op = Math.max(0, animP * 1.5 - (index * 0.2)) * Math.max(0, 1 - leaveP * 1.5);

  return (
    <div
      style={{ display:"grid", gridTemplateColumns:"80px 1fr", borderBottom:`1px solid ${T.border}`, position:"relative", transform:`translate(${flyX}px, ${offset + flyY}px) rotate(${rotate}deg)`, opacity: Math.min(1, op) }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:2, background:`linear-gradient(to bottom,transparent,${T.gold},transparent)`, opacity:hov?1:0, transition:"opacity .4s" }} />
      <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(to right,${T.gold},transparent)`, opacity:hov?.5:0, transition:"opacity .4s" }} />

      <div style={{ padding:"28px 0 28px 14px", borderRight:`1px solid ${hov?T.goldD:T.border}`, transition:"border-color .3s", display:"flex", alignItems:"flex-start" }}>
        <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:34, lineHeight:1, color:hov?T.gold:T.muted, transition:"color .3s" }}>{item.year}</span>
      </div>

      <div style={{ padding:"28px 0 28px 32px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:6, gap:12 }}>
          <div>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:700, color:hov?T.goldL:T.white, transition:"color .3s", marginBottom:3 }}>{item.role}</h3>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.2em", color:T.gold, textTransform:"uppercase" }}>{item.company}</span>
          </div>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:T.muted, border:`1px solid ${T.border}`, padding:"3px 8px", textTransform:"uppercase", flexShrink:0 }}>{tr(item.type, lang)}</span>
        </div>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:300, color:T.muted, lineHeight:1.65, marginBottom:12 }}>{tr(item.desc, lang)}</p>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {item.tags.map(t => (
            <span key={t} style={{ fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:"0.12em", textTransform:"uppercase", color:hov?T.gold:T.muted, border:`1px solid ${hov?T.goldD:T.border}`, padding:"2px 8px", transition:"all .3s" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Componente: PanelCarreira (Painel Trajetória Profissional)
 * O que faz: É o painel escuro no centro que desce sobre o "Sobre" com a lista do histórico de trabalho.
 * @param {number} p - O pulso progressivo geral (0 a 1) vindo do contêiner mestre BioSection.
 */
function PanelCarreira({ p }) {
  const nb = useNotebook();
  const { t: tx } = useLang();
  // LÓGICA DE TEMPO:
  // stageT confina os valores sempre em escalas seguras de 0 a 1.
  // (p - X) descobre quanto já desceu além do marco X. (/ STAGE_DUR) define a lentidão deste processo.
  const enterT = stageT(p, STAGES.carreira); // Entra no marco da carreira
  const leaveT = stageT(p, STAGES.projetos); // Sai quando os projetos entram
  
  const eIn = enterT * enterT; 
  const eOut = leaveT * leaveT * leaveT; // Curva suavizada

  return (
    <div style={{ position: "absolute", inset: 0, background: T.dark, display:"flex", alignItems:"center", justifyContent:"center", padding: nb ? "60px 24px" : "100px 40px", pointerEvents: enterT > 0 && leaveT < 1 ? "auto" : "none", opacity: eIn > 0 ? 1 : 0, clipPath: `circle(${eIn * 150}% at 50% 50%)`, zIndex: 20 }}>
      {/* Se quiser permitir scroll interno desse box enquanto rola a página não rola, mas em tela cheia cabe assim. O wrap tem auto. */}
      <div style={{ maxWidth:860, width:"100%", margin:"auto" }}>
        
        {/* Header da carreira desce teto e foge pela esquerda rotacionando */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:52, flexWrap:"wrap", gap:16, transform:`translate(${-eOut * 200}px, ${(1 - eIn) * -100 - eOut * 100}px) rotate(${-eOut * 15}deg)`, opacity: eIn * Math.max(0, 1 - eOut * 1.5) }}>
          <div>
            <SecLabel num="02" label={tx.career.label} />
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(44px,6vw,76px)", lineHeight:.9, color:T.white }}>
              {tx.career.title[0]}<br /><span className="gold-text">{tx.career.title[1]}</span>
            </h2>
          </div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontStyle:"italic", color:T.muted, maxWidth:180, lineHeight:1.7 }}>
            {tx.career.note}
          </p>
        </div>

        <div style={{ borderTop:`1px solid ${T.border}` }}>
          {CAREER.map((item, i) => <CareerItem key={i} item={item} index={i} animP={eIn} leaveP={eOut} />)}
        </div>
      </div>
    </div>
  );
}

/* ══ PROJETOS ════════════════════════════════════════════════ */
// Array com os dados dos seus trabalhos. Cada item vai virar um ProjectCard.
const PROJECTS = [
  {
    num: "001",
    title: "Kerdos Finance — Intelligent Wealth & Advisory SaaS",
    category: "Co-Founder & Lead Architect",
    badge: "Flagship SaaS",
    year: "2025 / 2026",
    desc: {
      pt: "Co-fundador e arquiteto de software da plataforma SaaS de inteligência financeira e investimentos. Arquitetura orientada a microsserviços integrando uma tríade de agentes de IA: Voithos (NLP para finanças e transações), Argos (inteligência patrimonial e dashboards 360°) e Plutos (advisory prudente e educação financeira com conformidade estrita CVM).",
      en: "Co-founder and software architect of a financial intelligence and wealth management SaaS. Microservices architecture orchestrating a triad of AI agents: Voithos (NLP for finance and transactions), Argos (wealth intelligence and 360° dashboards) and Plutos (prudent advisory and financial education under strict CVM compliance).",
    },
    tags: ["FastAPI", "PostgreSQL", "Multi-Agentes", "Docker", "Python", "Fintech"],
    large: true,
    link: "#",
    status: "Private Alpha"
  },
  {
    num: "002",
    title: "Automatic Prediction of Academic Dropout",
    category: "Machine Learning",
    year: "2025 / 2026",
    desc: {
      pt: "Pipeline preditivo de Machine Learning para detecção precoce de risco de evasão acadêmica e churn estudantil. Modelagem estatística, engenharia de features e integração com rotinas de intervenção preventiva.",
      en: "Predictive Machine Learning pipeline for early detection of academic dropout risk and student churn. Statistical modeling, feature engineering and integration with preventive intervention workflows.",
    },
    tags: ["Python", "Scikit-Learn", "Pandas", "SQL Server", "Random Forest"],
    large: false,
    link: "https://github.com/davizinhoow/MachineLearning-Evasao-Alunos"
  },
  {
    num: "003",
    title: "Document Processing System with AI",
    category: "AI & Automation",
    year: "2025 / 2026",
    desc: {
      pt: "Ecossistema de multi-agentes e visão computacional para leitura, validação e extração estruturada de dados de documentos institucionais, eliminando fluxos manuais de conferência.",
      en: "Multi-agent and computer vision ecosystem for reading, validating and extracting structured data from institutional documents, eliminating manual review workflows.",
    },
    tags: ["Python", "LLMs", "OCR", "SQL Server", "FastAPI"],
    large: false,
    link: "https://github.com/davizinhoow/IntegracoesIA"
  },
  {
    num: "004",
    title: "Automated Landing Page Generation System",
    category: "FullStack & AI",
    year: "2026",
    desc: {
      pt: "Sistema end-to-end para geração e deploy automatizado de landing pages de alta conversão. Orquestração completa de esteira no n8n integrada a modelos de IA generativa e publicação automatizada.",
      en: "End-to-end system for automated generation and deployment of high-conversion landing pages. Full n8n pipeline orchestration integrated with Generative AI models and automated publishing.",
    },
    tags: ["N8N", "React", "Next.js", "Gemini", "Webhooks"],
    large: true,
    link: "https://github.com/davizinhoow/Automated-LP-creation-with-deployment"
  },
];

/**
 * Componente: ProjectCard (Caixa de Projeto)
 * O que faz: É a caixinha individual brilhosa de cada projeto no portfolio. Ele tem uma matemática específica para "voar" e sumir dependendo se é par ou ímpar.
 */
function ProjectCard({ p, idx, animP = 1, leaveP = 0 }) {
  const [hov, setHov] = useState(false);
  const { lang, t: tx } = useLang();
  
  // Animação de entrada e saída vinculada ao scroll
  const t = Math.max(0, animP);
  const l = Math.max(0, leaveP);
  
  const opacity = Math.max(0, t * 1.5 - (idx * 0.2)) * Math.max(0, 1 - l * 1.5);
  
  // Entrada vem de baixo (Y). Saída vai para a esquerda (X) com um pouco de rotação
  const inY = (1 - t) * (48 + idx * 20);
  const outX = -l * (400 + idx * 150);
  const outY = l * (50 + idx * 30) * (idx % 2 === 0 ? 1 : -1);
  const rotate = -l * (8 + idx * 4);
  
  const transform = `translate(${outX}px, ${inY + outY}px) rotate(${rotate}deg)`;

  return (
    <div data-h 
      onMouseEnter={()=>setHov(true)} 
      onMouseLeave={()=>setHov(false)}
      onClick={() => { if(p.link && p.link !== "#") window.open(p.link, "_blank"); }}
      style={{ gridColumn:p.large?"span 2":"span 1", padding:p.large?"52px":"40px", border:`1px solid ${hov?T.gold:T.border}`, background:hov?`${T.goldD}0e`:T.card, cursor:p.link && p.link !== "#"?"pointer":"default", position:"relative", overflow:"hidden", transition:"border-color .4s,background .4s", opacity, transform }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${hov?T.gold:T.goldD}55,transparent)`, transformOrigin:"left", transform:hov?"scaleX(1)":"scaleX(.3)", transition:"transform .55s" }} />
      <div style={{ position:"absolute", inset:0, opacity:hov?1:0, background:`radial-gradient(ellipse 60% 60% at 25% 40%,${T.goldD}10,transparent)`, transition:"opacity .6s", pointerEvents:"none" }} />
      <GoldParticles active={hov} />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22, position:"relative" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:"0.2em", color:T.goldD }}>{p.num}</span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.2em", color:T.muted, textTransform:"uppercase", border:`1px solid ${T.border}`, padding:"3px 10px" }}>{p.category}</span>
          {p.badge && (
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:"0.18em", color:T.gold, background:`${T.goldXD}66`, border:`1px solid ${T.goldD}`, padding:"3px 8px", textTransform:"uppercase" }}>
              {p.badge}
            </span>
          )}
        </div>
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:T.muted }}>{p.year}</span>
      </div>
      <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:p.large?"clamp(36px,5vw,62px)":"clamp(28px,3.5vw,44px)", lineHeight:.9, color:hov?T.goldL:T.white, marginBottom:16, transition:"color .35s", position:"relative" }}>{p.title}</h3>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:300, color:T.muted, lineHeight:1.7, marginBottom:28, maxWidth:p.large?580:"100%", position:"relative" }}>{tr(p.desc, lang)}</p>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", position:"relative" }}>
        <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
          {p.tags.map(t=><span key={t} style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:hov?T.gold:T.muted, border:`1px solid ${hov?T.goldD:T.border}`, padding:"4px 12px", transition:"all .3s" }}>{t}</span>)}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, opacity:hov?1:0, transform:hov?"translate(0,0)":"translate(-12px,8px)", transition:"all .4s" }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:T.gold }}>
            {p.link && p.link !== "#" ? tx.projects.view : (p.status || tx.projects.soon)}
          </span>
          {p.link && p.link !== "#" ? (
            <ArrowExternalIcon size={11} color={T.gold} />
          ) : (
            <LockIcon size={11} color={T.gold} />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Componente: PanelProjetos (Galeria de Trabalhos)
 * O que faz: É a listagem de cards dos seus trabalhos. Ela brota feito um círculo crescendo do centro quando o scroll chega nos ~52%.
 * @param {number} p - Progresso da página ('porcentagem' do scroll que define o andamento das animações).
 */
function PanelProjetos({ p }) {
  const nb = useNotebook();
  const { t: tx } = useLang();
  // LÓGICA DE TEMPO IDÊNTICA
  const enterT = stageT(p, STAGES.projetos);
  const leaveT = stageT(p, STAGES.skills);

  const eIn = enterT * enterT * enterT; 
  const eOut = leaveT * leaveT * leaveT; // Curva bezier para animar saída mais dramática

  return (
    <div style={{ position: "absolute", inset: 0, background: T.black, padding: nb ? "60px 32px" : "100px 48px", overflowY: "auto", pointerEvents: enterT > 0.5 && leaveT < 0.5 ? "auto" : "none", opacity: eIn > 0 ? 1 : 0, clipPath: `circle(${eIn * 150}% at 50% 100%)`, zIndex: 30, display:"flex", alignItems:"center" }}>
      <div style={{ maxWidth:1200, width:"100%", margin:"auto" }}>
        
        {/* Título foge também pra esquerda na saída */}
        <div className="projetos-title" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:60, flexWrap:"wrap", gap:24, transform:`translate(${-eOut * 300}px, 0) rotate(${-eOut * 6}deg)`, opacity: Math.max(0, 1 - eOut * 1.5) }}>
          <div>
            <SecLabel num="03" label={tx.projects.label} />
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(48px,7vw,80px)", lineHeight:.9, color:T.white, transform:`translateY(${(1 - eIn) * 30}px)` }}>
              {tx.projects.title[0]}<br /><span className="gold-text">{tx.projects.title[1]}</span>
            </h2>
          </div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontStyle:"italic", color:T.muted, maxWidth:200, lineHeight:1.7, opacity: enterT * Math.max(0, 1 - eOut) }}>{tx.projects.note}</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:2 }}>
          {PROJECTS.map((proj,i) => <ProjectCard key={i} p={proj} idx={i} animP={eIn} leaveP={eOut} />)}
        </div>
      </div>
    </div>
  );
}

/* ══ SERVIÇOS & SOLUÇÕES (Freelance & Consultoria) ══════════════════════════════ */
// Tags técnicas de cada frente (não traduzidas). Títulos e descrições ficam no I18N.
const SERVICE_TAGS = [
  ["n8n", "Webhooks", "CRM / ERP", "WhatsApp"],
  ["LLMs", "RAG", "LangChain", "Agno"],
  ["FastAPI", "Docker", "PostgreSQL", "SQL Server"],
  ["Scikit-Learn", "Pandas", "Churn", "Scoring"],
];

/**
 * Componente: ServiceCard (Frente de Atuação)
 * O que faz: Card de cada serviço, no mesmo padrão dos projetos (borda dourada e partículas no hover).
 * Entra de baixo em escadinha e, na saída, os dois primeiros fogem pra esquerda e os dois últimos pra direita.
 */
function ServiceCard({ s, tags, idx, animP, leaveP }) {
  const [hov, setHov] = useState(false);
  const nb = useNotebook();
  const Icon = SERVICE_ICONS[idx];

  const dir = idx < 2 ? -1 : 1;
  const opacity = Math.max(0, animP * 1.5 - idx * 0.15) * Math.max(0, 1 - leaveP * 1.5);
  const inY = (1 - animP) * (60 + idx * 30);
  const outX = leaveP * dir * (300 + idx * 80);
  const outY = -leaveP * (80 + idx * 40);
  const rotate = leaveP * dir * (6 + idx * 2);

  return (
    <div data-h
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ padding: nb ? "22px 22px" : "34px 28px", border:`1px solid ${hov?T.gold:T.border}`, background:hov?`${T.goldD}0e`:T.card, position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", transition:"border-color .4s,background .4s", opacity:Math.min(1, opacity), transform:`translate(${outX}px, ${inY + outY}px) rotate(${rotate}deg)` }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${hov?T.gold:T.goldD}55,transparent)`, transformOrigin:"left", transform:hov?"scaleX(1)":"scaleX(.3)", transition:"transform .55s" }} />
      <div style={{ position:"absolute", inset:0, opacity:hov?1:0, background:`radial-gradient(ellipse 70% 60% at 30% 20%,${T.goldD}14,transparent)`, transition:"opacity .6s", pointerEvents:"none" }} />
      <GoldParticles active={hov} />

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom: nb ? 18 : 24, position:"relative" }}>
        <div style={{ width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${hov?T.gold:T.goldD}`, background:`${T.goldXD}33`, transition:"border-color .4s" }}>
          <Icon size={20} color={hov ? T.goldL : T.gold} />
        </div>
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:"0.2em", color:T.goldD }}>{String(idx + 1).padStart(2, "0")}</span>
      </div>

      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.2em", color:T.gold, textTransform:"uppercase", marginBottom:10, position:"relative" }}>{s.kicker}</span>
      <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize: nb ? 24 : "clamp(24px,2.1vw,32px)", lineHeight:.95, letterSpacing:"0.02em", color:hov?T.goldL:T.white, marginBottom:12, transition:"color .35s", position:"relative" }}>{s.title}</h3>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: nb ? 15 : 16, fontWeight:300, color:T.muted, lineHeight:1.6, marginBottom:18, flex:1, position:"relative" }}>{s.desc}</p>

      <div style={{ display:"flex", gap:6, flexWrap:"wrap", position:"relative" }}>
        {tags.map(tag => (
          <span key={tag} style={{ fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:"0.12em", textTransform:"uppercase", color:hov?T.gold:T.muted, border:`1px solid ${hov?T.goldD:T.border}`, padding:"3px 8px", transition:"all .3s" }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

/**
 * Componente: PanelServicos (Serviços & Soluções)
 * O que faz: Painel de conversão freelance. Brota como círculo vindo da esquerda (a Stack entrou pela direita),
 * mostra as 4 frentes de atuação, o processo em 3 etapas e o CTA de orçamento via WhatsApp.
 * @param {number} p - Progresso geral (0 a 1) vindo do BioSection.
 */
function PanelServicos({ p }) {
  const nb = useNotebook();
  const { t: tx } = useLang();
  const enterT = stageT(p, STAGES.servicos);
  const leaveT = stageT(p, STAGES.contatos);

  const eIn = enterT * enterT * enterT;
  const eOut = leaveT * leaveT * leaveT;
  const sv = tx.services;

  return (
    <div style={{ position:"absolute", inset:0, background:T.black, padding: nb ? "68px 32px 24px" : "100px 48px 60px", overflowY:"auto", pointerEvents: enterT > 0.5 && leaveT < 0.5 ? "auto" : "none", opacity: eIn > 0 ? 1 : 0, clipPath:`circle(${eIn * 150}% at 0% 50%)`, zIndex:45, display:"flex", alignItems:"center" }}>
      <div style={{ maxWidth:1240, width:"100%", margin:"auto" }}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom: nb ? 24 : 48, flexWrap:"wrap", gap:24, transform:`translate(${-eOut * 300}px, ${(1 - eIn) * 30 - eOut * 80}px) rotate(${-eOut * 6}deg)`, opacity: Math.max(0, 1 - eOut * 1.5) }}>
          <div>
            <SecLabel num="05" label={sv.label} />
            {/* No notebook o título fica numa linha só para o painel caber em telas de ~768px de altura */}
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize: nb ? "clamp(40px,4.4vw,60px)" : "clamp(48px,7vw,80px)", lineHeight:.9, color:T.white, marginTop: nb ? -16 : 0 }}>
              {sv.title[0]}{nb ? " " : <br />}<span className="gold-text">{sv.title[1]}</span>
            </h2>
          </div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontStyle:"italic", color:T.muted, maxWidth:300, lineHeight:1.7, opacity: enterT * Math.max(0, 1 - eOut) }}>{sv.note}</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:2 }}>
          {sv.items.map((s, i) => <ServiceCard key={i} s={s} tags={SERVICE_TAGS[i]} idx={i} animP={eIn} leaveP={eOut} />)}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap: nb ? 32 : 56, alignItems:"center", marginTop: nb ? 20 : 44, paddingTop: nb ? 18 : 32, borderTop:`1px solid ${T.border}`, transform:`translate(${eOut * 300}px, ${(1 - eIn) * 60 + eOut * 80}px)`, opacity: Math.max(0, eIn * 1.2 - 0.2) * Math.max(0, 1 - eOut * 1.5) }}>
          <div>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.4em", color:T.muted, textTransform:"uppercase" }}>{sv.processLabel}</span>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap: nb ? 20 : 32, marginTop:16 }}>
              {sv.steps.map((step, i) => (
                <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <span className="gold-text" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize: nb ? 30 : 36, lineHeight:1 }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h4 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: nb ? 16 : 18, fontWeight:700, color:T.white, lineHeight:1.25, marginBottom:4 }}>{step.title}</h4>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize: nb ? 14 : 15, fontWeight:300, color:T.muted, lineHeight:1.5 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <a data-h className="svc-cta" href={whatsappLink(sv.waMsg)} target="_blank" rel="noreferrer">
            <ChatIcon size={18} color="currentColor" />
            {sv.cta}
            <span className="svc-arr" style={{ display:"inline-flex" }}><ArrowExternalIcon size={12} color="currentColor" /></span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ══ GESTOR DE ROLETAGEM: BIOSECTION ═════════════════════════════════════════════ */
/**
 * Componente Principal: BioSection (Motor da Linha do Tempo)
 * O que faz: É o grande cérebro do portfolio que controla as animações como se fossem frames de um vídeo.
 * Como funciona para um leigo: Em vez de rolar as coisas par baixo de qualquer jeito, ele finge que o site tem 17.000 pixels de altura escondidos (1700vh).
 * Conforme você roda a rodinha do mouse para descer essa altura, ele NÃO desce a tela, mas sim calcula quantos % (scrollP) você desceu. 
 * E usa essa % para acionar como "play" as animações das telas filhas: "Quem Sou" some, "Trajetória" entra, etc.
 */
function BioSection() {
  const [scrollP, setScrollP] = useState(0);
  const targetP = useRef(0);
  const currentP = useRef(0);
  const containerRef = useRef(null);
  const { t: tx } = useLang();

  useEffect(() => {
    let af;
    const loop = () => {
      // Interpolação suave para scroll sem engasgos
      currentP.current += (targetP.current - currentP.current) * 0.08;
      
      // Checa pra evitar re-renders desnecessários
      if (Math.abs(targetP.current - currentP.current) > 0.001) {
        setScrollP(currentP.current);
      }
      af = requestAnimationFrame(loop);
    };
    af = requestAnimationFrame(loop);

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      
      const rect = el.getBoundingClientRect();
      const maxScroll = el.offsetHeight - window.innerHeight;
      
      let progress = -rect.top / maxScroll;
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;
      
      targetP.current = progress;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(af); };
  }, []);

  return (
    <>
      <SDivider />
  {/* CONFIGURAÇÃO DE ROLAMENTO: 3100vh (600vh por painel, alinhado a STAGES) aumenta a distância de transição */}
  <div id="bio" ref={containerRef} style={{ height: "3100vh", position: "relative" }}>

        {/* ANCORAS NATIVAS ALINHADAS AO SECTION_SCROLL_MAP */}
  <div id="trajetoria" style={{ position: "absolute", top: "24%", width: "1px", height: "1px", pointerEvents: "none" }} />
  <div id="projetos" style={{ position: "absolute", top: "47%", width: "1px", height: "1px", pointerEvents: "none" }} />
  <div id="skills" style={{ position: "absolute", top: "64%", width: "1px", height: "1px", pointerEvents: "none" }} />
  <div id="servicos" style={{ position: "absolute", top: "84%", width: "1px", height: "1px", pointerEvents: "none" }} />
  <div id="contatos" style={{ position: "absolute", top: "100%", width: "1px", height: "1px", pointerEvents: "none" }} />

        {/* sticky amarra os conteudos na tela. T.black pro fundo padrão escuro da div */}
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: T.black }}>
          
          <PanelSobre p={scrollP} />
          
          <PanelCarreira p={scrollP} />

          <PanelProjetos p={scrollP} />

          <Skills p={scrollP} />

          <PanelServicos p={scrollP} />

          <Contact p={scrollP} />

          {/* Dica visual indicando que requer rolagem do mouse */}
          <div style={{ position:"absolute", bottom:40, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:8, opacity: Math.max(0, 0.4 - scrollP * 2), pointerEvents:"none", zIndex: 100 }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:"0.2em", color:T.muted, textTransform:"uppercase" }}>
              {tx.hint}
            </span>
            <div style={{ width:1, height:16, background:`linear-gradient(to bottom, ${T.goldD}, transparent)` }} />
          </div>
        </div>
      </div>
    </>
  );
}

/* ══ SKILLS (Conhecimentos) ══════════════════════════════════════════════════ */
// Arrays puramente com números falsos ou verdadeiros sobre suas barras de xp.
const SKILLS = [
  {n:"N8N / AI Agents",p:88},{n:"React / Next.js",p:47},
  {n:"Python",p:68},{n:"SQL",p:52},
  {n:"Docker / AWS",p:21},
];

/**
 * Componente: Skills (Suas Habilidades)
 * O que faz: É a tela que mostra tanto as barrinhas douradas enchendo do seu nível de conforto, 
 * quanto as "bolhas" (logotipos) das linguagens flutuando igual em gravidade zero.
 * Ela entra pela direita quando a seção Projetos corre para a esquerda.
 */
function Skills({ p }) {
  const nb = useNotebook();
  const { t: tx } = useLang();
  const isCin = p !== undefined;
  // LÓGICA DE TEMPO IDÊNTICA
  const enterT = isCin ? stageT(p, STAGES.skills) : 1;   // Entra quando os projetos saem
  const leaveT = isCin ? stageT(p, STAGES.servicos) : 0; // Sai quando os serviços entram
  const eIn = isCin ? (enterT * enterT * enterT) : 1;
  const eOut = leaveT * leaveT * leaveT; // Aceleração na saída

  const [lRef, lVisState] = useInView();
  const [rRef, rVisState] = useInView();

  const lVis = isCin ? enterT > 0.1 : lVisState;
  const rVis = isCin ? enterT > 0.1 : rVisState;

  const LOGO_DEFS = [
    { src: logoPython, size: 55 },
    { src: logoReact, size: 45 },
    { src: logoNode, size: 60 },
    { src: logoNext, size: 50 },
    { src: logoAws, size: 65 },
    { src: logoDocker, size: 55 },
    { src: logoDatabase, size: 45 },
    { src: logoGithub, size: 40 },
    { src: logoN8n, size: 60 },
    { src: logoLangchain, size: 50 },
    { src: logoLanggrafic, size: 45 },
    { src: logoAgno, size: 50 },
    { src: logoClaude, size: 45 },
    { src: logoGemini, size: 55 },
    { src: logoOpenai, size: 50 },
    { src: logoPostman, size: 60 },
    { src: logoFastApi, size: 55 },
    { src: logoPostgress, size: 50 },
    { src: logoSupabase, size: 45 },
  ];

  const containerRefF = useRef(null);
  const logosRef = useRef([]);

  useEffect(() => {
    if (!lVis || !containerRefF.current) return;
    let af;
    
    // Inicialização do estado físico das logos
    const w = containerRefF.current.offsetWidth;
    const h = containerRefF.current.offsetHeight;
    
    const state = LOGO_DEFS.map((def) => {
      // Posiciona inicialmente em volta, nos cantos ou bordas (evita o centro)
      let x = Math.random() * w;
      let y = Math.random() * h;
      
      const cx = w/2, cy = h/2;
      let dx = x - cx, dy = y - cy;
      const d = Math.sqrt(dx*dx + dy*dy);
      // Raio seguro para não spawnar no meio
      let safeDist = Math.max(w, h) * 0.25;
      if (d < safeDist) { 
         x = cx + (dx/d)*safeDist;
         y = cy + (dy/d)*safeDist;
      }

      return {
        x, y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: def.size / 2,
        size: def.size,
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 0.8
      };
    });

    const loop = () => {
      const cw = containerRefF.current.offsetWidth;
      const ch = containerRefF.current.offsetHeight;
      const num = state.length;
      
      for (let i = 0; i < num; i++) {
        let a = state[i];
        a.x += a.vx;
        a.y += a.vy;
        a.rotation += a.rSpeed;
        
        // Bounce nas bordas da tela
        if (a.x < a.radius) { a.x = a.radius; a.vx *= -1; }
        if (a.x > cw - a.radius) { a.x = cw - a.radius; a.vx *= -1; }
        if (a.y < a.radius) { a.y = a.radius; a.vy *= -1; }
        if (a.y > ch - a.radius) { a.y = ch - a.radius; a.vy *= -1; }
        
        // Repulsão suave do centro (onde o texto está)
        const cx = cw / 2;
        const cy = ch / 2;
        const dx = a.x - cx;
        const dy = a.y - cy;
        const distToCenter = Math.sqrt(dx*dx + dy*dy);
        
        // Raio flexível do conteúdo
        const minCenterDist = Math.min(cw, ch) * 0.35 + a.radius;
        if (distToCenter < minCenterDist && distToCenter > 0) {
          a.vx += (dx / distToCenter) * 0.04;
          a.vy += (dy / distToCenter) * 0.04;
        }
        
        // Limita a velocidade (gravidade zero é lenta)
        const speed = Math.sqrt(a.vx*a.vx + a.vy*a.vy);
        const maxSpeed = 0.8; 
        if (speed > maxSpeed) {
           a.vx = (a.vx / speed) * maxSpeed;
           a.vy = (a.vy / speed) * maxSpeed;
        }
      }

      // Checa colisão entre as logos
      for (let i = 0; i < num; i++) {
        for (let j = i + 1; j < num; j++) {
          let a = state[i], b = state[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let dist = Math.sqrt(dx*dx + dy*dy);
          let minDist = a.radius + b.radius;
          
          if (dist < minDist && dist > 0) {
            // Resolve sobreposição pra não prender
            let overlap = minDist - dist;
            let nx = dx / dist;
            let ny = dy / dist;
            
            a.x -= nx * overlap / 2;
            a.y -= ny * overlap / 2;
            b.x += nx * overlap / 2;
            b.y += ny * overlap / 2;
            
            // Troca de impulso (empurrão) elástica
            let kx = b.vx - a.vx;
            let ky = b.vy - a.vy;
            let p = 2.0 * (nx * kx + ny * ky) / 2; 
            
            const bounciness = 1;
            a.vx = a.vx + p * nx * bounciness;
            a.vy = a.vy + p * ny * bounciness;
            b.vx = b.vx - p * nx * bounciness;
            b.vy = b.vy - p * ny * bounciness;
            
            // Giração extra quando bate
            a.rSpeed += (Math.random() - 0.5) * 0.5;
            b.rSpeed += (Math.random() - 0.5) * 0.5;
          }
        }
      }
      
      // Aplica direto no DOM (60fps liso)
      for (let i = 0; i < num; i++) {
        let el = logosRef.current[i];
        if (el) {
          el.style.transform = `translate(${state[i].x - state[i].size/2}px, ${state[i].y - state[i].size/2}px) rotate(${state[i].rotation}deg)`;
        }
      }

      af = requestAnimationFrame(loop);
    };

    af = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(af);
  }, [lVis]);

  const content = (
    <section id="skills" ref={containerRefF} style={{ position: "relative", padding: isCin ? (nb ? "0 28px" : "0 48px") : (nb ? "100px 32px" : "140px 48px"), background:T.dark, overflow: "hidden", display: isCin ? "flex" : "block", flexDirection: "column", justifyContent: "center", height: isCin ? "100vh" : "auto", minHeight: "100vh", width: "100%" }}>
      {/* Logos com física via ref (saem da animação CSS) */}
      <div style={{ position: "absolute", inset: 0, opacity: Math.max(0, 1 - eOut), transform: `scale(${1 - eOut*0.3})`, pointerEvents: "none" }}>
        {LOGO_DEFS.map((logo, i) => (
          <div
            key={i}
            ref={(el) => logosRef.current[i] = el}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: logo.size,
              height: logo.size,
              pointerEvents: "none",
              zIndex: 1, // fica atrás do texto
            }}
          >
            <img
              src={logo.src}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                opacity: lVis ? 0.35 : 0,
                transform: `scale(${lVis ? 1 : 0})`,
                transition: `opacity 1.2s ${i * 0.08}s, transform 1.2s ${i * 0.08}s cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
              }}
            />
          </div>
        ))}
      </div>
      <div style={{ position: "relative", zIndex: 10, maxWidth:1060, width: "100%", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap: nb ? 44 : 80, alignItems:"start" }}>
        <div style={{ transform: `translate(${-eOut * 300}px, ${-eOut * 100}px) rotate(${-eOut * 15}deg)`, opacity: Math.max(0, 1 - eOut) }}>
          <div ref={lRef} style={{ opacity:lVis?1:0, transform:lVis?"translateX(0)":"translateX(-40px)", transition:"all .9s .1s cubic-bezier(.16,1,.3,1)" }}>
            <SecLabel num="04" label={tx.skills.label} />
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(44px,6vw,68px)", lineHeight:.9, color:T.white }}>
              {tx.skills.title[0]}<br /><span className="gold-text">{tx.skills.title[1]}</span>
            </h2>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:300, fontStyle:"italic", color:T.muted, lineHeight:1.75, marginTop:28 }}>{tx.skills.note}</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginTop:36 }}>
              {["React","Next.js","JavaScript","Node.js","Python","SQL","MongoDB","LangChain","Docker","AWS","AGNO","Flask","N8N","Github","Express.js","Tailwind"].map((tag,i)=>(
                <span key={tag} data-h style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:i%4===0?T.gold:T.muted, border:`1px solid ${i%4===0?T.goldD:T.border}`, padding:"5px 11px", opacity:lVis?1:0, transition:`opacity .5s ${.3+i*.04}s` }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ transform: `translate(${eOut * 300}px, ${eOut * 150}px) rotate(${eOut * 10}deg)`, opacity: Math.max(0, 1 - eOut) }}>
          <div ref={rRef} style={{ paddingTop:60 }}>
            {SKILLS.map((s,i)=>(
              <div key={i} style={{ marginBottom:28, opacity:rVis?1:0, transform:rVis?"translateX(0)":"translateX(32px)", transition:`all .75s ${.1+i*.1}s cubic-bezier(.16,1,.3,1)` }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, color:T.cream }}>{s.n}</span>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:T.gold }}>{s.p}%</span>
                </div>
                <div style={{ height:1, background:T.border, position:"relative", overflow:"visible" }}>
                  <div style={{ position:"absolute", top:0, left:0, bottom:0, background:`linear-gradient(to right,${T.goldD},${T.goldL})`, transformOrigin:"left", transform:rVis?`scaleX(${s.p/100})`:"scaleX(0)", transition:`transform 1.4s ${.2+i*.12}s cubic-bezier(.16,1,.3,1)`, width:"100%" }} />
                  <div style={{ position:"absolute", top:-1, bottom:-1, width:"30%", background:`linear-gradient(to right,transparent,${T.goldL}60,transparent)`, left:rVis?"110%":"-30%", transition:`left 1.5s ${.2+i*.12}s cubic-bezier(.16,1,.3,1)` }} />
                  <div style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", width:5, height:5, borderRadius:"50%", background:T.goldL, border:`1px solid ${T.black}`, left:rVis?`calc(${s.p}% - 2.5px)`:"0%", transition:`left 1.4s ${.2+i*.12}s cubic-bezier(.16,1,.3,1)`, opacity:rVis?1:0 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  if (isCin) {
    return (
      <div style={{ position: "absolute", inset: 0, pointerEvents: enterT > 0.5 ? "auto" : "none", opacity: eIn > 0 ? 1 : 0, clipPath: `circle(${eIn * 150}% at 100% 50%)`, zIndex: 40 }}>
        {content}
      </div>
    );
  }

  return (
    <>
      <SDivider delay={.05} />
      {content}
    </>
  );
}

/* ══ CONTATO E FINAL ══════════════════════════════════════════════════ */
/**
 * Componente: Contact (Fale Comigo)
 * O que faz: É a última tela, o formulário virtual onde ficam os links para o seu GitHub, e-mail e LinkedIn.
 * Esta tela "desce do teto" (yOffset negativo vindo para o 0) quando o scroll geral passa dos 85%.
 */
function Contact({ p }) {
  const nb = useNotebook();
  const { t: tx } = useLang();
  const isCin = p !== undefined;
  // LÓGICA DE TEMPO IDÊNTICA
  const enterT = isCin ? stageT(p, STAGES.contatos) : 1; // Último painel: entra quando os serviços saem
  const yOffset = isCin ? (1 - Math.pow(enterT, 3)) * -100 : 0; // Starts from -100vh down to 0, suavizado 

  const [ref, visState] = useInView();
  const vis = isCin ? enterT > 0.1 : visState;

  const links = [
    { label: "GitHub", url: "https://github.com/davizinhoow" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/davi-freitas-789317352/" },
    { label: "E-mail", url: "mailto:davizinho.f.freitas@gmail.com" }
  ].map((link, i) => ({ ...link, desc: tx.contact.links[i] }));

  const content = (
    <section id="contatos" className="contato-section" ref={ref} style={{ padding: isCin ? (nb ? "36px 28px" : "60px 48px") : (nb ? "80px 32px 72px" : "120px 48px 100px"), background:T.dark, height: isCin ? "100vh" : "auto", minHeight:"80vh", display:"flex", flexDirection:"column", justifyContent:"center", width: "100%", overflowY:"auto" }}>
      <div style={{ maxWidth:1060, width:"100%", margin:"0 auto", opacity: isCin ? enterT : 1, flexShrink: 0 }}>
        <div style={{ textAlign: "center", marginBottom: 60, opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(40px)", transition:"all .9s .2s cubic-bezier(.16,1,.3,1)" }}>
          <SecLabel num="06" label={tx.contact.label} />
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(44px,6vw,68px)", lineHeight:.9, color:T.white, marginTop:24 }}>
            {tx.contact.title[0]} <span className="gold-text">{tx.contact.title[1]}</span>
          </h2>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:T.muted, lineHeight:1.6, marginTop:24, maxWidth:500, margin:"24px auto 0" }}>
            {tx.contact.sub}
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:24, opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(40px)", transition:"all .9s .4s cubic-bezier(.16,1,.3,1)" }}>
          {links.map((link, i) => (
            <a 
              key={i} 
              href={link.url} 
              target="_blank" 
              rel="noreferrer" 
              data-h 
              style={{
                display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"48px 32px",
                border:`1px solid ${T.border}`, background:T.card, textDecoration:"none", transition:"all .4s ease", cursor:"none", position:"relative", overflow:"hidden"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.gold;
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = `0 12px 32px -12px ${T.goldD}44`;
                e.currentTarget.querySelector('.card-bg').style.opacity = 1;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.querySelector('.card-bg').style.opacity = 0;
              }}
            >
              <div className="card-bg" style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at top, ${T.goldD}15, transparent 70%)`, opacity:0, transition:"opacity .4s", pointerEvents:"none" }} />
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:36, color:T.white, marginBottom:16, position:"relative" }}>{link.label}</h3>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:T.muted, position:"relative" }}>{link.desc}</p>
              <div style={{ marginTop:24, position:"relative", display:"flex" }}><ArrowExternalIcon size={18} color={T.gold} /></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );

  if (isCin) {
    return (
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100vh", zIndex: 50, pointerEvents: enterT > 0.5 ? "auto" : "none", transform: `translateY(${yOffset}vh)`, overflow: "hidden" }}>
        {content}
      </div>
    );
  }

  return (
    <>
      <SDivider delay={.05} />
      {content}
    </>
  );
}

/**
 * Componente: Footer (Rodapé)
 * O que faz: Simples sub-seção final no fundo da página que contém direitos autorais.
 */
function Footer() {
  const { t: tx } = useLang();
  return (
    <>
      <SDivider />
      <footer style={{ padding:"36px 48px", display:"flex", justifyContent:"space-between", alignItems:"center", background:T.black, flexWrap:"wrap", gap:16 }}>
        <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, letterSpacing:"0.12em" }}>
          <span className="gold-text">Davi</span><span style={{color:T.muted}}>freitas</span>
        </span>
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.25em", color:T.muted, textTransform:"uppercase" }}>
          © {new Date().getFullYear()} · Davi Freitas · {tx.footer.rights}
        </span>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <Diamond size={5} />
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.2em", color:T.muted }}>{tx.footer.made}</span>
        </div>
      </footer>
    </>
  );
}

/* ══ APLICATIVO PRINCIPAL ══════════════════════════════════════════════════════ */
/**
 * Componente: Managers (Gestores Invisíveis)
 * O que faz: Ele roda aquelas funções "mágicas" do cursor customizado e da barra de rolagem lá em cima em silêncio.
 */
function Managers() { useCursor(); useScrollProgress(); return null; }

/**
 * COMPONENTE RAIZ: Portfolio (O Ponto de Encontro)
 * O que faz: É aqui que todas as peças de lego se juntam. Ele põe o CSS no documento, chama o cursor mágico (Managers),
 * espeta o Menu de navegação no topo, coloca a página do "Hero" e engata o motor principal "BioSection" que rola o resto.
 */
export default function Portfolio() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("pf-lang") === "en" ? "en" : "pt"; } catch { return "pt"; }
  });
  useEffect(() => { injectFonts(); }, []);
  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
    try { localStorage.setItem("pf-lang", lang); } catch { /* storage indisponível */ }
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t: I18N[lang] }}>
      <style>{CSS}</style>
      <div id="cur-dot" />
      <div id="cur-ring" />
      <div id="progress-line" />
      <Managers />
      <Nav />
      <main>
        {/* Hero: transição de baixo para cima (mais clean) */}
        <section style={{ animation: 'fromDown 0.7s cubic-bezier(.16,1,.3,1) both' }}>
          <Hero />
        </section>
        {/* BioSection: transição da esquerda para a direita */}
        <section style={{ animation: 'fromRight 0.7s cubic-bezier(.16,1,.3,1) both' }}>
          <BioSection />
        </section>
      </main>
      <Footer />
    </LangContext.Provider>
  );
}