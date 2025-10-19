# Backend для TechCommunity

Полнофункциональный Python backend на FastAPI для мобильного приложения TechCommunity.

## Установка

1. Создайте виртуальное окружение:
```bash
python -m venv venv
```

2. Активируйте виртуальное окружение:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. Установите зависимости:
```bash
pip install -r requirements.txt
```

## Запуск

```bash
# Из папки backend
python main.py

# Или с помощью uvicorn напрямую
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend будет доступен по адресу: http://localhost:8000

## API Documentation

После запуска сервера:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Структура

```
backend/
├── main.py              # Основной файл с API эндпоинтами
├── models.py            # SQLAlchemy модели (User, Community, Post, etc.)
├── database.py          # Настройка подключения к БД
├── requirements.txt     # Python зависимости
└── techcommunity.db     # SQLite база данных (создастся автоматически)
```

## Основные эндпоинты

### Аутентификация
- `POST /api/signup` - Регистрация нового пользователя
- `POST /api/login` - Вход (возвращает JWT токен)

### Пользователи
- `GET /api/users/me` - Получить текущего пользователя
- `GET /api/users/{user_id}` - Получить пользователя по ID
- `PUT /api/users/me` - Обновить профиль

### Сообщества
- `GET /api/communities` - Список всех сообществ
- `GET /api/communities/{id}` - Получить сообщество
- `POST /api/communities` - Создать сообщество
- `POST /api/communities/{id}/join` - Вступить в сообщество
- `GET /api/communities/{id}/members` - Участники сообщества

### Объявления
- `GET /api/communities/{id}/announcements` - Объявления сообщества
- `POST /api/communities/{id}/announcements` - Создать объявление

### Кейсы
- `GET /api/communities/{id}/cases` - Кейсы сообщества
- `POST /api/communities/{id}/cases` - Создать кейс

### Посты
- `GET /api/posts` - Все посты
- `POST /api/posts` - Создать пост

## База данных

Используется SQLite для простоты. База создаётся автоматически при первом запуске.

### Таблицы:
- `users` - Пользователи
- `communities` - Сообщества
- `posts` - Посты
- `announcements` - Объявления
- `cases` - Кейсы
- `community_members` - Связь пользователей и сообществ (many-to-many)

## Авторизация

Используется JWT (JSON Web Token) с Bearer аутентификацией.

После логина получите токен и отправляйте его в заголовке:
```
Authorization: Bearer <your-token>
```

Токен действителен 7 дней.

## CORS

CORS настроен на все origins (`*`) для разработки. 
В production укажите конкретные домены в `main.py`.

## Тестирование

Можно использовать встроенный Swagger UI (http://localhost:8000/docs) для тестирования всех эндпоинтов.

## Production

Для production рекомендуется:
1. Изменить `SECRET_KEY` в `main.py`
2. Настроить конкретные CORS origins
3. Использовать PostgreSQL вместо SQLite
4. Настроить HTTPS
5. Использовать gunicorn + uvicorn workers
