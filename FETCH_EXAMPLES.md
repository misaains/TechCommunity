# 🚀 Примеры чистых fetch-запросов для TechCommunity API

## 📍 Базовая информация

**Бэкенд:** Python (Flask/FastAPI)  
**API Base URL:** `http://172.20.10.2:8000/api`  
**Фронтенд:** `http://172.20.10.6:8000` (или ваш IP)

---

## ✅ Ваш API уже использует fetch!

Все методы в `window.API` внутри используют `fetch()`. Но вот примеры, как делать **прямые fetch-запросы** без обёртки.

---

## 🔐 1. Авторизация (Login)

### Регистрация (signup)
```javascript
// POST /api/signup
const signupData = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
};

fetch('http://172.20.10.2:8000/api/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(signupData)
})
.then(response => response.json())
.then(data => {
  console.log('✅ Регистрация успешна:', data);
})
.catch(error => {
  console.error('❌ Ошибка регистрации:', error);
});
```

### Вход (login) с form-data
```javascript
// POST /api/login (требует form-data с username и password)
const formData = new FormData();
formData.append('username', 'test@example.com'); // бэкенд ожидает username
formData.append('password', 'password123');

fetch('http://172.20.10.2:8000/api/login', {
  method: 'POST',
  body: formData // НЕ добавляем Content-Type, браузер сам установит multipart/form-data
})
.then(response => response.json())
.then(data => {
  console.log('✅ Логин успешен:', data);
  
  // Сохраняем токен в localStorage
  if (data.access_token) {
    localStorage.setItem('authToken', data.access_token);
    console.log('🔐 Токен сохранён');
  }
})
.catch(error => {
  console.error('❌ Ошибка логина:', error);
});
```

---

## 🏘️ 2. Сообщества (Communities)

### Получить все сообщества
```javascript
// GET /api/communities
const token = localStorage.getItem('authToken');

fetch('http://172.20.10.2:8000/api/communities', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
})
.then(data => {
  console.log('✅ Сообщества получены:', data);
  console.log('Всего:', data.length);
})
.catch(error => {
  console.error('❌ Ошибка:', error);
});
```

### Получить конкретное сообщество
```javascript
// GET /api/communities/{id}
const communityId = 1;
const token = localStorage.getItem('authToken');

fetch(`http://172.20.10.2:8000/api/communities/${communityId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => console.log('Сообщество:', data))
.catch(error => console.error('Ошибка:', error));
```

### Создать сообщество
```javascript
// POST /api/communities
const token = localStorage.getItem('authToken');

const newCommunity = {
  name: 'Python Developers',
  description: 'Сообщество Python разработчиков',
  tags: ['python', 'backend', 'fastapi']
};

fetch('http://172.20.10.2:8000/api/communities', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newCommunity)
})
.then(r => r.json())
.then(data => {
  console.log('✅ Сообщество создано:', data);
})
.catch(error => {
  console.error('❌ Ошибка создания:', error);
});
```

### Вступить в сообщество
```javascript
// POST /api/communities/{id}/join
const communityId = 1;
const token = localStorage.getItem('authToken');

fetch(`http://172.20.10.2:8000/api/communities/${communityId}/join`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => console.log('✅ Вступили в сообщество:', data))
.catch(error => console.error('❌ Ошибка:', error));
```

---

## 📢 3. Объявления (Announcements)

### Создать объявление
```javascript
// POST /api/communities/{id}/announcements
const communityId = 1;
const token = localStorage.getItem('authToken');

const announcement = {
  title: 'Важное объявление',
  content: 'Встреча сообщества в субботу!'
};

fetch(`http://172.20.10.2:8000/api/communities/${communityId}/announcements`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(announcement)
})
.then(r => r.json())
.then(data => console.log('✅ Объявление создано:', data))
.catch(error => console.error('❌ Ошибка:', error));
```

### Получить объявления
```javascript
// GET /api/communities/{id}/announcements
const communityId = 1;
const token = localStorage.getItem('authToken');

