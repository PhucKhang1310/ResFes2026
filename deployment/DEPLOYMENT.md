# Deployment Guide

## Prerequisites

- A Linux host with Docker Engine 24 or newer and Docker Compose v2
- At least 2 CPU cores, 4 GB RAM, and enough persistent disk for MongoDB and backups
- A DNS name pointing to the host and a TLS-terminating reverse proxy or load balancer
- Cloudflare Turnstile, Cloudinary, and SMTP credentials
- The frontend and backend repositories checked out as sibling directories

## 1. Check Out the Deployment Branches

```bash
mkdir src2026-deployment
cd src2026-deployment
git clone https://github.com/PhucKhang1310/SRC2026.git
git clone https://github.com/nguyenHungAA/src2026_backend_main.git
git -C SRC2026 switch deployment
git -C src2026_backend_main switch deployment
cd SRC2026
```

The `deployment` branches must first be pushed to their remotes if this is a new installation.

## 2. Configure the Environment

```bash
cp .env.docker.example .env.docker
chmod 600 .env.docker
```

Replace every `replace-with-...` value. For production, also set:

```env
NODE_ENV=production
FRONTEND_ORIGIN=https://src2026.example.org
BACKEND_URL=https://src2026.example.org
TURNSTILE_EXPECTED_HOSTNAME=src2026.example.org
HTTP_BIND_ADDRESS=127.0.0.1
HTTP_PORT=8080
TRUST_PROXY_HOPS=2
RELEASE_TAG=2026-09-03.1
RELEASE_SHA=<frontend-or-release-commit>
```

`FRONTEND_ORIGIN` and `BACKEND_URL` must be HTTPS URLs in production. Use separate values of at least 32 characters for the five application secrets. A suitable command for each is:

```bash
openssl rand -hex 32
```

Use only URL-safe characters in `MONGO_ROOT_USERNAME` and `MONGO_ROOT_PASSWORD`; Compose embeds them in `MONGO_URI`. `VITE_TURNSTILE_SITE_KEY` is compiled into the frontend image, so changing it requires rebuilding `frontend`.

## 3. Validate and Start

The config command renders secret values to the terminal. Run it only in a private administrator session and do not save its output.

```bash
docker compose --env-file .env.docker config --quiet
docker compose --env-file .env.docker build --pull
docker compose --env-file .env.docker up -d
docker compose --env-file .env.docker ps
```

Wait until all three services report `healthy`, then verify the local listener:

```bash
curl --fail http://127.0.0.1:8080/healthz
curl --fail http://127.0.0.1:8080/backend-health
curl --fail http://127.0.0.1:8080/backend-ready
```

The first start can take several minutes while images and dependencies are downloaded. MongoDB data persists in the `src2026_mongo_data` named volume.

## 4. Add HTTPS

The Compose listener serves HTTP and is intended to sit behind TLS. Keep `HTTP_BIND_ADDRESS=127.0.0.1` and forward the public domain to port 8080. For example, a host-level Caddy configuration is:

```caddyfile
src2026.example.org {
    reverse_proxy 127.0.0.1:8080
}
```

Expose only ports 80 and 443 through the host firewall. Do not expose MongoDB or the backend container directly. Ensure the proxy preserves `Host`, `X-Forwarded-For`, and `X-Forwarded-Proto`; the included Nginx proxy passes those values to Express.

After TLS is active, verify:

```bash
curl --fail https://src2026.example.org/healthz
curl --fail https://src2026.example.org/backend-ready
curl --fail https://src2026.example.org/openapi.json
```

Then test sign-in, sign-out, one read-only public API flow, a Turnstile-protected form, an image upload, and email delivery. These checks exercise credentials that container health checks intentionally do not use.

## Local Evaluation

For local HTTP evaluation, leave `NODE_ENV=development`, use `http://localhost:8080` for both public URLs, and set `TURNSTILE_EXPECTED_HOSTNAME=localhost`. Real provider credentials are still needed to exercise Turnstile, uploads, and email. Start the stack with the same Compose commands and open `http://localhost:8080`.
