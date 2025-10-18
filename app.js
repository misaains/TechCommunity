// ============================
// DOM ELEMENTS
// ============================
let bottomNavItems = null;
let tabContents = null;
let modals = null;

// Buttons
let newPostBtn = null;
let closeNewPost = null;
let cancelNewPost = null;

let createCommunityBtn = null;
let closeCreateCommunity = null;
let cancelCreateCommunity = null;

let closeCreateCase = null;
let cancelCreateCase = null;

// ============================
// INITIALIZATION
// ============================
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM loaded, initializing mobile app...');
  
  // Initialize elements
  initElements();
  
  // Setup event listeners
  setupBottomNavigation();
  setupModals();
  setupFilters();
  setupForms();
  
  console.log('✅ Mobile app initialized successfully');
});

// ============================
// ELEMENT INITIALIZATION
// ============================
function initElements() {
  // Navigation
  bottomNavItems = document.querySelectorAll('.top-nav-item');
  tabContents = document.querySelectorAll('.tab-content');
  
  // Modals
  modals = {
    newPost: document.getElementById('newPostModal'),
    createCommunity: document.getElementById('createCommunityModal'),
    createCase: document.getElementById('createCaseModal')
  };
  
  // Buttons
  newPostBtn = document.getElementById('newPostBtn');
  closeNewPost = document.getElementById('closeNewPost');
  cancelNewPost = document.getElementById('cancelNewPost');
  
  createCommunityBtn = document.getElementById('createCommunityBtn');
  closeCreateCommunity = document.getElementById('closeCreateCommunity');
  cancelCreateCommunity = document.getElementById('cancelCreateCommunity');
  
  closeCreateCase = document.getElementById('closeCreateCase');
  cancelCreateCase = document.getElementById('cancelCreateCase');
  
  console.log(`Found ${bottomNavItems.length} nav items and ${tabContents.length} tabs`);
}

// ============================
// TOP NAVIGATION
// ============================
function setupBottomNavigation() {
  if (!bottomNavItems || bottomNavItems.length === 0) {
    console.warn('No navigation items found');
    return;
  }
  
  bottomNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      console.log('📱 Switching to tab:', targetTab);
      
      // Update navigation active state
      bottomNavItems.forEach(navItem => navItem.classList.remove('active'));
      item.classList.add('active');
      
      // Update tab content visibility
      tabContents.forEach(tab => tab.classList.remove('active'));
      const activeTab = document.getElementById(`${targetTab}-tab`);
      if (activeTab) {
        activeTab.classList.add('active');
      }
      
      // Scroll to top when switching tabs
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// ============================
// MODAL MANAGEMENT
// ============================
function setupModals() {
  // New Post Modal
  if (newPostBtn) {
    newPostBtn.addEventListener('click', () => openModal('newPost'));
  }
  if (closeNewPost) {
    closeNewPost.addEventListener('click', () => closeModal('newPost'));
  }
  if (cancelNewPost) {
    cancelNewPost.addEventListener('click', () => closeModal('newPost'));
  }
  
  // Create Community Modal
  if (createCommunityBtn) {
    createCommunityBtn.addEventListener('click', () => openModal('createCommunity'));
  }
  if (closeCreateCommunity) {
    closeCreateCommunity.addEventListener('click', () => closeModal('createCommunity'));
  }
  if (cancelCreateCommunity) {
    cancelCreateCommunity.addEventListener('click', () => closeModal('createCommunity'));
  }
  
  // Create Case Modal
  if (closeCreateCase) {
    closeCreateCase.addEventListener('click', () => closeModal('createCase'));
  }
  if (cancelCreateCase) {
    cancelCreateCase.addEventListener('click', () => closeModal('createCase'));
  }
  
  // Close modal on backdrop click
  Object.values(modals).forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }
  });
  
  console.log('✅ Modals setup complete');
}

function openModal(modalName) {
  const modal = modals[modalName];
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    console.log('🔓 Opened modal:', modalName);
  }
}

function closeModal(modalName) {
  const modal = modals[modalName];
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    console.log('🔒 Closed modal:', modalName);
  }
}

