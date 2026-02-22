# Функциональный план (Product & UX Roadmap)

## Twitch Panels Creator

**Анализ версии:** 0.0.1  
**Дата анализа:** 2025-02-09  
**Технологии:** Svelte 5, TypeScript, Konva.js, Cropper.js

---

## 1. Текущие возможности (глазами пользователя)

### ✅ Реализованный функционал

#### 1.1 Управление текстами панелей

**Файлы:** [`src/states/texts.svelte.ts`](src/states/texts.svelte.ts), [`src/components/text/TextManager.svelte`](src/components/text/TextManager.svelte), [`src/components/text/TextConfig.svelte`](src/components/text/TextConfig.svelte)

- Добавление текстовых панелей через инпут + кнопку/Enter
- Редактирование текста инлайн (двойной клик или прямое редактирование)
- Удаление отдельных текстов
- Глобальные настройки текста (размер, шрифт, цвет, выравнивание, отступы, смещение)
- **Приоритет:** High - это основной рабочий поток

#### 1.2 Система превью панелей

**Файлы:** [`src/components/panel/PreviewManager.svelte`](src/components/panel/PreviewManager.svelte), [`src/components/panel/Preview.svelte`](src/components/panel/Preview.svelte), [`src/components/panel/PreviewAll.svelte`](src/components/panel/PreviewAll.svelte)

- Просмотр превью текущей панели с настройками текста
- Навигация между панелями (стрелки + индикатор "N / M")
- Просмотр всех панелей одновременно (в скрытом контейнере для экспорта)
- Плавные переходы между панелями (fly transition)
- **Приоритет:** High - критично для UX

#### 1.3 Экспорт панелей

**Файлы:** [`src/services/downloadService.ts`](src/services/downloadService.ts)

- Экспорт отдельной панели в PNG (320x100px)
- Массовый экспорт всех панелей в ZIP-архив
- Использование file-saver и JSZip
- **Приоритет:** High - финальная цель пользователя

#### 1.4 Система фоновых изображений

**Файлы:** [`src/states/image.svelte.ts`](src/states/image.svelte.ts), [`src/components/image/ImageManager.svelte`](src/components/image/ImageManager.svelte), [`src/components/image/CropInline.svelte`](src/components/image/CropInline.svelte), [`src/services/uploadService.ts`](src/services/uploadService.ts)

- Загрузка изображений из файла, URL или буфера обмена
- Визуальный интерфейс для обрезки (crop box с handles)
- Настройки яркости, контраста, оттенка, насыщенности и яркости
- Применение фильтров с debounce (150ms)
- Сохранение настроек в localStorage
- **Приоритет:** High - полностью рабочий функционал

#### 1.5 Базовый UI/UX

**Файлы:** [`src/components/layout/Card.svelte`](src/components/layout/Card.svelte), [`src/components/ui/Button.svelte`](src/components/ui/Button.svelte), [`src/components/ui/RangeSlider.svelte`](src/components/ui/RangeSlider.svelte), [`src/components/ui/ColorPicker.svelte`](src/components/ui/ColorPicker.svelte), [`src/components/ui/SelectFont.svelte`](src/components/ui/SelectFont.svelte), [`src/components/ui/Alignment.svelte`](src/components/ui/Alignment.svelte)

- Карточная система группировки
- Кнопки 5 типов (primary, secondary, outline, danger, mini)
- Слайдеры с отображением значения
- Цветовой пикер
- Выбор шрифта из 8 системных
- Три кнопки выравнивания
- Темная/светлая тема
- **Приоритет:** Medium - работает, но можно улучшить

---

## 2. Ближайшие улучшения

### 2.1 Улучшение валидации и UX (Medium Priority)

**Текущее состояние:** Основной функционал работает, но можно улучшить пользовательский опыт.

**Требуемые улучшения:**

1. **Валидация текстов:**
   - Добавить ограничение на длину текста (max 100 символов)
   - Показать счетчик символов
   - Визуальная индикация ошибки при превышении лимита

2. **Валидация изображений:**
   - Проверка формата (JPEG, PNG, WebP, GIF)
   - Проверка размера файла (10MB max)
   - Показать ошибку при неудачной загрузке

3. **Состояния загрузки:**
   - Показать индикатор загрузки при загрузке по URL
   - Отключить кнопки во время загрузки
   - Показать toast уведомление об успехе/ошибке

4. **Пустые состояния:**
   - Показать красивый empty state когда нет текстов
   - Показать placeholder с инструкцией когда нет изображения

