# Numerical Response

Gradable numerical response question element. Learners enter numeric values
into one or more answer fields with optional prefix/suffix labels.

**Type:** `NUMERICAL_RESPONSE`

## Data

| Field | Type | Description |
|-------|------|-------------|
| `question` | `string[]` | Embedded question (Tiptap HTML) element ids |
| `embeds` | `Record<string, any>` | Embedded element map keyed by id |
| `prefixes` | `string[]` | Per-answer prefix label (e.g. currency symbol) |
| `suffixes` | `string[]` | Per-answer suffix label (e.g. unit of measurement) |
| `correct` | `number[]?` | Correct numeric value per answer (gradable only) |
| `hint` | `string` | Optional hint shown to the learner |
| `isGradable` | `boolean?` | Whether the question is graded |

## Edit

- Question prompt area (embedded Tiptap element)
- One row per answer with prefix, numeric value, and suffix fields
- Add/remove answer rows with at least one row required
- Hint field (question form)

## Display

- Renders one numeric input per configured answer with prefix/suffix adornments
- Validates that every answer field has a number before submit
- After submission, each field shows a check or close icon based on correctness

## Development

```sh
pnpm dev     # Preview :8080 | Edit :8010 | Display :8020 | Server :8030
pnpm build
pnpm lint
pnpm test
```

## Run with Docker

```sh
docker compose up
```
