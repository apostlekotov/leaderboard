# Leaderboard API

## Setup

First of all, create Postgres Database

```bash
createdb leaderboard
```

Generate https certificate

```bash
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout sslcert/key.pem -out sslcert/cert.pem
```

Make sure to fill `.env` and `.env.production` file as example file [`.env.example`](.env.example)!

```bash
yarn && yarn build && yarn start
```

## API Reference

- `/ping` - pong
