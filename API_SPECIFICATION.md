# 📡 API Спецификация для Backend-разработчика

## 👋 Привет, Backend Developer!

Этот документ описывает, какие **API endpoints** нужны для фронтенда TechCommunity.

---

## 🌐 Базовая информация

### Адрес бэкенда:
```
http://localhost:8080/api
```
(или любой другой, главное сообщить фронтенду)

### ⚠️ ВАЖНО: CORS
Бэкенд **ОБЯЗАТЕЛЬНО** должен разрешить CORS для фронтенда!

**Для Ktor:**
```kotlin
install(CORS) {
    anyHost()
    allowMethod(HttpMethod.Get)
    allowMethod(HttpMethod.Post)
    allowMethod(HttpMethod.Put)
    allowMethod(HttpMethod.Delete)
    allowHeader(HttpHeaders.ContentType)
}
```

**Для Spring Boot:**
```kotlin
@CrossOrigin(origins = ["*"])
```

---

## 📋 API Endpoints

### 1. Сообщества

#### 1.1 Получить все сообщества
```http
GET /api/communities
```

**Query параметры (опционально):**
- `category` - фильтр по категории (`tech`, `design`, `business`, `science`)
- `search` - поисковый запрос

**Ответ (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Технологии и IT",
    "description": "Разработчики будущего",
    "members": 12543,
    "category": "tech",
    "avatarUrl": "https://example.com/avatar.png"
  },
  {
    "id": 2,
    "name": "Дизайнеры и творцы",
    "description": "UI/UX и графический дизайн",
    "members": 8234,
    "category": "design",
    "avatarUrl": "https://example.com/avatar2.png"
  }
]
```

---

#### 1.2 Получить сообщество по ID
```http
GET /api/communities/{id}
```

**Ответ (200 OK):**
```json
{
  "id": 1,
  "name": "Технологии и IT",
  "description": "Разработчики будущего",
  "members": 12543,
  "category": "tech",
  "avatarUrl": "https://example.com/avatar.png",
  "createdAt": "2023-10-01T12:00:00Z",
  "admins": [1, 5],
  "moderators": [3, 8]
}
```

---

#### 1.3 Создать сообщество
```http
POST /api/communities
```

**Тело запроса:**
```json
{
  "name": "Новое сообщество",
  "description": "Описание сообщества",
  "category": "tech",
  "avatarUrl": "https://example.com/avatar.png"
}
```

**Ответ (201 Created):**
```json
{
  "id": 3,
  "name": "Новое сообщество",
  "description": "Описание сообщества",
  "members": 1,
  "category": "tech",
  "avatarUrl": "https://example.com/avatar.png",
  "createdAt": "2025-10-18T14:30:00Z"
}
```

---

#### 1.4 Вступить в сообщество
```http
POST /api/communities/{id}/join
```

**Тело запроса:**
```json
{
  "userId": 1
}
```

**Ответ (200 OK):**
```json
{
  "success": true,
  "message": "Вы вступили в сообщество",
  "communityId": 1,
  "userId": 1
}
```

---

#### 1.5 Покинуть сообщество
```http
POST /api/communities/{id}/leave
```

**Тело запроса:**
```json
{
  "userId": 1
}
```

**Ответ (200 OK):**
```json
{
  "success": true,
  "message": "Вы покинули сообщество"
}
```

---

### 2. Посты

#### 2.1 Получить все посты
```http
GET /api/posts
```

**Query параметры (опционально):**
- `communityId` - посты только из этого сообщества
- `userId` - посты только от этого пользователя

**Ответ (200 OK):**
```json
[
  {
    "id": 1,
    "authorId": 1,
    "authorName": "Алексей Смирнов",
    "authorAvatar": "https://example.com/avatar.png",
    "communityId": 1,
    "communityName": "Технологии и IT",
    "content": "Сегодня мы запустили новую функцию!",
    "imageUrl": "https://example.com/post-image.jpg",
    "likes": 142,
    "comments": 28,
    "timestamp": "2025-10-18T10:30:00Z",
    "createdAt": "2025-10-18T10:30:00Z"
  }
]
```

---

#### 2.2 Получить пост по ID
```http
GET /api/posts/{id}
```

**Ответ (200 OK):**
```json
{
  "id": 1,
  "authorId": 1,
  "authorName": "Алексей Смирнов",
  "authorAvatar": "https://example.com/avatar.png",
  "communityId": 1,
  "communityName": "Технологии и IT",
  "content": "Сегодня мы запустили новую функцию!",
  "imageUrl": "https://example.com/post-image.jpg",
  "likes": 142,
  "comments": 28,
  "timestamp": "2025-10-18T10:30:00Z"
}
```

---

#### 2.3 Создать пост
```http
POST /api/posts
```

**Тело запроса:**
```json
{
  "authorId": 1,
  "communityId": 1,
  "content": "Текст поста здесь",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Ответ (201 Created):**
```json
{
  "id": 2,
  "authorId": 1,
  "authorName": "Имя пользователя",
  "authorAvatar": "https://example.com/avatar.png",
  "communityId": 1,
  "communityName": "Технологии и IT",
  "content": "Текст поста здесь",
  "imageUrl": "https://example.com/image.jpg",
  "likes": 0,
  "comments": 0,
  "timestamp": "2025-10-18T14:35:00Z"
}
```

---

#### 2.4 Лайкнуть пост
```http
POST /api/posts/{id}/like
```

**Тело запроса:**
```json
{
  "userId": 1
}
```

**Ответ (200 OK):**
```json
{
  "success": true,
  "likes": 143,
  "postId": 1,
  "userId": 1
}
```

---

#### 2.5 Убрать лайк
```http
POST /api/posts/{id}/unlike
```

**Тело запроса:**
```json
{
  "userId": 1
}
```

**Ответ (200 OK):**
```json
{
  "success": true,
  "likes": 142
}
```

---

### 3. Комментарии

#### 3.1 Получить комментарии к посту
```http
GET /api/posts/{postId}/comments
```

**Ответ (200 OK):**
```json
[
  {
    "id": 1,
    "postId": 1,
    "authorId": 2,
    "authorName": "Мария Петрова",
    "authorAvatar": "https://example.com/avatar2.png",
    "content": "Отличная работа!",
    "createdAt": "2025-10-18T10:45:00Z"
  }
]
```

---

#### 3.2 Добавить комментарий
```http
POST /api/posts/{postId}/comments
```

**Тело запроса:**
```json
{
  "userId": 2,
  "content": "Мой комментарий"
}
```

**Ответ (201 Created):**
```json
{
  "id": 2,
  "postId": 1,
  "authorId": 2,
  "authorName": "Мария Петрова",
  "authorAvatar": "https://example.com/avatar2.png",
  "content": "Мой комментарий",
  "createdAt": "2025-10-18T14:40:00Z"
}
```

---

### 4. Кейсы

#### 4.1 Получить все кейсы
```http
GET /api/cases
```

**Query параметры (опционально):**
- `communityId` - кейсы только из этого сообщества
- `difficulty` - фильтр по сложности (`easy`, `medium`, `hard`)

**Ответ (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Разработка мобильного приложения",
    "description": "Нужен опытный разработчик для создания приложения...",
    "difficulty": "medium",
    "skills": ["React Native", "TypeScript", "API"],
    "deadline": "2024-11-25",
    "communityId": 1,
    "communityName": "Технологии и IT",
    "applications": 15,
    "createdAt": "2025-10-15T12:00:00Z"
  }
]
```

---

#### 4.2 Получить кейс по ID
```http
GET /api/cases/{id}
```

**Ответ (200 OK):**
```json
{
  "id": 1,
  "title": "Разработка мобильного приложения",
  "description": "Нужен опытный разработчик...",
  "difficulty": "medium",
  "skills": ["React Native", "TypeScript", "API"],
  "deadline": "2024-11-25",
  "communityId": 1,
  "communityName": "Технологии и IT",
  "applications": 15,
  "createdAt": "2025-10-15T12:00:00Z"
}
```

---

#### 4.3 Создать кейс
```http
POST /api/cases
```

**Тело запроса:**
```json
{
  "title": "Название кейса",
  "description": "Подробное описание",
  "difficulty": "medium",
  "skills": ["React", "Node.js"],
  "deadline": "2024-12-01",
  "communityId": 1
}
```

**Ответ (201 Created):**
```json
{
  "id": 2,
  "title": "Название кейса",
  "description": "Подробное описание",
  "difficulty": "medium",
  "skills": ["React", "Node.js"],
  "deadline": "2024-12-01",
  "communityId": 1,
  "communityName": "Технологии и IT",
  "applications": 0,
  "createdAt": "2025-10-18T14:50:00Z"
}
```

---

#### 4.4 Подать заявку на кейс
```http
POST /api/cases/{id}/apply
```

**Тело запроса:**
```json
{
  "userId": 1
}
```

**Ответ (200 OK):**
```json
{
  "success": true,
  "message": "Заявка подана",
  "caseId": 1,
  "userId": 1
}
```

---

### 5. Пользователи

#### 5.1 Получить профиль пользователя
```http
GET /api/users/{id}
```

**Ответ (200 OK):**
```json
{
  "id": 1,
  "name": "Мария Иванова",
  "username": "maria_ivanova",
  "email": "maria@example.com",
  "bio": "Full-stack разработчик",
  "avatarUrl": "https://example.com/avatar.png",
  "location": "Москва, Россия",
  "university": "МГУ им. М.В. Ломоносова",
  "memberSince": "2023-10-01T00:00:00Z",
  "communitiesCount": 12,
  "casesCount": 24,
  "reputation": 4850,
  "skills": ["React", "TypeScript", "Node.js", "Python", "Figma", "PostgreSQL"]
}
```

---

#### 5.2 Обновить профиль
```http
PUT /api/users/{id}
```

**Тело запроса:**
```json
{
  "name": "Новое имя",
  "bio": "Новая биография",
  "location": "Санкт-Петербург, Россия",
  "skills": ["React", "Vue", "Angular"]
}
```

**Ответ (200 OK):**
```json
{
  "id": 1,
  "name": "Новое имя",
  "bio": "Новая биография",
  "location": "Санкт-Петербург, Россия",
  "skills": ["React", "Vue", "Angular"],
  "updatedAt": "2025-10-18T15:00:00Z"
}
```

---

#### 5.3 Получить статистику пользователя
```http
GET /api/users/{id}/stats
```

**Ответ (200 OK):**
```json
{
  "userId": 1,
  "communitiesCount": 12,
  "casesCompleted": 24,
  "casesInProgress": 3,
  "postsCount": 156,
  "commentsCount": 342,
  "reputation": 4850,
  "achievements": [
    {
      "id": 1,
      "name": "Ранний участник",
      "description": "Присоединился в первые 100",
      "icon": "🏅",
      "earnedAt": "2023-10-05T00:00:00Z"
    }
  ]
}
```

---

### 6. Аутентификация (если нужна)

#### 6.1 Вход
```http
POST /api/auth/login
```

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Ответ (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Мария Иванова",
    "email": "user@example.com"
  }
}
```

