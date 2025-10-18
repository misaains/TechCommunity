# 🔗 Интеграция фронтенда с бэкендом на Kotlin

## 📋 Общая архитектура

```
[PWA Frontend (HTML/CSS/JS)] <--HTTP/JSON--> [Kotlin Backend (Ktor/Spring)] <--> [База данных]
```

## 🚀 Вариант 1: REST API (Рекомендуемый)

### Бэкенд на Kotlin (Ktor)

#### 1. Настройка Ktor в Android Studio

**build.gradle.kts**:
```kotlin
plugins {
    kotlin("jvm") version "1.9.0"
    application
    id("io.ktor.plugin") version "2.3.5"
}

dependencies {
    // Ktor сервер
    implementation("io.ktor:ktor-server-core:2.3.5")
    implementation("io.ktor:ktor-server-netty:2.3.5")
    implementation("io.ktor:ktor-server-content-negotiation:2.3.5")
    implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.5")
    
    // CORS для работы с фронтендом
    implementation("io.ktor:ktor-server-cors:2.3.5")
    
    // Логирование
    implementation("ch.qos.logback:logback-classic:1.4.11")
}
```

#### 2. Создание API endpoints

**Application.kt**:
```kotlin
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.routing.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import kotlinx.serialization.Serializable

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
        configureSerialization()
        configureCORS()
        configureRouting()
    }.start(wait = true)
}

fun Application.configureSerialization() {
    install(ContentNegotiation) {
        json()
    }
}

fun Application.configureCORS() {
    install(CORS) {
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)
        anyHost() // Для разработки, в продакшене указать конкретный домен
    }
}

fun Application.configureRouting() {
    routing {
        // Получить все сообщества
        get("/api/communities") {
            val communities = listOf(
                Community(
                    id = 1,
                    name = "Технологии и IT",
                    description = "Разработчики будущего",
                    members = 12543,
                    category = "tech",
                    avatarUrl = "https://example.com/avatar1.png"
                ),
                Community(
                    id = 2,
                    name = "Дизайнеры и творцы",
                    description = "UI/UX и графический дизайн",
                    members = 8234,
                    category = "design",
                    avatarUrl = "https://example.com/avatar2.png"
                )
            )
            call.respond(communities)
        }
        
        // Получить сообщество по ID
        get("/api/communities/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id != null) {
                val community = Community(
                    id = id,
                    name = "Технологии и IT",
                    description = "Разработчики будущего",
                    members = 12543,
                    category = "tech",
                    avatarUrl = "https://example.com/avatar1.png"
                )
                call.respond(community)
            } else {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid ID"))
            }
        }
        
        // Создать новое сообщество
        post("/api/communities") {
            val community = call.receive<CreateCommunityRequest>()
            val newCommunity = Community(
                id = 3,
                name = community.name,
                description = community.description,
                members = 1,
                category = community.category,
                avatarUrl = community.avatarUrl
            )
            call.respond(HttpStatusCode.Created, newCommunity)
        }
        
        // Получить все посты
        get("/api/posts") {
            val posts = listOf(
                Post(
                    id = 1,
                    authorId = 1,
                    authorName = "Алексей Смирнов",
                    authorAvatar = "https://via.placeholder.com/48",
                    communityName = "Технологии и IT",
                    content = "Сегодня мы запустили новую функцию!",
                    imageUrl = "https://via.placeholder.com/600x300",
                    likes = 142,
                    comments = 28,
                    timestamp = "2 часа назад"
                )
            )
            call.respond(posts)
        }
        
        // Создать новый пост
        post("/api/posts") {
            val post = call.receive<CreatePostRequest>()
            val newPost = Post(
                id = 2,
                authorId = post.authorId,
                authorName = "Вы",
                authorAvatar = "https://via.placeholder.com/48",
                communityName = post.communityName,
                content = post.content,
                imageUrl = post.imageUrl,
                likes = 0,
                comments = 0,
                timestamp = "Только что"
            )
            call.respond(HttpStatusCode.Created, newPost)
        }
        
        // Лайкнуть пост
        post("/api/posts/{id}/like") {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id != null) {
                call.respond(mapOf("success" to true, "likes" to 143))
            } else {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid ID"))
            }
        }
        
        // Получить профиль пользователя
        get("/api/users/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id != null) {
                val user = User(
                    id = id,
                    name = "Мария Иванова",
                    username = "maria_ivanova",
                    bio = "Full-stack разработчик",
                    avatarUrl = "https://via.placeholder.com/100",
                    location = "Москва, Россия",
                    memberSince = "Октябрь 2023",
                    communitiesCount = 12,
                    casesCount = 24,
                    reputation = 4850,
                    skills = listOf("React", "TypeScript", "Node.js", "Python")
                )
                call.respond(user)
            } else {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid ID"))
            }
        }
    }
}

// Модели данных
@Serializable
data class Community(
    val id: Int,
    val name: String,
    val description: String,
    val members: Int,
    val category: String,
    val avatarUrl: String
)

@Serializable
data class CreateCommunityRequest(
    val name: String,
    val description: String,
    val category: String,
    val avatarUrl: String
)

@Serializable
data class Post(
    val id: Int,
    val authorId: Int,
    val authorName: String,
    val authorAvatar: String,
    val communityName: String,
    val content: String,
    val imageUrl: String?,
    val likes: Int,
    val comments: Int,
    val timestamp: String
)

@Serializable
data class CreatePostRequest(
    val authorId: Int,
    val communityName: String,
    val content: String,
    val imageUrl: String?
)

@Serializable
data class User(
    val id: Int,
    val name: String,
    val username: String,
    val bio: String,
    val avatarUrl: String,
    val location: String,
    val memberSince: String,
    val communitiesCount: Int,
    val casesCount: Int,
    val reputation: Int,
    val skills: List<String>
)
```

