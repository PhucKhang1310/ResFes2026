# Maintenance Guide

## Routine Checks

At least daily, check container health, readiness, recent errors, host disk space, and the last successful off-host backup:

```bash
docker compose --env-file .env.docker ps
curl --fail http://127.0.0.1:8080/backend-ready
docker compose --env-file .env.docker logs --since=24h backend
docker system df
```

Application logs go to Docker's configured logging driver. Configure host-level rotation and centralized retention; the Compose file does not impose a site-specific logging policy.

## Database Backup

Create a restricted host directory, stream a consistent MongoDB archive from the database container, checksum it, and copy both files to encrypted off-host storage:

```bash
mkdir -p backups
chmod 700 backups
backup_file="backups/src2026-$(date -u +%Y%m%dT%H%M%SZ).archive.gz"
docker compose --env-file .env.docker exec -T mongo sh -c 'mongodump --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin --db publicationDb --archive --gzip' > "$backup_file"
sha256sum "$backup_file" > "$backup_file.sha256"
```

Retain multiple generations according to the organization's recovery-point and legal requirements. Test restoration into an isolated environment on a schedule; a backup is not verified until it has been restored successfully.

## Database Restore

Restore is destructive because `--drop` replaces collections in `publicationDb`. Stop application traffic, verify the selected archive and checksum, and take a fresh backup first.

```bash
sha256sum --check backups/src2026-YYYYMMDDTHHMMSSZ.archive.gz.sha256
docker compose --env-file .env.docker stop frontend backend
docker compose --env-file .env.docker exec -T mongo sh -c 'mongorestore --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin --db publicationDb --archive --gzip --drop' < backups/src2026-YYYYMMDDTHHMMSSZ.archive.gz
docker compose --env-file .env.docker start backend frontend
curl --fail http://127.0.0.1:8080/backend-ready
```

Confirm representative records and application workflows after restoration.

## Upgrade

Back up MongoDB, review release notes and environment changes, then update both repositories to known commits on their deployment branches:

```bash
git status --short
git -C ../src2026_backend_main status --short
git pull --ff-only
git -C ../src2026_backend_main pull --ff-only
docker compose --env-file .env.docker build --pull
docker compose --env-file .env.docker up -d
docker compose --env-file .env.docker ps
curl --fail http://127.0.0.1:8080/backend-ready
```

Change `RELEASE_TAG` and `RELEASE_SHA` for each release. This single-host Compose update can briefly interrupt requests; use replicated orchestration if zero-downtime deployment is required.

## Rollback

Record the previous frontend commit, backend commit, release tag, and database schema state before every upgrade. To roll back application code, check out the recorded commits in both repositories, restore the previous `.env.docker`, rebuild, and start the stack:

```bash
git checkout <previous-frontend-commit>
git -C ../src2026_backend_main checkout <previous-backend-commit>
docker compose --env-file .env.docker build
docker compose --env-file .env.docker up -d
```

Restore a database backup only when the release changed stored data incompatibly. Code rollback and data rollback are separate decisions.

## Secret Rotation

- Rotate provider and SMTP credentials in their provider consoles, update `.env.docker`, then recreate `backend`.
- Rotating `VITE_TURNSTILE_SITE_KEY` requires rebuilding `frontend`.
- Rotating `JWT_SECRET` invalidates existing login tokens.
- Rotating `EMAIL_OUTBOX_ENCRYPTION_KEY` requires a migration plan for queued encrypted data.
- Rotating MongoDB credentials requires updating the database user as well as `.env.docker`; changing only Compose initialization variables does not modify an existing MongoDB volume.

Recreate affected services with:

```bash
docker compose --env-file .env.docker up -d --force-recreate backend
docker compose --env-file .env.docker up -d --build frontend
```

## Troubleshooting

- `frontend` build fails: verify the Turnstile site key is real and the frontend build environment validation passes.
- `backend` is unhealthy: inspect `docker compose --env-file .env.docker logs backend` and check `mongo` health first.
- API requests return CORS errors: `FRONTEND_ORIGIN` must exactly match the browser origin, including scheme and port.
- Login succeeds but the cookie is absent: production requires HTTPS end to end and the correct forwarded protocol.
- Upload or email flows fail while health checks pass: verify Cloudinary and SMTP credentials; health checks do not call external providers.
- MongoDB rejects credentials after editing `.env.docker`: initialization variables only apply to a new empty volume. Rotate the existing database user or restore into a deliberately recreated volume.
