# Diagnóstico da Loja — Next.js

Estrutura pronta para deploy na Vercel, **sem respostas pré-preenchidas**.
- `FORM_VERSION` invalida dados antigos do localStorage.
- Mostra % preenchido, Saúde da Loja e ~70% do diagnóstico borrado.

## Rodar localmente
```bash
npm install
npm run dev
# abra http://localhost:3000
```

## Deploy (Vercel)
- Suba esta pasta no GitHub (os arquivos **já estão na raiz**, inclusive `package.json`).
- Na Vercel: New Project → escolha o repositório → Framework: **Next.js** → Root Directory: `./`.
