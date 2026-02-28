# Marquee Tool (Local)

## Use
1. Open `index.html` directly, or start a tiny local server in this folder:
   - `python -m http.server 8080`
2. Visit `http://localhost:8080`
3. Configure text/style/direction and click `Download WebM` or `Download GIF`.

## Notes
- GIF export uses local files in `vendor/` (gif.js + gif.worker.js).
- Transparent GIF works via chroma-key mapping.
- For best compatibility, run with local server instead of `file://`.
- In Chromium browsers on `http://localhost` or `https`, download buttons open a save dialog so you can choose folder/file name.