### 2.2 Улучшение доступности (Medium Priority)

**Файлы для правок:**

- Все кнопки уже имеют `aria-label` ✅
- [`src/components/text/TextInput.svelte`](src/components/text/TextInput.svelte): добавить `aria-describedby` для валидации
- [`src/components/text/TextInlineEdit.svelte`](src/components/text/TextInlineEdit.svelte): добавить `aria-label` на delete button (уже есть)
- Добавить `role="region"` и `aria-label` на карточки
- Убедиться, что фокусный порядок логичен (Tab navigation)

### 2.3 Расширенные настройки текста (Medium Priority)

**Файлы для модификации:** [`src/states/textConfig.svelte.ts`](src/states/textConfig.svelte.ts), [`src/components/text/TextConfig.svelte`](src/components/text/TextConfig.svelte)

Добавить:

- **Тень текста:** `textShadow: { offsetX, offsetY, blur, color }`
- **Прозрачность:** `opacity: number` (0-100)
- **Градиент:** `gradient: { type: 'linear' | 'radial', colors: HexColor[], angle? }` (сложнее)
- **Несколько текстовых блоков на панели:** потребует переархитектуры Preview.svelte

**Приоритет:** Medium - улучшает качество панелей, но требует работы с Konva.

### 2.4 Улучшение доступности (Medium Priority)

**Файлы для правок:**

- Все кнопки уже имеют `aria-label` ✅
- [`src/components/text/TextInput.svelte`](src/components/text/TextInput.svelte): добавить `aria-describedby` для валидации
- [`src/components/text/TextInlineEdit.svelte`](src/components/text/TextInlineEdit.svelte): добавить `aria-label` на delete button (уже есть)
- Добавить `role="region"` и `aria-label` на карточки
- Убедиться, что фокусный порядок логичен (Tab navigation)

---

## 3. Масштабирование (Крупные модули/интеграции)

### 3.1 Сохранение и загрузка проектов (High Priority)

**Проблема:** Нет persistence, пользователь теряет данные при перезагрузке.

**Решение:**

1. **Создать [`src/services/storageService.ts`](src/services/storageService.ts):**
   - `saveProject(project: Project): Promise<void>` → localStorage
   - `loadProject(id: string): Project | null`
   - `listProjects(): ProjectInfo[]`
   - `deleteProject(id: string)`
   - **Project тип:** `{ id, name, createdAt, texts, imageConfig, textConfig }`

2. **Добавить UI для управления проектами:**
   - [`src/components/layout/AppHeader.svelte`](src/components/layout/AppHeader.svelte): добавить кнопку "Проекты" → открывает модалку
   - [`src/components/project/ProjectManager.svelte`](src/components/project/ProjectManager.svelte) (новый):
     - Список сохраненных проектов
     - Создание/переименование/удаление
     - Экспорт/импорт JSON (для бэкапа)

3. **Автосохранение:**
   - В [`src/routes/+layout.svelte`](src/routes/+layout.svelte): `$effect` на изменениях состояний → debounced save
   - Восстановление при загрузке страницы

**User Retention impact:** Высокий - пользователи смогут возвращаться к своим работам.

### 3.2 Расширенные настройки текста (Medium Priority)

**Файлы для модификации:** [`src/states/textConfig.svelte.ts`](src/states/textConfig.svelte.ts), [`src/components/text/TextConfig.svelte`](src/components/text/TextConfig.svelte)

Добавить:

- **Тень текста:** `textShadow: { offsetX, offsetY, blur, color }`
- **Прозрачность:** `opacity: number` (0-100)
- **Градиент:** `gradient: { type: 'linear' | 'radial', colors: HexColor[], angle? }` (сложнее)
- **Несколько текстовых блоков на панели:** потребует переархитектуры Preview.svelte

**Приоритет:** Medium - улучшает качество панелей, но требует работы с Konva.

### 3.3 Расширенные настройки изображений (Medium Priority)

**Файлы:** [`src/states/imageConfig.svelte.ts`](src/states/imageConfig.svelte.ts), [`src/components/image/ImageManager.svelte`](src/components/image/ImageManager.svelte)

Добавить:

- **Фильтры:** blur, sepia, saturate, grayscale
- **Наложение:** возможность добавить второй слой изображения
- **Режимы наложения:** multiply, screen, overlay (CSS blend modes)

**Приоритет:** Medium - улучшает креативность, но сложная реализация.

### 3.4 Пресеты и шаблоны (Low Priority)

**Новые файлы:**