fetch(`http://172.20.10.2:8000/api/communities/${communityId}/announcements`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => console.log('Объявления:', data))
.catch(error => console.error('Ошибка:', error));
```

---

## 📝 4. Кейсы (Cases)

### Создать кейс
```javascript
// POST /api/communities/{id}/cases
const communityId = 1;
const token = localStorage.getItem('authToken');

const newCase = {
  title: 'Нужна помощь с API',
  description: 'Не могу подключиться к бэкенду',
  tags: ['help', 'api', 'python']
};

fetch(`http://172.20.10.2:8000/api/communities/${communityId}/cases`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newCase)
})
.then(r => r.json())
.then(data => console.log('✅ Кейс создан:', data))
.catch(error => console.error('❌ Ошибка:', error));
```

### Получить кейсы
```javascript
// GET /api/communities/{id}/cases
const communityId = 1;
const token = localStorage.getItem('authToken');

fetch(`http://172.20.10.2:8000/api/communities/${communityId}/cases`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => console.log('Кейсы:', data))
.catch(error => console.error('Ошибка:', error));
```

---

## 👤 5. Пользователи

### Получить профиль пользователя
```javascript
// GET /api/users/{id}
const userId = 1;
const token = localStorage.getItem('authToken');

fetch(`http://172.20.10.2:8000/api/users/${userId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => console.log('Профиль пользователя:', data))
.catch(error => console.error('Ошибка:', error));
```

### Обновить свой профиль
```javascript
// PUT /api/users/me
const token = localStorage.getItem('authToken');

const updatedProfile = {
  name: 'Новое имя',
  bio: 'Python developer',
  skills: ['Python', 'FastAPI', 'PostgreSQL']
};

fetch('http://172.20.10.2:8000/api/users/me', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(updatedProfile)
})
.then(r => r.json())
.then(data => console.log('✅ Профиль обновлён:', data))
.catch(error => console.error('❌ Ошибка:', error));
```

---

## 🔥 Быстрые проверки в консоли браузера

### 1. Проверить, доступен ли бэкенд
```javascript
fetch('http://172.20.10.2:8000/')
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
```

### 2. Проверить токен
```javascript
localStorage.getItem('authToken')
```

### 3. Полный сценарий: регистрация → логин → получение сообществ
```javascript
async function testAPI() {
  try {
    // 1. Регистрация
    const signupResp = await fetch('http://172.20.10.2:8000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User'
      })
    });
    const signupData = await signupResp.json();
    console.log('✅ Регистрация:', signupData);
    
    // 2. Логин
    const formData = new FormData();
    formData.append('username', 'test@example.com');
    formData.append('password', 'password123');
    
    const loginResp = await fetch('http://172.20.10.2:8000/api/login', {
      method: 'POST',
      body: formData
    });
    const loginData = await loginResp.json();
    console.log('✅ Логин:', loginData);
    
    const token = loginData.access_token;
    localStorage.setItem('authToken', token);
    
    // 3. Получить сообщества
    const commResp = await fetch('http://172.20.10.2:8000/api/communities', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const communities = await commResp.json();
    console.log('✅ Сообщества:', communities);
    
    console.log('🎉 Все тесты пройдены!');
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

// Запустить
testAPI();
```

---

## 🐍 Для бэкенд-разработчика (Python)

Если бэкенд на **Flask**, добавьте CORS:
```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
```

Если на **FastAPI**, добавьте CORS middleware:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://172.20.10.6:8000", "*"],  # или конкретные origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## ✅ Итого

**Ваш `api.js` уже использует fetch** во всех методах через обёртку `apiRequest`.

**Для быстрых проверок** можете использовать примеры из этого файла — копируйте в консоль браузера (F12 → Console) и тестируйте напрямую!

**Удачи на хакатоне!** 🚀
