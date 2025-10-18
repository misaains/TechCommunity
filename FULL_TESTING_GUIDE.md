# 🧪 Полный скрипт тестирования TechCommunity

## 📋 Чек-лист подготовки

- [ ] Фронтенд запущен: http://localhost:8000
- [ ] Бэкенд запущен: http://172.20.10.2:8000
- [ ] Chrome открыт с DevTools (F12)
- [ ] Включен мобильный режим (Ctrl+Shift+M)
- [ ] Консоль открыта (вкладка Console)

---

## 🎯 Тест 1: Проверка фронтенда

### Визуальная проверка:
- [ ] Навигация ВВЕРХУ экрана
- [ ] 4 кнопки видны: Лента, Поиск, Сообщества, Профиль
- [ ] Можно переключаться между вкладками
- [ ] Кнопка "Новый пост" открывает модальное окно
- [ ] Модальные окна закрываются

### В консоли:
```javascript
// Проверить, что API загружен
console.log('API:', window.API)
// Должно показать объект с методами
```

---

## 🔌 Тест 2: Проверка подключения к бэкенду

### Шаг 1: Проверить конфигурацию
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

### Шаг 2: Проверить доступность бэкенда
```javascript
// Простая проверка - получить список сообществ
window.API.getCommunities()
  .then(data => {
    console.log('✅ УСПЕХ! Бэкенд работает!');
    console.log('Получено сообществ:', data.length);
    console.log('Данные:', data);
  })
  .catch(error => {
    console.error('❌ ОШИБКА:', error.message);
    console.log('Подробности:', error);
  })
```

---

## 🔐 Тест 3: Авторизация (если требуется)

### Шаг 1: Регистрация (если нет аккаунта)
```javascript
await window.API.signup({
  email: 'test@example.com',
  password: 'password123',
  name: 'Тестовый Пользователь'
})
.then(data => console.log('✅ Регистрация успешна!', data))
.catch(error => console.error('❌ Ошибка регистрации:', error.message))
```

### Шаг 2: Вход
```javascript
await window.API.login('test@example.com', 'password123')
  .then(data => {
    console.log('✅ Авторизация успешна!');
    console.log('Токен сохранен:', data.access_token);
  })
  .catch(error => {
    console.error('❌ Ошибка входа:', error.message);
  })
```

### Шаг 3: Проверить, что токен сохранен
```javascript
window.API.isAuthenticated()  // должно вернуть true
window.API.getToken()         // должно показать токен
```

### Шаг 4: Попробовать запрос с токеном
```javascript
await window.API.getCommunities()
  .then(data => console.log('✅ Запрос с токеном успешен!', data))
```

---

## 🏘️ Тест 4: Работа с сообществами

### 1. Получить все сообщества
```javascript
const communities = await window.API.getCommunities()
console.log('Всего сообществ:', communities.length)
console.log('Первое:', communities[0])
```

### 2. Получить конкретное сообщество
```javascript
const community = await window.API.getCommunity(1)
console.log('Сообщество #1:', community)
```

### 3. Создать новое сообщество
```javascript
const newCommunity = await window.API.createCommunity({
  name: 'Test Community',
  description: 'Тестовое сообщество',
  tags: ['test', 'demo']
})
console.log('✅ Сообщество создано:', newCommunity)
```

### 4. Вступить в сообщество
```javascript
await window.API.joinCommunity(1)
  .then(() => console.log('✅ Вступили в сообщество!'))
```

### 5. Получить участников
```javascript
const members = await window.API.getCommunityMembers(1)
console.log('Участники:', members)
```

---

## 📢 Тест 5: Объявления

### 1. Создать объявление
```javascript
const announcement = await window.API.createAnnouncement(1, {
  title: 'Тестовое объявление',
  content: 'Это тест API'
})
console.log('✅ Объявление создано:', announcement)
```

### 2. Получить объявления
```javascript
const announcements = await window.API.getAnnouncements(1)
console.log('Объявления сообщества:', announcements)
```

---

## 📝 Тест 6: Кейсы

### 1. Создать кейс
```javascript
const newCase = await window.API.createCase(1, {
  title: 'Нужна помощь с тестированием',
  description: 'Описание кейса',
  difficulty: 'medium',
  tags: ['testing', 'help']
})
console.log('✅ Кейс создан:', newCase)
```

### 2. Получить кейсы
```javascript
const cases = await window.API.getCases(1)
console.log('Кейсы сообщества:', cases)
```

---

## 🚀 Тест 7: Полный сценарий (E2E)

Запустите весь сценарий целиком:

```javascript
// ============================================
// ПОЛНЫЙ СЦЕНАРИЙ ТЕСТИРОВАНИЯ
// ============================================

async function fullTest() {
  console.log('🚀 Начинаем полное тестирование...\n');
  
  try {
    // 1. Регистрация
    console.log('1️⃣ Регистрация...');
    await window.API.signup({
      email: 'testuser' + Date.now() + '@example.com',
      password: 'password123',
      name: 'Test User'
    });
    console.log('✅ Регистрация успешна\n');
    
    // 2. Вход
    console.log('2️⃣ Авторизация...');
    const loginData = await window.API.login('test@example.com', 'password123');
    console.log('✅ Авторизация успешна\n');
    
    // 3. Получить сообщества
    console.log('3️⃣ Получение сообществ...');
    const communities = await window.API.getCommunities();
    console.log(`✅ Получено ${communities.length} сообществ\n`);
    
    // 4. Создать сообщество
    console.log('4️⃣ Создание сообщества...');
    const newCommunity = await window.API.createCommunity({
      name: 'Test Community ' + Date.now(),
      description: 'Автоматически созданное сообщество',
      tags: ['test', 'auto']
    });
    console.log('✅ Сообщество создано:', newCommunity.name, '\n');
    
    // 5. Вступить в сообщество
    console.log('5️⃣ Вступление в сообщество...');
    await window.API.joinCommunity(newCommunity.id);
    console.log('✅ Вступили в сообщество\n');
    
    // 6. Создать объявление
    console.log('6️⃣ Создание объявления...');
    const announcement = await window.API.createAnnouncement(newCommunity.id, {
      title: 'Тестовое объявление',
      content: 'Это автоматически созданное объявление'
    });
    console.log('✅ Объявление создано\n');
    
    // 7. Создать кейс
    console.log('7️⃣ Создание кейса...');
    const newCase = await window.API.createCase(newCommunity.id, {
      title: 'Тестовый кейс',
      description: 'Автоматически созданный кейс',
      tags: ['test']
    });
    console.log('✅ Кейс создан\n');
    
    console.log('🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО!');
    
  } catch (error) {
    console.error('❌ ОШИБКА В ТЕСТЕ:', error.message);
    console.error('Детали:', error);
  }
}

// Запустить тест
fullTest();
```

---

## 📊 Интерпретация результатов

### ✅ Успех - всё работает:
```
✅ Регистрация успешна
✅ Авторизация успешна
✅ Получено 5 сообществ
✅ Сообщество создано: Test Community 1697612345
✅ Вступили в сообщество
✅ Объявление создано
✅ Кейс создан
🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО!
```

### ❌ CORS ошибка:
```
❌ Access to fetch... has been blocked by CORS policy
```
**Действие:** Отправить коллеге `API_SPECIFICATION.md`

### ❌ 401 Unauthorized:
```
❌ Error: 401: Unauthorized
```
**Действие:** Проверить правильность email/password или зарегистрироваться

### ❌ Network Error:
```
❌ Error: Failed to fetch
```
**Действие:** 
1. Проверить, что бэкенд запущен
2. Проверить, что вы в одной сети
3. Попробовать открыть http://172.20.10.2:8000/api/communities в браузере

---

## 🎯 Быстрая проверка "на коленке"

Если нужно быстро проверить, работает ли связь фронт-бэк:

```javascript
// Одной командой:
window.API.getCommunities()
  .then(d => console.log('✅ Работает! Получено:', d.length, 'сообществ'))
  .catch(e => console.error('❌ Не работает:', e.message))
```

---

## 📞 Что показать коллеге (бэкенд-разработчику)

Если что-то не работает, покажите ему:

1. **Ошибку из консоли** (скриншот или текст)
2. **Файл `API_SPECIFICATION.md`** - там вся спецификация API
3. **Файл `API_USAGE_EXAMPLES.md`** - примеры запросов
4. **Этот результат:**
```javascript
window.API.getConfig()
```

---

## ✅ Финальная проверка

Всё работает, если:
- [ ] Фронтенд открывается на localhost:8000
- [ ] API загружен (window.API существует)
- [ ] Получаются данные с бэкенда (без ошибок)
- [ ] Авторизация работает (токен сохраняется)
- [ ] Можно создавать сообщества/объявления/кейсы
- [ ] Навигация работает (переключение вкладок)
- [ ] Модальные окна открываются

---

## 🎉 Готово к хакатону!

Если все тесты прошли - приложение полностью готово к демонстрации! 🚀

**Удачи на TechCommunity хакатоне Моспром!** 💪
