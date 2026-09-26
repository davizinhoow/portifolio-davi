# 📋 Plano de Ações e Correções de QA (Pré-Deploy Vercel)
**Projeto:** Portfólio Pessoal (`portifolio-davi`)  
**Data da Auditoria:** 26 de Setembro de 2026  
**Auditor Responsável:** QA Senior & System Logic Auditor (Goal-Driven)  
**Status da Auditoria:** `[APROVADO COM RESSALVAS]` (Requer correções dos itens críticos antes do deploy)

---

## 1. Resumo Executivo

O portfólio apresenta alto nível estético, performance de carregamento excelente (build de produção do Vite compilado em ~400ms, bundle de ~278KB) e boa arquitetura de componentes. A paleta dark/gold e a nova escala de contraste de textos (`T.muted = #a8a59d`) garantiram legibilidade total.

Contudo, a auditoria implacável detectou **1 link externo quebrado (HTTP 404)** em um dos projetos principais, **1 erro de linter** que pode quebrar builds estritos no CI/CD da Vercel, e ausência de **metadados de SEO/OpenGraph** no `index.html`.

---

## 2. Tabela de Ações Priorizadas

| ID | Arquivo Afetado | Severidade | Problema | Ação Corretiva |
| :--- | :--- | :--- | :--- | :--- |
| **QA-01** | `src/portfolio.jsx` | 🚨 **Crítico** | Link do projeto de Machine Learning retorna HTTP 404 no GitHub (`davizinhoow/MachineLearning-Evasao-Alunos`) | Atualizar para o link público correto ou sinalizar como `Private / Case Study 🔒` com link `#` até o repo ser publicado. |
| **QA-02** | `src/portfolio.jsx` | ⚠️ **Alto** | Erro de ESLint (`no-unused-vars`): variável `tx` declarada e não utilizada na função `BioSection` (linha 1791) | Remover a declaração desnecessária de `tx` para não quebrar pipelines do Vercel. |
| **QA-03** | `index.html` | 🟡 **Médio** | Título genérico (`portifolio-davi`) e ausência de meta tags OpenGraph / SEO | Inserir título profissional, favicon e tags de preview social (WhatsApp / LinkedIn). |
| **QA-04** | `src/portfolio.jsx` | 🟡 **Médio** | Grid de fundo do `Hero` (`inset: -20%`) sem `pointerEvents: "none"` | Adicionar `pointerEvents: "none"` para prevenir interceptação de cliques no menu superior. |
| **QA-05** | `src/portfolio.jsx` | 💡 **Baixo** | Warnings de dependências no `useEffect` de `useInView` e `Skills` | Declarar dependências ausentes nos arrays de hooks. |

---

## 3. Detalhamento e Soluções Prontas

### QA-01: Correção do Link Quebrado no Projeto de ML (404)
* **Local:** `src/portfolio.jsx` (array `PROJECTS`)
* **Problema:** A URL `https://github.com/davizinhoow/MachineLearning-Evasao-Alunos` não existe publicamente no GitHub.
* **Solução:**
```jsx
// ANTES
{
  num: "002",
  title: "Automatic Prediction of Academic Dropout",
  link: "https://github.com/davizinhoow/MachineLearning-Evasao-Alunos"
}

// DEPOIS (Travado com segurança até o repositório ser subido no GitHub)
{
  num: "002",
  title: "Automatic Prediction of Academic Dropout",
  category: "Machine Learning",
  year: "2025 / 2026",
  desc: "Pipeline preditivo de Machine Learning para detecção precoce de risco de evasão acadêmica e churn estudantil. Modelagem estatística, engenharia de features e rotinas preventivas.",
  tags: ["Python", "Scikit-Learn", "Pandas", "SQL Server", "Random Forest"],
  large: false,
  link: "#",
  status: "Case Study"
}
```

---

### QA-02: Eliminar Erro de ESLint em `BioSection`
* **Local:** `src/portfolio.jsx`, linha 1791
* **Problema:** `error 'tx' is assigned a value but never used`
* **Solução:**
```jsx
// ANTES
function BioSection() {
  const [scrollP, setScrollP] = useState(0);
  const targetP = useRef(0);
  const currentP = useRef(0);
  const containerRef = useRef(null);
  const { t: tx } = useLang(); // <--- NÃO USADO
  const isMobile = useIsMobile();

// DEPOIS
function BioSection() {
  const [scrollP, setScrollP] = useState(0);
  const targetP = useRef(0);
  const currentP = useRef(0);
  const containerRef = useRef(null);
  const isMobile = useIsMobile();
```

---

### QA-03: Metadados Profissionais e OpenGraph no `index.html`
* **Local:** `index.html`
* **Solução:**
```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Davi Freitas | AI & Software Engineer</title>
    <meta name="description" content="Engenheiro de Software & Especialista em IA. Desenvolvimento de agentes inteligentes, automações com n8n e plataformas escaláveis em Python e React." />
    
    <!-- Open Graph / Redes Sociais / WhatsApp Preview -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Davi Freitas | AI & Software Engineer" />
    <meta property="og:description" content="Desenvolvedor Full Stack & Especialista em Inteligência Artificial. Automações n8n, Agentes de IA e Microsserviços FastAPI." />
    <meta property="og:image" content="/assets/quem-sou/eu no santander.jpeg" />
    <meta name="theme-color" content="#080808" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

### QA-04: Blindagem de Cliques no `Hero` (`pointerEvents: "none"`)
* **Local:** `src/portfolio.jsx`, linha 1110
* **Solução:**
```jsx
// ANTES
<div style={{ position:"absolute", inset:"-20%", backgroundImage:`linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`, backgroundSize:"80px 80px", opacity:.28, transform: `translateY(${e * 800}px)` }} />

// DEPOIS
<div style={{ position:"absolute", inset:"-20%", backgroundImage:`linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`, backgroundSize:"80px 80px", opacity:.28, transform: `translateY(${e * 800}px)`, pointerEvents:"none" }} />
```

---

## 4. Roteiro de Testes de Regressão Pós-Correção

1. Executar `npm run lint`: O terminal deve retornar `0 errors`.
2. Executar `npm run build`: O build deve compilar com status `✓ built in ~400ms`.
3. Testar clique em todos os cards de projetos: Nenhum deve abrir página 404 do GitHub.
4. Compartilhar o link de teste no WhatsApp Web para validar o card de preview (OpenGraph).
