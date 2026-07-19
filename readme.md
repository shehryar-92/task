# Image Resizer

A simple, privacy-friendly image resizer that runs entirely in your browser.
No uploads, no backend, no accounts — your image never leaves your device.

## Why it's safe by design

Everything happens client-side using the browser's `FileReader` and `Canvas`
APIs. The image is read into memory, drawn onto a canvas at the size you
choose, and exported straight back to a downloadable file. There is no
server component to send data to, so there's nothing to leak.

## Features

- Drag-and-drop or click-to-upload
- Resize by exact width/height, in pixels
- Lock/unlock aspect ratio so images don't look stretched
- Live preview before you download
- Choose output format: JPG, PNG, or WebP
- Quality slider for JPG/WebP (hidden for PNG, since PNG is lossless)
- Shows the resulting file size before you commit to downloading

## Project structure

```
image-resizer/
├── index.html    Markup / structure
├── styles.css    All visual styling and the color theme
├── script.js     Resizing logic and interactivity
├── README.md     This file
└── TEST_CASES.md Manual test checklist
```

Splitting things this way keeps each file doing one job: `index.html`
describes *what's on the page*, `styles.css` decides *how it looks*, and
`script.js` handles *what it does*.

## How to run it

No installation, no build step, no dependencies.

1. Download all files into the same folder.
2. Double-click `index.html` (or open it via `File > Open` in your browser).

That's it — it runs as a static page.

If you'd rather host it (e.g. to share a link), any static host works, since
there's no backend: GitHub Pages, Netlify, Vercel, or even a plain S3 bucket.

## How the resize actually works

1. The chosen image file is read into memory with `FileReader`.
2. It's drawn onto a hidden `<canvas>` element at the target width/height —
   this redraw *is* the resize, since the canvas rasterizes the image at
   whatever size you tell it to.
3. The canvas is exported back into an image blob via `canvas.toBlob()`,
   with your chosen format and quality.
4. That blob becomes the downloadable file.

## Browser support

Works in any modern browser (Chrome, Firefox, Safari, Edge). WebP export
depends on browser support for `canvas.toBlob('image/webp')`, which all
current major browsers provide.

## Possible next steps

- Batch mode: resize a whole folder of images at once
- Resize by percentage instead of exact pixels
- Preset sizes (e.g. "Instagram post", "Twitter header")
