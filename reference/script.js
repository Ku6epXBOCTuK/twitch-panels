// State
let texts = [];
let panels = [];
let currentPanelIndex = 0;
let backgroundImage = null;
let originalImage = null;
let settings = {
  fontSize: 18,
  fontFamily: "Arial",
  textColor: "#ffffff",
  alignment: "left",
  sidePadding: 10,
  centerOffset: 0,
  bgBrightness: 100,
  bgContrast: 100,
};

// Crop state
let cropBox = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};
let isDragging = false;
let isResizing = false;
let resizeHandle = null;
let dragStart = { x: 0, y: 0 };
let cropBoxStart = { x: 0, y: 0, width: 0, height: 0 };

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  initializeEventListeners();
  loadDefaultBackground();
  addDefaultTexts();
});

// Theme Management
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

// Event Listeners
function initializeEventListeners() {
  // Theme toggle
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);

  // Add text
  document.getElementById("addTextBtn").addEventListener("click", addText);
  document.getElementById("panelTextInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") addText();
  });

  // Settings
  document.getElementById("fontSize").addEventListener("input", (e) => {
    settings.fontSize = parseInt(e.target.value);
    document.getElementById("fontSizeValue").textContent = e.target.value;
    updateAllPanels();
  });

  document.getElementById("fontFamily").addEventListener("change", (e) => {
    settings.fontFamily = e.target.value;
    updateAllPanels();
  });

  document.getElementById("textColor").addEventListener("input", (e) => {
    settings.textColor = e.target.value;
    document.getElementById("textColorValue").textContent = e.target.value;
    updateAllPanels();
  });

  document.querySelectorAll(".align-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".align-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      settings.alignment = btn.dataset.align;
      updateAllPanels();
    });
  });

  document.getElementById("sidePadding").addEventListener("input", (e) => {
    settings.sidePadding = parseInt(e.target.value);
    document.getElementById("sidePaddingValue").textContent = e.target.value;
    updateAllPanels();
  });

  document.getElementById("centerOffset").addEventListener("input", (e) => {
    settings.centerOffset = parseInt(e.target.value);
    document.getElementById("centerOffsetValue").textContent = e.target.value;
    updateAllPanels();
  });

  // Background controls
  document.getElementById("uploadBgBtn").addEventListener("click", () => {
    document.getElementById("bgImageInput").click();
  });

  document.getElementById("bgImageInput").addEventListener("change", handleBackgroundUpload);

  document.getElementById("bgBrightness").addEventListener("input", (e) => {
    settings.bgBrightness = parseInt(e.target.value);
    document.getElementById("bgBrightnessValue").textContent = e.target.value;
    drawCropCanvas();
    updateAllPanels();
  });

  document.getElementById("bgContrast").addEventListener("input", (e) => {
    settings.bgContrast = parseInt(e.target.value);
    document.getElementById("bgContrastValue").textContent = e.target.value;
    drawCropCanvas();
    updateAllPanels();
  });

  document.getElementById("resetCropBtn").addEventListener("click", resetCrop);

  // Crop canvas events
  const canvas = document.getElementById("cropCanvas");
  canvas.addEventListener("mousedown", handleCropMouseDown);
  canvas.addEventListener("mousemove", handleCropMouseMove);
  canvas.addEventListener("mouseup", handleCropMouseUp);
  canvas.addEventListener("mouseleave", handleCropMouseUp);

  // Panel navigation
  document.getElementById("prevPanel").addEventListener("click", () => {
    if (currentPanelIndex > 0) {
      currentPanelIndex--;
      displayCurrentPanel();
    }
  });

  document.getElementById("nextPanel").addEventListener("click", () => {
    if (currentPanelIndex < panels.length - 1) {
      currentPanelIndex++;
      displayCurrentPanel();
    }
  });

  document.getElementById("downloadCurrentBtn").addEventListener("click", downloadCurrentPanel);
  document.getElementById("downloadAllBtn").addEventListener("click", downloadAllPanels);
}