### Фронтенд (JavaScript)

#### 1. Создание API клиента

**api.js**:
```javascript
// Базовый URL вашего API
const API_BASE_URL = 'http://localhost:8080/api';

// Утилита для fetch запросов
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const config = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// API методы
const API = {
  // Сообщества
  getCommunities: () => apiRequest('/communities'),
  
  getCommunity: (id) => apiRequest(`/communities/${id}`),
  
  createCommunity: (data) => apiRequest('/communities', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  // Посты
  getPosts: () => apiRequest('/posts'),
  
  createPost: (data) => apiRequest('/posts', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  likePost: (id) => apiRequest(`/posts/${id}/like`, {
    method: 'POST'
  }),
  
  // Пользователи
  getUser: (id) => apiRequest(`/users/${id}`)
};

// Экспорт для использования в других файлах
window.API = API;
```

#### 2. Использование в app.js

**app.js** (добавьте эти функции):
```javascript
// Загрузка сообществ из API
async function loadCommunities() {
  try {
    showLoading();
    const communities = await API.getCommunities();
    
    const container = document.querySelector('.communities-grid');
    container.innerHTML = '';
    
    communities.forEach(community => {
      const card = createCommunityCard(community);
      container.appendChild(card);
    });
    
    hideLoading();
  } catch (error) {
    console.error('Ошибка загрузки сообществ:', error);
    showToast('Не удалось загрузить сообщества', 'error');
  }
}

// Создание карточки сообщества
function createCommunityCard(community) {
  const card = document.createElement('div');
  card.className = 'community-card';
  card.innerHTML = `
    <img src="${community.avatarUrl}" alt="${community.name}" class="community-avatar">
    <div class="community-info">
      <h3 class="community-name">${community.name}</h3>
      <p class="community-description">${community.description}</p>
      <p class="community-meta">${community.members.toLocaleString()} участников</p>
    </div>
    <button class="btn-join" data-id="${community.id}">Вступить</button>
  `;
  
  // Добавляем обработчик кнопки "Вступить"
  const joinBtn = card.querySelector('.btn-join');
  joinBtn.addEventListener('click', () => joinCommunity(community.id));
  
  return card;
}

// Вступить в сообщество
async function joinCommunity(communityId) {
  try {
    // Здесь будет запрос к API
    showToast('Вы вступили в сообщество!', 'success');
  } catch (error) {
    showToast('Ошибка при вступлении', 'error');
  }
}

// Загрузка постов
async function loadPosts() {
  try {
    showLoading();
    const posts = await API.getPosts();
    
    const container = document.querySelector('.feed-container');
    container.innerHTML = '';
    
    posts.forEach(post => {
      const postElement = createPostElement(post);
      container.appendChild(postElement);
    });
    
    hideLoading();
  } catch (error) {
    console.error('Ошибка загрузки постов:', error);
    showToast('Не удалось загрузить посты', 'error');
  }
}

// Создание поста
async function createPost(data) {
  try {
    showLoading();
    const newPost = await API.createPost(data);
    showToast('Пост опубликован!', 'success');
    closeModal('newPost');
    
    // Перезагружаем ленту
    await loadPosts();
    
    hideLoading();
  } catch (error) {
    console.error('Ошибка создания поста:', error);
    showToast('Не удалось создать пост', 'error');
    hideLoading();
  }
}

// Лайк поста
async function likePost(postId) {
  try {
    const result = await API.likePost(postId);
    showToast('Пост лайкнут!', 'success');
    
    // Обновляем счетчик лайков в UI
    const likeBtn = document.querySelector(`[data-post-id="${postId}"] .like-btn`);
    if (likeBtn) {
      const countSpan = likeBtn.querySelector('span');
      countSpan.textContent = result.likes;
    }
  } catch (error) {
    console.error('Ошибка лайка:', error);
    showToast('Не удалось поставить лайк', 'error');
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
  console.log('✅ Загружаем данные из API...');
  
  // Загружаем начальные данные
  await loadCommunities();
  await loadPosts();
  
  // Обработчик формы создания поста
  const postForm = document.querySelector('#newPostModal form');
  if (postForm) {
    postForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(postForm);
      const data = {
        authorId: 1, // ID текущего пользователя
        communityName: formData.get('community'),
        content: formData.get('content'),
        imageUrl: formData.get('imageUrl') || null
      };
      
      await createPost(data);
    });
  }
});
```

