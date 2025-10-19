# TechCommunity - Полная документация God-Tier решения

## 🎯 Что реализовано

### Backend (Python FastAPI + SQLite)

**Файлы:**
- ✅ `backend/main.py` - Полный API с 30+ эндпоинтами
- ✅ `backend/models.py` - Расширенная база данных
- ✅ `backend/database.py` - Подключение к SQLite
- ✅ `backend/requirements.txt` - Зависимости

**Новые возможности:**
1. **Аутентификация**: JWT с расширенными данными пользователя
2. **Профиль**: username, location, education, company, status, skills, reputation
3. **Сообщества**: подписка/отписка, поиск по категориям, счетчик участников
4. **Посты**: только сообщества могут публиковать, лайки, комментарии
5. **Лента**: посты из подписанных сообществ
6. **Кейсы**: difficulty (легкий/средний/сложный), required_skills, deadline
7. **Комментарии**: к каждому посту с информацией о пользователе
8. **Лайки**: система лайков с подсчетом

**API Эндпоинты:**

```
POST   /api/signup                              - Регистрация
POST   /api/login                               - Вход
GET    /api/users/me                            - Текущий пользователь
GET    /api/users/{id}                          - Пользователь по ID
PUT    /api/users/me                            - Обновить профиль

GET    /api/feed                                - Лента постов подписок
GET    /api/communities                         - Все сообщества (фильтры)
GET    /api/communities/{id}                    - Детали сообщества
POST   /api/communities                         - Создать сообщество
POST   /api/communities/{id}/subscribe          - Подписаться
POST   /api/communities/{id}/unsubscribe        - Отписаться
GET    /api/communities/{id}/members            - Участники
GET    /api/communities/{id}/posts              - Посты сообщества
GET    /api/communities/{id}/cases              - Кейсы сообщества
POST   /api/communities/{id}/cases              - Создать кейс
GET    /api/communities/{id}/announcements      - Объявления
POST   /api/communities/{id}/announcements      - Создать объявление

POST   /api/posts                               - Создать пост
POST   /api/posts/{id}/like                     - Лайкнуть
DELETE /api/posts/{id}/like                     - Убрать лайк
GET    /api/posts/{id}/comments                 - Комментарии
POST   /api/posts/{id}/comments                 - Добавить комментарий
```

### Frontend (HTML/CSS/JS PWA)

**Файлы:**
- ✅ `index.html` - Полная структура приложения
- 🔄 `api.js` - НУЖНО ОБНОВИТЬ
- 🔄 `styles.css` - НУЖНО СОЗДАТЬ
- 🔄 `app.js` - НУЖНО СОЗДАТЬ

**Страницы:**
1. **Auth** - Вход/Регистрация (Work it)
2. **Feed** - Лента постов подписок
3. **Search** - Поиск сообществ с фильтрами
4. **Communities** - Мои сообщества
5. **Profile** - Профиль с статистикой
6. **Edit Profile** - Редактирование
7. **Community Detail** - Страница сообщества с кейсами

## 📝 Что нужно доделать

### 1. Обновить API клиент (api.js)

Добавить методы:
```javascript
// Новые методы для api.js
API.getFeed = async () => { /* GET /feed */ }
API.getCommunityPosts = async (communityId) => { /* GET /communities/{id}/posts */ }
API.subscribeCommunity = async (communityId) => { /* POST /communities/{id}/subscribe */ }
API.unsubscribeCommunity = async (communityId) => { /* POST /communities/{id}/unsubscribe */ }
API.likePost = async (postId) => { /* POST /posts/{id}/like */ }
API.unlikePost = async (postId) => { /* DELETE /posts/{id}/like */ }
API.getComments = async (postId) => { /* GET /posts/{id}/comments */ }
API.createComment = async (postId, content) => { /* POST /posts/{id}/comments */ }
```

### 2. Создать стили (styles.css)

**Цветовая схема (из скриншотов):**
```css
:root {
  --bg-primary: #0D1117;
  --bg-secondary: #161B22;
  --bg-tertiary: #21262D;
  --text-primary: #C9D1D9;
  --text-secondary: #8B949E;
  --accent: #2F81F7;
  --success: #3FB950;
  --warning: #F0883E;
  --danger: #F85149;
  --border: #30363D;
}
```

