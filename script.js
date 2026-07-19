
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const panel = document.getElementById('panel');
const fileNameEl = document.getElementById('fileName');
const originalDimsEl = document.getElementById('originalDims');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const lockBtn = document.getElementById('lockBtn');
const formatSelect = document.getElementById('formatSelect');
const qualityRow = document.getElementById('qualityRow');
const qualityInput = document.getElementById('qualityInput');
const qualityValue = document.getElementById('qualityValue');
const previewImg = document.getElementById('previewImg');
const outInfo = document.getElementById('outInfo');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const canvas = document.getElementById('workCanvas');
const ctx = canvas.getContext('2d');

let img = null;
let origWidth = 0;
let origHeight = 0;
let aspectLocked = true;
let currentFileName = 'image';
let renderTimeout = null;

dropzone.addEventListener('click', () => fileInput.click());

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('drag-over');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('drag-over');
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('drag-over');
  if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', () => {
  if (fileInput.files.length) handleFile(fileInput.files[0]);
});

function handleFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please choose an image file.');
    return;
  }
  currentFileName = file.name.replace(/\.[^/.]+$/, '');
  const reader = new FileReader();
  reader.onload = (e) => {
    img = new Image();
    img.onload = () => {
      origWidth = img.naturalWidth;
      origHeight = img.naturalHeight;
      fileNameEl.textContent = file.name;
      originalDimsEl.textContent = `${origWidth} × ${origHeight}`;
      widthInput.value = origWidth;
      heightInput.value = origHeight;
      panel.classList.add('visible');
      renderPreview();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

lockBtn.addEventListener('click', () => {
  aspectLocked = !aspectLocked;
  lockBtn.classList.toggle('active', aspectLocked);
});

widthInput.addEventListener('input', () => {
  if (aspectLocked && origWidth) {
    const ratio = origHeight / origWidth;
    heightInput.value = Math.round(widthInput.value * ratio);
  }
  scheduleRender();
});

heightInput.addEventListener('input', () => {
  if (aspectLocked && origHeight) {
    const ratio = origWidth / origHeight;
    widthInput.value = Math.round(heightInput.value * ratio);
  }
  scheduleRender();
});

formatSelect.addEventListener('change', () => {
  qualityRow.classList.toggle('hidden', formatSelect.value === 'image/png');
  scheduleRender();
});

qualityInput.addEventListener('input', () => {
  qualityValue.textContent = qualityInput.value;
  scheduleRender();
});

function scheduleRender() {
  clearTimeout(renderTimeout);
  renderTimeout = setTimeout(renderPreview, 150);
}

function renderPreview() {
  if (!img) return;
  const w = Math.max(1, parseInt(widthInput.value) || 1);
  const h = Math.max(1, parseInt(heightInput.value) || 1);
  canvas.width = w;
  canvas.height = h;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);

  const format = formatSelect.value;
  const quality = format === 'image/png' ? undefined : qualityInput.value / 100;

  canvas.toBlob((blob) => {
    if (!blob) return;
    previewImg.src = URL.createObjectURL(blob);
    const kb = (blob.size / 1024).toFixed(1);
    outInfo.textContent = `${w} × ${h} — ${kb} KB`;
  }, format, quality);
}

downloadBtn.addEventListener('click', () => {
  if (!img) return;
  const format = formatSelect.value;
  const quality = format === 'image/png' ? undefined : qualityInput.value / 100;
  const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';

  canvas.toBlob((blob) => {
    if (!blob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${currentFileName}-resized.${ext}`;
    link.click();
  }, format, quality);
});

resetBtn.addEventListener('click', () => {
  img = null;
  fileInput.value = '';
  panel.classList.remove('visible');
  previewImg.src = '';
});
