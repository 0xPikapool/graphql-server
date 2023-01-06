# GQL Server

Uses Postgraphile to create GraphQL access for Postgres.

Postgraphile sits behind a Caddy reverse-proxy with some conservative rate-limit rules applied.

## Rate-limit

Using [caddy-ratelimit](https://github.com/mholt/caddy-ratelimit)

## Persisted Operations

[Persisted operations](https://github.com/graphile/persisted-operations) to prevent malicious queries

## Run

1. Modify `.env`

2. Run `docker compose up --build`
