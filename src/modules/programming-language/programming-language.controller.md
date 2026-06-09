# Programming Language Controller

Base path: `/programming-languages`

Gerencia o CRUD de linguagens de programação disponíveis na plataforma. Cada linguagem é associada a questões e níveis de usuário.

---

## Endpoints

### GET `/programming-languages`

Lista todas as linguagens cadastradas, ordenadas alfabeticamente por nome.

**Response** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "JavaScript",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### GET `/programming-languages/:id`

Retorna uma linguagem pelo UUID.

**Params**
| Campo | Tipo   | Descrição       |
|-------|--------|-----------------|
| `id`  | string | UUID da linguagem |

**Response** `200 OK` — objeto da linguagem

**Errors**
- `404 Not Found` — linguagem não encontrada

---

### POST `/programming-languages`

Cria uma nova linguagem de programação. O nome deve ser único.

**Body**
```json
{
  "name": "TypeScript"
}
```

| Campo  | Tipo   | Validação                  |
|--------|--------|----------------------------|
| `name` | string | obrigatório, máx. 100 chars |

**Response** `201 Created` — objeto criado

**Errors**
- `409 Conflict` — linguagem com esse nome já cadastrada

---

### PATCH `/programming-languages/:id`

Atualiza o nome de uma linguagem existente.

**Params**
| Campo | Tipo   | Descrição       |
|-------|--------|-----------------|
| `id`  | string | UUID da linguagem |

**Body**
```json
{
  "name": "TypeScript 5"
}
```

**Response** `200 OK` — objeto atualizado

**Errors**
- `404 Not Found` — linguagem não encontrada
- `409 Conflict` — novo nome já pertence a outra linguagem

---

### DELETE `/programming-languages/:id`

Remove uma linguagem pelo UUID.

**Params**
| Campo | Tipo   | Descrição       |
|-------|--------|-----------------|
| `id`  | string | UUID da linguagem |

**Response** `200 OK`
```json
{
  "message": "Linguagem <id> removida com sucesso"
}
```

**Errors**
- `404 Not Found` — linguagem não encontrada

---

## Entity

Tabela: `programming_languages`

| Coluna       | Tipo        | Restrições          |
|--------------|-------------|---------------------|
| `id`         | uuid (PK)   | gerado automaticamente |
| `name`       | varchar(100)| NOT NULL, UNIQUE    |
| `created_at` | timestamp   | auto                |
| `updated_at` | timestamp   | auto                |

**Relações**
- `questions` → `QuestionEntity` (OneToMany)
- `userLanguageLevels` → `UserLanguageLevelEntity` (OneToMany)
