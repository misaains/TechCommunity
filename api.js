// ============================
// API CLIENT для TechCommunity
// Обновлено под реальные эндпоинты бэкенда
// ============================

// Конфигурация
const CONFIG = {
  // Адрес бэкенда
  API_BASE_URL: 'http://172.20.10.2:8000',
  
  // Timeout для запросов (в миллисекундах)
  TIMEOUT: 10000,
  
  // Включить логирование
  DEBUG: true
};

// Хранилище токена
let authToken = localStorage.getItem('authToken') || null;

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
 * Сохранить токен
 */
function setAuthToken(token) {
  authToken = token;
  localStorage.setItem('authToken', token);
  log('🔐 Auth token saved');
}

/**
 * Получить токен
 */
function getAuthToken() {
  return authToken;
}

/**
 * Удалить токен (logout)
 */
function clearAuthToken() {
  authToken = null;
  localStorage.removeItem('authToken');
  log('🔓 Auth token cleared');
}

/**
 * Базовый HTTP запрос с timeout и аутентификацией
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${CONFIG.API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  // Добавляем токен если есть (для всех эндпоинтов кроме /signup и /login)
  if (authToken && !endpoint.includes('/login') && !endpoint.includes('/signup')) {
    defaultHeaders['Authorization'] = `Bearer ${authToken}`;
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  log(`${config.method || 'GET'} ${url}`, config.body);
  
  try {
    // Создаём Promise с timeout
    const fetchPromise = fetch(url, config);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), CONFIG.TIMEOUT);
    });
    
    const response = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (!response.ok) {
      if (response.status === 401) {
        log('❌ Unauthorized - токен неверный или истек');
        clearAuthToken();
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    log(`✅ Response from ${endpoint}:`, data);
    
    return data;
  } catch (error) {
    console.error(`[API] ❌ Error on ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Запрос с form-data (для логина)
 */
async function apiRequestFormData(endpoint, formData) {
  const url = `${CONFIG.API_BASE_URL}${endpoint}`;
  
  log(`POST ${url} (form-data)`);
  
  try {
    const fetchPromise = fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), CONFIG.TIMEOUT);
    });
    
    const response = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    log(`✅ Response from ${endpoint}:`, data);
    
    return data;
  } catch (error) {
    console.error(`[API] ❌ Error on ${endpoint}:`, error);
    throw error;
  }
}

// ============================
// API МЕТОДЫ (обновлено под реальные эндпоинты бэкенда)
// ============================

