# GQL Server

Uses Postgraphile to create GraphQL access for Postgres.

Postgraphile sits behind a Caddy reverse-proxy with some conservative rate-limit rules applied.

## Rate-limit

Per-IP ratelimit using [caddy-ratelimit](https://github.com/mholt/caddy-ratelimit).

## Persisted Operations

Only whitelisted operations are permitted, to prevent malicious queries. See [Persisted operations](https://github.com/graphile/persisted-operations).

## Run

1. Modify `.env`

2. Run `docker compose up --build`
