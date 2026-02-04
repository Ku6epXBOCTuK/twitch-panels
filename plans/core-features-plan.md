# Core Features Implementation Plan

## 🎯 **Focus: Core Features First**

This plan prioritizes the essential features needed for a functional Twitch panel creator, deferring advanced features like batch download for later implementation.

### **Phase 1: Minimum Viable Product (MVP)**

#### **1. Image Upload System** ✅ **COMPLETED**

**Priority: HIGH**

- **Drag & Drop Zone**: Visual feedback, file validation ✅
- **Ctrl+V Paste**: Clipboard API integration ✅
- **URL Input**: External image loading ✅
- **Image Preview**: Before cropping confirmation ✅

**Key Components:**

```typescript
interface ImageUploadProps {
  onImageSelect: (image: string) => void;
  onError: (error: string) => void;
}

// Features:
- File type validation (jpg, png, webp)
- Size limit (10MB max)
- Drag over visual states
- Paste detection
- URL fetch with CORS handling
```

#### **2. Image Cropping Interface** ✅ **COMPLETED**

**Priority: HIGH**

- **Cropper Integration**: Fixed 320px width constraint ✅
- **Crop Confirmation**: Accept/Cancel options ✅
- **Error Handling**: Invalid crop areas ✅

**Implementation Details:**

- Integrated cropperjs v2.1.0 with Web Components
- Used `$toCanvas()` method to get HTMLCanvasElement
- Implemented proper error handling with user-friendly messages

**Key Components:**

```typescript
interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

// Features:
- Fixed width (320px), variable height
- Aspect ratio locking
- Crop area validation
- Base64 output
- Mobile responsive
```

#### **3. Text Management System** ✅ **COMPLETED**

**Priority: HIGH**

- **Dynamic Text List**: Add, edit, delete ✅
- **Text Styling**: Font, size, color, positioning ✅
- **Real-time Updates**: Live preview sync ✅
- **Common Settings**: Apply settings to all texts ✅

**Key Components:**

```typescript
interface TextItem {
  id: string;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  x: number;
  y: number;
}

interface TextManagerProps {
  texts: TextItem[];
  onTextChange: (texts: TextItem[]) => void;
}

// Features:
- Add new text item
- Edit existing text
- Delete text item
- Font selection from available fonts
- Font size adjustment
- Color picker
- Position controls (x, y)
- Text validation (length limits)
```

#### **4. Canvas Rendering Engine** ✅ **COMPLETED**

**Priority: HIGH**

- **SvelteKonva Integration**: Enhanced implementation ✅
- **Dynamic Height**: Configurable panel height ✅
- **Real-time Preview**: Live updates ✅
- **Layer Management**: Background + text layers ✅

**Key Components:**

```typescript
interface PanelCanvasProps {
  backgroundImage: string;
  texts: TextItem[];
  width: number; // 320px fixed
  height: number; // configurable
}

// Features:
- Background image layer
- Text layers with proper positioning
- Dynamic height support
- Real-time rendering
- Performance optimization
```

#### **5. Basic Panel Management** ✅ **COMPLETED**

**Priority: MEDIUM**

- **Panel Storage**: Local storage for current panel ✅
- **Panel Navigation**: Basic next/prev (single panel for MVP) ✅
- **Panel Validation**: Basic validation ✅
- **Panel List**: View and manage saved panels ✅

**Key Components:**

```typescript
interface Panel {
  id: string;
  backgroundImage: string;
  texts: TextItem[];
  height: number;
  createdAt: Date;
}

interface PanelManagerProps {
  currentPanel: Panel | undefined;
  onPanelUpdate: (panel: Panel) => void;
}

// Features:
- Save current panel state
- Load panel from storage
- Basic validation
- Single panel focus for MVP
```

### **Phase 2: Enhanced Core Features**

#### **6. User Interface Enhancements** ✅ **COMPLETED**

**Priority: MEDIUM**

- ✅ **Responsive Layout**: Mobile-friendly design
- ✅ **Loading States**: Visual feedback через uiStore
- ✅ **Error Messages**: User-friendly error handling
- ✅ **Keyboard Shortcuts**: Ctrl+V для вставки изображений

#### **7. Error Handling & Validation** ✅ **COMPLETED**

**Priority: MEDIUM**

- ✅ **Input Validation**: Валидация текста и изображений
- ✅ **Error Boundaries**: Компонент ErrorMessage для обработки ошибок
- ✅ **User Guidance**: Понятные сообщения об ошибках
- ✅ **Retry Mechanisms**: Возможность повторной загрузки

#### **8. Batch Download System** 🔄 **IN PROGRESS**

**Priority: HIGH**

- 🔄 **JSZip Integration**: Подключена библиотека JSZip
- ⏳ **Batch Rendering**: Параллельная генерация изображений
- ⏳ **Progress Tracking**: Индикатор прогресса экспорта
- ⏳ **ZIP Archive Creation**: Создание архива с панелями

### **Implementation Order** ✅ **UPDATED STATUS**

