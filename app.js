// ============================================// ============================

// TECHCOMMUNITY - GOD-TIER APPLICATION LOGIC// DOM ELEMENTS

// ============================================// ============================

let bottomNavItems = null;

// ============= STATE MANAGEMENT =============let tabContents = null;

let currentUser = null;let modals = null;

let currentPage = 'feed';

let selectedCommunity = null;// Buttons

let selectedCategory = 'Все';let newPostBtn = null;

let userSkills = [];let closeNewPost = null;

let cancelNewPost = null;

// ============= INITIALIZATION =============

document.addEventListener('DOMContentLoaded', () => {let createCommunityBtn = null;

  console.log('TechCommunity App Starting...');let closeCreateCommunity = null;

  let cancelCreateCommunity = null;

  // Check auth status

  checkAuth();let closeCreateCase = null;

  let cancelCreateCase = null;

  // Setup event listeners

  setupAuthListeners();// ============================

  setupNavigationListeners();// INITIALIZATION

  setupModalListeners();// ============================

  setupFormListeners();document.addEventListener('DOMContentLoaded', () => {

});  console.log('✅ DOM loaded, initializing mobile app...');

  

// ============= AUTH MANAGEMENT =============  // Initialize elements

async function checkAuth() {  initElements();

  const token = localStorage.getItem('token');  

    // Setup event listeners

  if (!token) {  setupBottomNavigation();

    showAuthScreen();  setupModals();

    return;  setupFilters();

  }  setupForms();

    

  try {  console.log('✅ Mobile app initialized successfully');

    const user = await api.getUser();});

    currentUser = user;

    showAppScreen();// ============================

    loadFeed();// ELEMENT INITIALIZATION

  } catch (error) {// ============================

    console.error('Auth check failed:', error);function initElements() {

    localStorage.removeItem('token');  // Navigation

    showAuthScreen();  bottomNavItems = document.querySelectorAll('.top-nav-item');

  }  tabContents = document.querySelectorAll('.tab-content');

}  

  // Modals

function showAuthScreen() {  modals = {

  document.getElementById('auth-screen').classList.add('active');    newPost: document.getElementById('newPostModal'),

  document.getElementById('app-screen').classList.remove('active');    createCommunity: document.getElementById('createCommunityModal'),

}    createCase: document.getElementById('createCaseModal')

  };

function showAppScreen() {  

  document.getElementById('auth-screen').classList.remove('active');  // Buttons

  document.getElementById('app-screen').classList.add('active');  newPostBtn = document.getElementById('newPostBtn');

  loadProfile();  closeNewPost = document.getElementById('closeNewPost');

}  cancelNewPost = document.getElementById('cancelNewPost');

  

function setupAuthListeners() {  createCommunityBtn = document.getElementById('createCommunityBtn');

  // Переключение вкладок авторизации  closeCreateCommunity = document.getElementById('closeCreateCommunity');

  document.querySelectorAll('.auth-tab').forEach(tab => {  cancelCreateCommunity = document.getElementById('cancelCreateCommunity');

    tab.addEventListener('click', (e) => {  

      const targetForm = e.target.dataset.tab;  closeCreateCase = document.getElementById('closeCreateCase');

        cancelCreateCase = document.getElementById('cancelCreateCase');

      // Обновляем вкладки  

      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));  console.log(`Found ${bottomNavItems.length} nav items and ${tabContents.length} tabs`);

      e.target.classList.add('active');}

      

      // Обновляем формы// ============================

      document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));// TOP NAVIGATION

      document.getElementById(targetForm + '-form').classList.add('active');// ============================

    });function setupBottomNavigation() {

  });  if (!bottomNavItems || bottomNavItems.length === 0) {

      console.warn('No navigation items found');

  // Форма входа    return;

  document.getElementById('login-form').addEventListener('submit', async (e) => {  }

    e.preventDefault();  

      bottomNavItems.forEach(item => {

    const email = document.getElementById('login-email').value;    item.addEventListener('click', () => {

    const password = document.getElementById('login-password').value;      const targetTab = item.getAttribute('data-tab');

          console.log('📱 Switching to tab:', targetTab);

    try {      

      const response = await api.login(email, password);      // Update navigation active state

      localStorage.setItem('token', response.access_token);      bottomNavItems.forEach(navItem => navItem.classList.remove('active'));

      currentUser = response.user;      item.classList.add('active');

      showAppScreen();      

      loadFeed();      // Update tab content visibility

    } catch (error) {      tabContents.forEach(tab => tab.classList.remove('active'));

      alert('Ошибка входа: ' + (error.message || 'Проверьте логин и пароль'));      const activeTab = document.getElementById(`${targetTab}-tab`);

    }      if (activeTab) {

  });        activeTab.classList.add('active');

        }

  // Форма регистрации      

  document.getElementById('register-form').addEventListener('submit', async (e) => {      // Scroll to top when switching tabs

    e.preventDefault();      window.scrollTo({ top: 0, behavior: 'smooth' });

        });

    const name = document.getElementById('register-name').value;  });

    const email = document.getElementById('register-email').value;}

    const password = document.getElementById('register-password').value;

    // ============================

    try {// MODAL MANAGEMENT

      const response = await api.signup(name, email, password);// ============================

      localStorage.setItem('token', response.access_token);function setupModals() {

      currentUser = response.user;  // New Post Modal

      showAppScreen();  if (newPostBtn) {

      loadFeed();    newPostBtn.addEventListener('click', () => openModal('newPost'));

    } catch (error) {  }

      alert('Ошибка регистрации: ' + (error.message || 'Попробуйте другой email'));  if (closeNewPost) {

    }    closeNewPost.addEventListener('click', () => closeModal('newPost'));

  });  }

}  if (cancelNewPost) {

    cancelNewPost.addEventListener('click', () => closeModal('newPost'));

// ============= NAVIGATION =============  }

function setupNavigationListeners() {  

  document.querySelectorAll('.nav-item').forEach(item => {  // Create Community Modal

    item.addEventListener('click', (e) => {  if (createCommunityBtn) {

      const page = e.currentTarget.dataset.page;    createCommunityBtn.addEventListener('click', () => openModal('createCommunity'));

      showPage(page);  }

    });  if (closeCreateCommunity) {

  });    closeCreateCommunity.addEventListener('click', () => closeModal('createCommunity'));

    }

  // Кнопка "Назад" на странице сообщества  if (cancelCreateCommunity) {

  document.getElementById('back-to-communities').addEventListener('click', () => {    cancelCreateCommunity.addEventListener('click', () => closeModal('createCommunity'));

    showPage('communities');  }

  });  

    // Create Case Modal

  // Кнопка редактирования профиля  if (closeCreateCase) {

  document.getElementById('edit-profile-btn').addEventListener('click', () => {    closeCreateCase.addEventListener('click', () => closeModal('createCase'));

    showPage('edit-profile');  }

    loadEditProfile();  if (cancelCreateCase) {

  });    cancelCreateCase.addEventListener('click', () => closeModal('createCase'));

    }

  // Кнопка "Назад" на странице редактирования  

  document.getElementById('back-to-profile').addEventListener('click', () => {  // Close modal on backdrop click

    showPage('profile');  Object.values(modals).forEach(modal => {

  });    if (modal) {

        modal.addEventListener('click', (e) => {

  // Кнопка создания сообщества        if (e.target === modal) {

  document.getElementById('create-community-btn').addEventListener('click', () => {          modal.classList.remove('active');

    openModal('create-community-modal');        }

  });      });

}    }

  });

