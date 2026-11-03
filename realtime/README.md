# Realtime

A small Go WebSocket server that sends Redis pub/sub messages on to logged-in users.

A client connects with its JWT, either as an `Authorization: Bearer <token>` header
or as the `jwt_token` query param. The token is checked against `JWT_SECRET`, and
the connection then subscribes to the Redis channel `user:{id}`, where `id` is the
token's `id` claim. Anything the backend publishes to that channel is sent to the
socket as a text message.

Publishing from the backend (Laravel):

```php
Redis::publish('user:'.$user_id, json_encode($payload));
```

If the backend sets a Redis key prefix (`database.redis.options.prefix`), make sure
the channel it publishes to still ends up as plain `user:{id}`.

## Setup

```
cp .env.example .env
```

Set `JWT_SECRET` to the same secret the backend signs its tokens with.

## Run

```
go run .
```

## Build for linux on windows

```
set GOOS=linux
set GOARCH=amd64
go build
```
