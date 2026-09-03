# SRC2026 Docker Operations

This directory is the runbook for the Docker deployment of the complete SRC2026 stack:

- `DEPLOYMENT.md`: first deployment, configuration, TLS, and verification
- `USAGE.md`: application entry points and routine Docker commands
- `MAINTENANCE.md`: monitoring, upgrades, backup, restore, and rollback

The stack is defined by `../docker-compose.yml` and contains:

| Service | Purpose | Publicly exposed |
| --- | --- | --- |
| `frontend` | Nginx, the React static build, and API reverse proxy | Yes, port `HTTP_PORT` |
| `backend` | Express API | No |
| `mongo` | MongoDB with persistent named volume | No |

All commands in these documents are run from the frontend repository root unless stated otherwise. The frontend and backend repositories must remain sibling directories because Compose builds the backend from `../src2026_backend_main`.

```text
deployment-root/
├── SRC2026/
│   ├── docker-compose.yml
│   └── deployment/
└── src2026_backend_main/
    └── Dockerfile
```

Do not commit `.env.docker`. It contains database, authentication, Cloudinary, Turnstile, and SMTP credentials.