// ============================
// FILTER CHIPS
// ============================
function setupFilters() {
  const filterChips = document.querySelectorAll('.filter-chip');
  
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      // Remove active from all chips
      filterChips.forEach(c => c.classList.remove('active'));
      
      // Add active to clicked chip
      chip.classList.add('active');
      
      const category = chip.getAttribute('data-category');
      console.log('🏷️ Filter selected:', category);
      
      // Here you would filter the communities
      filterCommunities(category);
    });
  });
}

function filterCommunities(category) {
  // This is a placeholder for actual filtering logic
  console.log('Filtering communities by:', category);
  
  // In a real app, you would:
  // 1. Get all community cards
  // 2. Filter based on category
  // 3. Show/hide relevant cards
}

// ============================
// FORM INTERACTIONS
// ============================
function setupForms() {
  // Difficulty selector
  const difficultyBtns = document.querySelectorAll('.difficulty-btn');
  difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      difficultyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const level = btn.getAttribute('data-level');
      console.log('📊 Difficulty selected:', level);
    });
  });
  
  // Character counter for textareas
  const textareas = document.querySelectorAll('.form-textarea');
  textareas.forEach(textarea => {
    const hint = textarea.parentElement.querySelector('.form-hint');
    
    if (hint && hint.textContent.includes('символов')) {
      textarea.addEventListener('input', () => {
        const count = textarea.value.length;
        hint.textContent = `${count} символов`;
      });
    }
  });
  
  // Search input
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      console.log('🔍 Search query:', query);
      
      // Here you would implement search logic
      searchCommunities(query);
    });
  }
}

function searchCommunities(query) {
  // Placeholder for search logic
  if (query.length < 2) return;
  
  console.log('Searching for:', query);
  
  // In a real app, you would:
  // 1. Filter communities based on query
  // 2. Update UI to show results
}

// ============================
// POST INTERACTIONS
// ============================
function setupPostActions() {
  // Like buttons
  const likeBtns = document.querySelectorAll('.post-action-btn:first-child');
  likeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const count = btn.querySelector('span');
      const currentCount = parseInt(count.textContent);
      
      // Toggle like
      btn.classList.toggle('liked');
      
      if (btn.classList.contains('liked')) {
        count.textContent = currentCount + 1;
        btn.querySelector('svg').style.fill = '#D0021B';
      } else {
        count.textContent = currentCount - 1;
        btn.querySelector('svg').style.fill = 'none';
      }
      
      console.log('❤️ Post liked/unliked');
    });
  });
}

// ============================
// COMMUNITY ACTIONS
// ============================
function setupCommunityActions() {
  // Join buttons
  const joinBtns = document.querySelectorAll('.btn-join');
  joinBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.textContent === 'Вступить') {
        btn.textContent = 'Отписаться';
        btn.classList.add('btn-leave');
        console.log('✅ Joined community');
      } else {
        btn.textContent = 'Вступить';
        btn.classList.remove('btn-leave');
        console.log('❌ Left community');
      }
    });
  });
}

// ============================
// UTILITY FUNCTIONS
// ============================
function showToast(message, type = 'info') {
  console.log(`🔔 Toast (${type}):`, message);
  
  // In a real app, you would create and show a toast notification
  // For now, we'll just log it
}

function showLoading() {
  console.log('⏳ Loading...');
  // Show loading indicator
}

function hideLoading() {
  console.log('✅ Loading complete');
  // Hide loading indicator
}

// ============================
// API SIMULATION (for demo)
// ============================
const mockData = {
  posts: [
    {
      id: 1,
      author: 'Алексей Смирнов',
      avatar: 'https://via.placeholder.com/48',
      content: 'Сегодня мы запустили новую функцию!',
      community: 'Технологии и IT',
      likes: 142,
      comments: 28,
      timestamp: '2 часа назад'
    }
  ],
  communities: [
    {
      id: 1,
      name: 'Технологии и IT',
      description: 'Разработчики будущего',
      members: 12543,
      category: 'tech'
    }
  ]
};

// ============================
// EXPORT FOR DEBUGGING
// ============================
window.app = {
  openModal,
  closeModal,
  showToast,
  mockData
};

console.log('📱 TechCommunity Mobile App loaded');
