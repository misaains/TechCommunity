# 🎯 TechCommunity - Итоговое руководство

## ✅ Что мы создали

### 📱 Фронтенд (PWA)
✔️ **index.html** - Мобильное приложение с 4 вкладками  
✔️ **styles.css** - Современный адаптивный дизайн  
✔️ **app.js** - JavaScript для интерактивности  
✔️ **api.js** - Клиент для связи с бэкендом  
✔️ **service-worker.js** - PWA функциональность  
✔️ **manifest.json** - Метаданные приложения  

### 📚 Документация
✔️ **BACKEND_INTEGRATION.md** - Полное руководство по интеграции с Kotlin  
✔️ **API_EXAMPLES.md** - Примеры использования API  
✔️ **MOBILE_DESIGN_GUIDE.md** - Дизайн-система  
✔️ **MOBILE_README.md** - Инструкции для мобильной версии  

---

## 🔗 Связь фронтенда с бэкендом на Kotlin

### Схема работы:

```
┌─────────────────┐         HTTP/JSON         ┌──────────────────┐
│                 │  ─────────────────────────▶│                  │
│  PWA Frontend   │                            │  Kotlin Backend  │
│  (HTML/JS/CSS)  │  ◀─────────────────────────│  (Ktor/Spring)   │
│                 │                            │                  │
└─────────────────┘                            └──────────────────┘
   localhost:8000                                 localhost:8080
```

### 🚀 Быстрый старт

#### 1. **Запустить бэкенд** (в Android Studio):

**Вариант A: Ktor**

Создайте проект в Android Studio:

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "1.9.0"
    application
    id("io.ktor.plugin") version "2.3.5"
}

dependencies {
    implementation("io.ktor:ktor-server-core:2.3.5")
    implementation("io.ktor:ktor-server-netty:2.3.5")
    implementation("io.ktor:ktor-server-content-negotiation:2.3.5")
    implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.5")
    implementation("io.ktor:ktor-server-cors:2.3.5")
}
```

```kotlin
// Application.kt
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.http.*

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
        install(CORS) {
            anyHost()
            allowMethod(HttpMethod.Get)
            allowMethod(HttpMethod.Post)
            allowHeader(HttpHeaders.ContentType)
        }
        
        routing {
            get("/api/communities") {
                call.respond(listOf(
                    mapOf(
                        "id" to 1,
                        "name" to "Технологии и IT",
                        "members" to 12543
                    )
                ))
            }
        }
    }.start(wait = true)
}
```

Нажмите **Run** в Android Studio → Сервер запустится на `http://localhost:8080`

**Вариант B: Spring Boot**

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "1.9.0"
    kotlin("plugin.spring") version "1.9.0"
    id("org.springframework.boot") version "3.1.5"
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
}
```

```kotlin
// CommunityController.kt
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["*"])
class CommunityController {
    
    @GetMapping("/communities")
    fun getCommunities() = listOf(
        mapOf(
            "id" to 1,
            "name" to "Технологии и IT",
            "members" to 12543
        )
    )
}
```

#### 2. **Запустить фронтенд**:

```powershell
cd "c:\Users\mar17\OneDrive\Рабочий стол\TechCommunity хакатон моспром\TechCommunity"
python -m http.server 8000
```

Откройте: **http://localhost:8000**

#### 3. **Проверить связь**:

Откройте консоль браузера (F12) и введите:

```javascript
// Проверить, что API загружен
console.log(window.API);

// Получить сообщества
API.getCommunities().then(data => console.log(data));
```

---

## 🎨 Структура API

### Endpoints (которые нужно реализовать в Kotlin)

#### Сообщества
```
GET    /api/communities          - Получить все сообщества
GET    /api/communities/:id      - Получить сообщество по ID
POST   /api/communities          - Создать сообщество
POST   /api/communities/:id/join - Вступить в сообщество
```

#### Посты
```
GET    /api/posts                - Получить все посты
GET    /api/posts/:id            - Получить пост по ID
POST   /api/posts                - Создать пост
POST   /api/posts/:id/like       - Лайкнуть пост
```

#### Кейсы
```
GET    /api/cases                - Получить все кейсы
GET    /api/cases/:id            - Получить кейс по ID
POST   /api/cases                - Создать кейс
POST   /api/cases/:id/apply      - Подать заявку на кейс
```

#### Пользователи
```
GET    /api/users/:id            - Получить профиль
PUT    /api/users/:id            - Обновить профиль
GET    /api/users/:id/stats      - Получить статистику
```

---

## 📝 Пример полного цикла

### 1. Пользователь создаёт пост

**Фронтенд (JavaScript)**:
```javascript
const postData = {
  authorId: 1,
  communityId: 5,
  content: 'Привет!',
  imageUrl: null
};

