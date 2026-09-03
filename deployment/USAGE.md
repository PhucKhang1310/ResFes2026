# Usage Guide

## Application Entry Points

With the default local port, use:

| URL | Purpose |
| --- | --- |
| `http://localhost:8080/` | Public website |
| `http://localhost:8080/admin` | CMS administration |
| `http://localhost:8080/auth/login` | User and administrator sign-in |
| `http://localhost:8080/swagger` | Interactive API reference |
| `http://localhost:8080/openapi.json` | OpenAPI document |
| `http://localhost:8080/healthz` | Frontend health |
| `http://localhost:8080/backend-health` | Backend process health |
| `http://localhost:8080/backend-ready` | Backend and database readiness |

Replace the local origin with the production HTTPS origin after deployment. Browser API calls use the same-origin `/api/v1` path and Nginx forwards them to the private backend container.

## Routine Commands

Run commands from `SRC2026`:

```bash
# Show service and health status
docker compose --env-file .env.docker ps

# Follow all logs
docker compose --env-file .env.docker logs -f --tail=200

# Follow one service
docker compose --env-file .env.docker logs -f --tail=200 backend

# Restart one service without deleting data
docker compose --env-file .env.docker restart backend

# Stop and start the stack
docker compose --env-file .env.docker stop
docker compose --env-file .env.docker start

# Stop and remove containers while retaining MongoDB data
docker compose --env-file .env.docker down
```

Never add `--volumes` to `docker compose down` during routine operation. That option deletes the MongoDB volume.

## Normal Product Use

- Public users browse news, mentors, and publications from the main navigation.
- Contributors use the submission and registration routes. Turnstile, Cloudinary, and SMTP must be configured for their complete workflows.
- Administrators sign in at `/auth/login` and use `/admin` for content, submissions, media, semesters, and reporting according to their assigned permissions.
- API consumers use `/api/v1`; the legacy `/api/v1/content` and `/api/v1/content/versions` endpoints remain available during the CMS migration.

The deployment does not create an initial administrator account or seed content. Use the existing application registration and role-management process for the target environment.
