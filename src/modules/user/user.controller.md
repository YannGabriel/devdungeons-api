# UserController

Controller responsável pelas rotas HTTP de **usuários**.

- **Arquivo:** [user.controller.ts](user.controller.ts)
- **Prefixo base:** `/user`
- **Responsabilidade:** apenas o mapeamento HTTP (verbo, rota, parâmetros e corpo). Toda a lógica de negócio é delegada ao `UserService`.

---

## Usuários

### Criar usuário

| | |
|---|---|
| **Método** | `POST` |
| **Rota** | `/user` |
| **Handler** | `CreateUser(userData)` |

| Parâmetro | Origem | Tipo | Descrição |
|---|---|---|---|
| `userData` | corpo | `CreateUserDTO` | Dados do usuário a ser criado |

**Corpo (`CreateUserDTO`):**

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `username` | `string` | sim | Nome de usuário |
| `email` | `string` | sim | E-mail do usuário |
| `password` | `string` | sim | Senha do usuário |

Cria o usuário com `user_level` e `user_experience` iniciados em `0`. O handler não retorna o usuário criado no corpo da resposta (apenas registra um log de sucesso).

---

### Atualizar experiência (XP)

| | |
|---|---|
| **Método** | `PATCH` |
| **Rota** | `/user/update-experience` |
| **Handler** | `UpdateUserExperience(updateExperieceData)` |

| Parâmetro | Origem | Tipo | Descrição |
|---|---|---|---|
| `updateExperieceData` | corpo | `UpdateUserExperienceDto` | ID do usuário e XP a adicionar |

**Corpo (`UpdateUserExperienceDto`):**

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `string` | sim | ID do usuário |
| `user_experiece` | `number` | sim | Quantidade de XP a ser somada à experiência atual |

Soma o XP informado à experiência atual do usuário. Ao atingir `1000` de XP, o usuário sobe de nível (`user_level + 1`) e o excedente (`XP - 1000`) é mantido como nova experiência.

> **Observação:** esta rota é declarada **antes** de `/:id` no controller. Como o NestJS resolve as rotas na ordem de declaração, `update-experience` não é capturado pelo parâmetro dinâmico `:id`.

---

### Atualizar usuário

| | |
|---|---|
| **Método** | `PATCH` |
| **Rota** | `/user/:id` |
| **Handler** | `UpdateUser(id, updateUserData)` |

| Parâmetro | Origem | Tipo | Descrição |
|---|---|---|---|
| `id` | rota | `string` | ID do usuário a ser atualizado |
| `updateUserData` | corpo | `UpdateUserDto` | Campos a serem atualizados |

**Corpo (`UpdateUserDto`):** todos os campos são opcionais.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `username` | `string` | não | Nome de usuário |
| `email` | `string` | não | E-mail do usuário |
| `password` | `string` | não | Senha do usuário |

Atualiza os campos informados do usuário. Lança `NotFoundException` caso o ID não exista.

---

## Resumo das rotas

| Método | Rota | Handler |
|---|---|---|
| `POST` | `/user` | `CreateUser` |
| `PATCH` | `/user/update-experience` | `UpdateUserExperience` |
| `PATCH` | `/user/:id` | `UpdateUser` |
