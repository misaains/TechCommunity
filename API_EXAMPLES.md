# 🚀 Примеры использования API

## Быстрый старт

### 1. Проверка подключения API

Откройте консоль браузера (F12) и введите:

```javascript
// Проверить, что API загружен
console.log(window.API);

// Проверить текущую конфигурацию
console.log(window.APIConfig);
```

---

## 📚 Примеры использования

### Загрузка сообществ

```javascript
// Простой вариант
async function loadCommunities() {
  try {
    const communities = await API.getCommunities();
    console.log('Сообщества:', communities);
    
    // Отобразить в UI
    displayCommunities(communities);
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

// С фильтрацией по категории
async function loadTechCommunities() {
  const communities = await API.getCommunities({ category: 'tech' });
  console.log('Технологические сообщества:', communities);
}

// С поиском
async function searchCommunities(query) {
  const communities = await API.getCommunities({ search: query });
  console.log('Результаты поиска:', communities);
}
```

### Создание поста

```javascript
async function createNewPost() {
  const postData = {
    authorId: 1, // ID текущего пользователя
    communityId: 5, // ID сообщества
    content: 'Привет! Это мой первый пост!',
    imageUrl: 'https://example.com/image.jpg' // опционально
  };
  
  try {
    const newPost = await API.createPost(postData);
    console.log('Пост создан:', newPost);
    
    // Показать уведомление
    showToast('Пост опубликован!', 'success');
    
    // Перезагрузить ленту
    loadPosts();
  } catch (error) {
    console.error('Ошибка создания поста:', error);
    showToast('Не удалось создать пост', 'error');
  }
}
```

### Лайк поста

```javascript
async function handleLike(postId, userId) {
  try {
    const result = await API.likePost(postId, userId);
    console.log('Лайк поставлен:', result);
    
    // Обновить счётчик в UI
    updateLikeCount(postId, result.likes);
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

// Использование
document.querySelector('.like-btn').addEventListener('click', () => {
  handleLike(postId, currentUserId);
});
```

### Вступление в сообщество

```javascript
async function joinCommunity(communityId, userId) {
  try {
    const result = await API.joinCommunity(communityId, userId);
    console.log('Вступили в сообщество:', result);
    
    // Обновить кнопку
    const btn = document.querySelector(`[data-community="${communityId}"]`);
    btn.textContent = 'Отписаться';
    btn.classList.add('joined');
    
    showToast('Вы вступили в сообщество!', 'success');
  } catch (error) {
    console.error('Ошибка:', error);
    showToast('Не удалось вступить в сообщество', 'error');
  }
}
```

### Создание кейса

```javascript
async function createCase() {
  const caseData = {
    title: 'Разработка мобильного приложения',
    description: 'Нужен опытный разработчик...',
    difficulty: 'medium', // easy, medium, hard
    skills: ['React Native', 'TypeScript', 'API'],
    deadline: '2024-11-25',
    communityId: 1
  };
  
  try {
    const newCase = await API.createCase(caseData);
    console.log('Кейс создан:', newCase);
    
    showToast('Кейс успешно создан!', 'success');
    closeModal('createCase');
  } catch (error) {
    console.error('Ошибка:', error);
    showToast('Не удалось создать кейс', 'error');
  }
}
```

### Загрузка профиля пользователя

```javascript
async function loadUserProfile(userId) {
  try {
    const user = await API.getUser(userId);
    console.log('Профиль пользователя:', user);
    
    // Отобразить в UI
    document.querySelector('.profile-name').textContent = user.name;
    document.querySelector('.profile-bio').textContent = user.bio;
    document.querySelector('.stat-communities').textContent = user.communitiesCount;
    document.querySelector('.stat-cases').textContent = user.casesCount;
    document.querySelector('.stat-reputation').textContent = user.reputation;
    
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error);
  }
}
```

---

## 🔄 Работа с формами

### Форма создания поста

