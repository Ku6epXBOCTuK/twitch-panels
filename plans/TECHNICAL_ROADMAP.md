# Технический план (Engineering & Architecture Roadmap)

## Twitch Panels Creator

**Анализ версии:** 0.0.1  
**Дата анализа:** 2025-02-09  
**Технологии:** Svelte 5, TypeScript, Konva.js, Vitest

---

## 1. Аудит текущей архитектуры

### 1.1 State Management - КРИТИЧЕСКИЕ ПРОБЛЕМЫ

**Проблема:** Несогласованные паттерны управления состоянием.

#### Паттерн A: Фабрика функций (✅ Хорошо)

**Файлы:** [`src/states/texts.svelte.ts`](src/states/texts.svelte.ts), [`src/states/textConfig.svelte.ts`](src/states/textConfig.svelte.ts), [`src/states/theme.svelte.ts`](src/states/theme.svelte.ts), [`src/states/konvaStage.svelte.ts`](src/states/konvaStage.svelte.ts)

```typescript
// Пример: texts.svelte.ts
function createState() {
  let texts = $state(defaultTexts);
  let nextId = $state(defaultTexts.length);

  return {
    get texts() { return texts; },
    addText(text: string) { ... },
    removeText(id: number) { ... },
  };
}
export const textsState = createState();
```

**Преимущества:**

- Инкапсуляция приватных переменных
- Геттеры/сеттеры для валидации
- Легко тестировать (можно создавать инстансы)

**Недостатки:**

- Избыточный код геттеров/сеттеров (см. textConfig.svelte.ts:24-61)

#### Паттерн B: Прямой $state (❌ ПЛОХО)

**Файлы:** [`src/states/konvaAllStages.svelte.ts`](src/states/konvaAllStages.svelte.ts), [`src/states/imageConfig.svelte.ts`](src/states/imageConfig.svelte.ts)

```typescript
// ПЛОХО - глобальный массив без инкапсуляции
export const konvaAllStagesState: Array<Stage> = $state([]);

// ПЛОХО - класс с $state полями, но без фабрики
export class imageState {
  image = $state<HTMLImageElement | undefined>(undefined);
  imageLink = $state("");
  // ...
}
export const imageState = new imageState();
```

**Проблемы:**

- `konvaAllStagesState` - глобальный изменяемый массив, нет контроля над операциями
- `imageState` - класс с $state, но не фабрика, сложно тестировать
- Нет единого подхода

#### Паттерн C: Смешанный (⚠️ НЕПРАВИЛЬНО)

**Файлы:** [`src/states/imageConfig.svelte.ts`](src/states/imageConfig.svelte.ts) - класс с $state, но с приватными полями и методами

**Рекомендация:** Привести все состояния к **Фабрике функций** (Pattern A).

---

### 1.2 Сервисный слой - ОТСУТСТВУЕТ

**Текущее состояние:**

- ✅ [`src/services/downloadService.ts`](src/services/downloadService.ts) - хороший пример
- ❌ `imageService.ts` - отсутствует (логика загрузки размазана)
- ❌ `storageService.ts` - отсутствует (localStorage в +layout.svelte:15)

**Проблема:** Бизнес-логика смешана с UI-компонентами.

**Пример:** [`src/components/image/ImageManager.svelte`](src/components/image/ImageManager.svelte) - UI без логики, кнопки не работают.

**Рекомендация:** Создать сервисы для всех доменных областей.

---

### 1.3 Компонентная архитектура - ОЦЕНКА ВСЕХ ГРУПП

#### Группа 1: layout/ (Базовые layout-компоненты)

**Файлы:** Card.svelte, AppHeader.svelte, PanelBar.svelte, TextBar.svelte, SettingsGrid.svelte, SettingsRow.svelte, InputGroup.svelte

**Оценка:** ✅ **Хорошо**

- Четкое разделение: Card — контейнер, SettingsGrid/Row — формы, PanelBar/TextBar — компоновка секций
- InputGroup.svelte простой flex wrapper, выполняет свою функцию
- AppHeader.svelte содержит логику переключения темы, но это уместно (header — привязка к UI)
- Нет дублирования, каждый компонент имеет уникальную ответственность
- **Рекомендаций:** Нет

---

#### Группа 2: panel/ (Превью панелей)

**Файлы:** Preview.svelte, PreviewAll.svelte, PreviewControls.svelte, PreviewManager.svelte

**Оценка:** ✅ **Хорошо**

- Preview — чистый компонент, принимает `text` и `stage` как props, рендерит Konva Stage + Layer + Image + Text
- PreviewAll — off-screen рендеринг всех stages (необходимость для экспорта)
- PreviewControls — навигация (prev/next), чистая логика
- PreviewManager — оркестратор: управляет current index, direction, вызывает downloadService
- **Вывод:** Хорошее разделение, каждая панель имеет свою зону ответственности

