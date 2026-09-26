# 🛡️ Relatório de Auditoria de Segurança & Plano de Hardening
**Aplicação:** Portfólio Pessoal (`portifolio-davi`)  
**Data:** 26 de Setembro de 2026  
**Auditor Responsável:** Cybersecurity Analyst & Infrastructure Defense Auditor  
**Postura Global de Segurança:** `[BLINDADO]`  

---

## 1. Resumo Executivo
Embora seja uma aplicação estática (sem banco de dados ou endpoints backend expostos diretamente no repositório), aplicações client-side possuem vetores de ataque conhecidos: vazamento de credenciais em bundle/git, reverse tabnabbing em links externos, enquadramento malicioso em iframes (clickjacking) e vulnerabilidades em cadeias de suprimentos (npm packages).

A auditoria cobriu 100% dos arquivos de código, histórico de commits do Git e configurações de deploy.

---

## 2. Vetores de Segurança Auditados

| Vetor de Análise | Status | Detalhes |
| :--- | :---: | :--- |
| **Segredos & Chaves de API** | 🟢 **SEGURO** | Nenhuma chave privada (OpenAI, Gemini, AWS, SSH, senhas) encontrada no código ou no histórico do Git. |
| **Proteção contra Reverse Tabnabbing** | 🟢 **BLINDADO** | Todas as tags `<a>` com `target="_blank"` contêm `rel="noreferrer"` e `window.open` blindado com `noopener,noreferrer`. |
| **Proteção contra Clickjacking** | 🟢 **BLINDADO** | Criado `vercel.json` forçando header defensivo `X-Frame-Options: DENY`. |
| **MIME Sniffing & XSS Defense** | 🟢 **BLINDADO** | Headers `X-Content-Type-Options: nosniff` e `X-XSS-Protection: 1; mode=block` ativados via `vercel.json`. |
| **Vazamento de PII Sensível** | 🟢 **SEGURO** | Apenas dados de contato intencionais para negócios (WhatsApp corporativo e e-mail profissional). |
| **Injeção de Script (XSS)** | 🟢 **SEGURO** | Nenhum uso de `dangerouslySetInnerHTML` ou `eval()`. Todas as entradas são interpoladas de forma segura pelo React DOM. |

---

## 3. Implementações Realizadas

### A. Blindagem no `window.open`
Adicionado explicitamente o parâmetro `"noopener,noreferrer"` no clique dos cards de projetos para prevenir manipulação de aba pai em navegadores legados:
```javascript
window.open(p.link, "_blank", "noopener,noreferrer");
```

### B. Headers HTTP de Segurança (`vercel.json`)
Configurado na raiz para que o CDN da Vercel sirva todos os assets com cabeçalhos de proteção:
- `X-Frame-Options: DENY`: Impede que sites maliciosos embutam seu portfólio em um iframe.
- `X-Content-Type-Options: nosniff`: Força o navegador a respeitar os tipos MIME declarados.
- `Referrer-Policy: strict-origin-when-cross-origin`: Oculta parâmetros de URL ao navegar para fora do domínio.
- `Permissions-Policy`: Desativa acesso desnecessário a câmera, microfone e geolocalização.
