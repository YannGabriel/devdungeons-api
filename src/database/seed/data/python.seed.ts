import { LanguageSeed } from "../seed.types";

export const pythonSeed: LanguageSeed = {
    language: "Python",
    niveis: {
        Básico: [
            {
                enunciado: "Qual função exibe um valor no console?",
                correta: "print()",
                incorretas: ["echo()", "console.log()", "write()", "printf()"],
            },
            {
                enunciado: "Qual símbolo inicia um comentário de linha em Python?",
                correta: "#",
                incorretas: ["//", "--", "/*", ";"],
            },
            {
                enunciado: "Qual tipo de dado representa texto em Python?",
                correta: "str",
                incorretas: ["text", "char", "string", "varchar"],
            },
            {
                enunciado: "Qual função retorna a quantidade de itens de uma lista?",
                correta: "len()",
                incorretas: ["count()", "size()", "length()", "total()"],
            },
            {
                enunciado: "Como se define uma lista em Python?",
                correta: "[]",
                incorretas: ["{}", "()", "<>", "(( ))"],
            },
            {
                enunciado: "Qual palavra-chave define uma função?",
                correta: "def",
                incorretas: ["function", "func", "fn", "define"],
            },
            {
                enunciado: "Qual operador realiza exponenciação (potência)?",
                correta: "**",
                incorretas: ["^", "//", "exp", "pow"],
            },
            {
                enunciado: "Qual função lê uma entrada digitada pelo usuário?",
                correta: "input()",
                incorretas: ["read()", "scan()", "get()", "readline()"],
            },
            {
                enunciado: "Qual tipo representa valores verdadeiro ou falso?",
                correta: "bool",
                incorretas: ["boolean", "bit", "flag", "binary"],
            },
            {
                enunciado: "Qual função converte uma string em número inteiro?",
                correta: "int()",
                incorretas: ["str()", "float()", "parseInt()", "integer()"],
            },
        ],
        Intermediário: [
            {
                enunciado: "Qual estrutura de dados armazena pares chave-valor?",
                correta: "dict",
                incorretas: ["list", "tuple", "set", "array"],
            },
            {
                enunciado: "Qual método adiciona um item ao final de uma lista?",
                correta: "append()",
                incorretas: ["add()", "push()", "insert()", "extend()"],
            },
            {
                enunciado: "Qual a sintaxe correta de uma list comprehension?",
                correta: "[x for x in lista]",
                incorretas: [
                    "{x for x in lista}",
                    "(x in lista)",
                    "for x in lista: x",
                    "[for x in lista]",
                ],
            },
            {
                enunciado: "Qual palavra-chave captura/trata uma exceção?",
                correta: "except",
                incorretas: ["catch", "rescue", "error", "handle"],
            },
            {
                enunciado: "Qual coleção não permite elementos duplicados?",
                correta: "set",
                incorretas: ["list", "dict", "tuple", "array"],
            },
            {
                enunciado: "Qual construção abre um arquivo fechando-o automaticamente ao final?",
                correta: "with open(...) as f:",
                incorretas: [
                    "open(...) finally close()",
                    "file open(...)",
                    "try open(...)",
                    "using open(...)",
                ],
            },
            {
                enunciado: "Qual palavra-chave transforma uma função em um gerador?",
                correta: "yield",
                incorretas: ["return", "generate", "async", "await"],
            },
            {
                enunciado: "O que *args representa nos parâmetros de uma função?",
                correta: "Número variável de argumentos posicionais",
                incorretas: [
                    "Número variável de argumentos nomeados",
                    "Um ponteiro para a função",
                    "Argumentos obrigatórios",
                    "Uma lista vazia por padrão",
                ],
            },
            {
                enunciado: "Qual método de string remove espaços em branco das extremidades?",
                correta: "strip()",
                incorretas: ["trim()", "clean()", "cut()", "remove()"],
            },
            {
                enunciado: "Como obter os 3 primeiros itens de uma lista chamada lst?",
                correta: "lst[:3]",
                incorretas: ["lst[3:]", "lst[0,3]", "lst.first(3)", "lst[1:3]"],
            },
        ],
        Avançado: [
            {
                enunciado: "O que é um decorator em Python?",
                correta:
                    "Uma função que recebe outra função e estende seu comportamento",
                incorretas: [
                    "Um tipo especial de classe abstrata",
                    "Uma anotação de tipo estático",
                    "Um módulo de formatação de saída",
                    "Uma estrutura de repetição otimizada",
                ],
            },
            {
                enunciado: "Qual método especial inicializa uma instância de classe?",
                correta: "__init__",
                incorretas: ["__new__", "__main__", "__start__", "__create__"],
            },
            {
                enunciado: "O que o GIL (Global Interpreter Lock) garante?",
                correta: "Que apenas uma thread execute bytecode Python por vez",
                incorretas: [
                    "Que o código seja compilado para C",
                    "Que todas as threads rodem em paralelo real",
                    "Que a memória seja liberada manualmente",
                    "Que variáveis globais não possam ser alteradas",
                ],
            },
            {
                enunciado: "Qual módulo da biblioteca padrão fornece async/await?",
                correta: "asyncio",
                incorretas: ["threading", "multiprocessing", "concurrent", "aiohttp"],
            },
            {
                enunciado: "O que é uma metaclass?",
                correta: "A classe responsável por criar outras classes",
                incorretas: [
                    "Uma classe sem atributos",
                    "Uma classe que herda de object",
                    "Uma função geradora",
                    "Uma classe abstrata padrão",
                ],
            },
            {
                enunciado: "Qual método especial torna um objeto chamável como uma função?",
                correta: "__call__",
                incorretas: ["__invoke__", "__run__", "__exec__", "__apply__"],
            },
            {
                enunciado: "O que functools.lru_cache faz com uma função?",
                correta: "Memoriza (cacheia) os resultados das chamadas",
                incorretas: [
                    "Executa a função em paralelo",
                    "Limita o número de chamadas",
                    "Adia a execução da função",
                    "Registra logs de cada chamada",
                ],
            },
            {
                enunciado: "Qual a característica de um método decorado com @staticmethod?",
                correta: "Não recebe self nem cls como primeiro parâmetro",
                incorretas: [
                    "Recebe cls como primeiro parâmetro",
                    "Só pode ser chamado por instâncias",
                    "É executado automaticamente na criação do objeto",
                    "Retorna sempre None",
                ],
            },
            {
                enunciado: "O que define um context manager?",
                correta: "Um objeto que implementa __enter__ e __exit__",
                incorretas: [
                    "Um objeto que implementa __iter__ e __next__",
                    "Uma função decorada com @contextmanager apenas",
                    "Uma classe que herda de Exception",
                    "Um objeto que implementa apenas __call__",
                ],
            },
            {
                enunciado: "O que faz o operador walrus (:=)?",
                correta: "Atribui um valor a uma variável dentro de uma expressão",
                incorretas: [
                    "Compara dois valores ignorando o tipo",
                    "Concatena duas listas",
                    "Define um valor padrão para parâmetros",
                    "Desempacota os itens de uma tupla",
                ],
            },
        ],
    },
};