**Потенциальная проблема:**

- PreviewManager.svelte:22-30 содержит $effect для синхронизации current с textsState.texts.length — это бизнес-логика, но в данном контексте допустимо
- **Рекомендация:** Если логика усложнится, вынести в отдельный хук/сервис

---

#### Группа 3: text/ (Управление текстами)

**Файлы:** TextManager.svelte, TextConfig.svelte, TextInput.svelte, TextInlineEdit.svelte

**Оценка:** ✅ **Хорошо**

- TextManager — управление списком текстов (add/delete), вызывает textsState
- TextConfig — UI для глобальных настроек текста, bind:value к textConfigState
- TextInput — простой input с обработкой Enter
- TextInlineEdit — inline-редактирование с кнопкой удаления
- **Вывод:** Чистые, сфокусированные компоненты, нет дублирования

**Замечание:**

- TextInlineEdit.svelte:17 — `<input type="text" bind:value={text} />` без валидации maxLength (есть в constants.ts:32)
- **Рекомендация:** Добавить `maxlength={TYPOGRAPHY.MAX_TEXT_LENGTH}` и визуальный счетчик

---

#### Группа 4: image/ (Работа с изображениями)

**Файлы:** ImageManager.svelte, CropInline.svelte

**Оценка:** ⚠️ **Частично реализовано (нефункционально)**

- ImageManager.svelte — UI есть, но кнопки не работают (Upload, Edit, Reset)
- CropInline.svelte — визуальный crop box с handles, но нет интеграции с cropperjs и imageState
- Настройки яркости/контраста — только UI, нет логики применения
- **Вывод:** Компоненты выглядят готовыми, но функциональность отсутствует

**Рекомендации (High Priority):**

- Реализовать imageService.ts и интегрировать в ImageManager
- Добавить логику crop в CropInline (drag, resize, update imageState)
- Применить фильтры яркости/контраста к Konva Image в Preview.svelte

---

#### Группа 5: ui/ (Переиспользуемые UI-компоненты)

**Файлы:** Button.svelte, RangeSlider.svelte, ColorPicker.svelte, SelectFont.svelte, Alignment.svelte, Badge.svelte

**Оценка:** ✅ **Хорошо**

- Button — 5 типов (primary, secondary, outline, danger, mini), хороший API
- RangeSlider — простой wrapper с отображением значения
- ColorPicker — input type="color" + отображение hex
- SelectFont — hardcoded список шрифтов (можно улучшить, вынести в constants)
- Alignment — 3 кнопки выравнивания, bind:align
- Badge — простой компонент для счетчиков
- **Вывод:** Все компоненты маленькие, сфокусированные, легко переиспользовать

**Рекомендации (Low Priority):**

- SelectFont.svelte:9-18 — шрифты hardcoded, лучше взять из TYPOGRAPHY.FONT_FAMILIES (constants.ts:15-24)
- Button.svelte — добавить sizes (sm, md, lg) для гибкости
- RangeSlider.svelte — добавить label и unit props для лучшего UX

---

**Общий вывод по компонентной архитектуре:**

| Группа | Оценка      | Приоритет исправления          |
| ------ | ----------- | ------------------------------ |
| layout | ✅ Хорошо   | Нет                            |
| panel  | ✅ Хорошо   | Нет                            |
| text   | ✅ Хорошо   | Low (валидация)                |
| image  | ⚠️ Частично | **High** (доделать функционал) |
| ui     | ✅ Хорошо   | Low (улучшения)                |

**Критическая проблема:** Только группа `image/` требует срочной доработки. Остальные группы следуют best practices и не нуждаются в рефакторинге.

---

### 1.4 Типизация - УДОВЛЕТВОРИТЕЛЬНО

**Хорошее:**

- TypeScript везде
- Интерфейсы для Props компонентов
- Типы для сервисов (DownloadItem, DownloadResult)

**Проблемы:**

- [`src/lib/types.ts`](src/lib/types.ts) содержит только `HexColor` - слишком мало
- Нет типов для Project, Template, ImageConfig (есть в states, но не экспортированы)
- `any` в тестах (см. [`tests/unit/services/downloadService.test.ts`](tests/unit/services/downloadService.test.ts):27)

**Рекомендация:**

- Создать `src/lib/types/index.ts` с экспортом всех доменных типов
- Убрать `any` из тестов, создать моки с правильными типами

---

### 1.5 Обработка ошибок - ХОРОШО

**Файлы:** [`src/lib/error.types.ts`](src/lib/error.types.ts), [`src/lib/utils/errorUtils.ts`](src/lib/utils/errorUtils.ts)

