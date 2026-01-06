# Запуск

## 1. Клонирование репозитория

```bash
git clone https://github.com/itmo-webdev/lab2_Barkova_A_M
cd lab2_Barkova_A_M
```

## 2. Установка зависимостей

```bash
npm install
```

## 3. Настройка окружения

```bash
cp .env.example .env
```

## 4. Запуск приложения

```bash
npm run dev
```

При этом должен быть запущен бэкенд.

# Список страниц
- Авторизация
- Список новостей
- Меню создания новости
- Карточка новости

# Примеры запросов
Полный список можно посмотреть в репо бэкенда.
## 1. Регистрация пользователя
```bash
curl -s -X POST http://127.0.0.1:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jack","email":"jack@example.com","password":"123456"}' | jq .
```

Ответ сервера:
```json
{
  "access": "<ACCESS_TOKEN>",
  "refresh": "<REFRESH_TOKEN>"
}
```

## 2. Логин
```bash
curl -s -X POST http://127.0.0.1:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jack@example.com","password":"123456"}' | jq .
```

Ответ сервера:
```json
{
  "access": "<ACCESS_TOKEN>",
  "refresh": "<REFRESH_TOKEN>"
}
```

## 3. Обновление токена
```bash
curl -s -X POST http://127.0.0.1:8000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refresh\":\"$REFRESH_TOKEN\"}" | jq .
```

Ответ сервера:
```json
{
  "access": "<ACCESS_TOKEN>",
  "refresh": "<REFRESH_TOKEN>"
}
```

## 4. Logout
```bash
curl -i -X POST http://127.0.0.1:8000/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -d "{\"refresh\":\"$REFRESH_TOKEN\"}"
```