```
Week 1-2: Foundation ✅ COMPLETED
├── Setup dependencies (cropperjs, file-saver, jszip) ✅
├── TypeScript types and interfaces ✅
├── Error handling structure ✅
├── Basic project structure ✅
└── SvelteKit configuration ✅

Week 2-3: Image System ✅ COMPLETED
├── Image upload component ✅
├── Image cropping component ✅
├── Image validation utilities ✅
├── Image service layer ✅
└── Default backgrounds loading ✅

Week 3-4: Text System ✅ COMPLETED
├── Text management component ✅
├── Text styling controls ✅
├── Common text settings ✅
├── Text validation ✅
└── Text service layer ✅

Week 4-5: Canvas & Integration ✅ COMPLETED
├── Enhanced canvas implementation ✅
├── Dynamic height support ✅
├── Real-time preview ✅
├── Panel storage system ✅
└── Panel management ✅

Week 5-6: UI & Polish ✅ COMPLETED
├── Responsive layout ✅
├── Loading states ✅
├── Error handling improvements ✅
├── Keyboard shortcuts ✅
└── User experience polish ✅

Week 6-7: Batch Download 🔄 IN PROGRESS
├── JSZip integration ✅
├── Batch rendering engine ⏳
├── Progress tracking ⏳
└── ZIP archive creation ⏳

Week 7-8: Testing & Deployment ⏳ PLANNED
├── Unit testing ⏳
├── Integration testing ⏳
├── Bug fixes ⏳
└── GitHub Pages deployment ⏳
```

## 🔧 **Technical Specifications**

### **Dependencies to Install**

```bash
npm install cropperjs@^2.1.0 file-saver @types/cropperjs@^1.1.5
```

**Note:** Using cropperjs v2.1.0 with Web Components API. The `$toCanvas()` method is used to obtain HTMLCanvasElement from `<cropper-canvas>` component.

### **TypeScript Interfaces**

```typescript
// Core types
interface TextItem {
  id: string;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  x: number;
  y: number;
}

interface Panel {
  id: string;
  backgroundImage: string;
  texts: TextItem[];
  height: number;
  createdAt: Date;
}

interface ImageUploadResult {
  success: boolean;
  image?: string;
  error?: string;
}
```

### **State Management**

```typescript
// Core stores
export const panelStore = writable<Panel | undefined>(undefined);
export const uiStore = writable({
  isLoading: false,
  error: string | undefined,
  currentStep: "upload" | "crop" | "text" | "preview",
});
```

### **Error Handling Strategy**

```typescript
// Error types
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean = true,
  ) {
    super(message);
  }
}

// Error handling utilities
export const handleImageError = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.recoverable ? `Ошибка: ${error.message}. Попробуйте снова.` : `Критическая ошибка: ${error.message}`;
  }
  return "Произошла неизвестная ошибка";
};
```

## 🚨 **Common Issues & Solutions**

### **Image Upload Issues**

1. **CORS Errors**
   - Solution: Use proxy for external images or allow CORS in development
   - Fallback: Show error message with alternative upload methods

2. **Large Files**
   - Solution: Implement client-side compression
   - Limit: 10MB per file with clear user feedback

3. **Invalid Formats**
   - Solution: Validate before upload, show supported formats
   - Fallback: Convert to webp if possible

### **Canvas Rendering Issues**

1. **Memory Limits**
   - Solution: Implement lazy rendering and cleanup
   - Monitor: Canvas size and memory usage

2. **Font Loading**
   - Solution: Fallback to web-safe fonts
   - Preload: Load fonts during initialization

3. **Performance**
   - Solution: Debounce rapid updates
   - Optimize: Use requestAnimationFrame for smooth rendering

### **User Experience Issues**

1. **Slow Operations**
   - Solution: Loading states and progress indicators
   - Optimize: Async operations with proper error handling

2. **Complex Interface**
   - Solution: Step-by-step wizard approach
   - Guide: Tooltips and help text

## 📱 **UI/UX Considerations**

### **Mobile First Design**

- Touch-friendly controls
- Responsive layout for all screen sizes
- Swipe gestures for navigation

### **Accessibility**

- Screen reader compatibility
- Keyboard navigation
- High contrast mode support

### **Performance**

- Lazy loading of components
- Optimized bundle size
- Efficient state management

---

_Created: 2026-02-03_
_Focus: Core Features Implementation_
_Estimated Duration: 5 weeks_

## 📝 **Implementation Notes**

### **Image Cropping Implementation (Completed)**

**Challenge:** cropperjs v2.x uses Web Components API which differs significantly from v1.x

**Solution:**

1. Used `getCropperCanvas()` to get `<cropper-canvas>` Web Component
2. Called `$toCanvas()` method to convert to HTMLCanvasElement
3. Applied `toDataURL()` on the resulting canvas to get base64 image

**Code Example:**

```typescript
const cropperCanvasElement = cropper.getCropperCanvas();
const canvas = await cropperCanvasElement.$toCanvas({
  width: 320,
  imageSmoothingEnabled: true,
  imageSmoothingQuality: "high",
});
const croppedImage = canvas.toDataURL("image/png");
```

**Key Points:**

- cropperjs v2.x methods return Web Components, not standard DOM elements
- `$toCanvas()` is an async method that returns HTMLCanvasElement
- Proper error handling is essential for user experience
