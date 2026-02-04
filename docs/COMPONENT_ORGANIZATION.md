# Component Organization Guide

This document describes the organized folder structure for the Svelte components in the Twitch Panels Creator project.

## 📁 Folder Structure

```
src/components/
├── layout/           # Application layout components
├── image/            # Image-related components
├── text/             # Text management components
├── panel/            # Panel display and management
├── feedback/         # User feedback components
└── ui/               # Reusable UI components (from lib)
```

## 🏗️ Layout Components

**Location**: `src/components/layout/`

Components that define the overall application structure and layout:

- **AppContainer.svelte** - Main application wrapper and coordinator
- **AppHeader.svelte** - Application header with title and actions
- **AppContent.svelte** - Main content area container
- **MainSection.svelte** - Primary workspace section
- **Sidebar.svelte** - Side panel for previews and controls

## 🖼️ Image Components

**Location**: `src/components/image/`

Components related to image upload, processing, and display:

- **ImageManager.svelte** - Orchestrates image upload and cropping workflow
- **ImageUpload.svelte** - Handles drag-drop, paste, and URL image upload
- **ImageCropper.svelte** - Provides image cropping interface with cropperjs
- **BackgroundPreview.svelte** - Displays the background image preview

## 📝 Text Components

**Location**: `src/components/text/`

Components for text management and display:

- **TextManager.svelte** - Main text input and settings management
- **TextSection.svelte** - Text management section wrapper
- **TextPreview.svelte** - Preview of text styling and positioning

## 🎨 Panel Components

**Location**: `src/components/panel/`

Components for panel creation, preview, and management:

- **PanelPreview.svelte** - Individual panel preview with canvas rendering
- **PanelsList.svelte** - List of all created panels
- **PanelList.svelte** - Alternative panel list implementation

## 💬 Feedback Components

**Location**: `src/components/feedback/`

Components for user feedback and error handling:

- **ErrorMessage.svelte** - Displays error messages to users

## 🧩 UI Components

**Location**: `src/components/ui/` (from lib)

Reusable UI components:

- **Button.svelte** - Standard button component
- **IconButton.svelte** - Button with icon support

## 🔧 Import Conventions

When importing components, follow these patterns:

```typescript
// Layout components
import AppContainer from "../components/layout/AppContainer.svelte";
import AppHeader from "../components/layout/AppHeader.svelte";

// Image components
import ImageManager from "../components/image/ImageManager.svelte";
import ImageUpload from "../components/image/ImageUpload.svelte";

// Text components
import TextManager from "../components/text/TextManager.svelte";
import TextSection from "../components/text/TextSection.svelte";

// Panel components
import PanelPreview from "../components/panel/PanelPreview.svelte";
import PanelsList from "../components/panel/PanelsList.svelte";

// Feedback components
import ErrorMessage from "../components/feedback/ErrorMessage.svelte";

// UI components
import { Button } from "../lib/components/ui";
```

## 🎯 Benefits of This Organization

1. **Logical Grouping**: Components are grouped by functionality, making them easy to find
2. **Maintainability**: Related components are co-located, reducing cognitive load
3. **Scalability**: Easy to add new components to appropriate categories
4. **Import Clarity**: Clear import paths that reflect component purpose
5. **Team Collaboration**: Consistent structure that team members can follow

## 📋 Component Responsibilities

### Layout Components

- Handle application-wide structure and navigation
- Manage high-level state and data flow
- Provide containers for functional components

### Image Components

- Handle all image-related operations (upload, crop, preview)
- Manage image state and validation
- Provide image processing functionality

### Text Components

- Manage text input, editing, and styling
- Handle text validation and state
- Provide text preview functionality

### Panel Components

- Handle panel creation and management
- Provide panel preview and export functionality
- Manage panel state and interactions

### Feedback Components

- Display user feedback and error messages
- Handle user notifications and alerts
- Provide consistent error handling UI

## 🔄 Future Considerations

As the project grows, consider:

1. **Sub-categorization**: Further divide categories if they become too large
2. **Feature-based organization**: Group by feature rather than type for larger applications
3. **Component documentation**: Add individual component documentation
4. **Storybook integration**: Use Storybook for component development and testing

This organization provides a solid foundation for the current project while remaining flexible for future expansion.
