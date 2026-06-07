import { LanguageSeed } from "../seed.types";

export const cssSeed: LanguageSeed = {
    language: "CSS",
    niveis: {
        Básico: [
            {
                enunciado: "O que significa a sigla CSS?",
                correta: "Cascading Style Sheets",
                incorretas: [
                    "Computer Style Sheets",
                    "Creative Style System",
                    "Colorful Style Sheets",
                    "Cascading System Style",
                ],
            },
            {
                enunciado: "Qual propriedade define a cor do texto?",
                correta: "color",
                incorretas: ["text-color", "font-color", "foreground", "text-fill"],
            },
            {
                enunciado: "Qual propriedade define a cor de fundo de um elemento?",
                correta: "background-color",
                incorretas: ["bg-color", "color-background", "fill", "back-color"],
            },
            {
                enunciado: "Qual símbolo inicia um seletor de id?",
                correta: "#",
                incorretas: [".", "*", "@", "&"],
            },
            {
                enunciado: "Qual símbolo inicia um seletor de classe?",
                correta: ".",
                incorretas: ["#", "&", ":", "$"],
            },
            {
                enunciado: "Qual propriedade define o tamanho da fonte?",
                correta: "font-size",
                incorretas: ["text-size", "font-style", "size", "text-height"],
            },
            {
                enunciado: "Qual declaração deixa o texto em negrito?",
                correta: "font-weight: bold",
                incorretas: [
                    "text-style: bold",
                    "font-bold: true",
                    "weight: bold",
                    "text-weight: bold",
                ],
            },
            {
                enunciado: "Qual propriedade controla o espaçamento interno entre o conteúdo e a borda?",
                correta: "padding",
                incorretas: ["margin", "spacing", "border-gap", "inner-margin"],
            },
            {
                enunciado: "Qual propriedade controla o espaçamento externo de um elemento?",
                correta: "margin",
                incorretas: ["padding", "gap", "outer-space", "outline"],
            },
            {
                enunciado: "Qual propriedade define a família/tipo da fonte?",
                correta: "font-family",
                incorretas: ["font-type", "font-name", "typeface", "font-face"],
            },
        ],
        Intermediário: [
            {
                enunciado: "Qual valor de display cria um contêiner flexível?",
                correta: "flex",
                incorretas: ["block", "grid", "inline", "table"],
            },
            {
                enunciado: "Qual propriedade alinha itens flex ao longo do eixo principal?",
                correta: "justify-content",
                incorretas: ["align-items", "align-content", "justify-items", "place-content"],
            },
            {
                enunciado: "Qual propriedade alinha itens flex ao longo do eixo transversal?",
                correta: "align-items",
                incorretas: ["justify-content", "align-self", "vertical-align", "place-items"],
            },
            {
                enunciado: "Qual unidade é relativa ao tamanho da fonte do elemento raiz (root)?",
                correta: "rem",
                incorretas: ["em", "px", "vh", "pt"],
            },
            {
                enunciado: "Qual propriedade cria cantos arredondados?",
                correta: "border-radius",
                incorretas: ["border-round", "corner-radius", "radius", "round-corner"],
            },
            {
                enunciado: "Qual pseudo-classe aplica estilo quando o mouse passa sobre o elemento?",
                correta: ":hover",
                incorretas: [":focus", ":active", ":over", ":mouseover"],
            },
            {
                enunciado: "Qual valor de position fixa o elemento em relação à viewport?",
                correta: "fixed",
                incorretas: ["absolute", "relative", "sticky", "static"],
            },
            {
                enunciado: "O que box-sizing: border-box faz com a largura/altura do elemento?",
                correta: "Inclui padding e borda no tamanho total",
                incorretas: [
                    "Remove o padding do elemento",
                    "Ignora a borda do elemento",
                    "Duplica a largura do elemento",
                    "Centraliza o conteúdo do elemento",
                ],
            },
            {
                enunciado: "Qual regra é usada para aplicar estilos conforme o tamanho da tela?",
                correta: "@media",
                incorretas: ["@screen", "@responsive", "@viewport", "@device"],
            },
            {
                enunciado: "Qual propriedade controla a transparência (opacidade) do elemento?",
                correta: "opacity",
                incorretas: ["visibility", "transparent", "alpha", "filter"],
            },
        ],
        Avançado: [
            {
                enunciado: "Qual valor de display cria um layout em grade bidimensional?",
                correta: "grid",
                incorretas: ["flex", "table", "block", "inline-grid"],
            },
            {
                enunciado: "Qual propriedade define as colunas de um contêiner grid?",
                correta: "grid-template-columns",
                incorretas: ["grid-columns", "columns", "grid-cols", "template-columns"],
            },
            {
                enunciado: "Qual função define uma faixa que se ajusta entre um valor mínimo e máximo no grid?",
                correta: "minmax()",
                incorretas: ["clamp()", "range()", "fit()", "minimax()"],
            },
            {
                enunciado: "Qual propriedade anima mudanças de valores de forma suave?",
                correta: "transition",
                incorretas: ["animation", "transform", "ease", "morph"],
            },
            {
                enunciado: "Qual regra define uma animação por etapas (keyframes)?",
                correta: "@keyframes",
                incorretas: ["@animation", "@frames", "@steps", "@motion"],
            },
            {
                enunciado: "Qual propriedade aplica rotações, escalas e translações a um elemento?",
                correta: "transform",
                incorretas: ["transition", "translate", "position", "rotate"],
            },
            {
                enunciado: "Qual função CSS lê o valor de uma variável (custom property)?",
                correta: "var()",
                incorretas: ["env()", "get()", "custom()", "prop()"],
            },
            {
                enunciado: "Qual unidade representa 1% da largura da viewport?",
                correta: "vw",
                incorretas: ["vh", "%", "vmin", "vmax"],
            },
            {
                enunciado: "Qual propriedade controla a ordem de empilhamento de elementos posicionados?",
                correta: "z-index",
                incorretas: ["order", "stack", "layer", "depth"],
            },
            {
                enunciado: "Qual combinador seleciona apenas os filhos diretos de um elemento?",
                correta: ">",
                incorretas: ["+", "~", "espaço (descendente)", ">>"],
            },
        ],
    },
};
