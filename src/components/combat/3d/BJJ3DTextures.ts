import * as THREE from 'three';

/**
 * Creates a procedural high-density cotton weave canvas texture
 * reproducing authentic BJJ heavy pearl-weave / ripstop gi fabric.
 */
export function createGiTexture(giColorHex: string): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    return fallback;
  }

  // Base background
  ctx.fillStyle = giColorHex;
  ctx.fillRect(0, 0, size, size);

  // Parse color to add subtle weave highlights & shadows
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let y = 0; y < size; y += 4) {
    for (let x = (y % 8 === 0 ? 0 : 2); x < size; x += 4) {
      ctx.fillRect(x, y, 2, 2);
    }
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
  for (let y = 2; y < size; y += 4) {
    for (let x = (y % 8 === 0 ? 2 : 0); x < size; x += 4) {
      ctx.fillRect(x, y, 2, 2);
    }
  }

  // Seam line texture
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i < size; i += 16) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates official IBJJF tournament mat texture
 * (Royal Blue vinyl mat tiles with anti-slip micro-texture)
 */
export function createMatTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep IBJJF competition royal blue
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(0, 0, size, size);

  // Mat seams / tile grid
  ctx.strokeStyle = '#172554';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, size, size);

  // Tatame vinyl micro-grain
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates skin material with soft subsurface approximation
 */
export function createSkinMaterial(tone: 'light' | 'medium' | 'dark' = 'medium'): THREE.MeshStandardMaterial {
  const tones = {
    light: '#fcd34d',
    medium: '#d97706',
    dark: '#78350f'
  };

  return new THREE.MeshStandardMaterial({
    color: tones[tone],
    roughness: 0.65,
    metalness: 0.05
  });
}
