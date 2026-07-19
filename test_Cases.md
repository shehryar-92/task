# Test cases — Image Resizer

Manual test checklist. There's no automated test runner here since this is a
static, dependency-free page — these are the checks a developer would run
through by hand (or turn into Playwright/Cypress scripts later if the project
grows).

Each case lists: **Steps**, **Expected result**.

---

## 1. File input

### 1.1 Upload via click
**Steps:** Click the dropzone → choose a `.jpg` file from the file picker.
**Expected:** Panel appears below the dropzone. File name and original
dimensions (e.g. `1920 × 1080`) are shown correctly.

### 1.2 Upload via drag-and-drop
**Steps:** Drag a `.png` file from your file explorer and drop it onto the
dropzone.
**Expected:** Same result as 1.1 — panel appears, correct file name and
dimensions shown. Dropzone border/background should visually change while
dragging over it, and revert on drop.

### 1.3 Reject non-image files
**Steps:** Try to upload a `.txt` or `.pdf` file.
**Expected:** An alert appears saying to choose an image file. No panel is
shown.

### 1.4 Supported formats
**Steps:** Upload a `.jpg`, then a `.png`, then a `.webp` file (three
separate attempts).
**Expected:** All three load successfully and show correct original
dimensions.

---

## 2. Resizing

### 2.1 Width changes height (aspect locked)
**Steps:** Upload an image. Confirm the lock icon is active (default).
Change the width field to a smaller number.
**Expected:** Height field auto-updates to preserve the original aspect
ratio. Preview image updates to match.

### 2.2 Height changes width (aspect locked)
**Steps:** With aspect lock on, change the height field instead.
**Expected:** Width auto-updates proportionally.

### 2.3 Unlocking aspect ratio
**Steps:** Click the lock icon to deactivate it. Change width and height to
unrelated values (e.g. a square from a landscape photo).
**Expected:** Both fields accept independent values with no auto-adjustment.
Preview shows the stretched/squashed result.

### 2.4 Minimum size handling
**Steps:** Set width or height to `0` or a blank value.
**Expected:** Resize logic treats it as `1` (no crash, no blank canvas).

### 2.5 Upscaling
**Steps:** Set width/height larger than the original image.
**Expected:** Preview shows an upscaled (possibly softer) version without
errors.

---

## 3. Format and quality

### 3.1 Switching to PNG hides quality slider
**Steps:** Select "PNG" from the format dropdown.
**Expected:** Quality slider row disappears (PNG is lossless, so quality
doesn't apply).

### 3.2 Switching to JPG/WebP shows quality slider
**Steps:** Select "JPG" or "WebP".
**Expected:** Quality slider reappears, defaulting to its last value.

### 3.3 Quality affects file size
**Steps:** With JPG selected, drag the quality slider from 100 down to 10.
**Expected:** The file size readout below the preview visibly decreases as
quality drops. Image visibly loses some detail at very low quality.

---

## 4. Preview and output info

### 4.1 Live preview updates
**Steps:** Change any of width, height, format, or quality.
**Expected:** Preview image and the size/dimensions readout update within
about 150ms (debounced), without needing to click anything else.

### 4.2 Output readout accuracy
**Steps:** Resize an image to `800 × 600`.
**Expected:** Readout below the preview shows exactly `800 × 600` and a
file size in KB that looks reasonable for that format/quality.

---

## 5. Download

### 5.1 Download produces correct file
**Steps:** Set desired width/height/format, click "Download".
**Expected:** A file downloads named `<original-name>-resized.<ext>`, where
`<ext>` matches the chosen format (`jpg`, `png`, or `webp`). Opening the file
confirms it matches the on-screen preview's dimensions.

### 5.2 Download reflects latest settings
**Steps:** Change settings after the preview has rendered once, then
immediately click Download without waiting.
**Expected:** Downloaded file matches the most recent settings, not a stale
earlier version.

---

## 6. Reset

### 6.1 Start over
**Steps:** With an image loaded, click "Start over".
**Expected:** Panel hides, preview clears, file input resets so the same
file can be re-selected if needed.

---

## 7. Privacy check

### 7.1 No network activity
**Steps:** Open browser dev tools → Network tab. Upload an image and resize
it a few times.
**Expected:** No network requests are made for the image data at any point
— confirms processing is fully local.

---

## 8. Responsiveness

### 8.1 Narrow viewport
**Steps:** Resize the browser window to a narrow (mobile-width) size.
**Expected:** Layout remains usable — inputs stack sensibly, buttons don't
overflow, text stays readable.
