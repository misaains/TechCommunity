# 🎯 Примеры использования API

## ✅ API обновлен под реальные эндпоинты бэкенда!

Все методы теперь соответствуют вашему бэкенду на `http://172.20.10.2:8000/api`

---

## 📋 Полный список эндпоинтов

### 🔐 Аутентификация

#### 1. Регистрация
```javascript
await window.API.signup({
  email: 'user@example.com',
  password: 'password123',
  name: 'Иван Иванов'
})
```

#### 2. Вход
```javascript
// Логин с помощью email и пароля
await window.API.login('user@example.com', 'password123')
// Токен автоматически сохранится в localStorage
```

#### 3. Выход
```javascript
window.API.logout()
// Токен удалится из localStorage
```

---

### 👤 Пользователи

#### 1. Получить профиль пользователя
```javascript
await window.API.getUser(1) // user_id = 1
```

#### 2. Обновить свой профиль
```javascript
await window.API.updateProfile({
  name: 'Новое имя',
  bio: 'Моя биография',
  skills: ['JavaScript', 'Python']
})
```

---

### 🏘️ Сообщества

#### 1. Получить все сообщества
```javascript
// Все сообщества
await window.API.getCommunities()

// С фильтрацией по тегам
await window.API.getCommunities('frontend,javascript')
```

#### 2. Получить конкретное сообщество
```javascript
await window.API.getCommunity(1) // community_id = 1
```

#### 3. Создать сообщество
```javascript
await window.API.createCommunity({
  name: 'Frontend Developers',
  description: 'Сообщество frontend разработчиков',
  tags: ['frontend', 'javascript', 'react']
})
```

---

### 👥 Участники сообществ

#### 1. Вступить в сообщество
```javascript
await window.API.joinCommunity(1) // community_id = 1
```

#### 2. Получить участников
```javascript
await window.API.getCommunityMembers(1) // community_id = 1
```

---

### 📢 Объявления

#### 1. Создать объявление
```javascript
await window.API.createAnnouncement(1, {
  title: 'Важное объявление',
  content: 'Текст объявления'
})
```

#### 2. Получить объявления сообщества
```javascript
await window.API.getAnnouncements(1) // community_id = 1
```

---

### 📝 Кейсы

#### 1. Создать кейс
```javascript
await window.API.createCase(1, {
  title: 'Нужна помощь с React',
  description: 'Описание проблемы',
  difficulty: 'medium',
  tags: ['react', 'help']
})
```

#### 2. Получить кейсы сообщества
```javascript
await window.API.getCases(1) // community_id = 1
```

---

## 🚀 Полный сценарий использования

### Сценарий 1: Регистрация и создание сообщества

```javascript
// 1. Регистрация
await window.API.signup({
  email: 'newuser@example.com',
  password: 'password123',
  name: 'Новый Пользователь'
})

// 2. Вход
await window.API.login('newuser@example.com', 'password123')
// Токен сохранен автоматически!

// 3. Создаем сообщество
const community = await window.API.createCommunity({
  name: 'Backend Developers',
  description: 'Сообщество backend разработчиков',
  tags: ['backend', 'kotlin', 'spring']
})

console.log('Сообщество создано:', community)
```

### Сценарий 2: Вступление в сообщество и создание кейса

```javascript
// 1. Войти (если еще не вошли)
await window.API.login('user@example.com', 'password123')

// 2. Получить список сообществ
const communities = await window.API.getCommunities()
console.log('Доступные сообщества:', communities)

// 3. Вступить в первое сообщество
const communityId = communities[0].id
await window.API.joinCommunity(communityId)

// 4. Создать кейс в этом сообществе
const newCase = await window.API.createCase(communityId, {
  title: 'Помощь с API',
  description: 'Нужна помощь с интеграцией API',
  difficulty: 'medium',
  tags: ['api', 'integration']
})

console.log('Кейс создан:', newCase)
```

### Сценарий 3: Работа с объявлениями

```javascript
// 1. Получить сообщество
const community = await window.API.getCommunity(1)

// 2. Создать объявление
const announcement = await window.API.createAnnouncement(1, {
  title: 'Встреча сообщества',
  content: 'Приглашаем всех на встречу в субботу!'
})

// 3. Получить все объявления
const announcements = await window.API.getAnnouncements(1)
console.log('Объявления:', announcements)
```

