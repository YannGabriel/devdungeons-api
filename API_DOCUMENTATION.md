# DevDungeons API — Documentação de Uso

> **Base URL:** `http://localhost:3000/api`  
> **Swagger interativo:** `http://localhost:3000/api/docs`  
> **Formato:** JSON em todas as requisições e respostas.  
> **Autenticação:** `Authorization: Bearer <token>` nas rotas protegidas.

---

## Sumário

1. [Visão Geral](#visão-geral)
2. [Como Autenticar](#como-autenticar)
3. [Módulo Auth](#módulo-auth)
4. [Módulo Usuários](#módulo-usuários)
5. [Módulo Linguagens](#módulo-linguagens)
6. [Módulo Níveis de Conhecimento](#módulo-níveis-de-conhecimento)
7. [Módulo Questões](#módulo-questões)
8. [Módulo Quiz — Fila de 10 Questões](#módulo-quiz--fila-de-10-questões)
9. [Módulo Nível do Usuário por Linguagem](#módulo-nível-do-usuário-por-linguagem)
10. [Códigos de Erro](#códigos-de-erro)
11. [Variáveis de Ambiente](#variáveis-de-ambiente)

---

## Visão Geral

| Item | Valor |
|------|-------|
| Base URL | `http://localhost:3000/api` |
| Swagger | `http://localhost:3000/api/docs` |
| Autenticação | JWT Bearer Token |
| Rotas públicas | GET linguagens/níveis/questões, register, login, refresh |
| Rotas protegidas | Todas as demais — exigem `Authorization: Bearer <token>` |

---

## Como Autenticar

### Passo 1 — Cadastre-se ou faça login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "123456"
}
```

Resposta:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400,
  "user": {
    "id": "uuid",
    "username": "João",
    "email": "joao@email.com",
    "role": "USER",
    "user_level": 0,
    "user_experience": 0
  }
}
```

### Passo 2 — Use o `accessToken` em todas as requisições protegidas

```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Passo 3 — Renove o token quando expirar

```http
POST /api/auth/refresh
Content-Type: application/json

{ "refreshToken": "eyJhbGci..." }
```

---

## Módulo Auth

### `POST /api/auth/register` — Público

Cadastra um novo usuário e retorna os tokens prontos para uso. Não é necessário fazer login separado após o cadastro.

**Body:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `username` | string | Sim | Nome de exibição |
| `email` | string (email) | Sim | E-mail único |
| `password` | string (mín. 6) | Sim | Senha (armazenada com bcrypt) |
| `languageIds` | string[] | Não | Array de UUIDs de linguagens de interesse |
| `levelId` | string (uuid) | Não | Nível inicial para todas as linguagens selecionadas |

**Exemplo de Request:**

```json
{
  "username": "João Silva",
  "email": "joao@email.com",
  "password": "minhasenha",
  "languageIds": ["uuid-javascript", "uuid-python"],
  "levelId": "uuid-basico"
}
```

**Resposta 201:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400,
  "user": {
    "id": "uuid",
    "username": "João Silva",
    "email": "joao@email.com",
    "role": "USER",
    "user_level": 0,
    "user_experience": 0,
    "languages": [
      {
        "id": "uuid-assoc",
        "language": { "id": "uuid", "name": "JavaScript" },
        "level": { "id": "uuid", "name": "Básico", "xp": 50 }
      }
    ]
  }
}
```

**Erros possíveis:**

| Status | Motivo |
|--------|--------|
| `400` | Dados inválidos (email mal formatado, senha curta, campo obrigatório ausente) |
| `409` | E-mail já cadastrado |

---

### `POST /api/auth/login` — Público

Autentica com e-mail e senha. Retorna `accessToken` (padrão: 24h) e `refreshToken` (padrão: 7 dias).

**Body:**

```json
{
  "email": "joao@email.com",
  "password": "minhasenha"
}
```

**Resposta 200:**

```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "expiresIn": 86400,
  "user": {
    "id": "uuid",
    "username": "João Silva",
    "email": "joao@email.com",
    "role": "USER",
    "user_level": 2,
    "user_experience": 350,
    "languages": [...]
  }
}
```

**Erros possíveis:**

| Status | Motivo |
|--------|--------|
| `401` | E-mail não encontrado ou senha incorreta |

---

### `GET /api/auth/me` — Protegido

Retorna o perfil completo do usuário autenticado: dados pessoais, nível global, XP e todas as linguagens com seus níveis.

**Request:**

```http
GET /api/auth/me
Authorization: Bearer <accessToken>
```

**Resposta 200:**

```json
{
  "id": "uuid",
  "username": "João Silva",
  "email": "joao@email.com",
  "role": "USER",
  "user_level": 2,
  "user_experience": 350,
  "languages": [
    {
      "id": "uuid-assoc",
      "language": { "id": "uuid", "name": "JavaScript" },
      "level": { "id": "uuid", "name": "Básico", "xp": 50 }
    }
  ]
}
```

---

### `POST /api/auth/refresh` — Público

Gera um novo par de tokens sem exigir login. Use quando o `accessToken` expirar.

**Body:**

```json
{ "refreshToken": "eyJhbGci..." }
```

**Resposta 200:**

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "expiresIn": 86400
}
```

**Erros possíveis:**

| Status | Motivo |
|--------|--------|
| `401` | Refresh token inválido ou expirado |

---

## Módulo Usuários

> ⚠️ Todos os endpoints (exceto `POST /api/user`) exigem autenticação JWT.

---

### `POST /api/user` — Público

Cria um usuário diretamente sem retornar token. Para o fluxo completo com token, prefira `POST /api/auth/register`.

**Body:**

```json
{ "username": "Ana", "email": "ana@email.com", "password": "123456" }
```

**Resposta 201:**

```json
{
  "id": "uuid",
  "username": "Ana",
  "email": "ana@email.com",
  "role": "USER",
  "user_level": 0,
  "user_experience": 0
}
```

---

### `GET /api/user/:id` — Protegido

Busca um usuário pelo UUID. A senha nunca é retornada.

**Parâmetros de rota:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | uuid | ID do usuário |

**Resposta 200:**

```json
{
  "id": "uuid",
  "username": "Ana",
  "email": "ana@email.com",
  "role": "USER",
  "user_level": 1,
  "user_experience": 200
}
```

---

### `PATCH /api/user/:id` — Protegido

Atualiza `username`, `email` ou `password`. Todos os campos são opcionais. A nova senha é hasheada automaticamente com bcrypt.

**Body (todos opcionais):**

```json
{
  "username": "Novo Nome",
  "email": "novo@email.com",
  "password": "novasenha"
}
```

**Erros possíveis:**

| Status | Motivo |
|--------|--------|
| `404` | Usuário não encontrado |
| `409` | Novo e-mail já pertence a outro usuário |

---

### `PATCH /api/user/update-experience` — Protegido

Adiciona XP a um usuário manualmente. Se o total atingir 1000 XP, o nível global sobe automaticamente e o excedente é carregado para o próximo nível.

> O quiz credita XP automaticamente ao finalizar a sessão. Este endpoint é para casos manuais ou administrativos.

**Body:**

```json
{ "id": "uuid-do-usuario", "user_experience": 50 }
```

**Resposta 200:**

```json
{ "message": "XP atualizado para 400" }
```

```json
{ "message": "Parabéns! Você subiu para o nível 3" }
```

---

## Módulo Linguagens

> ✅ GET não requer token. POST, PATCH e DELETE exigem JWT.

Os 4 valores iniciais (HTML, CSS, Python, JavaScript) são criados automaticamente na inicialização da API.

---

### `GET /api/programming-languages` — Público

Lista todas as linguagens em ordem alfabética.

**Resposta 200:**

```json
[
  { "id": "uuid", "name": "CSS",        "created_at": "...", "updated_at": "..." },
  { "id": "uuid", "name": "HTML",       "created_at": "...", "updated_at": "..." },
  { "id": "uuid", "name": "JavaScript", "created_at": "...", "updated_at": "..." },
  { "id": "uuid", "name": "Python",     "created_at": "...", "updated_at": "..." }
]
```

---

### `GET /api/programming-languages/:id` — Público

Busca uma linguagem pelo UUID.

---

### `POST /api/programming-languages` — Protegido

Cria uma linguagem de programação. O nome deve ser único (máx. 100 chars).

**Body:**

```json
{ "name": "TypeScript" }
```

---

### `PATCH /api/programming-languages/:id` — Protegido

**Body:**

```json
{ "name": "TypeScript 5" }
```

---

### `DELETE /api/programming-languages/:id` — Protegido

Remove a linguagem. **Cascade:** todas as questões associadas são removidas junto.

**Resposta 200:**

```json
{ "message": "Linguagem uuid removida com sucesso" }
```

---

## Módulo Níveis de Conhecimento

> Os níveis **Básico (50 XP)**, **Intermediário (75 XP)** e **Avançado (100 XP)** são criados automaticamente na inicialização. O campo `xp` define quantos pontos o usuário ganha ao acertar uma questão daquele nível.

---

### `GET /api/knowledge-levels` — Público

**Resposta 200:**

```json
[
  { "id": "uuid", "name": "Avançado",      "xp": 100 },
  { "id": "uuid", "name": "Básico",        "xp": 50  },
  { "id": "uuid", "name": "Intermediário", "xp": 75  }
]
```

---

### `GET /api/knowledge-levels/:id` — Público

Busca um nível pelo UUID.

---

### `POST /api/knowledge-levels` — Protegido

**Body:**

```json
{ "name": "Expert", "xp": 150 }
```

> `xp` é opcional, default `0`.

---

### `PATCH /api/knowledge-levels/:id` — Protegido

**Body (ambos opcionais):**

```json
{ "name": "Iniciante", "xp": 30 }
```

---

### `DELETE /api/knowledge-levels/:id` — Protegido

Remove o nível. Questões associadas ficam com `level_id = null`. Associações usuário-linguagem-nível são removidas em cascade.

---

## Módulo Questões

> ✅ Leitura (GET) é pública. Criação, edição, remoção e resposta avulsa exigem JWT.

---

### `GET /api/questions` — Público

Lista todas as questões com linguagem, nível e alternativas. Ordenado por `created_at DESC`.

**Resposta 200 (estrutura de uma questão):**

```json
{
  "id": "uuid",
  "enunciado": "Qual método exibe mensagem no console?",
  "language": { "id": "uuid", "name": "JavaScript" },
  "level": { "id": "uuid", "name": "Básico", "xp": 50 },
  "alternatives": [
    { "id": "uuid", "descricao": "console.log()", "correta": true  },
    { "id": "uuid", "descricao": "print()",        "correta": false },
    { "id": "uuid", "descricao": "echo()",         "correta": false },
    { "id": "uuid", "descricao": "write()",        "correta": false },
    { "id": "uuid", "descricao": "log()",          "correta": false }
  ]
}
```

---

### `GET /api/questions/by-language/:languageId` — Público

Filtra questões por linguagem. Retorna array com a mesma estrutura do GET geral.

---

### `GET /api/questions/by-level/:levelId` — Público

Filtra questões por nível de conhecimento.

---

### `GET /api/questions/:id` — Público

Busca uma questão pelo UUID com todas as alternativas.

---

### `POST /api/questions` — Protegido

Cria uma questão com **exatamente 5 alternativas**, sendo **obrigatoriamente 1 correta**. Linguagem é obrigatória; nível é opcional.

**Body:**

```json
{
  "enunciado": "Qual tag cria um link em HTML?",
  "language_id": "uuid-html",
  "level_id": "uuid-basico",
  "alternatives": [
    { "descricao": "<a>",         "correta": true  },
    { "descricao": "<link>",      "correta": false },
    { "descricao": "<href>",      "correta": false },
    { "descricao": "<url>",       "correta": false },
    { "descricao": "<hyperlink>", "correta": false }
  ]
}
```

**Erros possíveis:**

| Status | Motivo |
|--------|--------|
| `400` | Número de alternativas diferente de 5 ou número de corretas diferente de 1 |
| `404` | `language_id` ou `level_id` não encontrado |

---

### `PATCH /api/questions/:id` — Protegido

Atualiza enunciado, linguagem ou nível. Para editar alternativas, use os endpoints de alternativas.

**Body (todos opcionais):**

```json
{ "enunciado": "Novo enunciado", "language_id": "uuid", "level_id": "uuid" }
```

---

### `DELETE /api/questions/:id` — Protegido

Remove a questão e todas as suas alternativas em cascade.

---

### `POST /api/questions/:id/answer` — Protegido

Resposta avulsa — fora de uma sessão de quiz. Verifica se a alternativa está correta e credita XP ao usuário autenticado. Não guarda histórico de respostas.

> Para um fluxo completo com histórico, fila de 10 questões e XP ao final, use o módulo **Quiz**.

**Body:**

```json
{ "alternative_id": "uuid-da-alternativa-escolhida" }
```

**Resposta 200:**

```json
{
  "question_id": "uuid",
  "chosen_alternative_id": "uuid",
  "correct": true,
  "correct_alternative_id": "uuid",
  "question_xp": 50,
  "xp_earned": 50,
  "user_update": { "message": "XP atualizado para 400" }
}
```

---

### `GET /api/questions/:id/alternatives` — Público

Lista as alternativas de uma questão em ordem de criação (ASC).

---

### `POST /api/questions/:id/alternatives` — Protegido

Adiciona uma alternativa a uma questão que ainda não atingiu 5 alternativas.

**Body:**

```json
{ "descricao": "Nova alternativa", "correta": false }
```

**Erros possíveis:**

| Status | Motivo |
|--------|--------|
| `400` | Questão já tem 5 alternativas, ou já possui 1 correta e `correta: true` foi enviado |

---

### `PATCH /api/questions/alternatives/:alternativeId` — Protegido

Atualiza texto ou status de correta. Ao enviar `correta: true`, as demais alternativas da mesma questão são automaticamente desmarcadas.

**Body (ambos opcionais):**

```json
{ "descricao": "Texto corrigido", "correta": true }
```

---

### `DELETE /api/questions/alternatives/:alternativeId` — Protegido

Remove uma alternativa. Só é permitido se a questão tiver mais de 5 alternativas — adicione a substituta antes de remover.

---

## Módulo Quiz — Fila de 10 Questões

> 🔒 **Todos os endpoints do Quiz exigem autenticação JWT.**  
> O quiz seleciona aleatoriamente até 10 questões para a linguagem/nível escolhido, rastreia cada resposta e credita o XP total ao usuário somente ao finalizar. As respostas corretas não são reveladas antes de cada questão ser respondida.

---

### `POST /api/quiz/start` — Protegido

Inicia uma nova sessão de quiz. Se já existir uma sessão `IN_PROGRESS` para a mesma linguagem/nível, ela é retomada automaticamente — não cria duplicatas.

**Body:**

```json
{
  "language_id": "uuid-javascript",
  "level_id": "uuid-basico"
}
```

> `level_id` é opcional. Se omitido, seleciona questões de todos os níveis.

**Resposta 201:**

```json
{
  "session_id": "uuid-sessao",
  "status": "IN_PROGRESS",
  "language": { "id": "uuid", "name": "JavaScript" },
  "level": { "id": "uuid", "name": "Básico", "xp": 50 },
  "progress": {
    "questions_answered": 0,
    "questions_total": 10,
    "current_score": 0,
    "total_xp_earned": 0,
    "accuracy_percentage": 0,
    "current_question_order": 1,
    "is_complete": false,
    "completed_at": null
  },
  "questions": [
    {
      "order": 1,
      "question_id": "uuid",
      "enunciado": "Qual palavra-chave declara variável com escopo de bloco?",
      "alternatives": [
        { "id": "uuid", "descricao": "var"     },
        { "id": "uuid", "descricao": "let"     },
        { "id": "uuid", "descricao": "const"   },
        { "id": "uuid", "descricao": "def"     },
        { "id": "uuid", "descricao": "declare" }
      ],
      "answered": false,
      "your_answer": null,
      "correct": null,
      "correct_alternative_id": null,
      "xp_earned": 0,
      "answered_at": null
    }
  ]
}
```

> ⚠️ Note que `correta` **não aparece** nas alternativas enquanto a questão não foi respondida.

**Erros possíveis:**

| Status | Motivo |
|--------|--------|
| `400` | Questões insuficientes (mínimo 3 disponíveis para a linguagem/nível) |
| `404` | Linguagem ou nível não encontrado |

---

### `POST /api/quiz/:sessionId/answer` — Protegido

Registra a resposta para uma questão da sessão. Ao responder a última questão, a sessão é finalizada e o XP total é creditado ao usuário automaticamente.

**Body:**

```json
{
  "question_id": "uuid-da-questao",
  "alternative_id": "uuid-da-alternativa-escolhida"
}
```

**Resposta 200 — questão intermediária:**

```json
{
  "question_order": 3,
  "correct": true,
  "correct_alternative_id": "uuid-correta",
  "xp_earned": 50,
  "session": {
    "id": "uuid-sessao",
    "questions_answered": 3,
    "questions_total": 10,
    "current_score": 2,
    "total_xp_earned": 100,
    "is_complete": false,
    "next_question_order": 4,
    "completed_at": null
  },
  "final_results": null
}
```

**Resposta 200 — última questão (sessão completa + XP creditado):**

```json
{
  "question_order": 10,
  "correct": false,
  "correct_alternative_id": "uuid-correta",
  "xp_earned": 0,
  "session": {
    "id": "uuid-sessao",
    "questions_answered": 10,
    "questions_total": 10,
    "current_score": 7,
    "total_xp_earned": 350,
    "is_complete": true,
    "next_question_order": null,
    "completed_at": "2024-01-15T14:32:00.000Z"
  },
  "final_results": {
    "correct_answers": 7,
    "wrong_answers": 3,
    "accuracy_percentage": 70,
    "total_xp_earned": 350,
    "questions_summary": [
      {
        "order": 1,
        "enunciado": "Qual palavra-chave declara variável com escopo de bloco?",
        "your_answer_id": "uuid-escolhida",
        "correct_answer_id": "uuid-correta",
        "correct": true,
        "xp_earned": 50
      }
    ]
  }
}
```

**Erros possíveis:**

| Status | Motivo |
|--------|--------|
| `400` | Questão já respondida / alternativa inválida / sessão já finalizada |
| `403` | A sessão pertence a outro usuário |
| `404` | Sessão não encontrada |

---

### `GET /api/quiz/history` — Protegido

Histórico de todas as sessões do usuário autenticado, da mais recente para a mais antiga.

**Resposta 200:**

```json
[
  {
    "id": "uuid",
    "status": "COMPLETED",
    "language": { "name": "JavaScript" },
    "level": { "name": "Básico", "xp": 50 },
    "score": 7,
    "total_questions": 10,
    "accuracy_percentage": 70,
    "total_xp_earned": 350,
    "started_at": "2024-01-15T14:20:00.000Z",
    "completed_at": "2024-01-15T14:32:00.000Z"
  }
]
```

---

### `GET /api/quiz/:sessionId` — Protegido

Estado completo de uma sessão. Questões já respondidas mostram `correta` nas alternativas; questões não respondidas ocultam esse campo.

---

## Módulo Nível do Usuário por Linguagem

> Registra em qual nível um usuário está para cada linguagem que estuda. Um usuário só pode ter **um nível por linguagem**. Todos os endpoints exigem JWT.

---

### `GET /api/user-language-levels` — Protegido

Lista todas as associações existentes.

---

### `GET /api/user-language-levels/by-user/:userId` — Protegido

Retorna todas as linguagens e níveis de um usuário. Ideal para renderizar o dashboard de progresso.

**Resposta 200:**

```json
[
  {
    "id": "uuid-assoc",
    "user_id": "uuid-user",
    "language": { "id": "uuid", "name": "JavaScript" },
    "level": { "id": "uuid", "name": "Básico", "xp": 50 },
    "created_at": "...",
    "updated_at": "..."
  }
]
```

---

### `GET /api/user-language-levels/:id` — Protegido

Busca uma associação específica pelo UUID.

---

### `POST /api/user-language-levels` — Protegido

Associa um usuário a uma linguagem com nível inicial. Também é feito automaticamente pelo `POST /auth/register` se `languageIds` e `levelId` forem enviados.

**Body:**

```json
{ "user_id": "uuid", "language_id": "uuid", "level_id": "uuid" }
```

**Erros possíveis:**

| Status | Motivo |
|--------|--------|
| `409` | Usuário já possui nível cadastrado para esta linguagem |
| `404` | `user_id`, `language_id` ou `level_id` não encontrado |

---

### `PATCH /api/user-language-levels/:id` — Protegido

Avança o nível do usuário em uma linguagem (ex: Básico → Intermediário).

**Body:**

```json
{ "level_id": "uuid-intermediario" }
```

---

### `DELETE /api/user-language-levels/:id` — Protegido

Remove a associação. O usuário deixa de ter aquela linguagem em seu perfil.

---

## Códigos de Erro

| Status | Significado | Causas comuns |
|--------|-------------|---------------|
| `400 Bad Request` | Dados inválidos | Campo obrigatório ausente, tipo errado, nº de alternativas ≠ 5, questão já respondida |
| `401 Unauthorized` | Não autenticado | Token ausente, expirado ou mal formado |
| `403 Forbidden` | Acesso negado | Sessão de quiz pertence a outro usuário |
| `404 Not Found` | Recurso não encontrado | ID inválido ou registro deletado |
| `409 Conflict` | Conflito de dados únicos | E-mail duplicado, nome duplicado, usuário já tem nível para a linguagem |

Todos os erros seguem o formato padrão do NestJS:

```json
{
  "statusCode": 400,
  "message": "Cada questão deve possuir exatamente 5 alternativas",
  "error": "Bad Request"
}
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

| Variável | Exemplo | Descrição |
|----------|---------|-----------|
| `DB_HOST` | `localhost` | Host do PostgreSQL |
| `DB_PORT` | `5432` | Porta do PostgreSQL |
| `DB_USERNAME` | `postgres` | Usuário do banco |
| `DB_PASSWORD` | `senha` | Senha do banco |
| `DB_NAME` | `devdungeons` | Nome do banco de dados |
| `JWT_SECRET` | `chave_secreta_aqui` | Segredo para assinar o access token (mín. 32 chars) |
| `JWT_EXPIRES_IN` | `86400` | Expiração do access token em segundos (86400 = 24h) |
| `JWT_REFRESH_SECRET` | `outra_chave_secreta` | Segredo para assinar o refresh token |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Expiração do refresh token |
| `PORT` | `3000` | Porta do servidor (opcional, default 3000) |
| `CORS_ORIGIN` | `http://localhost:5173` | Origins permitidos (separados por vírgula) |

---

*DevDungeons API · Versão 1.0 · Swagger interativo disponível em `/api/docs`*
