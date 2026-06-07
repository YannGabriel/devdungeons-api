import { LanguageSeed } from "../seed.types";

export const javascriptSeed: LanguageSeed = {
    language: "JavaScript",
    niveis: {
        Básico: [
            {
                enunciado: "Qual palavra-chave declara uma variável com escopo de bloco que pode ser reatribuída?",
                correta: "let",
                incorretas: ["var", "const", "def", "declare"],
            },
            {
                enunciado: "Qual método exibe uma mensagem no console do navegador?",
                correta: "console.log()",
                incorretas: ["print()", "echo()", "console.write()", "document.log()"],
            },
            {
                enunciado: "Qual operador compara valor E tipo (igualdade estrita)?",
                correta: "===",
                incorretas: ["==", "=", "!==", "=>"],
            },
            {
                enunciado: "Qual valor representa a ausência intencional de um valor?",
                correta: "null",
                incorretas: ["undefined", "NaN", "0", "false"],
            },
            {
                enunciado: "Qual palavra-chave declara uma constante?",
                correta: "const",
                incorretas: ["let", "var", "final", "static"],
            },
            {
                enunciado: "Qual método adiciona um elemento ao final de um array?",
                correta: "push()",
                incorretas: ["add()", "append()", "pop()", "concat()"],
            },
            {
                enunciado: "O que o operador typeof retorna para uma função?",
                correta: '"function"',
                incorretas: ['"object"', '"method"', '"callable"', '"func"'],
            },
            {
                enunciado: "Como se escreve um comentário de linha única?",
                correta: "//",
                incorretas: ["#", "<!-- -->", "/* */ apenas", "--"],
            },
            {
                enunciado: "Qual função converte uma string em número inteiro?",
                correta: "parseInt()",
                incorretas: ["Number.toInt()", "toInteger()", "int()", "parseNumber()"],
            },
            {
                enunciado: "Qual valor uma variável declarada mas não inicializada possui?",
                correta: "undefined",
                incorretas: ["null", "0", '""', "NaN"],
            },
        ],
        Intermediário: [
            {
                enunciado: "O que o método Array.prototype.map() faz?",
                correta: "Cria um novo array transformando cada elemento",
                incorretas: [
                    "Filtra elementos do array",
                    "Altera o array original sem retornar nada",
                    "Soma todos os elementos",
                    "Ordena o array em ordem crescente",
                ],
            },
            {
                enunciado: "Qual a sintaxe de uma arrow function que soma a e b?",
                correta: "(a, b) => a + b",
                incorretas: [
                    "function (a, b) -> a + b",
                    "(a, b) => return a + b;",
                    "=> (a, b) a + b",
                    "(a, b) -> { a + b }",
                ],
            },
            {
                enunciado: "Qual método retorna um novo array apenas com elementos que passam num teste?",
                correta: "filter()",
                incorretas: ["map()", "forEach()", "find()", "some()"],
            },
            {
                enunciado: "O que JSON.parse() faz?",
                correta: "Converte uma string JSON em um objeto JavaScript",
                incorretas: [
                    "Converte um objeto em string JSON",
                    "Valida a sintaxe de um objeto",
                    "Clona um objeto profundamente",
                    "Formata o JSON com indentação",
                ],
            },
            {
                enunciado: "O que uma Promise representa?",
                correta: "A eventual conclusão (ou falha) de uma operação assíncrona",
                incorretas: [
                    "Um valor sempre síncrono",
                    "Um tipo de laço de repetição",
                    "Uma função que nunca falha",
                    "Uma variável global imutável",
                ],
            },
            {
                enunciado: "Qual método executa uma função para cada elemento sem retornar um novo array?",
                correta: "forEach()",
                incorretas: ["map()", "reduce()", "filter()", "every()"],
            },
            {
                enunciado: "O que o spread operator (...) faz com um array?",
                correta: "Expande seus elementos individualmente",
                incorretas: [
                    "Agrupa argumentos em um array",
                    "Remove elementos duplicados",
                    "Inverte a ordem dos elementos",
                    "Congela o array tornando-o imutável",
                ],
            },
            {
                enunciado: "Qual a principal diferença de escopo entre let e var?",
                correta: "let tem escopo de bloco; var tem escopo de função",
                incorretas: [
                    "var tem escopo de bloco; let tem escopo global",
                    "Ambos têm exatamente o mesmo escopo",
                    "let não pode ser usado dentro de funções",
                    "var só funciona dentro de laços",
                ],
            },
            {
                enunciado: "O que faz const { nome } = pessoa?",
                correta: "Extrai a propriedade nome do objeto para uma variável",
                incorretas: [
                    "Cria um novo objeto com a propriedade nome",
                    "Renomeia a propriedade do objeto",
                    "Remove a propriedade nome do objeto",
                    "Faz uma cópia profunda do objeto",
                ],
            },
            {
                enunciado: "O que o método reduce() retorna?",
                correta: "Um único valor acumulado a partir dos elementos",
                incorretas: [
                    "Um novo array do mesmo tamanho",
                    "Um booleano",
                    "Os elementos em ordem inversa",
                    "O número de elementos do array",
                ],
            },
        ],
        Avançado: [
            {
                enunciado: "O que é uma closure em JavaScript?",
                correta:
                    "Uma função que mantém acesso às variáveis do escopo onde foi criada",
                incorretas: [
                    "Uma função que não retorna valor",
                    "Um objeto imutável",
                    "Uma função executada imediatamente",
                    "Uma função sem parâmetros",
                ],
            },
            {
                enunciado: "Para que servem async/await?",
                correta: "Escrever código baseado em Promises de forma mais legível",
                incorretas: [
                    "Criar laços infinitos sem travar",
                    "Substituir o uso de funções",
                    "Executar código de forma estritamente síncrona",
                    "Evitar o uso de variáveis",
                ],
            },
            {
                enunciado: "Qual a função do event loop?",
                correta: "Gerenciar a execução de callbacks e tarefas assíncronas",
                incorretas: [
                    "Compilar o código JavaScript",
                    "Alocar memória para variáveis",
                    "Renderizar o HTML da página",
                    "Validar os tipos das variáveis",
                ],
            },
            {
                enunciado: "O que é hoisting?",
                correta: "A elevação das declarações ao topo do seu escopo",
                incorretas: [
                    "A remoção de variáveis não usadas",
                    "A conversão automática de tipos",
                    "A execução de funções em paralelo",
                    "A criação automática de escopo global",
                ],
            },
            {
                enunciado: "A que o this se refere dentro de uma arrow function?",
                correta: "Ao this do escopo léxico onde a função foi definida",
                incorretas: [
                    "Ao objeto global sempre",
                    "Ao objeto que a chamou",
                    "A undefined sempre",
                    "A um novo objeto criado a cada chamada",
                ],
            },
            {
                enunciado: "O que Object.freeze() faz?",
                correta: "Torna o objeto imutável, impedindo alterações",
                incorretas: [
                    "Cria uma cópia profunda do objeto",
                    "Remove todas as propriedades do objeto",
                    "Congela a execução por um tempo",
                    "Oculta as propriedades do objeto",
                ],
            },
            {
                enunciado: "Sobre a fila de execução, o que ocorre primeiro?",
                correta: "Microtasks (Promises) executam antes de macrotasks (setTimeout)",
                incorretas: [
                    "Macrotasks executam antes de microtasks",
                    "Ambas executam ao mesmo tempo",
                    "setTimeout sempre executa imediatamente",
                    "A ordem de execução é aleatória",
                ],
            },
            {
                enunciado: "O que é a prototype chain (cadeia de protótipos)?",
                correta:
                    "O mecanismo de herança pelo qual objetos buscam propriedades em seus protótipos",
                incorretas: [
                    "Uma lista de todas as variáveis globais",
                    "A ordem de carregamento dos scripts",
                    "Uma estrutura de dados do tipo fila",
                    "Uma cadeia de callbacks assíncronos",
                ],
            },
            {
                enunciado: "O que o método bind() faz?",
                correta: "Cria uma nova função com o this fixado a um valor",
                incorretas: [
                    "Executa a função imediatamente",
                    "Remove o contexto da função",
                    "Converte a função em assíncrona",
                    "Clona a função sem alterações",
                ],
            },
            {
                enunciado: "O que é currying?",
                correta:
                    "Transformar uma função de vários argumentos em uma sequência de funções de um argumento",
                incorretas: [
                    "Executar funções em paralelo",
                    "Memorizar resultados de funções",
                    "Combinar dois objetos em um",
                    "Inverter a ordem dos argumentos",
                ],
            },
        ],
    },
};