---

#### 6.2 Регистрация
```http
POST /api/auth/register
```

**Тело запроса:**
```json
{
  "name": "Новый пользователь",
  "email": "newuser@example.com",
  "password": "password123"
}
```

**Ответ (201 Created):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "name": "Новый пользователь",
    "email": "newuser@example.com"
  }
}
```

---

## 🚨 Коды ошибок

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Некорректные данные",
  "details": "Поле 'name' обязательно"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Сообщество с ID 999 не найдено"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Ошибка сервера"
}
```

---

## 📞 Контакты

**Frontend разработчик:** [Ваше имя]  
**Email:** [Ваш email]  
**Telegram:** [Ваш телеграм]

---

## ✅ Чеклист для Backend

- [ ] Настроить CORS (обязательно!)
- [ ] Реализовать все endpoints из списка
- [ ] Вернуть JSON в указанном формате
- [ ] Обработать ошибки (400, 404, 500)
- [ ] Протестировать через Postman/Insomnia
- [ ] Сообщить фронтенду адрес API (например, `http://localhost:8080/api`)

---

## 🧪 Как протестировать

### Используйте Postman или curl:

```bash
# Получить сообщества
curl http://localhost:8080/api/communities

# Создать пост
curl -X POST http://localhost:8080/api/posts \
  -H "Content-Type: application/json" \
  -d '{"authorId":1,"communityId":1,"content":"Тест"}'
```

---

**Спасибо! Если есть вопросы - пишите!** 🚀
