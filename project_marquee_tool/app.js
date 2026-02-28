const el = {
  text: document.getElementById("text"),
  direction: document.getElementById("direction"),
  fontFamily: document.getElementById("fontFamily"),
  fontSize: document.getElementById("fontSize"),
  fontSizeValue: document.getElementById("fontSizeValue"),
  speed: document.getElementById("speed"),
  speedValue: document.getElementById("speedValue"),
  duration: document.getElementById("duration"),
  durationValue: document.getElementById("durationValue"),
  fps: document.getElementById("fps"),
  fpsValue: document.getElementById("fpsValue"),
  width: document.getElementById("width"),
  height: document.getElementById("height"),
  textColor: document.getElementById("textColor"),
  bgColor: document.getElementById("bgColor"),
  transparentBg: document.getElementById("transparentBg"),
  downloadWebm: document.getElementById("downloadWebm"),
  downloadGif: document.getElementById("downloadGif"),
  status: document.getElementById("status"),
  canvas: document.getElementById("canvas")
};

const ctx = el.canvas.getContext("2d", { alpha: true });
let previewT = 0;
let rafId = 0;
let cachedGifWorkerBlobUrl = "";

function clampNum(n, min, max, fallback) {
  const v = Number(n);
  if (Number.isNaN(v)) return fallback;
  return Math.max(min, Math.min(max, v));
}

function readSettings() {
  const width = clampNum(el.width.value, 64, 1920, 640);
  const height = clampNum(el.height.value, 64, 1080, 200);
  const fontSize = clampNum(el.fontSize.value, 24, 200, 72);
  const speed = clampNum(el.speed.value, 20, 500, 150);
  const fps = clampNum(el.fps.value, 10, 60, 30);
  const duration = clampNum(el.duration.value, 1, 15, 4);

  return {
    text: (el.text.value || " ").slice(0, 120),
    direction: el.direction.value,
    fontFamily: el.fontFamily.value,
    fontSize,
    speed,
    fps,
    duration,
    width,
    height,
    textColor: el.textColor.value,
    bgColor: el.bgColor.value,
    transparentBg: el.transparentBg.checked
  };
}

function syncLabels() {
  el.fontSizeValue.textContent = `${el.fontSize.value} px`;
  el.speedValue.textContent = `${el.speed.value}`;
  el.durationValue.textContent = Number(el.duration.value).toFixed(1);
  el.fpsValue.textContent = `${el.fps.value}`;
}

function layoutText(settings) {
  ctx.font = `${settings.fontSize}px ${settings.fontFamily}`;
  ctx.textBaseline = "middle";
  const metrics = ctx.measureText(settings.text);
  const textWidth = metrics.width;
  const textHeight = Math.max(settings.fontSize, (metrics.actualBoundingBoxAscent || settings.fontSize * 0.8) + (metrics.actualBoundingBoxDescent || settings.fontSize * 0.2));
  return { textWidth, textHeight };
}

function computePosition(settings, t, textWidth, textHeight) {
  const loop = settings.duration;
  const tt = ((t % loop) + loop) % loop;
  const dist = settings.speed * tt;

  switch (settings.direction) {
    case "ltr":
      return {
        x: -textWidth + dist % (settings.width + textWidth),
        y: settings.height / 2
      };
    case "rtl":
      return {
        x: settings.width - (dist % (settings.width + textWidth)),
        y: settings.height / 2
      };
    case "ttb":
      return {
        x: (settings.width - textWidth) / 2,
        y: -textHeight / 2 + (dist % (settings.height + textHeight))
      };
    case "btt":
      return {
        x: (settings.width - textWidth) / 2,
        y: settings.height + textHeight / 2 - (dist % (settings.height + textHeight))
      };
    default:
      return { x: 0, y: settings.height / 2 };
  }
}

function renderFrame(settings, t) {
  if (el.canvas.width !== settings.width || el.canvas.height !== settings.height) {
    el.canvas.width = settings.width;
    el.canvas.height = settings.height;
  }

  const { textWidth, textHeight } = layoutText(settings);
  if (!settings.transparentBg) {
    ctx.fillStyle = settings.bgColor;
    ctx.fillRect(0, 0, settings.width, settings.height);
  } else {
    ctx.clearRect(0, 0, settings.width, settings.height);
  }

  const pos = computePosition(settings, t, textWidth, textHeight);
  ctx.fillStyle = settings.textColor;
  ctx.fillText(settings.text, pos.x, pos.y);
}

function animatePreview(ts) {
  const settings = readSettings();
  if (!previewT) previewT = ts;
  const t = (ts - previewT) / 1000;
  renderFrame(settings, t);
  rafId = requestAnimationFrame(animatePreview);
}

function setStatus(msg) {
  el.status.textContent = msg;
}

function normalizeErrorMessage(err, formatLabel) {
  const raw = err && err.message ? String(err.message) : String(err || "");
  if (raw.includes("Failed to construct 'Worker'") || raw.includes("cannot be accessed from origin 'null'")) {
    return `${formatLabel} 需要本機伺服器模式。請雙擊 start-local.bat 後再重試。`;
  }
  return raw || `${formatLabel} 匯出失敗`;
}

function withButtonsDisabled(run) {
  el.downloadGif.disabled = true;
  el.downloadWebm.disabled = true;
  return run().finally(() => {
    el.downloadGif.disabled = false;
    el.downloadWebm.disabled = false;
  });
}

