# magnit-fake-data

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.42. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

# обновить схемы

bun run update:db:cr
bun run update:db:pa
bun run update:db:pricing

# запустить генерацию данных

```bash
bun run ./index.ts
```

# подгрузить обновления репозитория на локалку

```bash
git pull
```

# запушить изменения

```bash
git add .
git commit -m "msg"
git push
```