---

## 🔧 Проверка статуса API

### Проверить конфигурацию
```javascript
window.API.getConfig()
// Результат:
// {
//   API_BASE_URL: "http://172.20.10.2:8000/api",
//   TIMEOUT: 10000,
//   DEBUG: true,
//   isAuthenticated: true,  // если залогинен
//   hasToken: true
// }
```

### Проверить авторизацию
```javascript
window.API.isAuthenticated()  // true или false

window.API.getToken()  // вернет токен или null
```

---

## 🔐 Важно про аутентификацию!

### Автоматическая отправка токена

Токен автоматически добавляется в заголовок `Authorization: Bearer <token>` для всех запросов (кроме `/login` и `/signup`).

### Обработка ошибок 401

Если бэкенд вернет 401 (Unauthorized), токен автоматически удалится.

```javascript
try {
  await window.API.getCommunities()
} catch (error) {
  if (error.message.includes('401')) {
    console.log('Токен истек, нужно войти заново')
    // Перенаправить на страницу логина
  }
}
```

### Сохранение токена

Токен сохраняется в `localStorage`, поэтому при перезагрузке страницы пользователь остается залогиненным.

```javascript
// Проверить токен в localStorage
localStorage.getItem('authToken')
```

---

## ⚠️ Обработка ошибок

### Типичные ошибки и решения

#### 1. CORS ошибка
```javascript
❌ Access to fetch... has been blocked by CORS policy
```
**Решение:** Попросите бэкенд-разработчика настроить CORS (инструкция в `API_SPECIFICATION.md`)

#### 2. 401 Unauthorized
```javascript
❌ Error: 401: Unauthorized
```
**Решение:** Выполните логин снова
```javascript
await window.API.login('your@email.com', 'password')
```

#### 3. 404 Not Found
```javascript
❌ Error: 404: Not Found
```
**Решение:** Проверьте, что эндпоинт существует на бэкенде

#### 4. Timeout
```javascript
❌ Error: Request timeout
```
**Решение:** Проверьте, что бэкенд запущен и доступен

---

## 📱 Интеграция с формами в приложении

### Форма "Новый пост" (теперь это Announcement)

```javascript
// В app.js найдите обработчик формы и замените:

document.getElementById('publishPostBtn').addEventListener('click', async () => {
  const communityId = 1; // ID текущего сообщества
  
  const title = document.getElementById('postTitle').value;
  const content = document.getElementById('postContent').value;
  
  try {
    const announcement = await window.API.createAnnouncement(communityId, {
      title: title,
      content: content
    });
    
    console.log('✅ Объявление создано!', announcement);
    // Закрыть модальное окно
    // Обновить ленту
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    alert('Ошибка при создании объявления: ' + error.message);
  }
});
```

### Форма "Создать сообщество"

```javascript
document.getElementById('submitCommunityBtn').addEventListener('click', async () => {
  const name = document.getElementById('communityName').value;
  const description = document.getElementById('communityDescription').value;
  const tags = document.getElementById('communityTags').value.split(',').map(t => t.trim());
  
  try {
    const community = await window.API.createCommunity({
      name: name,
      description: description,
      tags: tags
    });
    
    console.log('✅ Сообщество создано!', community);
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    alert('Ошибка при создании сообщества: ' + error.message);
  }
});
```

### Форма "Создать кейс"

```javascript
document.getElementById('submitCaseBtn').addEventListener('click', async () => {
  const communityId = 1; // ID текущего сообщества
  
  const title = document.getElementById('caseTitle').value;
  const description = document.getElementById('caseDescription').value;
  const tags = document.getElementById('caseTags').value.split(',').map(t => t.trim());
  
  try {
    const newCase = await window.API.createCase(communityId, {
      title: title,
      description: description,
      tags: tags
    });
    
    console.log('✅ Кейс создан!', newCase);
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    alert('Ошибка при создании кейса: ' + error.message);
  }
});
```

---

## 🎯 Готово к использованию!

✅ API обновлен под реальные эндпоинты
✅ Аутентификация с токенами
✅ Автоматическое сохранение токена
✅ Обработка ошибок 401
✅ CORS поддержка

Откройте консоль браузера (F12) и начинайте тестировать! 🚀