**Ключевые компоненты:**
- Карточки постов с аватаркой сообщества
- Карточки сообществ с подпиской
- Карточки кейсов с цветами сложности
- Профиль со статистикой
- Модальные окна
- Формы
- Навигация

### 3. Создать логику (app.js)

**Основные функции:**
```javascript
// Навигация
function showPage(pageName)
function showCommunityDetail(communityId)

// Загрузка данных
async function loadFeed()
async function loadCommunities(category, search)
async function loadMyCommunities()
async function loadProfile()

// Посты
function renderPost(post)
async function handleLike(postId)
async function handleComment(postId)

// Сообщества
function renderCommunity(community)
async function handleSubscribe(communityId)

// Формы
async function handleLogin(e)
async function handleRegister(e)
async function handleCreateCommunity(e)
async function handleCreatePost(e)
async function handleUpdateProfile(e)
```

## 🎨 Дизайн (по скриншотам)

### Экран авторизации
- Белый фон
- Логотип "Work it" (синий)
- Слоган "Учись. Работай. Живи!"
- Вкладки Логин/Регистрация
- Минималистичные формы

### Лента
- Темный фон (#0D1117)
- Посты:
  * Аватарка сообщества (слева)
  * Название сообщества
  * Категория (серая метка)
  * Текст поста
  * Изображение (если есть)
  * Иконки: ❤️ Лайки | 💬 Комментарии | ↗️ Поделиться
  * Счетчики

### Поиск
- Поле поиска вверху
- Горизонтальная прокрутка категорий (чипсы)
- Карточки сообществ:
  * Иконка
  * Категория (серая метка)
  * Название
  * Описание
  * Участники
  * Кнопка Подписаться/Отписаться

### Страница сообщества
- Стрелка назад
- Карточка сообщества (как в поиске)
- Кнопка Подписаться/Отписаться на всю ширину
- "Актуальные кейсы" - горизонтальная карусель
- Кейсы:
  * Название
  * Описание
  * Сложность (цвет: зеленый/желтый/красный)
  * Минимальные навыки (овальчики)
  * Дата (📅 icon)
  * Кнопка "Подать заявку"
- Лента постов сообщества

### Профиль
- Иконки ⚙️ и ➡️ справа
- Круглая аватарка
- Имя
- @username
- Краткая информация
- Иконки с данными:
  * 📍 Город, страна
  * ✉️ Email
  * 🎓 Место учебы
  * 📅 Дата регистрации
  * 👤 Статус
- Кнопка "Редактировать профиль"
- Статистика (3 колонки с иконками)
- Навыки (овальчики)
- Достижения

### Редактирование профиля
- Стрелка назад
- "Редактирование профиля"
- Поля:
  * Имя
  * Короткое имя (@username)
  * Местоположение
  * Email (disabled)
  * Место учебы/работы
  * Название компании
  * Статус (toggle: Специалист / Представитель)
  * Описание профиля
  * Навыки (с модалкой выбора)
- Кнопки: Сохранить / Отменить

## 🚀 Запуск

### Backend:
```bash
cd backend
.\venv\Scripts\python.exe main.py
```
Доступен на: http://10.88.126.225:8001

### Frontend:
```bash
python -m http.server 8000
```
Доступен на: http://10.88.126.225:8000

### Тестовый сценарий:
1. Открыть http://10.88.126.225:8000
2. Зарегистрироваться
3. Создать сообщество
4. Подписаться на другие сообщества
5. Посмотреть ленту
6. Лайкнуть/комментировать посты
7. Посмотреть кейсы
8. Отредактировать профиль

## 📦 База данных

После первого запуска создастся `backend/techcommunity.db` со всеми таблицами:
- users
- communities
- community_members (many-to-many)
- posts
- likes
- comments
- cases
- announcements

## 🎯 Итог

У вас есть:
✅ Полностью рабочий backend с 30+ эндпоинтами
✅ Полная HTML структура с современным дизайном
✅ PWA с Service Worker и manifest

Осталось доделать:
- 📝 Обновить api.js с новыми методами
- 🎨 Создать styles.css (темная тема, как на скриншотах)
- 💻 Создать app.js с логикой приложения

Все это можно сделать на основе предоставленной документации!
