# 📋 Шпаргалка: Связь фронтенда с бэкендом на Kotlin

## 🎯 Главное за 2 минуты

### Что у вас есть:
- ✅ **Фронтенд** (PWA на HTML/CSS/JS) - работает на `localhost:8000`
- ✅ **api.js** - готовый клиент для связи с бэкендом
- ⏳ **Бэкенд** (Kotlin) - нужно создать в Android Studio

---

## 🚀 Как всё связать (3 шага)

### ШАГ 1: Создать бэкенд в Android Studio

**Простейший вариант (Spring Boot)**:

```kotlin
// 1. Создать файл: CommunityController.kt

import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["*"]) // ← ВАЖНО для работы с фронтендом!
class CommunityController {
    
    @GetMapping("/communities")
    fun getCommunities() = listOf(
        mapOf(
            "id" to 1,
            "name" to "Технологии и IT",
            "description" to "Разработчики будущего",
            "members" to 12543,
            "category" to "tech",
            "avatarUrl" to "https://via.placeholder.com/60"
        ),
        mapOf(
            "id" to 2,
            "name" to "Дизайнеры и творцы",
            "description" to "UI/UX и графический дизайн",
            "members" to 8234,
            "category" to "design",
            "avatarUrl" to "https://via.placeholder.com/60"
        )
    )
    
    @PostMapping("/posts")
    fun createPost(@RequestBody post: Map<String, Any>) = mapOf(
        "id" to 1,
        "success" to true,
        "message" to "Пост создан!"
    )
}
```

**Нажать RUN в Android Studio** → Сервер запустится на `http://localhost:8080`

---

### ШАГ 2: Проверить, что бэкенд работает

Откройте в браузере:
```
http://localhost:8080/api/communities
```

Должен вернуть JSON с сообществами! ✅

---

### ШАГ 3: Подключить фронтенд к бэкенду

Фронтенд УЖЕ готов! Просто:

1. **Запустить фронтенд**:
```powershell
cd "c:\Users\mar17\OneDrive\Рабочий стол\TechCommunity хакатон моспром\TechCommunity"
python -m http.server 8000
```

2. **Открыть** http://localhost:8000

3. **Открыть консоль** (F12) и ввести:
```javascript
API.getCommunities().then(console.log)
```

Должны вывестись данные из бэкенда! 🎉

---

## 📝 Примеры использования в JavaScript

### Получить сообщества:
```javascript
const communities = await API.getCommunities();
console.log(communities); // Массив сообществ из Kotlin
```

### Создать пост:
```javascript
const newPost = await API.createPost({
  authorId: 1,
  communityId: 1,
  content: 'Привет из фронтенда!',
  imageUrl: null
});
console.log(newPost); // Ответ от Kotlin бэкенда
```

### Вступить в сообщество:
```javascript
await API.joinCommunity(communityId, userId);
```

---

## 🔥 Минимальный Kotlin бэкенд (все endpoints)

```kotlin
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["*"])
class ApiController {
    
    // Сообщества
    @GetMapping("/communities")
    fun getCommunities() = /* список сообществ */
    
    @GetMapping("/communities/{id}")
    fun getCommunity(@PathVariable id: Int) = /* сообщество */
    
    @PostMapping("/communities")
    fun createCommunity(@RequestBody data: Map<String, Any>) = /* новое сообщество */
    
    @PostMapping("/communities/{id}/join")
    fun joinCommunity(@PathVariable id: Int, @RequestBody data: Map<String, Any>) = mapOf("success" to true)
    
    // Посты
    @GetMapping("/posts")
    fun getPosts() = /* список постов */
    
    @PostMapping("/posts")
    fun createPost(@RequestBody post: Map<String, Any>) = /* новый пост */
    
    @PostMapping("/posts/{id}/like")
    fun likePost(@PathVariable id: Int) = mapOf("success" to true, "likes" to 143)
    
    // Пользователи
    @GetMapping("/users/{id}")
    fun getUser(@PathVariable id: Int) = /* профиль пользователя */
    
    @PutMapping("/users/{id}")
    fun updateUser(@PathVariable id: Int, @RequestBody data: Map<String, Any>) = /* обновлённый профиль */
}
```

---

## ⚠️ Важные моменты

### 1. CORS обязательно!
Без `@CrossOrigin` фронтенд НЕ сможет обращаться к бэкенду!

```kotlin
@CrossOrigin(origins = ["*"]) // ← ЭТО ОБЯЗАТЕЛЬНО!
```

### 2. Адрес бэкенда
В файле `api.js` (строка 5):
```javascript
API_BASE_URL: 'http://localhost:8080/api'
```
Если бэкенд на другом порту - измените здесь!

### 3. Порядок запуска
1. Сначала запустить **бэкенд** (Android Studio)
2. Потом запустить **фронтенд** (Python сервер)

---

## 🧪 Как проверить, что всё работает

### Тест 1: Бэкенд
```
http://localhost:8080/api/communities
```
→ Должен вернуть JSON ✅

### Тест 2: Фронтенд
Консоль браузера (F12):
```javascript
window.API
```
→ Должен показать объект с методами ✅

### Тест 3: Связь
Консоль браузера:
```javascript
API.getCommunities().then(console.log)
```
→ Должны вывестись данные из Kotlin! 🎉

---

## 🐛 Если не работает

### Ошибка CORS
```
blocked by CORS policy
```
**Решение**: Добавить `@CrossOrigin` в Kotlin контроллер

### API is not defined
```
ReferenceError: API is not defined
```
**Решение**: Обновить страницу (Ctrl+F5)

### Connection refused
```
Failed to fetch
```
**Решение**: Запустить бэкенд в Android Studio

---

## 📚 Документация

Подробные руководства:
- **BACKEND_INTEGRATION.md** - полное руководство по Kotlin бэкенду
- **API_EXAMPLES.md** - примеры кода
- **README_FINAL.md** - итоговая инструкция

---

**Это всё! Теперь ваш PWA фронтенд может общаться с Kotlin бэкендом! 🚀**