- [`src/services/templateService.ts`](src/services/templateService.ts)
- [`src/components/template/TemplateGallery.svelte`](src/components/template/TemplateGallery.svelte)

**Функционал:**

- Предустановленные шаблоны (разные стили текста/изображений)
- Сохранение пользовательских пресетов
- Применение пресета к текущему проекту

**Приоритет:** Low - nice-to-have, не критично для MVP.

### 3.5 Интеграция с Twitch API (Future)

**Возможные интеграции:**

- Прямая загрузка панелей на Twitch через API
- Синхронизация с существующими панелями
- Планирование публикации

**Приоритет:** Low - требует OAuth, сложная интеграция.

---

## 4. User Retention (Повторное использование)

### 4.1 Сохранение проектов (см. 3.1) - HIGH

### 4.2 Настройки пользователя (Medium Priority)

**Файлы:** [`src/states/theme.svelte.ts`](src/states/theme.svelte.ts) уже есть, но нет сохранения.

**Добавить:**

- Сохранение темы в localStorage (частично есть в [`src/routes/+layout.svelte`](src/routes/+layout.svelte):15)
- Сохранение предпочитаемого шрифта
- Сохранение последних использованных цветов
- **Файл:** [`src/services/preferencesService.ts`](src/services/preferencesService.ts)

### 4.3 Экспорт в разные форматы (Medium Priority)

**Текущее состояние:** Только PNG.

**Добавить:**

- Экспорт в JPEG (с настройкой качества)
- Экспорт в WebP (современный формат)
- Экспорт в PDF (для печати)
- **Файл:** [`src/services/exportService.ts`](src/services/exportService.ts) (расширить downloadService)

**Приоритет:** Medium - увеличивает полезность.

### 4.4 История изменений (Low Priority)

**Новый файл:** [`src/services/historyService.ts`](src/services/historyService.ts)

**Функционал:**

- Undo/Redo для текстов и настроек
- Хранение N последних состояний
- Горячие клавиши Ctrl+Z / Ctrl+Y

**Приоритет:** Low - удобно, но не обязательно.

### 4.5 Совместная работа (Future)

**Сложная интеграция:**

- Share link с состоянием (закодировать в URL)
- Real-time collaboration (WebSocket)
- Комментарии/ревью

**Приоритет:** Very Low - далеко от MVP.

---

## 5. Приоритизация по фазам

### Фаза 1: Завершение базового функционала (2-3 недели)

**Цель:** Приложение должно работать end-to-end

1. Полная реализация системы изображений (2.1) - **High**
2. Сохранение проектов (3.1) - **High**
3. Валидация и состояния загрузки (2.2) - **Medium**
4. Пустые состояния (2.3) - **Medium**
5. Настройки пользователя (4.2) - **Medium**

**Критерий успеха:** Пользователь может создать, сохранить и загрузить проект с изображением и текстом.

### Фаза 2: Улучшение UX и расширение (3-4 недели)

1. Расширенные настройки текста (3.2) - **Medium**
2. Расширенные настройки изображений (3.3) - **Medium**
3. Экспорт в разные форматы (4.3) - **Medium**
4. Улучшение доступности (2.4) - **Medium**
5. Пресеты и шаблоны (3.4) - **Low**

**Критерий успеха:** Пользователь может создавать сложные панели с эффектами и быстро повторять стили.

### Фаза 3: Продвинутые фичи (4+ недели)

1. История изменений (4.4) - **Low**
2. Интеграция с Twitch API (3.5) - **Low**
3. Совместная работа (4.5) - **Very Low**

---

## 6. Метрики успеха

- **Активация:** >70% пользователей создают хотя бы 1 панель
- **Сохранение:** >30% пользователей сохраняют проект
- **Экспорт:** >50% пользователей экспортируют хотя бы 1 панель
- **Время на создание:** <2 минут для набора из 5 панелей
- **Retention week 1:** >40% возвращаются

---

## 7. Риски и ограничения

1. **Сложность Konva:** Ограниченная кастомизация текста (несколько блоков на панели потребует переписывания Preview.svelte)
2. **Производительность:** Множество Konva stages (konvaAllStages) могут тормозить при 50+ панелях
3. **Браузерные ограничения:** localStorage 5-10MB, может не хватить для изображений
4. **Cropper.js:** Требует доработки для работы с canvas/Konva

---

**Следующие шаги:**

1. Утвердить функциональный план
2. Перейти к техническому плану (ENGINEERING_IMPROVEMENTS.md)
3. Начать реализацию Фазы 1 (начиная с imageService)
