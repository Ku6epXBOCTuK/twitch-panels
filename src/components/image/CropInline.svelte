<script lang="ts">
  let active = $state(false);
</script>

<div class="crop-canvas-container">
  <canvas class="crop-canvas"></canvas>
  <div class="crop-box" class:active>
    <div class="crop-handle nw"></div>
    <div class="crop-handle ne"></div>
    <div class="crop-handle sw"></div>
    <div class="crop-handle se"></div>
    <div class="crop-handle n"></div>
    <div class="crop-handle s"></div>
    <div class="crop-handle w"></div>
    <div class="crop-handle e"></div>
  </div>
</div>

<style>
  .crop-canvas-container {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 5;
    background: var(--surface-subtle);
    border-radius: var(--radius);
    overflow: hidden;
    cursor: crosshair;
  }

  .crop-canvas {
    width: 100%;
    height: 100%;
    display: block;
  }

  .crop-box {
    position: absolute;
    border: 2px solid var(--action-primary);
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
    cursor: move;
    display: none;
  }

  .crop-box.active {
    display: block;
  }

  .crop-handle {
    position: absolute;
    width: 10px;
    height: 10px;
    background: white;
    border: 2px solid var(--action-primary);
    border-radius: 50%;
  }

  .crop-handle.nw {
    top: -5px;
    left: -5px;
    cursor: nw-resize;
  }

  .crop-handle.ne {
    top: -5px;
    right: -5px;
    cursor: ne-resize;
  }

  .crop-handle.sw {
    bottom: -5px;
    left: -5px;
    cursor: sw-resize;
  }

  .crop-handle.se {
    bottom: -5px;
    right: -5px;
    cursor: se-resize;
  }

  .crop-handle.n {
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    cursor: n-resize;
  }

  .crop-handle.s {
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    cursor: s-resize;
  }

  .crop-handle.w {
    left: -5px;
    top: 50%;
    transform: translateY(-50%);
    cursor: w-resize;
  }

  .crop-handle.e {
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
    cursor: e-resize;
  }
</style>