async function exportWebM() {
  const s = readSettings();
  renderFrame(s, 0);

  const stream = el.canvas.captureStream(s.fps);
  const mimeTypes = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm"
  ];
  const mimeType = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m));
  if (!mimeType) {
    throw new Error("此瀏覽器不支援 WebM 錄製");
  }

  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6_000_000 });
  const chunks = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

  const recordPromise = new Promise((resolve, reject) => {
    recorder.onerror = () => reject(new Error("WebM 錄製失敗"));
    recorder.onstop = () => resolve();
  });

  recorder.start();
  const start = performance.now();

  await new Promise((resolve) => {
    function step(now) {
      const t = (now - start) / 1000;
      renderFrame(s, t);
      if (t < s.duration) requestAnimationFrame(step);
      else resolve();
    }
    requestAnimationFrame(step);
  });

  recorder.stop();
  await recordPromise;

  const blob = new Blob(chunks, { type: mimeType });
  return saveBlob(blob, `marquee_${Date.now()}.webm`, "video/webm");
}

async function exportGif() {
  const s = readSettings();
  if (!window.GIF) {
    throw new Error("GIF 編碼器未載入（請確認網路或改用本機伺服器）");
  }

  const chromaHex = pickChromaKey(s.textColor);

  const gif = new window.GIF({
    workers: 2,
    quality: 8,
    workerScript: resolveGifWorkerScript(),
    width: s.width,
    height: s.height,
    transparent: s.transparentBg ? parseInt(chromaHex.slice(1), 16) : null
  });

  const frameCount = Math.max(1, Math.round(s.duration * s.fps));
  const delay = 1000 / s.fps;

  const frameCanvas = document.createElement("canvas");
  frameCanvas.width = s.width;
  frameCanvas.height = s.height;
  const frameCtx = frameCanvas.getContext("2d", { alpha: true });

  for (let i = 0; i < frameCount; i += 1) {
    const t = i / s.fps;

    renderFrame(s, t);
    frameCtx.clearRect(0, 0, s.width, s.height);

    if (s.transparentBg) {
      frameCtx.fillStyle = chromaHex;
      frameCtx.fillRect(0, 0, s.width, s.height);
      frameCtx.drawImage(el.canvas, 0, 0);
    } else {
      frameCtx.drawImage(el.canvas, 0, 0);
    }

    gif.addFrame(frameCanvas, { copy: true, delay });
  }

  const blob = await new Promise((resolve, reject) => {
    gif.on("finished", resolve);
    gif.on("abort", () => reject(new Error("GIF 匯出中止")));
    gif.on("error", () => reject(new Error("GIF 匯出失敗")));
    gif.render();
  });

  return saveBlob(blob, `marquee_${Date.now()}.gif`, "image/gif");
}

function pickChromaKey(textColor) {
  const keys = ["#00ff00", "#ff00ff", "#00ffff", "#ffff00"];
  const normalized = String(textColor || "").toLowerCase();
  return keys.find((k) => k !== normalized) || "#00ff00";
}

function resolveGifWorkerScript() {
  if (cachedGifWorkerBlobUrl) return cachedGifWorkerBlobUrl;

  const src = window.__GIF_WORKER_SOURCE__;
  if (typeof src === "string" && src.length > 0) {
    const blob = new Blob([src], { type: "application/javascript" });
    cachedGifWorkerBlobUrl = URL.createObjectURL(blob);
    return cachedGifWorkerBlobUrl;
  }

  return "./vendor/gif.worker.js";
}

async function saveBlob(blob, fileName, mimeType) {
  const canUsePicker = typeof window.showSaveFilePicker === "function" && window.isSecureContext;
  if (!canUsePicker) {
    downloadBlob(blob, fileName);
    return "download";
  }

  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: fileName,
      types: [
        {
          description: mimeType,
          accept: { [mimeType]: [fileName.endsWith(".gif") ? ".gif" : ".webm"] }
        }
      ]
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return "picker";
  } catch (err) {
    if (err && err.name === "AbortError") {
      throw new Error("已取消儲存");
    }
    downloadBlob(blob, fileName);
    return "download";
  }
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function attachEvents() {
  [
    el.text,
    el.direction,
    el.fontFamily,
    el.fontSize,
    el.speed,
    el.duration,
    el.fps,
    el.width,
    el.height,
    el.textColor,
    el.bgColor,
    el.transparentBg
  ].forEach((node) => {
    node.addEventListener("input", syncLabels);
    node.addEventListener("change", syncLabels);
  });

  el.downloadWebm.addEventListener("click", () => withButtonsDisabled(async () => {
    setStatus("正在輸出 WebM...");
    const mode = await exportWebM();
    setStatus(mode === "picker" ? "WebM 已儲存" : "WebM 已下載");
  }).catch((err) => {
    setStatus(normalizeErrorMessage(err, "WebM"));
  }));

  el.downloadGif.addEventListener("click", () => withButtonsDisabled(async () => {
    setStatus("正在輸出 GIF...");
    const mode = await exportGif();
    setStatus(mode === "picker" ? "GIF 已儲存" : "GIF 已下載");
  }).catch((err) => {
    setStatus(normalizeErrorMessage(err, "GIF"));
  }));
}

function boot() {
  syncLabels();
  attachEvents();
  cancelAnimationFrame(rafId);
  previewT = 0;
  rafId = requestAnimationFrame(animatePreview);
}

boot();

