# ⚡ Быстрый smoke-test TechCommunity

## 🎯 Цель
Проверить, что фронтенд работает и fetch-запросы идут на бэкенд.

---

## ✅ Шаг 1: Откройте фронтенд

Откройте в браузере:
```
http://172.20.10.6:8000
```

---

## ✅ Шаг 2: Откройте консоль (F12 → Console)

---

## ✅ Шаг 3: Проверьте API

### 1. Конфигурация
```javascript
window.API.getConfig()
```

**Ожидаемый результат:**
```javascript
{
  API_BASE_URL: "http://172.20.10.2:8000/api",
  TIMEOUT: 10000,
  DEBUG: true,
  isAuthenticated: false,
  hasToken: false
}
```

### 2. Проверка бэкенда (без авторизации)
```javascript
fetch('http://172.20.10.2:8000/')
  .then(r => r.text())
  .then(text => console.log('✅ Бэкенд отвечает:', text))
  .catch(e => console.error('❌ Бэкенд не доступен:', e))
```

### 3. Регистрация (если нужна)
```javascript
await window.API.signup({
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
})
```

### 4. Логин
```javascript
await window.API.login('test@example.com', 'password123')
```

**Ожидаемый результат:**
```javascript
{
  access_token: "eyJ0eXAiOiJKV...",
  token_type: "bearer"
}
```

### 5. Получить сообщества
```javascript
await window.API.getCommunities()
```

**Ожидаемый результат:**
```javascript
[
  {id: 1, name: "Frontend Developers", ...},
  {id: 2, name: "Backend Developers", ...}
]
```

---

## 🔥 Полный тест (копируйте целиком в консоль)

```javascript
async function smokeTest() {
  console.log('🧪 Начинаю smoke-test...\n');
  
  try {
    // 1. Проверка конфигурации
    console.log('1️⃣ Проверка конфигурации...');
    const config = window.API.getConfig();
    console.log('✅ Конфигурация:', config);
    
    // 2. Проверка бэкенда
    console.log('\n2️⃣ Проверка доступности бэкенда...');
    const pingResp = await fetch('http://172.20.10.2:8000/');
    console.log('✅ Бэкенд доступен, статус:', pingResp.status);
    
    // 3. Логин
    console.log('\n3️⃣ Попытка логина...');
    try {
      const loginData = await window.API.login('test@example.com', 'password123');
      console.log('✅ Логин успешен:', loginData);
    } catch (loginError) {
      console.log('⚠️ Логин не удался (возможно, нужна регистрация):', loginError.message);
      
      // Пробуем регистрацию
      console.log('\n   Попытка регистрации...');
      const signupData = await window.API.signup({
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User'
      });
      console.log('✅ Регистрация успешна:', signupData);
    }
    
    // 4. Получение данных
    console.log('\n4️⃣ Получение сообществ...');
    const communities = await window.API.getCommunities();
    console.log(`✅ Получено ${communities.length} сообществ:`, communities);
    
    console.log('\n🎉 SMOKE-TEST ПРОЙДЕН УСПЕШНО!');
    
  } catch (error) {
    console.error('\n❌ SMOKE-TEST ПРОВАЛЕН:', error);
    console.log('\nПроверьте:');
    console.log('1. Бэкенд запущен на http://172.20.10.2:8000');
    console.log('2. CORS настроен на бэкенде');
    console.log('3. Правильные эндпоинты в API');
  }
}

// ЗАПУСК ТЕСТА
smokeTest();
```

---

## 📋 Чек-лист проверки UI

### Навигация
- [ ] Навигация вверху экрана
- [ ] 4 кнопки: Лента, Поиск, Сообщества, Профиль
- [ ] Клик переключает вкладки
- [ ] Активная кнопка подсвечена синим

### Модальные окна
- [ ] "Новый пост" открывается
- [ ] "Создать сообщество" открывается
- [ ] "Создать кейс" открывается
- [ ] Закрытие по крестику работает
- [ ] Закрытие по клику вне окна работает

### Консоль (F12)
- [ ] Нет красных ошибок (кроме CORS, если бэкенд не настроен)
- [ ] Видны сообщения "API Client loaded"
- [ ] Видны сообщения "Mobile app initialized"

---

## ✅ Готово к хакатону, если:

1. ✅ Фронтенд открывается на http://172.20.10.6:8000
2. ✅ `window.API.getConfig()` показывает правильный URL
3. ✅ Навигация работает
4. ✅ Модальные окна открываются
5. ✅ Fetch-запросы идут на бэкенд (видны в Network tab)

**Если всё ОК — приложение полностью готово!** 🚀
