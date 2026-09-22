# Recipe Book API

REST API built with Node.js, Express 5 and Mongoose 9 for CSE 341 Project 2
(Part 1). It exposes full CRUD over two related collections, `recipes` and
`categories`, with request validation, centralized error handling and
interactive Swagger documentation.

## Requirements

- Node.js 20 or newer
- A MongoDB connection string (local or MongoDB Atlas)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your environment file from the template:

   ```bash
   cp .env.example .env
   ```

3. Open `.env` and set `MONGODB_URI` to your own connection string. Optionally
   adjust `PORT` and `SWAGGER_HOST`.

4. Start the server:

   ```bash
   npm start
   ```

The API is then available at `http://localhost:8080`.

## Scripts

| Script | Description |
|---|---|
| `npm start` | Starts the server with `node app.js`. |
| `npm run dev` | Starts the server with `node --watch app.js` (auto-reload). |
| `npm run swagger` | Regenerates `swagger.json` from the route definitions. |

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/` | Health/landing route. |
| GET | `/recipes` | List all recipes, newest first. |
| GET | `/recipes/:id` | Get one recipe. |
| POST | `/recipes` | Create a recipe. |
| PUT | `/recipes/:id` | Partially update a recipe. |
| DELETE | `/recipes/:id` | Delete a recipe. |
| GET | `/categories` | List all categories, alphabetical. |
| GET | `/categories/:id` | Get one category. |
| POST | `/categories` | Create a category. |
| PUT | `/categories/:id` | Partially update a category. |
| DELETE | `/categories/:id` | Delete a category. |

Error responses are always JSON:

- `400` for invalid input or a malformed id
- `404` for a missing resource or unknown route
- `409` for a duplicate key
- `500` for anything unexpected

### Error handling

Every route handler in `controllers/` wraps its work in a `try/catch` block and
forwards failures to a single 4-argument error middleware with `next(err)`. That
middleware maps `HttpError`, Mongoose `ValidationError` and `CastError`, and
duplicate-key errors (`11000`) to the status codes listed above.

## API documentation

The interactive Swagger UI is served at `/api-docs`. It reads the generated
`swagger.json`.

The documented host comes from `SWAGGER_HOST`. To regenerate the document for a
deployed instance:

```bash
SWAGGER_HOST=your-app.onrender.com npm run swagger
```

The committed `swagger.json` is generated for the deployed service, so the file
works as-is straight from the repository. Regenerating it for local development
(`npm run swagger` with no `SWAGGER_HOST`) points it back at `localhost:8080`.

## Manual testing

`recipes.rest` contains ready-to-run requests (including the expected status
for each case) for the VS Code REST Client extension. It targets localhost by
default and repeats every request against a `@renderHost` variable at the end.