**Преимущества:**

- Иерархия ошибок (AppError → ImageError, TextError, CanvasError, StorageError)
- Утилиты для форматирования и логирования
- Используется в downloadService

**Недостатки:**

- Нет обработки ошибок в UI (нет toast/notification системы)
- Ошибки только в консоль, пользователь не видит

**Рекомендация:** Добавить notification system (например, `src/components/ui/Notification.svelte`).

---

### 1.6 Производительность - РИСКИ

**Критические точки:**

1. **Konva stages:**
   - [`src/states/konvaAllStages.svelte.ts`](src/states/konvaAllStages.svelte.ts) хранит ВСЕ stages в памяти
   - [`src/components/panel/PreviewAll.svelte`](src/components/panel/PreviewAll.svelte) рендерит ВСЕ панели одновременно
   - **Проблема:** При 50+ панелях будет лагать

2. **Нет ленивой загрузки:**
   - Все компоненты загружаются сразу
   - Изображения загружаются без lazy loading

3. **Нет debouncing:**
   - [`src/states/textConfig.svelte.ts`](src/states/textConfig.svelte.ts) - каждый drag слайдера вызывает перерисовку Konva
   - Нет оптимизации частых обновлений

**Рекомендация:**

- Виртуализация списка панелей (virtual scrolling)
- Debounce для слайдеров (100-150ms)
- Ленивая загрузка изображений

---

## 2. Укрепление базы (Рефакторинг)

### 2.1 Привести все состояния к фабричному паттерну (High Priority)

**Цель:** Единообразная структура для всех stores.

**Текущие состояния:**

| Файл                     | Текущий паттерн      | Целевой паттерн                 |
| ------------------------ | -------------------- | ------------------------------- |
| texts.svelte.ts          | ✅ Фабрика           | Оставить                        |
| textConfig.svelte.ts     | ✅ Фабрика           | Упростить геттеры/сеттеры       |
| theme.svelte.ts          | ✅ Фабрика           | Оставить                        |
| konvaStage.svelte.ts     | ✅ Фабрика           | Оставить                        |
| konvaAllStages.svelte.ts | ❌ Глобальный $state | Переделать в фабрику с методами |
| imageConfig.svelte.ts    | ❌ Класс с $state    | Переделать в фабрику            |

**Пример рефакторинга konvaAllStages:**

```typescript
// BEFORE (src/states/konvaAllStages.svelte.ts)
export const konvaAllStagesState: Array<Stage> = $state([]);

// AFTER
function createState() {
  let stages: Array<Stage> = $state([]);

  return {
    get stages() {
      return stages;
    },
    addStage(stage: Stage) {
      stages.push(stage);
    },
    removeStage(stage: Stage) {
      stages = stages.filter((s) => s !== stage);
    },
    clear() {
      stages = [];
    },
  };
}
export const konvaAllStagesState = createState();
```

**Задача:** Рефакторинг всех состояний к единому паттерну.

---

### 2.2 Создать сервисный слой (High Priority)

**Требуемые сервисы:**

#### 2.2.1 imageService.ts

**Ответственность:** Загрузка, обработка, валидация изображений.

**API:**

```typescript
interface ImageService {
  // Загрузка
  uploadFromFile(file: File): Promise<ImageData>;
  uploadFromURL(url: string): Promise<ImageData>;
  uploadFromPaste(clipboardData: DataTransfer): Promise<ImageData>;

  // Обработка
  crop(image: ImageData, crop: CropRect): ImageData;
  applyFilters(image: ImageData, filters: ImageFilters): ImageData;

  // Валидация
  validateFormat(file: File): boolean;
  validateSize(file: File): boolean;

  // Кэш
  clearCache(): void;
}
```

**Реализация:**

- Использовать Canvas API для обрезки и фильтров
- Кэшировать загруженные изображения (Map<url, ImageData>)
- Обработка ошибок через ImageError

#### 2.2.2 Упрощенный подход: textsState как основной store

**Решение:** Вместо panelService оставить `textsState` как основной store для панелей.

**Архитектура:**

```
textsState (массив текстов) + textConfigState (глобальные настройки) + imageState (глобальное изображение)
         ↓
PreviewManager (навигация по textsState)
         ↓
Preview (рендерит панель на основе text + textConfig + imageConfig)
         ↓
downloadService (экспорт)
```

**Преимущества:**

- Нет лишних абстракций
- Прямая реактивность через Svelte 5 runes
- Простая debugging
- Минимальный порог входа

**Когда добавить panelService:** Только если появятся персональные настройки на панель (не глобальные), или сложная бизнес-логика (валидация, bulk-операции, undo/redo).

**Текущая логика в компонентах:**

