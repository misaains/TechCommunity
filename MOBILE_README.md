# 📱 TechCommunity Mobile - Инструкции по запуску

## 🚀 Быстрый старт

### Вариант 1: Использовать новую мобильную версию

1. **Переименуйте файлы:**
```powershell
# Сделайте резервную копию старой версии
mv index.html index-old.html
mv styles.css styles-old.css
mv app.js app-old.js

# Используйте новые файлы
mv index-mobile.html index.html
mv styles-mobile.css styles.css
mv app-mobile.js app.js
```

2. **Запустите сервер:**
```powershell
python -m http.server 8000
```

3. **Откройте в браузере:**
```
http://localhost:8000
```

### Вариант 2: Просмотр в Chrome DevTools (мобильная версия)

1. Откройте Chrome DevTools (F12)
2. Нажмите на иконку "Toggle device toolbar" (Ctrl+Shift+M)
3. Выберите устройство: iPhone 12 Pro или Pixel 5
4. Обновите страницу

## ✨ Что нового

### Нижняя навигация
- **Лента** - посты от ваших сообществ
- **Поиск** - найти новые сообщества
- **Мои сообщества** - управление подписками
- **Профиль** - ваши данные и достижения

### Модальные окна
1. **Новый пост** - кнопка "+" в ленте
2. **Создание сообщества** - кнопка "+" в моих сообществах
3. **Создание кейса** - (добавьте кнопку где нужно)

### Интерактивность
- ✅ Переключение между вкладками
- ✅ Фильтры по категориям
- ✅ Модальные окна
- ✅ Формы с валидацией
- ✅ Счетчик символов
- ✅ Выбор сложности кейса

## 📋 Структура файлов

```
TechCommunity/
├── index-mobile.html        # Новая мобильная версия ⭐
├── styles-mobile.css        # Стили для мобильной версии ⭐
├── app-mobile.js           # JavaScript для мобильной версии ⭐
├── MOBILE_DESIGN_GUIDE.md  # Гайд по дизайну ⭐
├── index.html              # Старая версия (backup)
├── styles.css              # Старые стили (backup)
├── app.js                  # Старый JS (backup)
├── service-worker.js       # PWA функциональность
└── manifest.json           # PWA манифест
```

## 🎨 Дизайн-система

### Цвета
- **Основной**: `#000000` (черный)
- **Фон**: `#F5F5F5` (светло-серый)
- **Карточки**: `#FFFFFF` (белый)
- **Текст**: `#1A1A1A` (почти черный)
- **Вторичный текст**: `#666666` (серый)

### Отступы
- **XS**: 8px
- **SM**: 12px
- **MD**: 16px (основной)
- **LG**: 20px
- **XL**: 24px

### Скругления
- **SM**: 8px (инпуты, чипы)
- **MD**: 12px (карточки)
- **LG**: 16px (модалки)

## 🔧 Кастомизация

### Добавить новую вкладку

1. **В HTML** (index-mobile.html):
```html
<!-- Добавить в .bottom-nav -->
<button class="bottom-nav-item" data-tab="notifications">
  <svg>...</svg>
  <span>Уведомления</span>
</button>

<!-- Добавить контент -->
<div class="tab-content" id="notifications-tab">
  <div class="page-header">
    <h1 class="page-title">Уведомления</h1>
  </div>
  <!-- Контент вкладки -->
</div>
```

2. **JavaScript автоматически подхватит новую вкладку** ✨

### Добавить новое модальное окно

1. **В HTML**:
```html
<div class="modal" id="myModal">
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title">Заголовок</h2>
      <button class="modal-close" id="closeMyModal">×</button>
    </div>
    <div class="modal-body">
      <!-- Контент -->
    </div>
    <div class="modal-footer">
      <button class="btn-secondary">Отмена</button>
      <button class="btn-primary">OK</button>
    </div>
  </div>
</div>
```

2. **В JavaScript** (app-mobile.js):
```javascript
const myModal = document.getElementById('myModal');
const closeMyModal = document.getElementById('closeMyModal');

closeMyModal.addEventListener('click', () => {
  myModal.classList.remove('active');
});

// Открыть модалку
function openMyModal() {
  myModal.classList.add('active');
}
```

## 🧪 Тестирование

### Проверить на разных устройствах:
- ✅ iPhone SE (375px)
- ✅ iPhone 12 Pro (390px)
- ✅ Pixel 5 (393px)
- ✅ iPad Mini (768px)
- ✅ Desktop (1024px+)

### Проверить функциональность:
- [ ] Переключение вкладок
- [ ] Открытие/закрытие модалок
- [ ] Фильтры в поиске
- [ ] Формы (ввод текста, выбор)
- [ ] Скролл в длинных списках
- [ ] Нижняя навигация не перекрывает контент

## 🐛 Известные проблемы

1. **Иконки 404** - создайте папку `icons/` с файлами:
   - icon-192.png
   - icon-512.png

2. **Service Worker кеширует старую версию**:
```javascript
// Очистить кеш в консоли браузера
caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
```

3. **Модалка не закрывается на Android**:
   - Попробуйте кликнуть на фон модалки
   - Или используйте кнопку "Отменить"

## 📱 PWA установка

### На Android:
1. Откройте сайт в Chrome
2. Меню → "Установить приложение"
3. Подтвердите установку

### На iPhone:
1. Откройте сайт в Safari
2. Нажмите "Поделиться"
3. "На экран Домой"

## 🎯 Следующие шаги

### Must Have:
- [ ] Добавить реальные иконки SVG
- [ ] Создать файлы изображений для иконок PWA
- [ ] Добавить анимации переходов
- [ ] Реализовать like/comment функциональность

### Should Have:
- [ ] Страница детального просмотра сообщества
- [ ] Страница кейса с подачей заявки
- [ ] Страница уведомлений
- [ ] Настройки профиля

### Nice to Have:
- [ ] Dark mode (темная тема)
- [ ] Pull-to-refresh
- [ ] Skeleton loaders
- [ ] Push notifications
- [ ] Офлайн режим

## 💡 Советы

1. **Используйте Chrome DevTools** для отладки
2. **Проверяйте консоль** на ошибки
3. **Тестируйте на реальных устройствах** перед релизом
4. **Делайте коммиты** после каждого большого изменения
5. **Читайте MOBILE_DESIGN_GUIDE.md** для понимания структуры

## 📞 Поддержка

Если что-то не работает:
1. Откройте консоль браузера (F12)
2. Проверьте вкладку "Console" на ошибки
3. Проверьте вкладку "Network" на 404 ошибки
4. Очистите кеш и перезагрузите страницу (Ctrl+Shift+R)

---

**Удачи с вашим приложением!** 🚀
