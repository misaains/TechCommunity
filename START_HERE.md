# 🎯 ИНСТРУКЦИЯ: Как подключиться к бэкенду (для фронтенд-разработчика)

## 📦 Что у вас уже есть

✅ **Готовый фронтенд:**
- `index.html` - приложение
- `styles.css` - стили
- `app.js` - логика
- `api.js` - клиент для API ✨

✅ **Документация для бэкенда:**
- `API_SPECIFICATION.md` - полная спецификация
- `MESSAGE_TO_BACKEND.txt` - готовое сообщение
- `WORKFLOW_DIAGRAM.md` - схема работы
- `HOW_TO_CONNECT.md` - подробная инструкция

---

## 🚀 3 простых шага

### ШАГ 1: Отправить backend-разработчику

Откройте файл **`MESSAGE_TO_BACKEND.txt`** и отправьте его backend-разработчику.

Или просто скопируйте и отправьте ему эти файлы:
```
✉️ API_SPECIFICATION.md
```

**Важно:** Попросите его сообщить вам:
1. Адрес API (например, `http://localhost:8080/api`)
2. Подтверждение, что CORS настроен

---

### ШАГ 2: Изменить адрес API

Когда backend-разработчик даст вам адрес, откройте файл **`api.js`**

Найдите строку 5:
```javascript
const CONFIG = {
  API_BASE_URL: 'http://localhost:8080/api', // ← ИЗМЕНИТЬ ЗДЕСЬ
};
```

Вставьте адрес, который дал backend-разработчик.

---

### ШАГ 3: Проверить

1. Запустите ваш фронтенд:
```powershell
python -m http.server 8000
```

2. Откройте http://localhost:8000

3. Откройте консоль браузера (F12)

4. Введите:
```javascript
API.getCommunities().then(console.log)
```

5. Если видите данные из бэкенда - **готово!** 🎉

---

## 📋 Файлы для отправки бэкенду

### Обязательно:
- ✅ **API_SPECIFICATION.md** - спецификация всех endpoints

### Для удобства:
- ✅ **MESSAGE_TO_BACKEND.txt** - готовое сообщение
- ✅ **WORKFLOW_DIAGRAM.md** - схема работы

---

## ⚙️ Настройки

### Если бэкенд на localhost:
```javascript
API_BASE_URL: 'http://localhost:8080/api'
```

### Если бэкенд на сервере:
```javascript
API_BASE_URL: 'https://api.example.com/api'
```

### Если бэкенд на другом компьютере (по сети):
```javascript
API_BASE_URL: 'http://192.168.1.100:8080/api'
```

---

## 🐛 Возможные проблемы

### 1. CORS ошибка
```
Access to fetch has been blocked by CORS policy
```

**Что делать:** Попросите backend-разработчика настроить CORS (инструкция есть в `API_SPECIFICATION.md`)

---

### 2. Connection refused
```
Failed to fetch
```

**Что делать:**
- Проверить, что бэкенд запущен
- Проверить правильность адреса в `api.js`
- Проверить порт

---

### 3. Неправильный формат данных
```
Cannot read property 'name' of undefined
```

**Что делать:** Сверить с backend-разработчиком формат данных (см. `API_SPECIFICATION.md`)

---

## 📞 Что попросить у бэкенда

### Минимум:
✅ Адрес API  
✅ Подтверждение CORS

### Желательно:
- Тестовые данные (несколько сообществ, постов)
- Уведомление, когда готов каждый endpoint

---

## ✅ Ваш чеклист

- [ ] Отправил `API_SPECIFICATION.md` бэкенду
- [ ] Получил адрес API
- [ ] Изменил `API_BASE_URL` в `api.js`
- [ ] Запустил фронтенд (`python -m http.server 8000`)
- [ ] Протестировал в консоли (`API.getCommunities()`)
- [ ] Данные загружаются успешно

---

## 💡 Полезные команды

### Запустить фронтенд:
```powershell
cd "c:\Users\mar17\OneDrive\Рабочий стол\TechCommunity хакатон моспром\TechCommunity"
python -m http.server 8000
```

### Проверить в консоли:
```javascript
// Проверить API
window.API

// Получить сообщества
API.getCommunities().then(console.log)

// Создать пост
API.createPost({
  authorId: 1,
  communityId: 1,
  content: 'Тест'
}).then(console.log)
```

---

## 📚 Документация

### Для вас:
- **HOW_TO_CONNECT.md** - подробная инструкция
- **WORKFLOW_DIAGRAM.md** - схема взаимодействия

### Для бэкенда:
- **API_SPECIFICATION.md** - спецификация API
- **BACKEND_INTEGRATION.md** - примеры кода на Kotlin

---

## 🎯 Итого

1. Отправьте `API_SPECIFICATION.md` backend-разработчику ✉️
2. Получите адрес API 📡
3. Вставьте адрес в `api.js` ⚙️
4. Протестируйте 🧪
5. Готово! 🎉

---

**Если есть вопросы - смотрите другие файлы документации или пишите backend-разработчику!**

**Удачи! 🚀**