```javascript
// В вашем app.js
document.addEventListener('DOMContentLoaded', () => {
  
  const postForm = document.querySelector('#newPostModal form');
  
  if (postForm) {
    postForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Получаем данные из формы
      const formData = new FormData(postForm);
      
      const postData = {
        authorId: getCurrentUserId(), // функция получения ID текущего пользователя
        communityId: parseInt(formData.get('communityId')),
        content: formData.get('content'),
        imageUrl: formData.get('imageUrl') || null
      };
      
      try {
        // Показываем индикатор загрузки
        showLoading();
        
        // Отправляем на сервер
        const newPost = await API.createPost(postData);
        
        // Скрываем загрузку
        hideLoading();
        
        // Закрываем модалку
        closeModal('newPost');
        
        // Показываем уведомление
        showToast('Пост опубликован!', 'success');
        
        // Перезагружаем ленту
        await loadPosts();
        
      } catch (error) {
        hideLoading();
        showToast('Ошибка при создании поста', 'error');
        console.error(error);
      }
    });
  }
});
```

### Форма поиска

```javascript
const searchInput = document.querySelector('.search-input');

// Поиск с debounce (задержка 500ms)
let searchTimeout;

searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  
  searchTimeout = setTimeout(async () => {
    const query = e.target.value.trim();
    
    if (query.length < 2) {
      // Показываем все сообщества
      loadCommunities();
      return;
    }
    
    try {
      const results = await API.getCommunities({ search: query });
      displayCommunities(results);
    } catch (error) {
      console.error('Ошибка поиска:', error);
    }
  }, 500);
});
```

---

## 🎨 Полная интеграция в app.js

Добавьте эти функции в ваш `app.js`:

```javascript
// ============================
// API ИНТЕГРАЦИЯ
// ============================

// ID текущего пользователя (в реальном приложении получать из localStorage или cookies)
let currentUserId = 1;

function getCurrentUserId() {
  return currentUserId;
}

// ============================
// ЗАГРУЗКА ДАННЫХ
// ============================

async function loadCommunities(filters = {}) {
  try {
    showLoading();
    
    const communities = await API.getCommunities(filters);
    
    const container = document.querySelector('.communities-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    communities.forEach(community => {
      const card = createCommunityCard(community);
      container.appendChild(card);
    });
    
    hideLoading();
  } catch (error) {
    console.error('Ошибка загрузки сообществ:', error);
    showToast('Не удалось загрузить сообщества', 'error');
    hideLoading();
  }
}

async function loadPosts(filters = {}) {
  try {
    showLoading();
    
    const posts = await API.getPosts(filters);
    
    const container = document.querySelector('.feed-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    posts.forEach(post => {
      const postElement = createPostElement(post);
      container.appendChild(postElement);
    });
    
    hideLoading();
  } catch (error) {
    console.error('Ошибка загрузки постов:', error);
    showToast('Не удалось загрузить посты', 'error');
    hideLoading();
  }
}

async function loadUserProfile(userId) {
  try {
    showLoading();
    
    const user = await API.getUser(userId);
    
    // Обновляем UI профиля
    updateProfileUI(user);
    
    hideLoading();
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error);
    showToast('Не удалось загрузить профиль', 'error');
    hideLoading();
  }
}

// ============================
// СОЗДАНИЕ ЭЛЕМЕНТОВ UI
// ============================

function createCommunityCard(community) {
  const card = document.createElement('div');
  card.className = 'community-card';
  card.innerHTML = `
    <img src="${community.avatarUrl}" alt="${community.name}" class="community-avatar">
    <div class="community-info">
      <h3 class="community-name">${community.name}</h3>
      <p class="community-description">${community.description}</p>
      <p class="community-meta">${community.members.toLocaleString('ru-RU')} участников</p>
    </div>
    <button class="btn-join" data-id="${community.id}">Вступить</button>
  `;
  
  // Обработчик кнопки "Вступить"
  const joinBtn = card.querySelector('.btn-join');
  joinBtn.addEventListener('click', () => handleJoinCommunity(community.id));
  
  return card;
}

function createPostElement(post) {
  const article = document.createElement('article');
  article.className = 'feed-post';
  article.setAttribute('data-post-id', post.id);
  
  article.innerHTML = `
    <div class="post-header">
      <img src="${post.authorAvatar}" alt="${post.authorName}" class="post-avatar">
      <div class="post-author-info">
        <div class="post-author-name">${post.authorName}</div>
        <div class="post-meta">${post.timestamp} • ${post.communityName}</div>
      </div>
      <button class="post-menu-btn">⋮</button>
    </div>
    
    <div class="post-content">
      <p>${post.content}</p>
    </div>
    
    ${post.imageUrl ? `
    <div class="post-image">
      <img src="${post.imageUrl}" alt="Post image">
    </div>
    ` : ''}
    
    <div class="post-actions">
      <button class="post-action-btn like-btn" data-post-id="${post.id}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <span>${post.likes}</span>
      </button>
      <button class="post-action-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span>${post.comments}</span>
      </button>
    </div>
  `;
  
  // Обработчик лайка
  const likeBtn = article.querySelector('.like-btn');
  likeBtn.addEventListener('click', () => handleLikePost(post.id));
  
  return article;
}

// ============================
// ОБРАБОТЧИКИ ДЕЙСТВИЙ
// ============================

async function handleJoinCommunity(communityId) {
  try {
    await API.joinCommunity(communityId, currentUserId);
    showToast('Вы вступили в сообщество!', 'success');
    
    // Обновляем кнопку
    const btn = document.querySelector(`[data-id="${communityId}"]`);
    if (btn) {
      btn.textContent = 'Отписаться';
      btn.classList.add('btn-leave');
    }
  } catch (error) {
    console.error('Ошибка:', error);
    showToast('Не удалось вступить в сообщество', 'error');
  }
}

async function handleLikePost(postId) {
  try {
    const result = await API.likePost(postId, currentUserId);
    
    // Обновляем счётчик
    const likeBtn = document.querySelector(`[data-post-id="${postId}"]`);
    if (likeBtn) {
      const countSpan = likeBtn.querySelector('span');
      countSpan.textContent = result.likes;
    }
    
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

// ============================
// ИНИЦИАЛИЗАЦИЯ
// ============================

document.addEventListener('DOMContentLoaded', async () => {
  console.log('✅ Загружаем данные из API...');
  
  // Проверяем, что API доступен
  if (!window.API) {
    console.error('❌ API не загружен!');
    return;
  }
  
  // Загружаем начальные данные
  try {
    await Promise.all([
      loadCommunities(),
      loadPosts(),
      loadUserProfile(currentUserId)
    ]);
    
    console.log('✅ Данные загружены');
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
});
```

---

## 🧪 Тестирование в консоли

Откройте консоль браузера (F12) и попробуйте:

```javascript
// Получить все сообщества
API.getCommunities().then(data => console.log(data));

// Получить сообщество по ID
API.getCommunity(1).then(data => console.log(data));

// Создать пост
API.createPost({
  authorId: 1,
  communityId: 1,
  content: 'Тестовый пост!',
  imageUrl: null
}).then(data => console.log(data));

// Получить профиль
API.getUser(1).then(data => console.log(data));
```

---

## ⚠️ Частые ошибки

### 1. CORS ошибка
```
Access to fetch at 'http://localhost:8080' from origin 'http://localhost:8000' 
has been blocked by CORS policy
```

**Решение**: Добавьте CORS в бэкенд (см. BACKEND_INTEGRATION.md)

### 2. API не загружен
```
Uncaught ReferenceError: API is not defined
```

**Решение**: Убедитесь, что `api.js` подключен ДО `app.js` в HTML

### 3. Timeout
```
Error: Request timeout
```

**Решение**: Увеличьте timeout в `api.js`:
```javascript
const CONFIG = {
  TIMEOUT: 30000 // 30 секунд
};
```

---

**Готово!** Теперь ваш фронтенд может общаться с бэкендом! 🚀