- `TextManager` → `textsState.addText()` / `removeText()`
- `PreviewManager` → читает `textsState.texts` для навигации
- `Preview` → читает `textsState.texts[current]` + `textConfigState` + `imageState`

Это **достаточно** для MVP.

#### 2.2.3 storageService.ts

**Ответственность:** Сохранение/загрузка проектов.

**API:**

```typescript
interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  panels: Panel[];
  globalConfig: {
    textConfig: TextConfig;
    imageConfig: ImageConfig | null;
  };
}

interface StorageService {
  saveProject(project: Project): Promise<void>;
  loadProject(id: string): Project | null;
  listProjects(): ProjectInfo[];
  deleteProject(id: string): void;
  autoSave(project: Project): void; // debounced
}
```

**Реализация:**

- localStorage с ключом `twitch-panels-projects`
- JSON сериализация
- Обработка квот localStorage (5-10MB)
- Восстановление при старте

#### 2.2.4 exportService.ts (расширить downloadService)

**Ответственность:** Экспорт в разные форматы.

**API:**

```typescript
interface ExportService {
  exportPanel(panel: Panel, format: "png" | "jpeg" | "webp", quality?: number): Promise<Blob>;
  exportAll(panels: Panel[], format: "png" | "jpeg" | "webp", quality?: number): Promise<Blob>;
  exportPDF(panels: Panel[]): Promise<Blob>;
}
```

**Реализация:**

- Использовать canvas.toBlob с качеством
- PDF через библиотеку (pdf-lib или jsPDF)

---

### 2.3 Вынести общие UI-компоненты в библиотеку (Medium Priority)

**Проблема:** Компоненты в `src/components/ui/` и `src/components/layout/` используются везде, но:

- Нет единого стиля (разные отступы, размеры)
- Нет документации
- Сложно переиспользовать в других проектах

**Решение:**

1. Создать `src/lib/components/` (или отдельный пакет)
2. Документировать API каждого компонента
3. Стандартизировать пропсы (size, variant, color scheme)
4. Добавить темы (dark/light уже есть, но нужно формализовать)

**Компоненты для выноса:**

- Button (уже хорош, но добавить sizes: sm, md, lg)
- RangeSlider (добавить label, unit)
- ColorPicker (добавить preset colors)
- Card (упростить API, убрать snippets)

---

### 2.4 Оптимизировать работу с Konva (High Priority)

**Проблемы:**

1. **Утечка памяти:**
   - [`src/states/imageConfig.svelte.ts`](src/states/imageConfig.svelte.ts):28-33 есть cleanup, но вызывается только при новой загрузке
   - Stages не уничтожаются при удалении панелей
   - konvaAllStages растет бесконечно

2. **Нет управления жизненным циклом:**
   - Stages создаются в Preview.svelte, но не уничтожаются
   - Нет вызова `stage.destroy()` при unmount

**Решение:**

1. **Добавить destroy в Preview.svelte:**

```typescript
import { onDestroy } from "svelte";
onDestroy(() => {
  if (stage?.node) {
    stage.node.destroy();
  }
});
```

2. **Очищать konvaAllStages при удалении панелей:**
   - В `textsState.removeText()` → удалять соответствующий stage из konvaAllStagesState
   - Вызывать `stage.destroy()`

3. **Лимитировать количество stages:**
   - Виртуализация: рендерить только видимые панели
   - Или: рендерить все, но в hidden container (уже есть PreviewAll), но stages все равно в памяти

**Рекомендация:** Реализовать virtual scrolling для PreviewAll.

---

## 3. Стратегия тестирования

### 3.1 Текущее покрытие

**Анализ тестов:**

- ✅ Unit тесты для states (texts, imageConfig, konvaStage, konvaAllStages, textConfig, theme)
- ✅ Unit тесты для компонентов (Preview, PreviewAll, PreviewControls, PreviewManager, TextConfig, TextInlineEdit, TextInput, TextManager, CropInline, ImageManager, Card, InputGroup, SettingsGrid, SettingsRow, TextBar, AppHeader, Alignment, Badge, Button, ColorPicker, RangeSlider, SelectFont)
- ✅ Unit тесты для сервисов (downloadService)
- ✅ Unit тесты для утилит (errorUtils)
- ✅ Unit тесты для констант и типов

**Проблемы:**

- ❌ Нет интеграционных тестов (связь компонентов + состояния)
- ❌ Нет E2E тестов (полные user flows)
- ❌ Нет тестов для imageService (его нет)
- ❌ Нет тестов для storageService (его нет)
- ❌ Нет тестов для контрактов между компонентами

**Оценка покрытия:** ~40-50% (только unit, нет интеграций)

---

### 3.2 Оптимальный баланс тестов

**Целевое распределение:**

