# Leaderboard API

## Local Setup

Для начала нужно создать базу данных Postgres  
Заполните файл конфигурации `ormconfig.env` по примеру [`ormconfig.example.env`](ormconfig.example.env)!

```bash
createdb leaderboard
```

Заполните файл конфигурации `.env` по примеру [`.example.env`](.example.env)!

```bash
yarn && yarn build && yarn start
```

## API Reference

- `/ping` - pong
- `/auth` - Регистрация, логин, верификация почты
- `/user` - CRUD система пользователей
- `/leaderboard` - Получение и очистка рейтинга

## User

| Тело запроса    |    Тип    |
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

## Middlewares (функции посредники)

### Аутентификация 🔒

Функция посредник отвечающая за проверку токена.  
Headers заполняем таким образом:

| Ключ            | Значение          |
| :-------------- | :---------------- |
| `Authorization` | `Bearer ${token}` |

### Аутентификация приложения 🗝

| Ключ          | Значение   |
| :------------ | :--------- |
| `x-app-token` | `appToken` |

appToken - jwt генерируем из рандомного объекта в payload и секретом `APP_JWT_SECRET`

## Endpoints

### ping

Для проверки работоспособности приложения

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

| Тело запроса |   Тип    | Описание           |
| :----------- | :------: | :----------------- |
| `login`      | `string` | Email или username |
| `password`   | `string` | Пароль             |

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

| Тело запроса |   Тип    | Описание               |
| :----------- | :------: | :--------------------- |
| `username`   | `string` |                        |
| `email`      | `string` |                        |
| `password`   | `string` |                        |
| `country`    | `string` | Исползуйте внешний API |

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

| Тело запроса |   Тип    | Описание                      |
| :----------- | :------: | :---------------------------- |
| `code`       | `string` | Из письма вводит пользователь |

### Me 🔒

Данные профиля авторизированного пользователя

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

Сначала пустой запрос делаем, потом заполняем:

| Тело запроса |   Тип    | Описание                      |
| :----------- | :------: | :---------------------------- |
| `code`       | `string` | Из письма вводит пользователь |
| `password`   | `string` | Новый пароль                  |

```http
  POST /user/:login/reset-password
```

### Update user score or avatar 🔒 🗝

| Тело запроса |    Тип    |
| :----------- | :-------: |
| `score`      | `?number` |
| `avatar`     | `?number` |

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

| Параметр |    Тип    | Описание                          |
| :------- | :-------: | :-------------------------------- |
| `limit`  | `?number` | По дефолту берём 25 пользователей |

```ts
{
  "isSuccess": true,
  "leaderboard": User[],
  // если нет авторизированого пользователя в leaderboard
  // то пихаем в chunk
  "chunk": (...User, "place": number)[]
}
```

### Clear leaderboard 🗝

Записываем 0 в score

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

| Query   |    Тип    | Описание                          |
| :------ | :-------: | :-------------------------------- |
| `limit` | `?number` | По дефолту берём 25 пользователей |

```ts
{
  "isSuccess": true,
  "leaderboard": User[]
}
```

### Clear leaderboard and leaders 🗝

Записываем 0 в score и pb

```http
  DELETE /leaderboard/best
```

```json
{
  "isSuccess": true,
  "message": "Leaderboard and leaders was successfully cleared"
}
```