---

## 🔥 Вариант 2: Spring Boot REST API

Если вы используете Spring Boot вместо Ktor:

**build.gradle.kts**:
```kotlin
plugins {
    kotlin("jvm") version "1.9.0"
    kotlin("plugin.spring") version "1.9.0"
    id("org.springframework.boot") version "3.1.5"
    id("io.spring.dependency-management") version "1.1.3"
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
}
```

**CommunityController.kt**:
```kotlin
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["http://localhost:8000"]) // Разрешаем CORS для фронтенда
class CommunityController {
    
    @GetMapping("/communities")
    fun getCommunities(): List<Community> {
        return listOf(
            Community(
                id = 1,
                name = "Технологии и IT",
                description = "Разработчики будущего",
                members = 12543,
                category = "tech",
                avatarUrl = "https://example.com/avatar1.png"
            )
        )
    }
    
    @GetMapping("/communities/{id}")
    fun getCommunity(@PathVariable id: Int): Community {
        return Community(
            id = id,
            name = "Технологии и IT",
            description = "Разработчики будущего",
            members = 12543,
            category = "tech",
            avatarUrl = "https://example.com/avatar1.png"
        )
    }
    
    @PostMapping("/communities")
    fun createCommunity(@RequestBody request: CreateCommunityRequest): Community {
        return Community(
            id = 3,
            name = request.name,
            description = request.description,
            members = 1,
            category = request.category,
            avatarUrl = request.avatarUrl
        )
    }
}

data class Community(
    val id: Int,
    val name: String,
    val description: String,
    val members: Int,
    val category: String,
    val avatarUrl: String
)

data class CreateCommunityRequest(
    val name: String,
    val description: String,
    val category: String,
    val avatarUrl: String
)
```

---

## 📱 Запуск и тестирование

### 1. Запустить бэкенд:
В Android Studio:
- Нажмите Run (зелёная кнопка play)
- Сервер запустится на http://localhost:8080

### 2. Запустить фронтенд:
```powershell
cd "c:\Users\mar17\OneDrive\Рабочий стол\TechCommunity хакатон моспром\TechCommunity"
python -m http.server 8000
```

### 3. Тестирование API:
Откройте в браузере:
- http://localhost:8080/api/communities - должен вернуть JSON

---

## 🐛 Решение проблем

### CORS ошибка:
Если видите ошибку `CORS policy`:
```kotlin
// В Ktor
install(CORS) {
    anyHost()
    allowCredentials = true
}

// В Spring Boot
@CrossOrigin(origins = ["*"])
```

### Подключение не работает:
1. Проверьте, запущен ли бэкенд (http://localhost:8080)
2. Проверьте консоль браузера на ошибки
3. Убедитесь, что `API_BASE_URL` правильный

---

## 📚 Дополнительные ресурсы

- [Ktor Documentation](https://ktor.io/)
- [Spring Boot Kotlin](https://spring.io/guides/tutorials/spring-boot-kotlin/)
- [Fetch API](https://developer.mozilla.org/ru/docs/Web/API/Fetch_API)

---

**Следующий шаг**: Создать файл `api.js` и интегрировать его в ваш проект!