- **Unit:** 40% - изолированные компоненты, утилиты, состояния
- **Integration:** 40% - взаимодействие компонентов, сервисов, состояний
- **E2E:** 20% - полные user flows (создание проекта → экспорт)

---

### 3.3 Критические сценарии для тестирования

#### HIGH PRIORITY (Интеграционные тесты)

**1. Текстовый flow:**

```
TextManager → textsState → PreviewManager → Preview → downloadService
```

**Тест:** [`tests/integration/text-flow.test.ts`](tests/integration/text-flow.test.ts)

```typescript
it("should create panel with text and export it", async () => {
  // 1. Добавить текст через TextManager
  // 2. Проверить textsState.texts
  // 3. Проверить PreviewManager отображает текст
  // 4. Нажать "Скачать"
  // 5. Проверить downloadService.downloadPanel вызван с правильным именем
});
```

**2. Изображение flow:**

```
ImageManager → imageService → imageState → Preview → export
```

**Тест:** [`tests/integration/image-flow.test.ts`](tests/integration/image-flow.test.ts)

```typescript
it("should upload image, crop it, and apply to panel", async () => {
  // 1. Загрузить изображение (mock file)
  // 2. Проверить imageState.image
  // 3. Установить crop values
  // 4. Проверить Preview отображает обрезанное изображение
});
```

**3. Навигация flow:**

```
textsState → PreviewControls → PreviewManager → Preview
```

**Тест:** [`tests/integration/navigation-flow.test.ts`](tests/integration/navigation-flow.test.ts)

```typescript
it("should navigate between panels correctly", async () => {
  // 1. Добавить 3 текста
  // 2. Проверить PreviewControls показывает "1 / 3"
  // 3. Клик next → проверяем PreviewManager.current = 1
  // 4. Клик prev → проверяем PreviewManager.current = 0
  // 5. Проверить transition direction
});
```

**4. Project persistence flow:**

```
storageService ↔ localStorage ↔ app state
```

**Тест:** [`tests/integration/storage-flow.test.ts`](tests/integration/storage-flow.test.ts)

```typescript
it("should save and load project", async () => {
  // 1. Создать проект (несколько панелей)
  // 2. Вызвать storageService.saveProject()
  // 3. Проверить localStorage содержит данные
  // 4. Перезагрузить страницу (или создать новый инстанс)
  // 5. Вызвать storageService.loadProject()
  // 6. Проверить состояние восстановлено
});
```

---

#### MEDIUM PRIORITY (E2E тесты)

**1. Полный user flow:**

- Открыть страницу
- Добавить 3 текста
- Загрузить изображение
- Настроить текст (размер, цвет, выравнивание)
- Настроить изображение (яркость, контраст, crop)
- Экспортировать все панели в ZIP
- Проверить ZIP содержит 3 файла

**Тест:** [`tests/e2e/create-panels.spec.ts`](tests/e2e/create-panels.spec.ts) (Playwright)

**2. Project management flow:**

- Создать проект
- Сохранить
- Создать второй проект
- Переключиться между проектами
- Удалить проект

**Тест:** [`tests/e2e/projects.spec.ts`](tests/e2e/projects.spec.ts)

---

### 3.4 Тесты для новых сервисов

**imageService.test.ts:**

- uploadFromFile (валидный/невалидный файл)
- uploadFromURL (успех/ошибка)
- crop (граничные случаи)
- applyFilters (brightness, contrast)
- validateFormat/validateSize

**textsState.test.ts** (уже есть, расширить):

- Тесты на синхронизацию с konvaAllStages
- Тесты на очистку stages при удалении текста

- createPanel
- updatePanel
- deletePanel
- validatePanel (текст слишком длинный, нет изображения и т.д.)

**storageService.test.ts:**

- saveProject (квоты localStorage)
- loadProject (несуществующий, поврежденный JSON)
- listProjects
- autoSave (debounce)

---

### 3.5 Улучшение существующих тестов

**Проблемы в текущих тестах:**

1. **tests/unit/states/texts.test.ts:70-100** - хорошие интеграционные тесты внутри state, но:
   - Нет тестов на edge cases (clear после удаления всех)
   - Нет тестов на валидацию (длина текста)

2. **tests/unit/services/downloadService.test.ts** - хорошие моки, но:
   - Нет теста на `downloadAll` с пустым массивом
   - Нет теста на ошибку при создании ZIP

3. **Компонентные тесты:**
   - Большинство - "should render without crashing"
   - Нет тестов на взаимодействие (клики, ввод)
   - Нет тестов на пропсы

**Рекомендация:**

- Добавить тесты на взаимодействие для всех компонентов
- Тесты на edge cases (empty state, error state, loading state)
- Тесты на accessibility (aria-labels, keyboard navigation)

---

## 4. Приоритизация улучшений

