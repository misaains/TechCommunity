// ============================
// API CLIENT для TechCommunity
// ============================

// Конфигурация
const CONFIG = {
  // Измените на адрес вашего бэкенда
  API_BASE_URL: 'https://172.20.10.2:8000/api',
  
  // Timeout для запросов (в миллисекундах)
  TIMEOUT: 10000,
  
  // Включить логирование
  DEBUG: true
};

// ============================
// УТИЛИТЫ
// ============================

/**
 * Логирование (только в режиме DEBUG)
 */
function log(message, data = null) {
  if (CONFIG.DEBUG) {
    console.log(`[API] ${message}`, data || '');
  }
}

/**
 * Базовый HTTP запрос с timeout
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${CONFIG.API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const config = { ...defaultOptions, ...options };
  
  log(`${config.method || 'GET'} ${url}`, config.body);
  
  try {
    // Создаём Promise с timeout
    const fetchPromise = fetch(url, config);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), CONFIG.TIMEOUT);
    });
    
    const response = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    log(`Response from ${endpoint}:`, data);
    
    return data;
  } catch (error) {
    console.error(`[API] Error on ${endpoint}:`, error);
    throw error;
  }
}

// ============================
// API МЕТОДЫ
// ============================

const API = {
  
  // ----------------------
  // СООБЩЕСТВА
  // ----------------------
  
  /**
   * Получить все сообщества
   * @param {Object} filters - Фильтры (category, search)
   * @returns {Promise<Array>}
   */
  getCommunities: async (filters = {}) => {
    let endpoint = '/communities';
    
    // Добавляем query параметры
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    if (queryString) endpoint += `?${queryString}`;
    
    return apiRequest(endpoint);
  },
  
  /**
   * Получить сообщество по ID
   * @param {number} id
   * @returns {Promise<Object>}
   */
  getCommunity: async (id) => {
    return apiRequest(`/communities/${id}`);
  },
  
  /**
   * Создать новое сообщество
   * @param {Object} data - {name, description, category, avatarUrl}
   * @returns {Promise<Object>}
   */
  createCommunity: async (data) => {
    return apiRequest('/communities', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  /**
   * Вступить в сообщество
   * @param {number} communityId
   * @param {number} userId
   * @returns {Promise<Object>}
   */
  joinCommunity: async (communityId, userId) => {
    return apiRequest(`/communities/${communityId}/join`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  },
  
  /**
   * Покинуть сообщество
   * @param {number} communityId
   * @param {number} userId
   * @returns {Promise<Object>}
   */
  leaveCommunity: async (communityId, userId) => {
    return apiRequest(`/communities/${communityId}/leave`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  },
  
  // ----------------------
  // ПОСТЫ
  // ----------------------
  
  /**
   * Получить все посты (с фильтрацией)
   * @param {Object} filters - {communityId, userId}
   * @returns {Promise<Array>}
   */
  getPosts: async (filters = {}) => {
    let endpoint = '/posts';
    
    const params = new URLSearchParams();
    if (filters.communityId) params.append('communityId', filters.communityId);
    if (filters.userId) params.append('userId', filters.userId);
    
    const queryString = params.toString();
    if (queryString) endpoint += `?${queryString}`;
    
    return apiRequest(endpoint);
  },
  
  /**
   * Получить пост по ID
   * @param {number} id
   * @returns {Promise<Object>}
   */
  getPost: async (id) => {
    return apiRequest(`/posts/${id}`);
  },
  
  /**
   * Создать новый пост
   * @param {Object} data - {authorId, communityId, content, imageUrl}
   * @returns {Promise<Object>}
   */
  createPost: async (data) => {
    return apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  /**
   * Лайкнуть пост
   * @param {number} postId
   * @param {number} userId
   * @returns {Promise<Object>}
   */
  likePost: async (postId, userId) => {
    return apiRequest(`/posts/${postId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  },
  
  /**
   * Убрать лайк с поста
   * @param {number} postId
   * @param {number} userId
   * @returns {Promise<Object>}
   */
  unlikePost: async (postId, userId) => {
    return apiRequest(`/posts/${postId}/unlike`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  },
  
  // ----------------------
  // КОММЕНТАРИИ
  // ----------------------
  
  /**
   * Получить комментарии к посту
   * @param {number} postId
   * @returns {Promise<Array>}
   */
  getComments: async (postId) => {
    return apiRequest(`/posts/${postId}/comments`);
  },
  
  /**
   * Добавить комментарий
   * @param {number} postId
   * @param {Object} data - {userId, content}
   * @returns {Promise<Object>}
   */
  addComment: async (postId, data) => {
    return apiRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // ----------------------
  // КЕЙСЫ
  // ----------------------
  
  /**
   * Получить все кейсы
   * @param {Object} filters - {communityId, difficulty}
   * @returns {Promise<Array>}
   */
  getCases: async (filters = {}) => {
    let endpoint = '/cases';
    
    const params = new URLSearchParams();
    if (filters.communityId) params.append('communityId', filters.communityId);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    
    const queryString = params.toString();
    if (queryString) endpoint += `?${queryString}`;
    
    return apiRequest(endpoint);
  },
  
  /**
   * Получить кейс по ID
   * @param {number} id
   * @returns {Promise<Object>}
   */
  getCase: async (id) => {
    return apiRequest(`/cases/${id}`);
  },
  
  /**
   * Создать новый кейс
   * @param {Object} data - {title, description, difficulty, skills, deadline, communityId}
   * @returns {Promise<Object>}
   */
  createCase: async (data) => {
    return apiRequest('/cases', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  /**
   * Подать заявку на кейс
   * @param {number} caseId
   * @param {number} userId
   * @returns {Promise<Object>}
   */
  applyToCase: async (caseId, userId) => {
    return apiRequest(`/cases/${caseId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  },
  
  // ----------------------
  // ПОЛЬЗОВАТЕЛИ
  // ----------------------
  
  /**
   * Получить профиль пользователя
   * @param {number} id
   * @returns {Promise<Object>}
   */
  getUser: async (id) => {
    return apiRequest(`/users/${id}`);
  },
  
  /**
   * Обновить профиль пользователя
   * @param {number} id
   * @param {Object} data - {name, bio, skills, etc.}
   * @returns {Promise<Object>}
   */
  updateUser: async (id, data) => {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  /**
   * Получить статистику пользователя
   * @param {number} userId
   * @returns {Promise<Object>}
   */
  getUserStats: async (userId) => {
    return apiRequest(`/users/${userId}/stats`);
  },
  
  // ----------------------
  // АУТЕНТИФИКАЦИЯ
  // ----------------------
  
  /**
   * Вход в систему
   * @param {Object} credentials - {email, password}
   * @returns {Promise<Object>}
   */
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },
  
  /**
   * Регистрация
   * @param {Object} data - {email, password, name}
   * @returns {Promise<Object>}
   */
  register: async (data) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  /**
   * Выход из системы
   * @returns {Promise<Object>}
   */
  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST'
    });
  }
};

// ============================
// КЕШИРОВАНИЕ (опционально)
// ============================

const cache = {
  data: new Map(),
  
  get(key) {
    const item = this.data.get(key);
    if (!item) return null;
    
    // Проверяем, не истёк ли срок кеша (5 минут)
    if (Date.now() - item.timestamp > 5 * 60 * 1000) {
      this.data.delete(key);
      return null;
    }
    
    return item.value;
  },
  
  set(key, value) {
    this.data.set(key, {
      value,
      timestamp: Date.now()
    });
  },
  
  clear() {
    this.data.clear();
  }
};

// Обёртка для кешированных запросов
API.cached = {
  getCommunities: async () => {
    const cached = cache.get('communities');
    if (cached) {
      log('Returning cached communities');
      return cached;
    }
    
    const data = await API.getCommunities();
    cache.set('communities', data);
    return data;
  }
};

// ============================
// ЭКСПОРТ
// ============================

// Делаем API доступным глобально
window.API = API;
window.APIConfig = CONFIG;

// Логируем успешную загрузку
console.log('✅ API Client loaded');
console.log(`📡 Base URL: ${CONFIG.API_BASE_URL}`);

// Экспорт для ES6 модулей (если нужно)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API, CONFIG };
}
