import { LanguageSeed } from "../seed.types";

export const htmlSeed: LanguageSeed = {
    language: "HTML",
    niveis: {
        Básico: [
            {
                enunciado: "O que significa a sigla HTML?",
                correta: "HyperText Markup Language",
                incorretas: [
                    "HighText Machine Language",
                    "Hyperlink and Text Markup Language",
                    "Home Tool Markup Language",
                    "Hyper Transfer Markup Language",
                ],
            },
            {
                enunciado: "Qual tag é usada para criar um parágrafo?",
                correta: "<p>",
                incorretas: ["<paragraph>", "<par>", "<pg>", "<text>"],
            },
            {
                enunciado: "Qual tag cria um link (hyperlink)?",
                correta: "<a>",
                incorretas: ["<link>", "<href>", "<url>", "<hyperlink>"],
            },
            {
                enunciado: "Qual tag é usada para inserir uma imagem?",
                correta: "<img>",
                incorretas: ["<image>", "<picture>", "<src>", "<figure>"],
            },
            {
                enunciado: "Qual tag representa o título de maior importância?",
                correta: "<h1>",
                incorretas: ["<head>", "<title>", "<h6>", "<heading>"],
            },
            {
                enunciado: "Qual atributo da tag <a> define o endereço de destino do link?",
                correta: "href",
                incorretas: ["src", "link", "target", "dest"],
            },
            {
                enunciado: "Qual tag cria uma lista não ordenada?",
                correta: "<ul>",
                incorretas: ["<ol>", "<list>", "<li>", "<dl>"],
            },
            {
                enunciado: "Qual tag insere uma quebra de linha simples?",
                correta: "<br>",
                incorretas: ["<lb>", "<break>", "<hr>", "<nl>"],
            },
            {
                enunciado: "Dentro de qual elemento fica o conteúdo visível da página?",
                correta: "<body>",
                incorretas: ["<head>", "<main>", "<html>", "<content>"],
            },
            {
                enunciado: "Qual tag define um item dentro de uma lista?",
                correta: "<li>",
                incorretas: ["<item>", "<ul>", "<dd>", "<list-item>"],
            },
        ],
        Intermediário: [
            {
                enunciado: "Qual atributo torna o preenchimento de um campo de formulário obrigatório?",
                correta: "required",
                incorretas: ["mandatory", "validate", "needed", "obligatory"],
            },
            {
                enunciado: "Qual tag semântica representa o conteúdo principal e único da página?",
                correta: "<main>",
                incorretas: ["<section>", "<content>", "<article>", "<primary>"],
            },
            {
                enunciado: 'Qual valor de "type" cria um campo de entrada de e-mail?',
                correta: 'type="email"',
                incorretas: ['type="mail"', 'type="text"', 'type="address"', 'type="e-mail"'],
            },
            {
                enunciado: "Qual atributo da tag <img> define o texto alternativo da imagem?",
                correta: "alt",
                incorretas: ["title", "src", "label", "caption"],
            },
            {
                enunciado: "Qual tag semântica agrupa o cabeçalho de uma página ou seção?",
                correta: "<header>",
                incorretas: ["<head>", "<top>", "<title>", "<thead>"],
            },
            {
                enunciado: "Qual atributo de <label> o associa a um campo de formulário pelo id?",
                correta: "for",
                incorretas: ["id", "name", "ref", "target"],
            },
            {
                enunciado: "Qual elemento define uma célula de dados em uma tabela?",
                correta: "<td>",
                incorretas: ["<th>", "<tr>", "<cell>", "<table>"],
            },
            {
                enunciado: "Qual atributo de <form> define para onde os dados serão enviados?",
                correta: "action",
                incorretas: ["method", "target", "send", "url"],
            },
            {
                enunciado: "Qual tag semântica representa um bloco de navegação de links?",
                correta: "<nav>",
                incorretas: ["<menu>", "<links>", "<navigation>", "<aside>"],
            },
            {
                enunciado: "Qual tag define uma célula de cabeçalho em uma tabela?",
                correta: "<th>",
                incorretas: ["<td>", "<thead>", "<header>", "<tr>"],
            },
        ],
        Avançado: [
            {
                enunciado:
                    "Qual atributo de <script> adia a execução até o HTML ser totalmente analisado, mantendo a ordem dos scripts?",
                correta: "defer",
                incorretas: ["async", "lazy", "delay", "postpone"],
            },
            {
                enunciado:
                    "Qual elemento permite oferecer várias fontes de imagem responsivas que o navegador escolhe?",
                correta: "<picture>",
                incorretas: ["<img>", "<source>", "<responsive>", "<srcset>"],
            },
            {
                enunciado: "Como armazenar dados customizados diretamente em um elemento HTML?",
                correta: "Atributos data-*",
                incorretas: [
                    "Atributos custom-*",
                    "Atributos meta-*",
                    "Atributos x-*",
                    "Atributos attr-*",
                ],
            },
            {
                enunciado: "Qual atributo define explicitamente o papel (semântica) de um elemento para acessibilidade?",
                correta: "role",
                incorretas: ["aria", "type", "semantic", "purpose"],
            },
            {
                enunciado: "Qual meta tag é essencial para o design responsivo controlando o viewport?",
                correta: '<meta name="viewport">',
                incorretas: [
                    '<meta name="responsive">',
                    '<meta name="screen">',
                    '<meta charset="viewport">',
                    '<meta name="device">',
                ],
            },
            {
                enunciado: "Qual atributo torna o conteúdo de um elemento editável pelo usuário?",
                correta: "contenteditable",
                incorretas: ["editable", "writable", "input", "editmode"],
            },
            {
                enunciado: "Qual atributo de <iframe> restringe as permissões do conteúdo incorporado?",
                correta: "sandbox",
                incorretas: ["secure", "restrict", "isolated", "safe"],
            },
            {
                enunciado: "Qual atributo de <img> define um conjunto de imagens para diferentes resoluções?",
                correta: "srcset",
                incorretas: ["sources", "src-list", "media", "sizes-set"],
            },
            {
                enunciado: "Qual elemento associa uma legenda a uma figura?",
                correta: "<figcaption>",
                incorretas: ["<caption>", "<legend>", "<figtext>", "<label>"],
            },
            {
                enunciado:
                    "Qual atributo ARIA fornece um rótulo acessível quando não há texto visível no elemento?",
                correta: "aria-label",
                incorretas: ["aria-text", "aria-title", "aria-describe", "aria-name"],
            },
        ],
    },
};