### Фаза 1: Стабилизация (2-3 недели) - HIGH PRIORITY

#### 1.1 Рефакторинг состояний (High)

**Задача:** Привести все состояния к фабричному паттерну.

**Файлы:**

- [`src/states/konvaAllStages.svelte.ts`](src/states/konvaAllStages.svelte.ts) - переделать в фабрику
- [`src/states/imageConfig.svelte.ts`](src/states/imageConfig.svelte.ts) - переделать в фабрику, убрать класс
- [`src/states/textConfig.svelte.ts`](src/states/textConfig.svelte.ts) - упростить геттеры/сеттеры (использовать $state напрямую)

**Тесты:** Обновить существующие тесты под новые API.

**Критерий успеха:** Все состояния имеют одинаковую структуру.

---

#### 1.2 Создание сервисного слоя (High)

**Задача:** Вынести всю бизнес-логику в сервисы.

**Файлы:**

- [`src/services/imageService.ts`](src/services/imageService.ts) - новая
- [`src/services/storageService.ts`](src/services/storageService.ts) - новая
- [`src/services/exportService.ts`](src/services/exportService.ts) - новая (расширить downloadService)

**Миграция:**

1. Создать imageService
2. Переместить логику загрузки из ImageManager в imageService
3. Интегрировать в ImageManager
4. Аналогично для storageService

**Тесты:** Unit тесты для каждого сервиса (80%+ покрытия).

**Критерий успеха:** Компоненты только для UI, вся логика в сервисах.

---

#### 1.3 Интеграционные тесты (High)

**Задача:** Покрыть критические user flows.

**Файлы:**

- [`tests/integration/text-flow.test.ts`](tests/integration/text-flow.test.ts)
- [`tests/integration/image-flow.test.ts`](tests/integration/image-flow.test.ts)
- [`tests/integration/navigation-flow.test.ts`](tests/integration/navigation-flow.test.ts)
- [`tests/integration/storage-flow.test.ts`](tests/integration/storage-flow.test.ts)

**Технологии:** Vitest + Testing Library (не Playwright, это не E2E).

**Критерий успеха:** 100% покрытия критических flows.

---

#### 1.4 Управление памятью Konva (High)

**Задача:** Предотвратить утечки памяти.

**Файлы:**

- [`src/components/panel/Preview.svelte`](src/components/panel/Preview.svelte) - добавить onDestroy
- [`src/states/konvaAllStages.svelte.ts`](src/states/konvaAllStages.svelte.ts) - добавить очистку
- [`src/states/texts.svelte.ts`](src/states/texts.svelte.ts) - интегрировать очистку stages в removeText()

**Тесты:** Тест на отсутствие утечек (Jest memory leak detection).

**Критерий успеха:** stages уничтожаются при удалении панелей.

---

### Фаза 2: Улучшение качества (3-4 недели) - MEDIUM PRIORITY

#### 2.1 Улучшение UI-компонентов (Medium)

**Задача:** Стандартизировать и вынести в библиотеку.

**Файлы:**

- [`src/lib/components/Button.svelte`](src/lib/components/Button.svelte) - добавить sizes
- [`src/lib/components/RangeSlider.svelte`](src/lib/components/RangeSlider.svelte) - добавить label, unit
- [`src/lib/components/ColorPicker.svelte`](src/lib/components/ColorPicker.svelte) - preset colors

**Документация:** Storybook или doc comments.

---

#### 2.2 Оптимизация производительности (Medium)

**Задача:** Ускорить рендеринг при большом количестве панелей.

**Задачи:**

1. Debounce для слайдеров (в TextConfig и ImageManager)
2. Virtual scrolling для PreviewAll (использовать svelte-virtual-list)
3. Ленивая загрузка изображений (IntersectionObserver)

**Файлы:**

- [`src/components/text/TextConfig.svelte`](src/components/text/TextConfig.svelte) - debounce
- [`src/components/image/ImageManager.svelte`](src/components/image/ImageManager.svelte) - debounce
- [`src/components/panel/PreviewAll.svelte`](src/components/panel/PreviewAll.svelte) - virtual scroll

**Тесты:** Бенчмарки рендеринга (vitest-bench).

---

#### 2.3 Улучшение доступности (Medium)

**Задача:** WCAG 2.1 AA compliance.

**Файлы:**

- Все компоненты: добавить `role`, `aria-*`, `tabindex`
- Клавиатурная навигация (Enter, Space, Arrow keys)
- Фокусные состояния (визуальные)
- Контрастность (проверить цвета)

**Тесты:** axe-core, Playwright accessibility audits.

---

#### 2.4 Расширенные тесты (Medium)

**Задача:** Покрытие 80%+ кода.

**Файлы:**

