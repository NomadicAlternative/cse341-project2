# Recipe Book API

REST API built with Node.js, Express 5 and Mongoose 9 for CSE 341 Project 2
(Parts 1 and 2). It exposes full CRUD over two related collections, `recipes`
and `categories`, with request validation, centralized error handling, GitHub
OAuth authentication and interactive Swagger documentation.

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

| Method | Path | Protected | Description |
|---|---|---|---|
| GET | `/` | No | Health/landing route. |
| GET | `/recipes` | No | List all recipes, newest first. |
| GET | `/recipes/:id` | No | Get one recipe. |
| POST | `/recipes` | Yes | Create a recipe. |
| PUT | `/recipes/:id` | Yes | Partially update a recipe. |
| DELETE | `/recipes/:id` | Yes | Delete a recipe. |
| GET | `/categories` | No | List all categories, alphabetical. |
| GET | `/categories/:id` | No | Get one category. |
| POST | `/categories` | Yes | Create a category. |
| PUT | `/categories/:id` | Yes | Partially update a category. |
| DELETE | `/categories/:id` | Yes | Delete a category. |
| GET | `/auth/github` | No | Start the GitHub OAuth login flow. |
| GET | `/auth/github/callback` | No | GitHub OAuth callback (creates the session). |
| GET | `/auth/whoami` | Yes | Return the logged-in user, or `401`. |
| GET | `/auth/logout` | No | Destroy the session and redirect to `/`. |
| GET | `/auth/failure` | No | OAuth failure landing (`401` JSON). |

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

## Authentication

The write routes are protected with GitHub OAuth, handled by `passport` and
`passport-github2`. Login lives under `/auth`:

1. The browser visits `GET /auth/github`, which redirects to GitHub.
2. After the user authorizes the app, GitHub calls back at
   `GET /auth/github/callback`. Passport upserts the GitHub profile into the
   `users` collection and stores the session.
3. On later requests the session cookie identifies the user; `GET /auth/whoami`
   returns the logged-in user and the protected routes allow the request.
4. `GET /auth/logout` destroys the session.

Any request to a protected route without a valid session gets
`401 { "error": "Authentication required" }`. Public `GET` routes stay public.

### Environment variables

Authentication reads four variables (see `.env.example`):

| Variable | Description |
|---|---|
| `GITHUB_CLIENT_ID` | Client ID of your GitHub OAuth app. |
| `GITHUB_CLIENT_SECRET` | Client secret of your GitHub OAuth app. |
| `GITHUB_CALLBACK_URL` | Must match the app's callback URL, e.g. `http://localhost:8080/auth/github/callback`. |
| `SESSION_SECRET` | Random string used to sign the session cookie. |

Create a GitHub OAuth app at **Settings > Developer settings > OAuth Apps** and
register the callback URL for each host you run (localhost and the deployed
service).

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