function showPage(pageName) {  

  currentPage = pageName;  console.log('✅ Modals setup complete');

  }

  // Обновляем навигацию

  document.querySelectorAll('.nav-item').forEach(item => {function openModal(modalName) {

    item.classList.remove('active');  const modal = modals[modalName];

    if (item.dataset.page === pageName) {  if (modal) {

      item.classList.add('active');    modal.classList.add('active');

    }    document.body.style.overflow = 'hidden';

  });    console.log('🔓 Opened modal:', modalName);

    }

  // Обновляем страницы}

  document.querySelectorAll('.page').forEach(page => {

    page.classList.remove('active');function closeModal(modalName) {

  });  const modal = modals[modalName];

  document.getElementById(pageName + '-page').classList.add('active');  if (modal) {

      modal.classList.remove('active');

  // Загружаем данные для страницы    document.body.style.overflow = '';

  loadPageData(pageName);    console.log('🔒 Closed modal:', modalName);

}  }

}

async function loadPageData(pageName) {

  switch (pageName) {// ============================

    case 'feed':// FILTER CHIPS

      await loadFeed();// ============================

      break;function setupFilters() {

    case 'search':  const filterChips = document.querySelectorAll('.filter-chip');

      await loadSearchCommunities();  

      break;  filterChips.forEach(chip => {

    case 'communities':    chip.addEventListener('click', () => {

      await loadMyCommunities();      // Remove active from all chips

      break;      filterChips.forEach(c => c.classList.remove('active'));

    case 'profile':      

      await loadProfile();      // Add active to clicked chip

      break;      chip.classList.add('active');

  }      

}      const category = chip.getAttribute('data-category');

      console.log('🏷️ Filter selected:', category);

// ============= FEED PAGE =============      

async function loadFeed() {      // Here you would filter the communities

  const container = document.getElementById('feed-posts');      filterCommunities(category);

  container.innerHTML = '<div class="loading">Загрузка ленты...</div>';    });

    });

  try {}

    const posts = await api.getFeed();

    function filterCommunities(category) {

    if (posts.length === 0) {  // This is a placeholder for actual filtering logic

      container.innerHTML = `  console.log('Filtering communities by:', category);

        <div class="empty-state">  

          <h3>Лента пуста</h3>  // In a real app, you would:

          <p>Подпишитесь на сообщества, чтобы видеть их посты</p>  // 1. Get all community cards

        </div>  // 2. Filter based on category

      `;  // 3. Show/hide relevant cards

      return;}

    }

    // ============================

    container.innerHTML = posts.map(post => renderPost(post)).join('');// FORM INTERACTIONS

    attachPostEventListeners();// ============================

  } catch (error) {function setupForms() {

    console.error('Failed to load feed:', error);  // Difficulty selector

    container.innerHTML = '<div class="empty-state"><p>Ошибка загрузки ленты</p></div>';  const difficultyBtns = document.querySelectorAll('.difficulty-btn');

  }  difficultyBtns.forEach(btn => {

}    btn.addEventListener('click', () => {

      difficultyBtns.forEach(b => b.classList.remove('active'));

function renderPost(post) {      btn.classList.add('active');

  const community = post.community || {};      

  const likesCount = post.likes_count || 0;      const level = btn.getAttribute('data-level');

  const commentsCount = post.comments_count || 0;      console.log('📊 Difficulty selected:', level);

  const isLiked = post.is_liked || false;    });

    });

  return `  

    <div class="post-card" data-post-id="${post.id}">  // Character counter for textareas

      <div class="post-header">  const textareas = document.querySelectorAll('.form-textarea');

        <div class="post-avatar">  textareas.forEach(textarea => {

          ${community.icon_url ?     const hint = textarea.parentElement.querySelector('.form-hint');

            `<img src="${community.icon_url}" alt="${community.name}">` :    

            `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">    if (hint && hint.textContent.includes('символов')) {

              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>      textarea.addEventListener('input', () => {

            </svg>`        const count = textarea.value.length;

          }        hint.textContent = `${count} символов`;

        </div>      });

        <div class="post-info">    }

          <div class="post-community-name">${community.name || 'Сообщество'}</div>  });

          ${community.category ? `<span class="post-category">${community.category}</span>` : ''}  

        </div>  // Search input

      </div>  const searchInput = document.querySelector('.search-input');

      <div class="post-content">${post.content}</div>  if (searchInput) {

      ${post.image_url ? `<img src="${post.image_url}" alt="Post image" class="post-image">` : ''}    searchInput.addEventListener('input', (e) => {

      <div class="post-actions">      const query = e.target.value.toLowerCase();

        <button class="post-action ${isLiked ? 'liked' : ''}" data-action="like" data-post-id="${post.id}">      console.log('🔍 Search query:', query);

          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">      

            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>      // Here you would implement search logic

          </svg>      searchCommunities(query);

          <span>${likesCount}</span>    });

        </button>  }

        <button class="post-action" data-action="comment" data-post-id="${post.id}">}

          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">

            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>function searchCommunities(query) {

          </svg>  // Placeholder for search logic

          <span>${commentsCount}</span>  if (query.length < 2) return;

        </button>  

        <button class="post-action" data-action="share" data-post-id="${post.id}">  console.log('Searching for:', query);

          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">  

            <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>  // In a real app, you would:

          </svg>  // 1. Filter communities based on query

          <span>Поделиться</span>  // 2. Update UI to show results

        </button>}

      </div>

    </div>// ============================

  `;// POST INTERACTIONS

}// ============================

function setupPostActions() {

function attachPostEventListeners() {  // Like buttons

  document.querySelectorAll('.post-action').forEach(button => {  const likeBtns = document.querySelectorAll('.post-action-btn:first-child');

    button.addEventListener('click', async (e) => {  likeBtns.forEach(btn => {

      e.stopPropagation();    btn.addEventListener('click', () => {

      const action = button.dataset.action;      const count = btn.querySelector('span');

      const postId = button.dataset.postId;      const currentCount = parseInt(count.textContent);

            

      if (action === 'like') {      // Toggle like

        await toggleLike(button, postId);      btn.classList.toggle('liked');

      } else if (action === 'comment') {      

        alert('Комментарии скоро появятся!');      if (btn.classList.contains('liked')) {

      } else if (action === 'share') {        count.textContent = currentCount + 1;

        alert('Функция "Поделиться" скоро появится!');        btn.querySelector('svg').style.fill = '#D0021B';

      }      } else {

    });        count.textContent = currentCount - 1;

  });        btn.querySelector('svg').style.fill = 'none';

}      }

      

async function toggleLike(button, postId) {      console.log('❤️ Post liked/unliked');

  const isLiked = button.classList.contains('liked');    });

    });

  try {}

    if (isLiked) {

      await api.unlikePost(postId);// ============================

      button.classList.remove('liked');// COMMUNITY ACTIONS

    } else {// ============================

      await api.likePost(postId);function setupCommunityActions() {

      button.classList.add('liked');  // Join buttons

    }  const joinBtns = document.querySelectorAll('.btn-join');

      joinBtns.forEach(btn => {

    const span = button.querySelector('span');    btn.addEventListener('click', () => {

    const currentCount = parseInt(span.textContent);      if (btn.textContent === 'Вступить') {

    span.textContent = isLiked ? currentCount - 1 : currentCount + 1;        btn.textContent = 'Отписаться';

  } catch (error) {        btn.classList.add('btn-leave');

    console.error('Failed to toggle like:', error);        console.log('✅ Joined community');

  }      } else {

}        btn.textContent = 'Вступить';

        btn.classList.remove('btn-leave');

// ============= SEARCH PAGE =============        console.log('❌ Left community');

async function loadSearchCommunities(category = 'Все', searchQuery = '') {      }

  const container = document.getElementById('search-communities-list');    });

  container.innerHTML = '<div class="loading">Поиск сообществ...</div>';  });

  }

  try {

    const params = {};// ============================

    if (category && category !== 'Все') {// UTILITY FUNCTIONS

      params.category = category;// ============================

    }function showToast(message, type = 'info') {

      console.log(`🔔 Toast (${type}):`, message);

    const communities = await api.getCommunities(params);  

      // In a real app, you would create and show a toast notification

    const filtered = searchQuery   // For now, we'll just log it

      ? communities.filter(c => }

          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||

          (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))function showLoading() {

        )  console.log('⏳ Loading...');

      : communities;  // Show loading indicator

    }

    if (filtered.length === 0) {

      container.innerHTML = `function hideLoading() {

        <div class="empty-state">  console.log('✅ Loading complete');

          <h3>Сообщества не найдены</h3>  // Hide loading indicator

          <p>Попробуйте изменить фильтры</p>}

        </div>

      `;// ============================

      return;// API SIMULATION (for demo)

    }// ============================

    const mockData = {

    container.innerHTML = filtered.map(community => renderCommunityCard(community)).join('');  posts: [

    attachCommunityEventListeners();    {

  } catch (error) {      id: 1,

    console.error('Failed to load communities:', error);      author: 'Алексей Смирнов',

    container.innerHTML = '<div class="empty-state"><p>Ошибка загрузки сообществ</p></div>';      avatar: 'https://via.placeholder.com/48',

  }      content: 'Сегодня мы запустили новую функцию!',

}      community: 'Технологии и IT',

      likes: 142,

function renderCommunityCard(community) {      comments: 28,

  const isSubscribed = community.is_subscribed || false;      timestamp: '2 часа назад'

  const membersCount = community.members_count || 0;    }

    ],

  return `  communities: [

    <div class="community-card" data-community-id="${community.id}">    {

      <div class="community-header">      id: 1,

        <div class="community-icon">      name: 'Технологии и IT',

          ${community.icon_url ?      description: 'Разработчики будущего',

            `<img src="${community.icon_url}" alt="${community.name}">` :      members: 12543,

            `<svg fill="currentColor" viewBox="0 0 24 24">      category: 'tech'

              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>    }

            </svg>`  ]

          }};

        </div>

        <div class="community-header-info">// ============================

          <div class="community-header-top">// EXPORT FOR DEBUGGING

            <h3 class="community-name">${community.name}</h3>// ============================

            <button class="subscribe-btn ${isSubscribed ? 'subscribed' : ''}" window.app = {

                    data-community-id="${community.id}"  openModal,

                    onclick="event.stopPropagation(); toggleSubscribe(${community.id}, this)">  closeModal,

              ${isSubscribed ? 'Отписаться' : 'Подписаться'}  showToast,

            </button>  mockData

          </div>};

          ${community.category ? `<span class="post-category">${community.category}</span>` : ''}

        </div>console.log('📱 TechCommunity Mobile App loaded');

      </div>
      ${community.description ? `<p class="community-description">${community.description}</p>` : ''}
      <div class="community-meta">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <span>${membersCount} участников</span>
      </div>
    </div>
  `;
}

function attachCommunityEventListeners() {
  document.querySelectorAll('.community-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('subscribe-btn')) {
        const communityId = card.dataset.communityId;
        showCommunityDetail(communityId);
      }
    });
  });
}