- Тесты для всех сервисов (imageService, storageService, exportService)
- Тесты для всех компонентов (интеграционные)
- E2E тесты (Playwright)

**Критерий успеха:** Coverage >80%.

---

### Фаза 3: Продвинутые фичи (4+ недели) - LOW PRIORITY

#### 3.1 Расширенные настройки текста (Low)

**Задача:** Тени, градиенты, прозрачность, несколько блоков.

**Файлы:**

- [`src/states/textConfig.svelte.ts`](src/states/textConfig.svelte.ts) - добавить shadow, opacity
- [`src/components/panel/Preview.svelte`](src/components/panel/Preview.svelte) - применить настройки

**Сложность:** Высокая (Konva Text ограничен).

---

#### 3.2 Расширенные настройки изображений (Low)

**Задача:** Фильтры, слои, blend modes.

**Файлы:**

- [`src/services/imageService.ts`](src/services/imageService.ts) - фильтры
- [`src/components/panel/Preview.svelte`](src/components/panel/Preview.svelte) - отображение

---

#### 3.3 Пресеты и шаблоны (Low)

**Задача:** Шаблоны для быстрого старта.

**Файлы:**

- [`src/services/templateService.ts`](src/services/templateService.ts)
- [`src/components/template/TemplateGallery.svelte`](src/components/template/TemplateGallery.svelte)

---

## 5. Безопасность

### 5.1 Валидация входных данных (High)

**Текущее состояние:** Почти отсутствует.

**Требования:**

1. **Тексты:**
   - [`src/states/texts.svelte.ts`](src/states/texts.svelte.ts):17 - есть `trim().length === 0`, но нет max length
   - Добавить: `if (text.length > TYPOGRAPHY.MAX_TEXT_LENGTH) throw new TextError(...)`

2. **Изображения:**
   - [`src/services/imageService.ts`](src/services/imageService.ts) - валидация:
     - Формат: `file.type in IMAGE_SETTINGS.SUPPORTED_FORMATS`
     - Размер: `file.size <= IMAGE_SETTINGS.MAX_FILE_SIZE`
     - URL: валидация схемы (http/https), нет XSS

3. **URL изображений:**
   - Защита от XSS: не допускать `javascript:` URLs
   - Проверка CORS (crossOrigin="anonymous" уже есть)

---

### 5.2 Защита от XSS (High)

**Риски:**

- Текст рендерится в Konva Text - безопасно (не innerHTML)
- Но если добавить HTML в будущем - нужно санитизировать

**Решение:** Использовать DOMPurify для любого HTML.

---

### 5.3 Безопасная работа с localStorage (Medium)

**Риски:**

- localStorage не изолирован (другие скрипты на домене)
- Квоты (5-10MB)
- Поврежденные данные

**Решение:**

- Валидация при загрузке: `JSON.parse` в try-catch, проверка схемы
- Ограничение размера: `JSON.stringify(project).length < 5_000_000`
- Fallback: если localStorage полон/поврежден - предложить экспорт JSON

**Файл:** [`src/services/storageService.ts`](src/services/storageService.ts)

---

## 6. Мониторинг и observability

### 6.1 Логирование ошибок (Medium)

**Текущее состояние:** [`src/lib/utils/errorUtils.ts`](src/lib/utils/errorUtils.ts):19-26 - console.error

**Улучшение:**

- Отправлять ошибки в external service (Sentry, LogRocket)
- Добавить контекст (user id, project id, action)
- User-friendly сообщения (не показывать stack trace)

**Файл:** [`src/services/errorReportingService.ts`](src/services/errorReportingService.ts)

---

### 6.2 Метрики производительности (Low)

**Что измерять:**

- Время загрузки страницы
- Время рендеринга панелей (per panel)
- Размер памяти (heap size)
- Количество stages

**Инструменты:** Web Vitals, Chrome DevTools Performance.

---

## 7. CI/CD

### 7.1 Текущее состояние

**package.json scripts:**

- `test` - vitest
- `test:unit` - unit tests
- `test:integration` - нет такой папки
- `test:e2e` - playwright test (но playwright не в devDependencies? ✅ есть)

**Проблемы:**

- Нет папки `tests/integration/`
- Нет папки `tests/e2e/`
- Нет GitHub Actions / CI pipeline

---

### 7.2 Настроить CI (Medium Priority)

**Цель:** Автоматические тесты на каждом PR.

**GitHub Actions:**

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run check
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e
      - run: npm run build