const newPost = await API.createPost(postData);
console.log('Пост создан:', newPost);
```

**Бэкенд (Kotlin)**:
```kotlin
@PostMapping("/posts")
fun createPost(@RequestBody request: CreatePostRequest): Post {
    // Сохранить в базу данных
    val post = postRepository.save(request)
    
    // Вернуть созданный пост
    return post
}
```

### 2. Пользователь вступает в сообщество

**Фронтенд**:
```javascript
await API.joinCommunity(communityId, userId);
showToast('Вы вступили в сообщество!');
```

**Бэкенд**:
```kotlin
@PostMapping("/communities/{id}/join")
fun joinCommunity(
    @PathVariable id: Int,
    @RequestBody request: JoinRequest
): CommunityMember {
    return communityService.addMember(id, request.userId)
}
```

---

## 🔧 Настройка проекта

### В Android Studio:

1. **File** → **New** → **Project**
2. Выбрать **Kotlin** и **Gradle**
3. Добавить зависимости в `build.gradle.kts` (см. выше)
4. Создать файл `Application.kt` или `CommunityController.kt`
5. Нажать **Run** (зелёная кнопка play)

### В VS Code (фронтенд):

1. Открыть папку проекта
2. Убедиться, что все файлы на месте:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `api.js` ✨ (новый файл!)
3. Запустить сервер: `python -m http.server 8000`

---

## ⚡ Важные настройки

### CORS (обязательно!)

Без этого фронтенд не сможет обращаться к бэкенду:

**Ktor**:
```kotlin
install(CORS) {
    anyHost()
    allowMethod(HttpMethod.Options)
    allowMethod(HttpMethod.Get)
    allowMethod(HttpMethod.Post)
    allowMethod(HttpMethod.Put)
    allowMethod(HttpMethod.Delete)
    allowHeader(HttpHeaders.ContentType)
    allowHeader(HttpHeaders.Authorization)
}
```

**Spring Boot**:
```kotlin
@CrossOrigin(origins = ["http://localhost:8000"])
```

### Адрес API

В `api.js` измените, если бэкенд на другом порту:

```javascript
const CONFIG = {
  API_BASE_URL: 'http://localhost:8080/api', // ← Здесь ваш адрес
};
```

---

## 🧪 Тестирование

### 1. Проверить бэкенд

Откройте в браузере:
```
http://localhost:8080/api/communities
```

Должен вернуть JSON:
```json
[
  {
    "id": 1,
    "name": "Технологии и IT",
    "members": 12543
  }
]
```

### 2. Проверить фронтенд

Откройте консоль (F12) на `http://localhost:8000`:
```javascript
API.getCommunities().then(console.log);
```

Должен вывести данные из бэкенда!

---

## 🐛 Решение проблем

### Ошибка CORS
```
Access to fetch has been blocked by CORS policy
```
**Решение**: Добавить CORS в бэкенд (см. выше)

### API is not defined
```
ReferenceError: API is not defined
```
**Решение**: 
1. Проверить, что `api.js` подключен в `index.html` ПЕРЕД `app.js`
2. Обновить страницу (Ctrl+F5)

### Connection refused
```
Failed to fetch
```
**Решение**:
1. Убедиться, что бэкенд запущен на порту 8080
2. Проверить URL в `api.js` (`API_BASE_URL`)

---

## 📚 Дополнительные ресурсы

### Документация
- [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) - Детальное руководство по бэкенду
- [API_EXAMPLES.md](./API_EXAMPLES.md) - Примеры кода
- [MOBILE_DESIGN_GUIDE.md](./MOBILE_DESIGN_GUIDE.md) - Дизайн-система

### Полезные ссылки
- [Ktor Documentation](https://ktor.io/docs/welcome.html)
- [Spring Boot with Kotlin](https://spring.io/guides/tutorials/spring-boot-kotlin/)
- [Fetch API](https://developer.mozilla.org/ru/docs/Web/API/Fetch_API)

---

## ✨ Следующие шаги

### Backend (Kotlin):
1. ✅ Создать проект в Android Studio
2. ✅ Добавить зависимости (Ktor или Spring Boot)
3. ✅ Создать endpoints для сообществ, постов, кейсов
4. ✅ Настроить CORS
5. ✅ Запустить сервер на порту 8080

### Frontend (JavaScript):
1. ✅ Убедиться, что `api.js` подключен
2. ✅ Изменить `API_BASE_URL` на адрес бэкенда
3. ✅ Проверить в консоли: `window.API`
4. ✅ Вызвать методы API из `app.js`

### Интеграция:
1. ⏳ Заменить mock-данные реальными запросами к API
2. ⏳ Добавить обработку ошибок
3. ⏳ Реализовать авторизацию (JWT токены)
4. ⏳ Добавить загрузку изображений

---

**Готово! Теперь ваш фронтенд готов к подключению к бэкенду на Kotlin! 🚀**

---

## 🎯 Команды для копирования

### Запустить фронтенд:
```powershell
cd "c:\Users\mar17\OneDrive\Рабочий стол\TechCommunity хакатон моспром\TechCommunity"
python -m http.server 8000
```

### Проверить API в консоли:
```javascript
// Проверка загрузки
window.API

// Получить сообщества
API.getCommunities().then(console.log)

// Создать пост
API.createPost({
  authorId: 1,
  communityId: 1,
  content: 'Тест',
  imageUrl: null
}).then(console.log)
```

**Удачи! 🎉**