async function toggleSubscribe(communityId, button) {
  const isSubscribed = button.classList.contains('subscribed');
  
  try {
    if (isSubscribed) {
      await api.unsubscribeCommunity(communityId);
      button.classList.remove('subscribed');
      button.textContent = 'Подписаться';
    } else {
      await api.subscribeCommunity(communityId);
      button.classList.add('subscribed');
      button.textContent = 'Отписаться';
    }
    
    if (currentPage === 'feed') {
      loadFeed();
    }
  } catch (error) {
    console.error('Failed to toggle subscription:', error);
    alert('Ошибка подписки');
  }
}

document.getElementById('community-search').addEventListener('input', (e) => {
  loadSearchCommunities(selectedCategory, e.target.value);
});

document.querySelectorAll('.category-chip').forEach(chip => {
  chip.addEventListener('click', (e) => {
    document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');
    
    selectedCategory = e.target.dataset.category;
    loadSearchCommunities(selectedCategory, document.getElementById('community-search').value);
  });
});

// ============= COMMUNITY DETAIL PAGE =============
async function showCommunityDetail(communityId) {
  selectedCommunity = communityId;
  document.getElementById('community-detail-page').classList.add('active');
  document.getElementById('search-page').classList.remove('active');
  
  await loadCommunityDetail(communityId);
}

