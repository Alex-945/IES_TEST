# Marquee Tool (Local)

## Use
1. Recommended: double-click `start-local.bat` in this folder.
2. Or run a local server manually:
   - `python -m http.server 8080`
3. Visit `http://localhost:8080`
4. Configure text/style/direction and click `Download WebM` or `Download GIF`.

## Notes
- GIF export relies on Web Worker. In many browsers, `file://` mode blocks Worker by security policy.
- Root fix: use `start-local.bat` (or any local HTTP server) so origin is `http://localhost`.
- Transparent GIF works via chroma-key mapping.
- For best compatibility, run with local server instead of `file://`.
- In Chromium browsers on `http://localhost` or `https`, download buttons open a save dialog so you can choose folder/file name.