// Load default background
function loadDefaultBackground() {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    originalImage = img;
    backgroundImage = img;
    initializeCropBox();
    drawCropCanvas();
    updateAllPanels();
  };
  img.src = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=250&fit=crop";
}

// Add default texts
function addDefaultTexts() {
  const defaultTexts = ["links", "about me", "projects"];
  defaultTexts.forEach((text) => {
    texts.push({ id: Date.now() + Math.random(), text });
  });
  renderTexts();
  updateAllPanels();
}

// Add text
function addText() {
  const input = document.getElementById("panelTextInput");
  const text = input.value.trim();

  if (!text) return;

  texts.push({ id: Date.now(), text });
  input.value = "";

  renderTexts();
  updateAllPanels();
}

// Render texts list
function renderTexts() {
  const container = document.getElementById("textsList");

  if (texts.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v20M2 12h20"></path>
        </svg>
        <p>Добавьте тексты</p>
      </div>
    `;
    return;
  }

  container.innerHTML = texts
    .map(
      (item) => `
    <div class="text-item" data-id="${item.id}">
      <input type="text" value="${item.text}" onchange="updateText(${item.id}, this.value)">
      <button class="btn-delete" onclick="deleteText(${item.id})">×</button>
    </div>
  `,
    )
    .join("");
}

// Update text
window.updateText = function (id, newText) {
  const item = texts.find((t) => t.id === id);
  if (item) {
    item.text = newText;
    updateAllPanels();
  }
};

// Delete text
window.deleteText = function (id) {
  texts = texts.filter((t) => t.id !== id);
  renderTexts();
  updateAllPanels();
};
// Handle background upload
function handleBackgroundUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      originalImage = img;
      backgroundImage = img;
      initializeCropBox();
      drawCropCanvas();
      updateAllPanels();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

// Initialize crop box
function initializeCropBox() {
  const canvas = document.getElementById("cropCanvas");
  const container = document.getElementById("cropCanvasContainer");
  const rect = container.getBoundingClientRect();

  canvas.width = rect.width;
  canvas.height = rect.height;

  // Set crop box to full canvas initially
  cropBox = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };

  updateCropBoxElement();
  document.getElementById("cropBox").classList.add("active");
}

// Draw crop canvas
function drawCropCanvas() {
  const canvas = document.getElementById("cropCanvas");
  const ctx = canvas.getContext("2d");

  if (!originalImage) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply filters
  ctx.filter = `brightness(${settings.bgBrightness}%) contrast(${settings.bgContrast}%)`;

  // Draw image to fit canvas
  const scale = Math.max(canvas.width / originalImage.width, canvas.height / originalImage.height);
  const scaledWidth = originalImage.width * scale;
  const scaledHeight = originalImage.height * scale;
  const x = (canvas.width - scaledWidth) / 2;
  const y = (canvas.height - scaledHeight) / 2;

  ctx.drawImage(originalImage, x, y, scaledWidth, scaledHeight);
  ctx.filter = "none";
}

// Update crop box element
function updateCropBoxElement() {
  const element = document.getElementById("cropBox");
  element.style.left = cropBox.x + "px";
  element.style.top = cropBox.y + "px";
  element.style.width = cropBox.width + "px";
  element.style.height = cropBox.height + "px";
}

// Crop mouse handlers
function handleCropMouseDown(e) {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Check if clicking on a handle
  const handles = document.querySelectorAll(".crop-handle");
  let clickedHandle = null;

  handles.forEach((handle) => {
    const handleRect = handle.getBoundingClientRect();
    const handleX = handleRect.left - rect.left + handleRect.width / 2;
    const handleY = handleRect.top - rect.top + handleRect.height / 2;

    if (Math.abs(x - handleX) < 10 && Math.abs(y - handleY) < 10) {
      clickedHandle = handle.classList[1]; // Get handle class (nw, ne, etc.)
    }
  });

  if (clickedHandle) {
    isResizing = true;
    resizeHandle = clickedHandle;
  } else if (x >= cropBox.x && x <= cropBox.x + cropBox.width && y >= cropBox.y && y <= cropBox.y + cropBox.height) {
    isDragging = true;
  }

  dragStart = { x, y };
  cropBoxStart = { ...cropBox };
}

function handleCropMouseMove(e) {
  if (!isDragging && !isResizing) return;

  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const dx = x - dragStart.x;
  const dy = y - dragStart.y;

  if (isDragging) {
    cropBox.x = Math.max(0, Math.min(cropBoxStart.x + dx, rect.width - cropBox.width));
    cropBox.y = Math.max(0, Math.min(cropBoxStart.y + dy, rect.height - cropBox.height));
  } else if (isResizing) {
    const minSize = 50;

    switch (resizeHandle) {
      case "nw":
        cropBox.x = Math.max(0, Math.min(cropBoxStart.x + dx, cropBoxStart.x + cropBoxStart.width - minSize));
        cropBox.y = Math.max(0, Math.min(cropBoxStart.y + dy, cropBoxStart.y + cropBoxStart.height - minSize));
        cropBox.width = cropBoxStart.width - (cropBox.x - cropBoxStart.x);
        cropBox.height = cropBoxStart.height - (cropBox.y - cropBoxStart.y);
        break;
      case "ne":
        cropBox.y = Math.max(0, Math.min(cropBoxStart.y + dy, cropBoxStart.y + cropBoxStart.height - minSize));
        cropBox.width = Math.max(minSize, Math.min(cropBoxStart.width + dx, rect.width - cropBoxStart.x));
        cropBox.height = cropBoxStart.height - (cropBox.y - cropBoxStart.y);
        break;
      case "sw":
        cropBox.x = Math.max(0, Math.min(cropBoxStart.x + dx, cropBoxStart.x + cropBoxStart.width - minSize));
        cropBox.width = cropBoxStart.width - (cropBox.x - cropBoxStart.x);
        cropBox.height = Math.max(minSize, Math.min(cropBoxStart.height + dy, rect.height - cropBoxStart.y));
        break;
      case "se":
        cropBox.width = Math.max(minSize, Math.min(cropBoxStart.width + dx, rect.width - cropBoxStart.x));
        cropBox.height = Math.max(minSize, Math.min(cropBoxStart.height + dy, rect.height - cropBoxStart.y));
        break;
      case "n":
        cropBox.y = Math.max(0, Math.min(cropBoxStart.y + dy, cropBoxStart.y + cropBoxStart.height - minSize));
        cropBox.height = cropBoxStart.height - (cropBox.y - cropBoxStart.y);
        break;
      case "s":
        cropBox.height = Math.max(minSize, Math.min(cropBoxStart.height + dy, rect.height - cropBoxStart.y));
        break;
      case "w":
        cropBox.x = Math.max(0, Math.min(cropBoxStart.x + dx, cropBoxStart.x + cropBoxStart.width - minSize));
        cropBox.width = cropBoxStart.width - (cropBox.x - cropBoxStart.x);
        break;
      case "e":
        cropBox.width = Math.max(minSize, Math.min(cropBoxStart.width + dx, rect.width - cropBoxStart.x));
        break;
    }
  }

  updateCropBoxElement();
}

function handleCropMouseUp() {
  if (isDragging || isResizing) {
    applyCrop();
  }
  isDragging = false;
  isResizing = false;
  resizeHandle = null;
}

// Apply crop
function applyCrop() {
  if (!originalImage) return;

  const canvas = document.getElementById("cropCanvas");
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");

  // Calculate scale factor
  const scale = Math.max(canvas.width / originalImage.width, canvas.height / originalImage.height);
  const scaledWidth = originalImage.width * scale;
  const scaledHeight = originalImage.height * scale;
  const offsetX = (canvas.width - scaledWidth) / 2;
  const offsetY = (canvas.height - scaledHeight) / 2;

  // Calculate crop area in original image coordinates
  const cropX = (cropBox.x - offsetX) / scale;
  const cropY = (cropBox.y - offsetY) / scale;
  const cropWidth = cropBox.width / scale;
  const cropHeight = cropBox.height / scale;

  tempCanvas.width = cropWidth;
  tempCanvas.height = cropHeight;

  tempCtx.drawImage(originalImage, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

  const img = new Image();
  img.onload = () => {
    backgroundImage = img;
    updateAllPanels();
  };
  img.src = tempCanvas.toDataURL();
}

// Reset crop
function resetCrop() {
  loadDefaultBackground();
}
// Update all panels
function updateAllPanels() {
  panels = texts.map((item) => ({
    id: item.id,
    text: item.text,
  }));

  currentPanelIndex = Math.min(currentPanelIndex, Math.max(0, panels.length - 1));
  displayCurrentPanel();
  updatePanelNavigation();
}

// Display current panel
function displayCurrentPanel() {
  const container = document.getElementById("panelDisplay");

  if (panels.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="9" x2="15" y2="9"></line>
        </svg>
        <p>Добавьте тексты для создания панелей</p>
      </div>
    `;
    return;
  }

  const panel = panels[currentPanelIndex];
  container.innerHTML = `<canvas class="panel-canvas" id="currentPanelCanvas"></canvas>`;

  setTimeout(() => {
    drawPanel(panel, "currentPanelCanvas");
  }, 0);
}

