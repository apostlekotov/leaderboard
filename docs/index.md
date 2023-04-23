# Docs

## Local Setup

First, you need to create a Postgres database, then fill in the configuration file `ormconfig.env` according to the example [`ormconfig.example.env`](ormconfig.example.env)!

```bash
createdb leaderboard
```

Fill in the configuration file `.env` according to the example [`.example.env`](.example.env)!

```bash
yarn && yarn build && yarn start
```

## API Reference

- `/ping` - pong
- `/auth` - Registration, login, email verification
- `/user` - CRUD system for users
- `/leaderboard` - Getting and clearing the rating

## User

| Param           |   Type    |
| :-------------- | :-------: |
| id              | `string`  |
| username        | `string`  |
| email           | `string`  |
| isVerifiedEmail | `boolean` |
| password        | `string`  |
| country         | `string`  |
| score           | `number`  |
| pb              | `number`  |
| avatar          | `number`  |
| createdAt       |  `Date`   |
| updatedAt       |  `Date`   |

## Middlewares

### Auth 🔒

Middleware responsible for checking the token.
Headers are filled in as follows:

| Key             | Value             |
| :-------------- | :---------------- |
| `Authorization` | `Bearer ${token}` |

### App auth 🗝

| Key           | Value      |
| :------------ | :--------- |
| `x-app-token` | `appToken` |

appToken - jwt generated from a random object in the payload and the secret `APP_JWT_SECRET`

## Endpoints

### ping

Used to check the availability of the server

```http
  GET /ping
```

Ответ:

```text
  pong
```

### Login

```http
  POST /auth/login
```

| Param      |   Type   | Description       |
| :--------- | :------: | :---------------- |
| `login`    | `string` | Email or username |
| `password` | `string` | Password          |

```ts
{
  "isSuccess": true,
  "user": User,
  "token": "eyJhbGciO..."
}
```

### Registration

```http
  POST /auth/register
```

| Param      |   Type   |
| :--------- | :------: |
| `username` | `string` |
| `password` | `string` |
| `email`    | `string` |
| `country`  | `string` |

```ts
{
  "isSuccess": true,
  "user": User,
  "token": "eyJhbGciO..."
}
```

### Email verification

```http
  POST /user/:id/verify-email
```

| Param  |   Type   | Description                   |
| :----- | :------: | :---------------------------- |
| `code` | `string` | From email to verify the user |

### Me 🔒

Profile data of the authorized user

```http
  GET /user/me
```

```ts
{
  "isSuccess": true,
  "user": User
}
```

### Reset password

First, we make an empty request, then we fill it in:

| Param      |   Type   | Description                   |
| :--------- | :------: | :---------------------------- |
| `code`     | `string` | From email to verify the user |
| `password` | `string` | New password                  |

```http
  POST /user/:login/reset-password
```

### Update user score or avatar 🔒 🗝

| Param    |        Type        |
| :------- | :----------------: |
| `score`  | `number(optional)` |
| `avatar` | `number(optional)` |

```http
  PUT /user
```

```json
{
  "isSuccess": true,
  "message": "User was successfully updated"
}
```

### Delete user 🔒

Самовыпил

```http
  DELETE /user
```

```json
{
  "isSuccess": true,
  "message": "User was successfully deleted"
}
```

### Get leaderboard 🔒

```http
  GET /leaderboard?limit=:limit
```

| Параметр |        Type        | Description   |
| :------- | :----------------: | :------------ |
| `limit`  | `number(optional)` | 25 by default |

```ts
{
  "isSuccess": true,
  "leaderboard": User[],
  // if there is no authorized user in the leaderboard
  // then we push it into chunk
  "chunk": (...User, "place": number)[]
}
```

### Clear leaderboard 🗝

Write 0 to score

```http
  DELETE /leaderboard
```

```json
{
  "isSuccess": true,
  "message": "Leaderboard was successfully cleared"
}
```

### Get leaders

```http
  GET /leaderboard/best
```

| Query   |        Type        | Description   |
| :------ | :----------------: | :------------ |
| `limit` | `number(optional)` | 25 by default |

```ts
{
  "isSuccess": true,
  "leaderboard": User[]
}
```

### Clear leaderboard and leaders 🗝

Write 0 to score and pb

```http
  DELETE /leaderboard/best
```

```json
{
  "isSuccess": true,
  "message": "Leaderboard and leaders was successfully cleared"
}
```