async function loadCommunityDetail(communityId) {
  try {
    const community = await api.getCommunity(communityId);
    
    document.getElementById('community-detail-name').textContent = community.name;
    document.getElementById('community-detail-description').textContent = community.description || 'Описание отсутствует';
    document.getElementById('community-detail-members').textContent = `${community.members_count || 0} участников`;
    
    const cases = await api.getCommunityCases(communityId);
    const casesContainer = document.getElementById('community-cases-list');
    
    if (cases.length === 0) {
      casesContainer.innerHTML = '<p style="color: var(--text-secondary)">Нет активных кейсов</p>';
    } else {
      casesContainer.innerHTML = cases.map(c => renderCaseCard(c)).join('');
    }
    
    const posts = await api.getCommunityPosts(communityId);
    const postsContainer = document.getElementById('community-detail-posts');
    
    if (posts.length === 0) {
      postsContainer.innerHTML = '<div class="empty-state"><p>Нет постов</p></div>';
    } else {
      postsContainer.innerHTML = posts.map(post => renderPost(post)).join('');
      attachPostEventListeners();
    }
  } catch (error) {
    console.error('Failed to load community detail:', error);
  }
}

function renderCaseCard(caseItem) {
  const difficultyClass = caseItem.difficulty || 'medium';
  const difficultyText = {
    'easy': 'Легкий',
    'medium': 'Средний',
    'hard': 'Сложный'
  }[difficultyClass] || 'Средний';
  
  const skills = Array.isArray(caseItem.required_skills) ? caseItem.required_skills : 
                 (caseItem.required_skills ? JSON.parse(caseItem.required_skills) : []);
  
  return `
    <div class="case-card">
      <h4 class="case-title">${caseItem.title}</h4>
      <p class="case-description">${caseItem.description}</p>
      <div class="case-difficulty ${difficultyClass}">${difficultyText}</div>
      ${skills.length > 0 ? `
        <div class="case-skills">
          <div class="case-skills-label">Требуемые навыки:</div>
          <div class="skills-list">
            ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      ${caseItem.deadline ? `
        <div class="case-deadline">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>До ${new Date(caseItem.deadline).toLocaleDateString()}</span>
        </div>
      ` : ''}
      <button class="case-apply-btn">Откликнуться</button>
    </div>
  `;
}

// ============= MY COMMUNITIES PAGE =============
async function loadMyCommunities() {
  const container = document.getElementById('my-communities-list');
  container.innerHTML = '<div class="loading">Загрузка ваших сообществ...</div>';
  
  try {
    const allCommunities = await api.getCommunities();
    const myCommunities = allCommunities.filter(c => c.is_subscribed);
    
    if (myCommunities.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>Вы не подписаны ни на одно сообщество</h3>
          <p>Перейдите в раздел "Поиск", чтобы найти интересные сообщества</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = myCommunities.map(community => renderCommunityCard(community)).join('');
    attachCommunityEventListeners();
  } catch (error) {
    console.error('Failed to load my communities:', error);
    container.innerHTML = '<div class="empty-state"><p>Ошибка загрузки сообществ</p></div>';
  }
}

// ============= PROFILE PAGE =============
async function loadProfile() {
  try {
    const user = await api.getUser();
    currentUser = user;
    
    document.getElementById('profile-name').textContent = user.name || 'Пользователь';
    document.getElementById('profile-username').textContent = user.username ? `@${user.username}` : `@user${user.id}`;
    document.getElementById('profile-bio').textContent = user.bio || 'Биография не заполнена';
    
    const detailsContainer = document.getElementById('profile-details-list');
    const details = [];
    
    if (user.location) {
      details.push(`
        <div class="detail-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span>${user.location}</span>
        </div>
      `);
    }
    
    if (user.education) {
      details.push(`
        <div class="detail-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
          </svg>
          <span>${user.education}</span>
        </div>
      `);
    }
    
    if (user.company) {
      details.push(`
        <div class="detail-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          <span>${user.company}</span>
        </div>
      `);
    }
    
    detailsContainer.innerHTML = details.join('') || '<p style="color: var(--text-secondary); text-align: center;">Детали не заполнены</p>';
    
    document.getElementById('stat-communities').textContent = user.communities_count || 0;
    document.getElementById('stat-cases').textContent = user.cases_count || 0;
    document.getElementById('stat-reputation').textContent = user.reputation || 0;
    
    const skillsList = document.getElementById('profile-skills-list');
    const skills = Array.isArray(user.skills) ? user.skills : 
                   (user.skills ? JSON.parse(user.skills) : []);
    
    if (skills.length === 0) {
      skillsList.innerHTML = '<p style="color: var(--text-secondary)">Навыки не указаны</p>';
    } else {
      skillsList.innerHTML = skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
    }
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
}

// ============= EDIT PROFILE PAGE =============
function loadEditProfile() {
  if (!currentUser) return;
  
  document.getElementById('edit-name').value = currentUser.name || '';
  document.getElementById('edit-username').value = currentUser.username || '';
  document.getElementById('edit-email').value = currentUser.email || '';
  document.getElementById('edit-bio').value = currentUser.bio || '';
  document.getElementById('edit-location').value = currentUser.location || '';
  document.getElementById('edit-education').value = currentUser.education || '';
  document.getElementById('edit-company').value = currentUser.company || '';
  
  const status = currentUser.status || 'active';
  document.querySelectorAll('.status-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.status === status) {
      btn.classList.add('active');
    }
  });
  
  userSkills = Array.isArray(currentUser.skills) ? currentUser.skills : 
               (currentUser.skills ? JSON.parse(currentUser.skills) : []);
  updateSkillsEditList();
}

function updateSkillsEditList() {
  const container = document.getElementById('edit-skills-list');
  
  if (userSkills.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary); padding: 8px;">Навыки не выбраны</p>';
  } else {
    container.innerHTML = userSkills.map(skill => `
      <div class="skill-tag-edit">
        ${skill}
        <button class="skill-remove" onclick="removeSkill('${skill}')">×</button>
      </div>
    `).join('');
  }
}

function removeSkill(skill) {
  userSkills = userSkills.filter(s => s !== skill);
  updateSkillsEditList();
}

document.querySelectorAll('.status-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ============= MODALS =============
function setupModalListeners() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });
  
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      closeModal(modal.id);
    });
  });
}

function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

document.getElementById('select-skills-btn').addEventListener('click', () => {
  openModal('skills-selector-modal');
  loadSkillsSelector();
});

function loadSkillsSelector() {
  const container = document.getElementById('skills-selector-grid');
  const availableSkills = [
    'Python', 'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular',
    'Node.js', 'Django', 'FastAPI', 'SQL', 'MongoDB', 'PostgreSQL',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'Machine Learning', 'Data Science', 'AI', 'Computer Vision',
    'Генная инженерия', 'Биотехнологии', 'Молекулярная биология',
    'UI/UX Design', 'Graphic Design', 'Product Management'
  ];
  
  container.innerHTML = availableSkills.map(skill => `
    <label class="skill-checkbox">
      <input type="checkbox" value="${skill}" ${userSkills.includes(skill) ? 'checked' : ''}>
      ${skill}
    </label>
  `).join('');
  
  container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const skill = e.target.value;
      if (e.target.checked) {
        if (!userSkills.includes(skill)) {
          userSkills.push(skill);
        }
      } else {
        userSkills = userSkills.filter(s => s !== skill);
      }
      updateSkillsEditList();
    });
  });
}

// ============= FORMS =============
function setupFormListeners() {
  document.getElementById('edit-profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('edit-name').value,
      username: document.getElementById('edit-username').value,
      email: document.getElementById('edit-email').value,
      bio: document.getElementById('edit-bio').value,
      location: document.getElementById('edit-location').value,
      education: document.getElementById('edit-education').value,
      company: document.getElementById('edit-company').value,
      status: document.querySelector('.status-btn.active').dataset.status,
      skills: userSkills
    };
    
    try {
      const updatedUser = await api.updateProfile(formData);
      currentUser = updatedUser;
      alert('Профиль успешно обновлен!');
      showPage('profile');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Ошибка обновления профиля');
    }
  });
  
  document.getElementById('create-community-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('new-community-name').value,
      description: document.getElementById('new-community-description').value,
      category: document.getElementById('new-community-category').value
    };
    
    try {
      await api.createCommunity(formData);
      alert('Сообщество успешно создано!');
      closeModal('create-community-modal');
      e.target.reset();
      loadMyCommunities();
    } catch (error) {
      console.error('Failed to create community:', error);
      alert('Ошибка создания сообщества');
    }
  });
  
  document.getElementById('create-post-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      content: document.getElementById('new-post-content').value,
      community_id: parseInt(document.getElementById('new-post-community').value)
    };
    
    try {
      await api.createPost(formData);
      alert('Пост успешно создан!');
      closeModal('create-post-modal');
      e.target.reset();
      loadFeed();
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Ошибка создания поста');
    }
  });
}

document.querySelectorAll('textarea[maxlength]').forEach(textarea => {
  const maxLength = textarea.getAttribute('maxlength');
  const counterId = textarea.id + '-counter';
  
  if (document.getElementById(counterId)) {
    textarea.addEventListener('input', () => {
      const remaining = maxLength - textarea.value.length;
      document.getElementById(counterId).textContent = `${remaining} символов осталось`;
    });
  }
});

function logout() {
  if (confirm('Вы уверены, что хотите выйти?')) {
    localStorage.removeItem('token');
    currentUser = null;
    showAuthScreen();
  }
}

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

console.log('TechCommunity App Loaded Successfully! 🚀');