// Update panel navigation
function updatePanelNavigation() {
  document.getElementById("panelCount").textContent = panels.length;
  document.getElementById("panelIndicator").textContent =
    panels.length > 0 ? `${currentPanelIndex + 1} / ${panels.length}` : "0 / 0";

  document.getElementById("prevPanel").disabled = currentPanelIndex === 0 || panels.length === 0;
  document.getElementById("nextPanel").disabled = currentPanelIndex >= panels.length - 1 || panels.length === 0;
  document.getElementById("downloadCurrentBtn").disabled = panels.length === 0;
  document.getElementById("downloadAllBtn").disabled = panels.length === 0;
}

// Draw panel
function drawPanel(panel, canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = 320;
  canvas.height = 100;

  // Draw background
  if (backgroundImage) {
    ctx.filter = `brightness(${settings.bgBrightness}%) contrast(${settings.bgContrast}%)`;

    const scale = Math.max(canvas.width / backgroundImage.width, canvas.height / backgroundImage.height);
    const scaledWidth = backgroundImage.width * scale;
    const scaledHeight = backgroundImage.height * scale;
    const x = (canvas.width - scaledWidth) / 2;
    const y = (canvas.height - scaledHeight) / 2;

    ctx.drawImage(backgroundImage, x, y, scaledWidth, scaledHeight);
    ctx.filter = "none";
  } else {
    ctx.fillStyle = "#667eea";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Draw text
  ctx.font = `${settings.fontSize}px ${settings.fontFamily}`;
  ctx.fillStyle = settings.textColor;
  ctx.textBaseline = "middle";

  const text = panel.text;

  let x;
  if (settings.alignment === "left") {
    x = settings.sidePadding;
    ctx.textAlign = "left";
  } else if (settings.alignment === "center") {
    x = canvas.width / 2 + settings.centerOffset;
    ctx.textAlign = "center";
  } else {
    x = canvas.width - settings.sidePadding;
    ctx.textAlign = "right";
  }

  const y = canvas.height / 2;
  ctx.fillText(text, x, y);
}

// Download current panel
function downloadCurrentPanel() {
  if (panels.length === 0) return;

  const canvas = document.getElementById("currentPanelCanvas");
  const panel = panels[currentPanelIndex];

  if (canvas && panel) {
    const link = document.createElement("a");
    link.download = `${panel.text}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }
}

// Download all panels
function downloadAllPanels() {
  panels.forEach((panel, index) => {
    setTimeout(() => {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.id = `temp-canvas-${panel.id}`;
      document.body.appendChild(tempCanvas);

      drawPanel(panel, tempCanvas.id);

      const link = document.createElement("a");
      link.download = `${panel.text}.png`;
      link.href = tempCanvas.toDataURL();
      link.click();

      document.body.removeChild(tempCanvas);
    }, 100 * index);
  });
}