const API = {
  
  // ----------------------
  // АУТЕНТИФИКАЦИЯ
  // ----------------------
  
  /**
   * Регистрация нового пользователя
   * POST /api/signup
   * @param {Object} userData - Данные пользователя {email, password, name, etc.}
   * @returns {Promise<Object>}
   */
  signup: async (userData) => {
    return apiRequest('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  /**
   * Вход в систему
   * POST /api/login
   * @param {string} email - Email пользователя
   * @param {string} password - Пароль
   * @returns {Promise<Object>} - Объект с токеном {access_token, token_type}
   */
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email); // Бэкенд ожидает username, передаем email
    formData.append('password', password);
    
    const response = await apiRequestFormData('/login', formData);
    
    // Сохраняем токен
    if (response.access_token) {
      setAuthToken(response.access_token);
      log('✅ Logged in successfully');
    }
    
    return response;
  },
  
  /**
   * Выход из системы (очистка токена)
   */
  logout: () => {
    clearAuthToken();
    log('👋 Logged out');
  },
  
  // ----------------------
  // ПОЛЬЗОВАТЕЛИ
  // ----------------------
  
  /**
   * Получить профиль пользователя
   * GET /api/users/{user_id}
   * @param {number} userId - ID пользователя
   * @returns {Promise<Object>}
   */
  getUser: async (userId) => {
    return apiRequest(`/users/${userId}`);
  },
  
  /**
   * Обновить свой профиль
   * PUT /api/users/me
   * @param {Object} userData - Обновленные данные
   * @returns {Promise<Object>}
   */
  updateProfile: async (userData) => {
    return apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  
  // ----------------------
  // СООБЩЕСТВА
  // ----------------------
  
  /**
   * Получить список сообществ
   * GET /api/communities
   * @param {string} tags - Опциональные теги для фильтрации (через запятую)
   * @returns {Promise<Array>}
   */
  getCommunities: async (tags = null) => {
    let endpoint = '/communities';
    
    // Добавляем query параметры если есть теги
    if (tags) {
      const params = new URLSearchParams();
      params.append('tags', tags);
      endpoint += `?${params.toString()}`;
    }
    
    return apiRequest(endpoint);
  },
  
  /**
   * Получить информацию о сообществе
   * GET /api/communities/{community_id}
   * @param {number} communityId - ID сообщества
   * @returns {Promise<Object>}
   */
  getCommunity: async (communityId) => {
    return apiRequest(`/communities/${communityId}`);
  },
  
  /**
   * Создать новое сообщество
   * POST /api/communities
   * @param {Object} communityData - Данные сообщества {name, description, tags, etc.}
   * @returns {Promise<Object>}
   */
  createCommunity: async (communityData) => {
    return apiRequest('/communities', {
      method: 'POST',
      body: JSON.stringify(communityData),
    });
  },
  
  // ----------------------
  // УЧАСТНИКИ СООБЩЕСТВ
  // ----------------------
  
  /**
   * Вступить в сообщество
   * POST /api/communities/{community_id}/join
   * @param {number} communityId - ID сообщества
   * @returns {Promise<Object>}
   */
  joinCommunity: async (communityId) => {
    return apiRequest(`/communities/${communityId}/join`, {
      method: 'POST',
    });
  },
  
  /**
   * Получить список участников сообщества
   * GET /api/communities/{community_id}/members
   * @param {number} communityId - ID сообщества
   * @returns {Promise<Array>}
   */
  getCommunityMembers: async (communityId) => {
    return apiRequest(`/communities/${communityId}/members`);
  },
  
  // ----------------------
  // ОБЪЯВЛЕНИЯ (ANNOUNCEMENTS)
  // ----------------------
  
  /**
   * Создать объявление в сообществе
   * POST /api/communities/{community_id}/announcements
   * @param {number} communityId - ID сообщества
   * @param {Object} announcementData - Данные объявления {title, content, etc.}
   * @returns {Promise<Object>}
   */
  createAnnouncement: async (communityId, announcementData) => {
    return apiRequest(`/communities/${communityId}/announcements`, {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
  },
  
  /**
   * Получить список объявлений сообщества
   * GET /api/communities/{community_id}/announcements
   * @param {number} communityId - ID сообщества
   * @returns {Promise<Array>}
   */
  getAnnouncements: async (communityId) => {
    return apiRequest(`/communities/${communityId}/announcements`);
  },
  
  // ----------------------
  // КЕЙСЫ
  // ----------------------
  
  /**
   * Создать кейс в сообществе
   * POST /api/communities/{community_id}/cases
   * @param {number} communityId - ID сообщества
   * @param {Object} caseData - Данные кейса {title, description, etc.}
   * @returns {Promise<Object>}
   */
  createCase: async (communityId, caseData) => {
    return apiRequest(`/communities/${communityId}/cases`, {
      method: 'POST',
      body: JSON.stringify(caseData),
    });
  },
  
  /**
   * Получить список кейсов сообщества
   * GET /api/communities/{community_id}/cases
   * @param {number} communityId - ID сообщества
   * @returns {Promise<Array>}
   */
  getCases: async (communityId) => {
    return apiRequest(`/communities/${communityId}/cases`);
  },
  
  // ----------------------
  // УТИЛИТЫ
  // ----------------------
  
  /**
   * Проверить, авторизован ли пользователь
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return authToken !== null;
  },
  
  /**
   * Получить текущий токен
   * @returns {string|null}
   */
  getToken: () => {
    return authToken;
  },
  
  /**
   * Получить конфигурацию API
   * @returns {Object}
   */
  getConfig: () => {
    return {
      API_BASE_URL: CONFIG.API_BASE_URL,
      TIMEOUT: CONFIG.TIMEOUT,
      DEBUG: CONFIG.DEBUG,
      isAuthenticated: authToken !== null,
      hasToken: authToken !== null,
    };
  },
};

// ============================
// ЭКСПОРТ И ИНИЦИАЛИЗАЦИЯ
// ============================

// Делаем API доступным глобально
window.API = API;
window.APIConfig = CONFIG;

// Логируем успешную загрузку
console.log('✅ API Client loaded');
console.log('� Base URL:', CONFIG.API_BASE_URL);
console.log('🔐 Authenticated:', API.isAuthenticated());

// Экспорт для ES6 модулей (если нужно)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API, CONFIG };
}
