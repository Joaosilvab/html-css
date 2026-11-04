# 📝 Minhas Notas — PWA personalizável

Bloco de notas que funciona offline e pode ser **instalado** no celular ou computador.
Dá para mudar praticamente tudo no visual.

**Link do app:** https://joaosilvab.github.io/html-css/notas-pwa/

## O que dá para personalizar (botão 🎨)

- **9 temas prontos**: Lavanda, Escuro, Sépia, Oceano, Neon, Floresta, Caderno, Terminal, Pôr do sol
- **Fontes**: escolha separada para interface, títulos e notas (16 opções: Inter, Poppins, Lora, Playfair, Caveat, Fira Code…), tamanho, espaçamento entre linhas e negrito
- **Fundo**: cor sólida, degradê (2 cores + ângulo) ou imagem (URL ou foto do aparelho, com desfoque e escurecimento)
- **Cores**: texto, destaque/botões, cartões, barra superior e transparência dos cartões
- **Formato**: arredondamento, sombra, borda, largura dos cartões, layout em grade ou lista
- **Nome do app**
- Cada nota pode ter **cor de fundo**, **cor do título**, **cor do texto** e **fonte** próprias (também dá para escolher ao escrever uma nota nova)

## Recursos

- **Texto formatado**: selecione uma palavra ou linha e mude só a cor ou a fonte dela, use marca-texto, negrito, itálico e sublinhado
- Criar, editar, fixar 📌, duplicar e excluir (com "Desfazer")
- Busca com destaque
- Salva automaticamente no aparelho (localStorage) e funciona **offline**
- Exportar/importar backup em `.json`
- **Copiar link com meu tema**: quem abrir o link recebe o mesmo visual
- **Compartilhar app** (⤴): link + QR Code para outra pessoa instalar

## Como publicar (uma vez só)

1. No GitHub, abra o repositório → **Settings** → **Pages**
2. Em *Build and deployment*, escolha **Deploy from a branch**, branch **main**, pasta **/ (root)** → **Save**
3. Em 1–2 minutos o app fica em `https://joaosilvab.github.io/html-css/notas-pwa/`

> O app precisa estar na branch `main` (faça o merge desta branch antes).

## Como a outra pessoa instala

- **Android / Chrome / Edge (PC)**: abrir o link e tocar no botão ⬇ do app (ou em "Instalar app" no menu do navegador)
- **iPhone / iPad**: abrir no Safari → Compartilhar → **Adicionar à Tela de Início**

As notas de cada pessoa ficam só no aparelho dela.

## Arquivos

| Arquivo | Função |
|---|---|
| `index.html` | estrutura da página |
| `style.css` | visual (usa variáveis CSS alteradas pelo app) |
| `app.js` | notas, personalização, compartilhar e instalação |
| `manifest.webmanifest` | dados para instalar como app |
| `sw.js` | service worker (funcionamento offline) |
| `icons/` | ícones do app |