```

**Критерий успеха:** Все тесты проходят на CI.

---

## 8. Документация

### 8.1 Кодовая документация (Medium)

**Текущее состояние:** Нет JSDoc/TSDoc комментариев.

**Рекомендация:**

- Добавить JSDoc для всех публичных API (сервисы, состояния, компоненты)
- Использовать `/** */` с `@param`, `@returns`, `@throws`
- Генерация docs через TypeDoc

**Пример:**

```typescript
/**
 * Uploads an image from a File object.
 * @param file - The File object to upload
 * @returns Promise<ImageData> - The processed image data
 * @throws {ImageError} If file format or size is invalid
 */
uploadFromFile(file: File): Promise<ImageData> { ... }
```

---

### 8.2 Architecture Decision Records (ADR) (Low)

**Цель:** Зафиксировать ключевые архитектурные решения.

**Файлы:** `docs/adr/` (или `plans/adr/`)

**Примеры:**

- ADR-001: Выбор Svelte 5 с runes
- ADR-002: Паттерн фабрики для состояний
- ADR-003: Сервисный слой для бизнес-логики
- ADR-004: Konva.js для рендеринга

---

## 9. Приоритизация по фазам

### Фаза 1: Стабилизация (2-3 недели) - КРИТИЧНО

**Цель:** Устранить архитектурные проблемы, создать сервисный слой, добавить тесты.

**Задачи:**

1. Рефакторинг состояний (1.1) - 2 дня
2. Создание imageService (2.2.1) - 3 дня
3. Создание storageService (2.2.2) - 2 дня
4. Интеграционные тесты (3.3) - 3 дня
5. Управление памятью Konva (2.4) - 2 дня

**Итого:** ~15 рабочих дней

**Критерий успеха:**

- Все состояния используют фабричный паттерн
- Сервисы покрыты unit тестами (>80%)
- Интеграционные тесты покрывают критические flows
- Нет утечек памяти при создании/удалении панелей

---

### Фаза 2: Улучшение качества (3-4 недели) - ВАЖНО

**Цель:** Повысить поддерживаемость, производительность, доступность.

**Задачи:**

1. Стандартизация UI-компонентов (2.3) - 3 дня
2. Оптимизация производительности (2.2) - 4 дня
3. Улучшение доступности (2.4) - 3 дня
4. Расширенные тесты (3.4) - 5 дней
5. CI/CD настройка (7.2) - 2 дня
6. Документация (8.1) - 2 дня

**Итого:** ~19 рабочих дней

**Критерий успеха:**

- Покрытие тестами >80%
- Все компоненты доступны (WCAG AA)
- Производительность: рендеринг 50 панелей < 1s
- CI паsses на всех PR

---

### Фаза 3: Продвинутые фичи (4+ недели) - НИЗКИЙ

**Цель:** Добавить удобные фичи для power users.

**Задачи:**

1. Расширенные настройки текста (3.1) - 1 неделя
2. Расширенные настройки изображений (3.2) - 1 неделя
3. Пресеты и шаблоны (3.3) - 5 дней
4. История изменений (4.4) - 3 дня
5. Экспорт в PDF (4.3) - 4 дня

**Итого:** ~4 недели

---

## 10. Метрики технического успеха

- **Покрытие тестами:** >80% (критические paths: 100%)
- **Производительность:** FCP < 1s, LCP < 2.5s, рендеринг 50 панелей < 1s
- **Утечки памяти:** 0 (проверка через Chrome DevTools)
- **Доступность:** WCAG 2.1 AA compliance (axe-score > 90)
- **TypeScript ошибки:** 0 (strict mode)
- **Lint:** 0 ошибок (eslint + svelte-check)
- **CI:** 100% pass rate

---

## 11. Риски и митигация

| Риск                               | Вероятность | Влияние | Митигация                                           |
| ---------------------------------- | ----------- | ------- | --------------------------------------------------- |
| Сложность Konva                    | Medium      | High    | Документировать API, добавить абстракции            |
| Утечки памяти                      | High        | High    | Приоритет 1.4, тесты на память                      |
| Нет эксперта по Svelte 5           | Medium      | Medium  | Изучить документацию, использовать best practices   |
| Cropper.js интеграция              | Medium      | Medium  | Выделить отдельный сервис, тестировать изолированно |
| localStorage квоты                 | Low         | Medium  | Валидация размера, fallback на JSON export          |
| Производительность при 50+ панелях | High        | Medium  | Виртуализация (Фаза 2)                              |

---

## 12. Следующие шаги

1. Утвердить технический план
2. Начать с **Фазы 1**:
   - День 1-2: Рефакторинг konvaAllStages и imageConfig
   - День 3-5: Создание imageService
   - День 6-7: Создание storageService
   - День 11-13: Интеграционные тесты
   - День 14-15: Управление памятью Konva
3. Запустить CI после Фазы 1
4. Продолжить Фазу 2

---

**Примечание:** Этот план должен обновляться по мере реализации. Каждая фаза заканчивается review и корректировкой последующих фаз.
