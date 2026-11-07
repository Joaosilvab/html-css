/* Minhas Notas — bloco de notas personalizável (PWA)
 * Tudo é salvo no localStorage do próprio aparelho. */
(() => {
  'use strict';

  const NOTES_KEY = 'notas.v1';
  const THEME_KEY = 'notas.tema.v1';
  const BG_IMG_KEY = 'notas.bgimg.v1';

  const FONTS = [
    ['system-ui, -apple-system, Segoe UI, sans-serif', 'Padrão do sistema'],
    ["'Inter', sans-serif", 'Inter'],
    ["'Roboto', sans-serif", 'Roboto'],
    ["'Poppins', sans-serif", 'Poppins'],
    ["'Nunito', sans-serif", 'Nunito'],
    ["'Comfortaa', sans-serif", 'Comfortaa'],
    ["'Lora', serif", 'Lora'],
    ["'Merriweather', serif", 'Merriweather'],
    ["'Playfair Display', serif", 'Playfair Display'],
    ["Georgia, 'Times New Roman', serif", 'Georgia'],
    ["'Caveat', cursive", 'Caveat (manuscrita)'],
    ["'Patrick Hand', cursive", 'Patrick Hand'],
    ["'Indie Flower', cursive", 'Indie Flower'],
    ["'Pacifico', cursive", 'Pacifico'],
    ["'Fira Code', monospace", 'Fira Code (código)'],
    ["'JetBrains Mono', monospace", 'JetBrains Mono']
  ];

  const NOTE_COLORS = ['', '#fff59d', '#ffcc80', '#ef9a9a', '#f48fb1', '#ce93d8', '#90caf9', '#80deea', '#a5d6a7', '#e6ee9c', '#bcaaa4', '#b0bec5'];

  const TEXT_COLORS = ['', '#111111', '#ffffff', '#d32f2f', '#ef6c00', '#f9a825', '#2e7d32', '#00838f', '#1565c0', '#6a1b9a', '#ad1457', '#5d4037'];

  const DEFAULT_THEME = {
    appTitle: 'Minhas Notas',
    layout: 'grid',
    cardWidth: 150,
    uiFont: "'Inter', sans-serif",
    titleFont: "'Poppins', sans-serif",
    noteFont: "'Inter', sans-serif",
    fontSize: 16,
    titleSize: 18,
    lineHeight: 1.5,
    titleBold: true,
    bgType: 'gradient',
    bgColor: '#f4f1ff',
    bgColor2: '#ffe3ef',
    bgAngle: 135,
    bgImageUrl: '',
    bgBlur: 0,
    bgDim: 0,
    textColor: '#1f1d2b',
    accentColor: '#7c5cff',
    cardColor: '#ffffff',
    barColor: '#ffffff',
    cardOpacity: 0.95,
    radius: 16,
    shadow: 0.35,
    border: 1
  };

  const PRESETS = {
    'Lavanda': {},
    'Escuro': { bgType: 'solid', bgColor: '#121218', textColor: '#ececf1', accentColor: '#9d86ff', cardColor: '#1f1f2a', barColor: '#17171f', cardOpacity: 1, shadow: 0.6 },
    'Sépia': { bgType: 'solid', bgColor: '#f3e9d2', textColor: '#4a3b2a', accentColor: '#b5652b', cardColor: '#fbf5e6', barColor: '#efe2c4', uiFont: "'Lora', serif", titleFont: "'Playfair Display', serif", noteFont: "'Lora', serif", radius: 6, shadow: 0.2 },
    'Oceano': { bgType: 'gradient', bgColor: '#0f4c81', bgColor2: '#00b4d8', bgAngle: 160, textColor: '#0b2540', accentColor: '#0077b6', cardColor: '#e8f7ff', barColor: '#d8f1ff', cardOpacity: 0.9 },
    'Neon': { bgType: 'gradient', bgColor: '#0d0221', bgColor2: '#3a0ca3', bgAngle: 200, textColor: '#f1f1ff', accentColor: '#f72585', cardColor: '#1b0b3b', barColor: '#120530', cardOpacity: 0.85, titleFont: "'Comfortaa', sans-serif", shadow: 0.8, radius: 20 },
    'Floresta': { bgType: 'gradient', bgColor: '#dfe8d4', bgColor2: '#a8c69f', bgAngle: 180, textColor: '#1e3320', accentColor: '#2e7d32', cardColor: '#f5fbf0', barColor: '#e8f2e0', titleFont: "'Merriweather', serif" },
    'Caderno': { bgType: 'solid', bgColor: '#fdfcf7', textColor: '#1d3a6e', accentColor: '#1d3a6e', cardColor: '#fffef5', barColor: '#fdfcf7', uiFont: "'Patrick Hand', cursive", titleFont: "'Caveat', cursive", noteFont: "'Patrick Hand', cursive", fontSize: 19, titleSize: 26, radius: 2, shadow: 0.15 },
    'Terminal': { bgType: 'solid', bgColor: '#0a0f0a', textColor: '#39ff14', accentColor: '#39ff14', cardColor: '#0f1a0f', barColor: '#0a0f0a', uiFont: "'Fira Code', monospace", titleFont: "'JetBrains Mono', monospace", noteFont: "'Fira Code', monospace", radius: 0, shadow: 0, border: 1, cardOpacity: 1 },
    'Pôr do sol': { bgType: 'gradient', bgColor: '#ff7e5f', bgColor2: '#feb47b', bgAngle: 120, textColor: '#3b1d12', accentColor: '#d9480f', cardColor: '#fff4ec', barColor: '#fff0e6', cardOpacity: 0.9, titleFont: "'Pacifico', cursive" }
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---------- Armazenamento ----------
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch { toast('Sem espaço para salvar (imagem de fundo muito grande?)'); return false; }
    }
  };

  let notes = store.get(NOTES_KEY, null);
  if (!Array.isArray(notes)) {
    const now = Date.now();
    notes = [
      { id: uid(), title: 'Bem-vindo(a)! 👋', body: 'Toque no 🎨 lá em cima para mudar fontes, cores, fundo e o layout.\n\nToque numa nota para editar.', color: '#fff59d', font: '', pinned: true, created: now, updated: now },
      { id: uid(), title: 'Compartilhe', body: 'Use o botão ⤴ para mandar o link do app para alguém instalar no celular ou computador.', color: '#90caf9', font: '', pinned: false, created: now - 1, updated: now - 1 }
    ];
    store.set(NOTES_KEY, notes);
  }

  let theme = { ...DEFAULT_THEME, ...store.get(THEME_KEY, {}) };
  // cartões menores: quem estava no tamanho antigo padrão (240) passa para o novo
  if (!localStorage.getItem('notas.mig.cards')) {
    if (theme.cardWidth === 240) { theme.cardWidth = DEFAULT_THEME.cardWidth; store.set(THEME_KEY, theme); }
    try { localStorage.setItem('notas.mig.cards', '1'); } catch { /* ignora */ }
  }
  let filter = 'all';
  let query = '';
  let editingId = null;

  // Tema recebido por link (?tema=...)
  try {
    const params = new URLSearchParams(location.search);
    const shared = params.get('tema');
    if (shared) {
      const t = JSON.parse(decodeURIComponent(escape(atob(shared))));
      if (t && typeof t === 'object') {
        theme = { ...DEFAULT_THEME, ...sanitizeTheme(t) };
        store.set(THEME_KEY, theme);
        setTimeout(() => toast('Tema aplicado a partir do link 🎨'), 400);
      }
      history.replaceState(null, '', location.pathname);
    }
  } catch { /* link inválido: ignora */ }

  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function saveNotes() { store.set(NOTES_KEY, notes); }
  function saveTheme() { store.set(THEME_KEY, theme); }

  function sanitizeTheme(t) {
    const out = {};
    for (const k of Object.keys(DEFAULT_THEME)) {
      if (k in t && typeof t[k] === typeof DEFAULT_THEME[k]) out[k] = t[k];
    }
    return out;
  }

  // ---------- Cores ----------
  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgba(hex, a) { const [r, g, b] = hexToRgb(hex); return `rgba(${r}, ${g}, ${b}, ${a})`; }
  function luminance(hex) {
    const [r, g, b] = hexToRgb(hex).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function readableOn(hex) { return luminance(hex) > 0.45 ? '#111111' : '#ffffff'; }

  // ---------- Aplicar tema ----------
  function applyTheme() {
    const r = document.documentElement.style;
    r.setProperty('--ui-font', theme.uiFont);
    r.setProperty('--title-font', theme.titleFont);
    r.setProperty('--note-font', theme.noteFont);
    r.setProperty('--font-size', theme.fontSize + 'px');
    r.setProperty('--title-size', theme.titleSize + 'px');
    r.setProperty('--title-weight', theme.titleBold ? '700' : '400');
    r.setProperty('--line-height', theme.lineHeight);
    r.setProperty('--text', theme.textColor);
    r.setProperty('--accent', theme.accentColor);
    r.setProperty('--accent-text', readableOn(theme.accentColor));
    r.setProperty('--card', rgba(theme.cardColor, theme.cardOpacity));
    r.setProperty('--card-solid', theme.cardColor);
    r.setProperty('--bar', rgba(theme.barColor, Math.min(1, theme.cardOpacity + 0.05)));
    r.setProperty('--radius', theme.radius + 'px');
    r.setProperty('--shadow', theme.shadow > 0 ? `0 ${4 + theme.shadow * 10}px ${10 + theme.shadow * 30}px rgba(0,0,0,${0.06 + theme.shadow * 0.3})` : 'none');
    r.setProperty('--border', theme.border + 'px');
    r.setProperty('--border-color', rgba(theme.textColor, 0.15));
    r.setProperty('--card-width', theme.cardWidth + 'px');
    r.setProperty('--bg-blur', theme.bgType === 'image' ? theme.bgBlur + 'px' : '0px');
    $('.bg-layer').classList.toggle('blurred', theme.bgType === 'image' && theme.bgBlur > 0);
    r.setProperty('--bg-dim', theme.bgType === 'image' ? theme.bgDim : 0);

    let bg;
    if (theme.bgType === 'gradient') bg = `linear-gradient(${theme.bgAngle}deg, ${theme.bgColor}, ${theme.bgColor2})`;
    else if (theme.bgType === 'image') {
      const img = localStorage.getItem(BG_IMG_KEY) || theme.bgImageUrl;
      bg = img ? `url("${img.replace(/"/g, '%22')}") center / cover no-repeat, ${theme.bgColor}` : theme.bgColor;
    } else bg = theme.bgColor;
    r.setProperty('--bg', bg);
    document.body.style.background = theme.bgColor;

    const meta = document.querySelector('meta[name=theme-color]');
    if (meta) meta.content = theme.barColor;
    document.documentElement.style.colorScheme = luminance(theme.cardColor) < 0.3 ? 'dark' : 'light';

    $('#appTitle').textContent = theme.appTitle || 'Minhas Notas';
    document.title = theme.appTitle || 'Minhas Notas';
    $('#notes').className = 'notes ' + theme.layout;
    $('#btnLayout').textContent = theme.layout === 'grid' ? '☰' : '▦';
    syncControls();
  }

  // ---------- Painel de personalização ----------
  function fillFontSelect(sel, withInherit) {
    sel.innerHTML = '';
    if (withInherit) sel.add(new Option('Mesma das notas', ''));
    for (const [value, label] of FONTS) {
      const o = new Option(label, value);
      o.style.fontFamily = value;
      sel.add(o);
    }
  }
  $$('.font-select').forEach(s => fillFontSelect(s, false));
  fillFontSelect($('#editFont'), true);

  function fmt(key, v) {
    if (['fontSize', 'titleSize', 'radius', 'cardWidth', 'bgBlur', 'border'].includes(key)) return v + 'px';
    if (key === 'bgAngle') return v + '°';
    if (['cardOpacity', 'shadow', 'bgDim'].includes(key)) return Math.round(v * 100) + '%';
    return v;
  }

  function syncControls() {
    $$('[data-key]').forEach(el => {
      const k = el.dataset.key;
      if (el.type === 'checkbox') el.checked = !!theme[k];
      else if (document.activeElement !== el) el.value = theme[k];
      const out = $(`output[data-for="${k}"]`);
      if (out) out.textContent = fmt(k, theme[k]);
    });
    $$('[data-show]').forEach(el => { el.hidden = el.dataset.show !== theme.bgType; });
  }

  $$('[data-key]').forEach(el => {
    const handler = () => {
      const k = el.dataset.key;
      let v = el.type === 'checkbox' ? el.checked : el.value;
      if (typeof DEFAULT_THEME[k] === 'number') v = parseFloat(v);
      theme[k] = v;
      saveTheme();
      applyTheme();
      if (k === 'layout') render();
    };
    el.addEventListener('input', handler);
    el.addEventListener('change', handler);
  });

  const presetsEl = $('#presets');
  for (const [name, p] of Object.entries(PRESETS)) {
    const t = { ...DEFAULT_THEME, ...p };
    const b = document.createElement('button');
    b.className = 'preset';
    b.type = 'button';
    const bg = t.bgType === 'gradient' ? `linear-gradient(${t.bgAngle}deg, ${t.bgColor}, ${t.bgColor2})` : t.bgColor;
    b.innerHTML = `<div class="pv" style="background:${bg}"><span style="background:${t.cardColor};border-bottom:3px solid ${t.accentColor}"></span></div><small style="font-family:${t.titleFont.replace(/"/g, "'")}">${name}</small>`;
    b.addEventListener('click', () => {
      theme = { ...DEFAULT_THEME, ...p, appTitle: theme.appTitle, layout: theme.layout };
      saveTheme();
      applyTheme();
      toast(`Tema “${name}” aplicado`);
    });
    presetsEl.appendChild(b);
  }

  $('#bgFile').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        // reduz a imagem para caber no localStorage
        const max = 1600;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        const data = c.toDataURL('image/jpeg', 0.8);
        try {
          localStorage.setItem(BG_IMG_KEY, data);
          theme.bgType = 'image';
          saveTheme();
          applyTheme();
          toast('Imagem de fundo aplicada');
        } catch { toast('Imagem muito grande para salvar'); }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  });
  $('[data-key="bgImageUrl"]').addEventListener('input', () => localStorage.removeItem(BG_IMG_KEY));

  const drawer = $('#drawer');
  const scrim = $('#scrim');
  function openDrawer(open) {
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    scrim.hidden = !open;
  }
  $('#btnSettings').addEventListener('click', () => openDrawer(true));
  $('#btnCloseDrawer').addEventListener('click', () => openDrawer(false));
  scrim.addEventListener('click', () => openDrawer(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') openDrawer(false); });

  $('#btnLayout').addEventListener('click', () => {
    theme.layout = theme.layout === 'grid' ? 'list' : 'grid';
    saveTheme(); applyTheme(); render();
  });

  $('#btnReset').addEventListener('click', () => {
    if (!confirm('Voltar ao visual padrão? Suas notas não serão apagadas.')) return;
    theme = { ...DEFAULT_THEME };
    localStorage.removeItem(BG_IMG_KEY);
    saveTheme(); applyTheme(); render();
  });

  // ---------- Backup ----------
  $('#btnExport').addEventListener('click', async () => {
    const fotos = {};
    for (const id of new Set(notes.flatMap(noteImageIds))) {
      const blob = await imgDB.get(id).catch(() => null);
      if (blob) fotos[id] = await blobToDataUrl(blob);
    }
    const data = { app: 'minhas-notas', version: 2, exported: new Date().toISOString(), theme, notes, fotos };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `notas-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  $('#importFile').addEventListener('change', async e => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const incoming = Array.isArray(data) ? data : data.notes;
      if (!Array.isArray(incoming)) throw new Error();
      if (data.fotos && typeof data.fotos === 'object') {
        for (const [id, url] of Object.entries(data.fotos)) {
          if (!/^[a-z0-9]{4,40}$/i.test(id) || typeof url !== 'string' || !url.startsWith('data:image/')) continue;
          try { await imgDB.put(id, await dataUrlToBlob(url)); imgUrls.delete(id); } catch { /* ignora */ }
        }
      }
      const ids = new Set(notes.map(n => n.id));
      let added = 0;
      for (const n of incoming) {
        if (!n || typeof n !== 'object') continue;
        const note = {
          id: n.id && !ids.has(n.id) ? String(n.id) : uid(),
          title: String(n.title || ''), body: String(n.body || ''), html: typeof n.html === 'string' ? sanitizeHtml(n.html) : '',
          color: typeof n.color === 'string' ? n.color : '', textColor: typeof n.textColor === 'string' ? n.textColor : '', titleColor: typeof n.titleColor === 'string' ? n.titleColor : '', font: typeof n.font === 'string' ? n.font : '',
          pinned: !!n.pinned, created: +n.created || Date.now(), updated: +n.updated || Date.now()
        };
        notes.push(note); ids.add(note.id); added++;
      }
      if (data.theme && confirm('O backup tem um tema. Aplicar também o visual?')) {
        theme = { ...DEFAULT_THEME, ...sanitizeTheme(data.theme) };
        saveTheme(); applyTheme();
      }
      saveNotes(); render();
      toast(`${added} nota(s) importada(s)`);
    } catch { toast('Arquivo inválido'); }
  });

  $('#btnExportTheme').addEventListener('click', () => {
    const { bgImageUrl, ...rest } = theme;
    const t = bgImageUrl.startsWith('http') ? theme : rest;
    const code = btoa(unescape(encodeURIComponent(JSON.stringify(t))));
    const url = appUrl() + '?tema=' + encodeURIComponent(code);
    copy(url, 'Link com seu tema copiado! Quem abrir verá o mesmo visual.');
  });

  // ---------- Texto formatado (cor por palavra/linha) ----------
  const RICH_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE', 'BR', 'DIV', 'P', 'SPAN', 'FONT', 'UL', 'OL', 'LI']);
  const SAFE_COLOR = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|[a-z]{3,20})$/i;
  const STYLE_PROPS = ['color', 'background-color', 'font-weight', 'font-style', 'text-decoration-line', 'text-decoration', 'font-family'];

  function sanitizeHtml(html) {
    const src = new DOMParser().parseFromString(`<body>${html || ''}</body>`, 'text/html').body;
    const out = document.createElement('div');
    const walk = (from, to) => {
      for (const node of from.childNodes) {
        if (node.nodeType === 3) { to.appendChild(document.createTextNode(node.nodeValue)); continue; }
        if (node.nodeType !== 1) continue;
        const tag = node.tagName;
        if (/^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT|IFRAME|OBJECT)$/.test(tag)) continue;
        if (tag === 'IMG') {
          const id = node.getAttribute('data-img');
          if (id && /^[a-z0-9]{4,40}$/i.test(id)) {
            const img = document.createElement('img');
            img.setAttribute('data-img', id);
            img.setAttribute('alt', '');
            to.appendChild(img);
          }
          continue;
        }
        if (!RICH_TAGS.has(tag)) { walk(node, to); continue; }
        const el = document.createElement(tag === 'FONT' ? 'span' : tag.toLowerCase());
        const styles = [];
        for (const prop of STYLE_PROPS) {
          const v = node.style && node.style.getPropertyValue(prop);
          if (!v) continue;
          if (prop.includes('color')) { if (SAFE_COLOR.test(v.trim())) styles.push(`${prop}: ${v}`); }
          else if (prop === 'font-family') { if (/^[a-z0-9\s,'"-]{1,80}$/i.test(v)) styles.push(`${prop}: ${v}`); }
          else if (/^[a-z0-9\s-]+$/i.test(v)) styles.push(`${prop}: ${v}`);
        }
        if (tag === 'FONT' && node.getAttribute('color') && SAFE_COLOR.test(node.getAttribute('color'))) styles.push(`color: ${node.getAttribute('color')}`);
        if (tag === 'FONT' && node.getAttribute('face') && /^[a-z0-9\s,'"-]{1,80}$/i.test(node.getAttribute('face'))) styles.push(`font-family: ${node.getAttribute('face')}`);
        if (styles.length) el.setAttribute('style', styles.join('; '));
        walk(node, el);
        to.appendChild(el);
      }
    };
    walk(src, out);
    return out.innerHTML;
  }

  function htmlToText(html) {
    const root = new DOMParser().parseFromString(`<body>${html || ''}</body>`, 'text/html').body;
    let text = '';
    const walk = node => {
      for (const c of node.childNodes) {
        if (c.nodeType === 3) text += c.nodeValue;
        else if (c.nodeType === 1) {
          if (c.tagName === 'BR') { text += '\n'; continue; }
          if (c.tagName === 'IMG') { text += '📷'; continue; }
          const block = /^(DIV|P|LI|UL|OL)$/.test(c.tagName);
          if (block && text && !text.endsWith('\n')) text += '\n';
          walk(c);
        }
      }
    };
    walk(root);
    return text.replace(/ /g, ' ');
  }

  function textToHtml(text) { return escapeHtml(text || '').replace(/\n/g, '<br>'); }
  function noteHtml(n) { return n.html ? sanitizeHtml(n.html) : textToHtml(n.body); }

  // destaca a busca só nos textos (sem quebrar as tags)
  function markMatches(el, q) {
    if (!q) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const hits = [];
    while (walker.nextNode()) if (walker.currentNode.nodeValue.toLowerCase().includes(q)) hits.push(walker.currentNode);
    for (const t of hits) {
      const frag = document.createDocumentFragment();
      const s = t.nodeValue;
      let i = 0, j;
      while ((j = s.toLowerCase().indexOf(q, i)) >= 0) {
        frag.append(s.slice(i, j));
        const m = document.createElement('mark');
        m.textContent = s.slice(j, j + q.length);
        frag.append(m);
        i = j + q.length;
      }
      frag.append(s.slice(i));
      t.replaceWith(frag);
    }
  }

  // ---------- Fotos (guardadas no IndexedDB, fora do localStorage) ----------
  const imgDB = (() => {
    let dbp;
    const open = () => dbp || (dbp = new Promise((res, rej) => {
      const r = indexedDB.open('notas-fotos', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('fotos');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    }));
    const tx = async (mode, fn) => {
      const db = await open();
      return new Promise((res, rej) => {
        const t = db.transaction('fotos', mode);
        const out = fn(t.objectStore('fotos'));
        t.oncomplete = () => res(out && 'result' in out ? out.result : undefined);
        t.onerror = () => rej(t.error);
      });
    };
    return {
      put: (id, blob) => tx('readwrite', s => s.put(blob, id)),
      get: id => tx('readonly', s => s.get(id)),
      del: id => tx('readwrite', s => s.delete(id)),
      keys: () => tx('readonly', s => s.getAllKeys())
    };
  })();

  const imgUrls = new Map();
  async function imgUrl(id) {
    if (imgUrls.has(id)) return imgUrls.get(id);
    const blob = await imgDB.get(id).catch(() => null);
    const url = blob ? URL.createObjectURL(blob) : '';
    imgUrls.set(id, url);
    return url;
  }
  // coloca o endereço de cada foto nas tags <img data-img>
  function hydrateImages(root) {
    root.querySelectorAll('img[data-img]:not([src])').forEach(async img => {
      const url = await imgUrl(img.dataset.img);
      if (url) img.src = url; else img.classList.add('missing');
      img.addEventListener('load', () => {
        const body = img.closest('.note-body');
        if (body && body.scrollHeight > body.clientHeight + 2) body.classList.add('clip');
      }, { once: true });
    });
  }

  // reduz a foto (no máximo 1600px, JPEG) para ocupar pouco espaço
  function compressImage(file, max = 1600, quality = 0.82) {
    return new Promise((res, rej) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement('canvas');
        c.width = Math.round(img.naturalWidth * scale);
        c.height = Math.round(img.naturalHeight * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(b => (b ? res(b) : rej(new Error('falhou'))), 'image/jpeg', quality);
      };
      img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('imagem inválida')); };
      img.src = url;
    });
  }

  async function insertPhotos(target, files) {
    let added = 0;
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const blob = await compressImage(file);
        const id = uid();
        await imgDB.put(id, blob);
        restoreSelection(target);
        document.execCommand('insertHTML', false, `<img data-img="${id}" alt=""><br>`);
        added++;
      } catch { toast('Não consegui adicionar uma das fotos'); }
    }
    if (added) {
      hydrateImages(target);
      target.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  // ---------- Escrever com o dedo direto na nota (junto com o texto) ----------
  const PEN_COLORS = ['#111111', '#ffffff', '#d32f2f', '#ef6c00', '#2e7d32', '#1565c0', '#6a1b9a', '#ad1457'];
  const PEN_SIZES = [[2, 'Fino'], [4, 'Médio'], [7, 'Grosso']];
  const INK_START_H = 200;

  const ink = (() => {
    // área transparente que fica por cima de um espaço aberto no meio do texto
    const area = document.createElement('div');
    area.className = 'ink-area';
    area.hidden = true;
    const canvas = document.createElement('canvas');
    area.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // barrinha flutuante embaixo da tela (cores, espessura, desfazer, pronto)
    const tools = document.createElement('div');
    tools.className = 'ink-tools';
    tools.hidden = true;
    tools.innerHTML = `
      <div class="ink-row ink-colors"></div>
      <div class="ink-row">
        <span class="ink-sizes"></span>
        <button type="button" class="rt-btn" data-act="more" title="Mais espaço para escrever">↓</button>
        <button type="button" class="rt-btn" data-act="undo" title="Desfazer">↶</button>
        <button type="button" class="rt-btn" data-act="cancel" title="Cancelar">✕</button>
        <button type="button" class="btn primary ink-done" data-act="ok">Pronto</button>
      </div>`;
    document.body.appendChild(tools);

    let strokes = [], current = null, color = PEN_COLORS[0], size = 4;
    let spot = null, target = null, host = null, height = INK_START_H;

    const colorsEl = tools.querySelector('.ink-colors');
    const paintSel = () => {
      colorsEl.querySelectorAll('.swatch').forEach(s => s.classList.toggle('selected', s.dataset.c === color));
      tools.querySelectorAll('.size-btn').forEach(b => b.classList.toggle('selected', +b.dataset.s === size));
    };
    for (const c of PEN_COLORS) {
      const s = document.createElement('button');
      s.type = 'button'; s.className = 'swatch'; s.style.background = c; s.dataset.c = c; s.title = c;
      s.addEventListener('click', () => { color = c; paintSel(); });
      colorsEl.appendChild(s);
    }
    const custom = document.createElement('label');
    custom.className = 'swatch swatch-custom'; custom.title = 'Outra cor';
    const ci = document.createElement('input'); ci.type = 'color';
    ci.addEventListener('change', () => { color = ci.value; paintSel(); });
    custom.appendChild(ci); colorsEl.appendChild(custom);
    for (const [s, label] of PEN_SIZES) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'rt-btn size-btn'; b.dataset.s = s; b.title = label;
      b.innerHTML = `<span style="width:${s + 4}px;height:${s + 4}px"></span>`;
      b.addEventListener('click', () => { size = s; paintSel(); });
      tools.querySelector('.ink-sizes').appendChild(b);
    }

    function place() {
      if (!spot) return;
      spot.style.height = height + 'px';
      const hr = host.getBoundingClientRect(), sr = spot.getBoundingClientRect();
      area.style.left = (sr.left - hr.left) + 'px';
      area.style.top = (sr.top - hr.top) + 'px';
      area.style.width = sr.width + 'px';
      area.style.height = height + 'px';
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(sr.width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = sr.width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      redraw();
    }
    function drawStroke(c, st) {
      const p = st.points;
      c.strokeStyle = st.color; c.fillStyle = st.color;
      c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = st.size;
      if (p.length === 1) { c.beginPath(); c.arc(p[0].x, p[0].y, st.size / 2, 0, Math.PI * 2); c.fill(); return; }
      c.beginPath();
      c.moveTo(p[0].x, p[0].y);
      for (let i = 1; i < p.length - 1; i++) {
        const mx = (p[i].x + p[i + 1].x) / 2, my = (p[i].y + p[i + 1].y) / 2;
        c.quadraticCurveTo(p[i].x, p[i].y, mx, my);
      }
      const last = p[p.length - 1];
      c.lineTo(last.x, last.y);
      c.stroke();
    }
    function redraw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      strokes.forEach(st => drawStroke(ctx, st));
    }
    const pos = e => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    canvas.addEventListener('pointerdown', e => {
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      current = { color, size, points: [pos(e)] };
      strokes.push(current);
      redraw();
    });
    canvas.addEventListener('pointermove', e => {
      if (!current) return;
      e.preventDefault();
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      for (const ev of evs) current.points.push(pos(ev));
      redraw();
    });
    const end = () => { current = null; };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);

    // mantém a largura toda (a letra fica na mesma posição em que foi escrita)
    // e corta só o espaço vazio em cima e embaixo; fundo transparente
    function exportPng() {
      if (!strokes.length) return Promise.resolve(null);
      let minY = Infinity, maxY = -Infinity;
      for (const st of strokes) for (const p of st.points) {
        minY = Math.min(minY, p.y - st.size); maxY = Math.max(maxY, p.y + st.size);
      }
      minY = Math.max(0, minY - 6); maxY = Math.min(height, maxY + 6);
      const width = parseFloat(canvas.style.width), scale = 2;
      const out = document.createElement('canvas');
      out.width = Math.round(width * scale);
      out.height = Math.max(1, Math.round((maxY - minY) * scale));
      const c = out.getContext('2d');
      c.setTransform(scale, 0, 0, scale, 0, -minY * scale);
      strokes.forEach(st => drawStroke(c, st));
      return new Promise(res => out.toBlob(res, 'image/png'));
    }

    function close() {
      area.hidden = true; tools.hidden = true;
      document.body.classList.remove('inking');
      if (target) target.contentEditable = 'true';
      window.removeEventListener('resize', place);
      strokes = []; current = null; spot = null;
    }

    tools.addEventListener('click', async e => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      const act = b.dataset.act;
      if (act === 'undo') { strokes.pop(); redraw(); }
      else if (act === 'more') { height += 160; place(); }
      else if (act === 'cancel') {
        if (strokes.length && !confirm('Descartar o que escreveu?')) return;
        if (spot) spot.remove();
        close();
      } else if (act === 'ok') {
        const blob = await exportPng();
        const s = spot, t = target;
        if (!blob) { s.remove(); close(); return; }
        try {
          const id = 'desenho' + uid();
          await imgDB.put(id, blob);
          const img = document.createElement('img');
          img.setAttribute('data-img', id);
          img.alt = '';
          s.replaceWith(img);
          close();
          hydrateImages(t);
          t.dispatchEvent(new Event('input', { bubbles: true }));
        } catch { toast('Não consegui salvar'); s.remove(); close(); }
      }
    });

    return {
      open(editable, bg) {
        if (spot) return;
        target = editable;
        host = editable.closest('.editor-inner') || editable.parentElement;
        if (!area.parentElement || area.parentElement !== host) host.appendChild(area);
        // abre um espaço no ponto do cursor (ou no fim do texto)
        restoreSelection(target);
        const sel = document.getSelection();
        const r = sel.getRangeAt(0);
        r.collapse(false);
        spot = document.createElement('div');
        spot.className = 'ink-spot';
        spot.contentEditable = 'false';
        r.insertNode(spot);
        target.contentEditable = 'false'; // sem teclado enquanto escreve com o dedo
        if (document.activeElement) document.activeElement.blur();
        height = INK_START_H;
        strokes = [];
        color = bg && luminance(bg) < 0.3 ? '#ffffff' : '#111111';
        paintSel();
        area.hidden = false; tools.hidden = false;
        document.body.classList.add('inking');
        requestAnimationFrame(() => { place(); spot.scrollIntoView({ block: 'center', behavior: 'smooth' }); });
        window.addEventListener('resize', place);
      }
    };
  })();

  async function insertImageBlob(target, blob, prefix = '') {
    const id = prefix + uid();
    await imgDB.put(id, blob);
    restoreSelection(target);
    document.execCommand('insertHTML', false, `<img data-img="${id}" alt=""><br>`);
    hydrateImages(target);
    target.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function noteImageIds(n) { return [...(n.html || '').matchAll(/data-img="([a-z0-9]+)"/gi)].map(m => m[1]); }

  // apaga fotos que nenhuma nota usa mais (roda ao abrir o app)
  async function cleanupImages() {
    try {
      const used = new Set(notes.flatMap(noteImageIds));
      const keys = await imgDB.keys();
      for (const k of keys) if (!used.has(k)) await imgDB.del(k);
    } catch { /* ignora */ }
  }

  function blobToDataUrl(blob) {
    return new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(blob); });
  }
  async function dataUrlToBlob(url) { return (await fetch(url)).blob(); }

  // guarda a última seleção dentro de um campo formatado
  let savedRange = null;
  let savedEditable = null;
  document.addEventListener('selectionchange', () => {
    const sel = document.getSelection();
    if (!sel || !sel.rangeCount) return;
    const r = sel.getRangeAt(0);
    const host = r.commonAncestorContainer.nodeType === 1 ? r.commonAncestorContainer : r.commonAncestorContainer.parentElement;
    const ed = host && host.closest && host.closest('.rich');
    if (ed) {
      savedRange = r.cloneRange(); savedEditable = ed;
      if (!r.collapsed) hideKeyboard(ed);
    }
  });

  // Com texto selecionado o teclado fica escondido (para ver a barra de formatação).
  // Ao tocar de novo no texto para escrever, o teclado volta.
  let refocusing = false;
  function hideKeyboard(ed) {
    if (ed.inputMode === 'none' || refocusing) return;
    ed.inputMode = 'none';
    if (document.activeElement === ed) {
      // o iOS só aplica o inputmode ao focar de novo
      const keep = savedRange && savedRange.cloneRange();
      refocusing = true;
      ed.blur();
      ed.focus({ preventScroll: true });
      if (keep) { const s = document.getSelection(); s.removeAllRanges(); s.addRange(keep); }
      setTimeout(() => { refocusing = false; }, 0);
    }
  }
  function showKeyboard(ed) {
    if (ed.inputMode !== 'none') return;
    ed.inputMode = '';
    const sel = document.getSelection();
    const keep = sel && sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
    refocusing = true;
    ed.blur();
    ed.focus({ preventScroll: true }); // dentro do toque: o teclado abre
    if (keep) { sel.removeAllRanges(); sel.addRange(keep); }
    setTimeout(() => { refocusing = false; }, 0);
  }

  function restoreSelection(target) {
    if (savedEditable !== target || !savedRange) {
      // sem seleção: coloca o cursor no fim
      target.focus();
      const r = document.createRange();
      r.selectNodeContents(target);
      r.collapse(false);
      savedRange = r; savedEditable = target;
    } else {
      target.focus({ preventScroll: true });
    }
    const sel = document.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRange);
  }

  function format(target, cmd, value) {
    restoreSelection(target);
    try { document.execCommand('styleWithCSS', false, true); } catch { /* ignora */ }
    document.execCommand(cmd, false, value);
    target.dispatchEvent(new Event('input', { bubbles: true }));
  }

  const HILITE_COLORS = ['#fff176', '#a5d6a7', '#90caf9', '#f48fb1', '#ffcc80', '#ce93d8'];

  function buildToolbar(bar) {
    const target = document.getElementById(bar.dataset.target);
    bar.innerHTML = '';
    const btn = (label, title, onClick, html) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rt-btn';
      b.title = title;
      b.setAttribute('aria-label', title);
      if (html) b.innerHTML = label; else b.textContent = label;
      b.addEventListener('mousedown', e => e.preventDefault()); // não perde a seleção
      b.addEventListener('click', onClick);
      bar.appendChild(b);
      return b;
    };
    const sep = () => { const s = document.createElement('span'); s.className = 'rt-sep'; bar.appendChild(s); };

    btn('<b>B</b>', 'Negrito', () => format(target, 'bold'), true);
    btn('<i>I</i>', 'Itálico', () => format(target, 'italic'), true);
    btn('<u>U</u>', 'Sublinhado', () => format(target, 'underline'), true);
    sep();
    const colorBtn = btn('A<span class="bar"></span>', 'Cor da letra do trecho selecionado', () => toggle(colorPal, colorBtn), true);
    const fontBtn = btn('<span style="font-family:Georgia,serif">Aa</span>', 'Fonte do trecho selecionado', () => toggle(fontPal, fontBtn), true);
    const hiBtn = btn('🖍', 'Marca-texto', () => toggle(hiPal, hiBtn));
    btn('⌫', 'Limpar formatação do trecho', () => format(target, 'removeFormat'));
    sep();
    const photoInput = document.createElement('input');
    photoInput.type = 'file';
    photoInput.accept = 'image/*';
    photoInput.multiple = true;
    photoInput.hidden = true;
    photoInput.addEventListener('change', () => {
      const files = [...photoInput.files];
      photoInput.value = '';
      if (files.length) insertPhotos(target, files);
    });
    bar.appendChild(photoInput);
    btn('📷', 'Adicionar foto', () => photoInput.click());
    btn('✍️', 'Escrever com o dedo', () => {
      const n = current();
      ink.open(target, n && n.color ? n.color : '');
    });

    const palette = (label, colors, apply, extra) => {
      const p = document.createElement('div');
      p.className = 'rt-palette';
      p.hidden = true;
      const span = document.createElement('span');
      span.textContent = label;
      p.appendChild(span);
      for (const c of colors) {
        const s = document.createElement('button');
        s.type = 'button';
        s.className = 'swatch';
        s.style.background = c;
        s.title = c;
        s.addEventListener('mousedown', e => e.preventDefault());
        s.addEventListener('click', () => apply(c));
        p.appendChild(s);
      }
      if (extra) extra(p);
      const custom = document.createElement('label');
      custom.className = 'swatch swatch-custom';
      custom.title = 'Outra cor';
      const input = document.createElement('input');
      input.type = 'color';
      input.addEventListener('change', () => apply(input.value));
      custom.appendChild(input);
      p.appendChild(custom);
      bar.appendChild(p);
      return p;
    };
    const colorPal = palette('Cor:', TEXT_COLORS.filter(Boolean), c => format(target, 'foreColor', c));
    const hiPal = palette('Marca-texto:', HILITE_COLORS, c => format(target, 'hiliteColor', c), p => {
      const none = document.createElement('button');
      none.type = 'button';
      none.className = 'swatch none';
      none.title = 'Sem marca-texto';
      none.addEventListener('mousedown', e => e.preventDefault());
      none.addEventListener('click', () => format(target, 'hiliteColor', 'transparent'));
      p.appendChild(none);
    });
    const hint = document.createElement('span');
    hint.className = 'rt-hint';
    hint.textContent = 'Selecione uma palavra ou linha e escolha.';
    hint.hidden = true;
    bar.appendChild(hint);

    // fontes: cada botão mostra o nome escrito na própria fonte
    const fontPal = document.createElement('div');
    fontPal.className = 'rt-palette rt-fonts';
    fontPal.hidden = true;
    const fl = document.createElement('span');
    fl.textContent = 'Fonte:';
    fontPal.appendChild(fl);
    for (const [value, label] of [['inherit', 'Padrão da nota'], ...FONTS]) {
      const f = document.createElement('button');
      f.type = 'button';
      f.className = 'font-chip';
      f.textContent = label.replace(/ \(.*\)$/, '');
      if (value !== 'inherit') f.style.fontFamily = value;
      f.addEventListener('mousedown', e => e.preventDefault());
      f.addEventListener('click', () => format(target, 'fontName', value));
      fontPal.appendChild(f);
    }
    bar.insertBefore(fontPal, hint);

    function toggle(pal, b) {
      const open = pal.hidden;
      [colorPal, hiPal, fontPal].forEach(x => { x.hidden = true; });
      [colorBtn, hiBtn, fontBtn].forEach(x => x.classList.remove('open'));
      pal.hidden = !open;
      hint.hidden = !open;
      b.classList.toggle('open', open);
    }
  }

  function setupRich(el) {
    // colar sempre como texto simples (evita lixo de outros apps)
    el.addEventListener('paste', e => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text/plain');
      document.execCommand('insertText', false, text);
    });
    // tocou no texto (sem seleção) depois de formatar: volta o teclado
    el.addEventListener('click', () => {
      const sel = document.getSelection();
      if (sel && sel.rangeCount && sel.getRangeAt(0).collapsed) showKeyboard(el);
    });
    el.addEventListener('blur', () => { if (!refocusing) el.inputMode = ''; });
    // mantém o placeholder funcionando quando o campo fica vazio
    el.addEventListener('input', () => {
      if (!el.textContent.trim() && !el.querySelector('li')) el.innerHTML = '';
    });
  }

  $$('.rt-toolbar').forEach(buildToolbar);

  // ---------- Notas ----------
  function buildSwatches(container, current, onPick, palette = NOTE_COLORS, isText = false) {
    const rebuild = c => buildSwatches(container, c, onPick, palette, isText);
    container.innerHTML = '';
    for (const c of palette) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'swatch' + (isText ? ' text-swatch' : '') + (c ? '' : (isText ? ' auto' : ' none')) + (c === current ? ' selected' : '');
      if (isText) {
        b.textContent = c ? 'A' : 'auto';
        if (c) { b.style.color = c; if (luminance(c) > 0.6) b.style.background = '#333'; }
      }
      else if (c) b.style.background = c;
      b.title = c || (isText ? 'Automática' : 'Sem cor');
      b.setAttribute('aria-label', b.title);
      b.addEventListener('click', () => { onPick(c); rebuild(c); });
      container.appendChild(b);
    }
    const custom = document.createElement('label');
    custom.className = 'swatch swatch-custom' + (current && !palette.includes(current) ? ' selected' : '');
    custom.title = 'Cor personalizada';
    const input = document.createElement('input');
    input.type = 'color';
    input.value = current && current.startsWith('#') ? current : (isText ? '#000000' : '#ffffff');
    input.addEventListener('change', () => { onPick(input.value); rebuild(input.value); });
    custom.appendChild(input);
    container.appendChild(custom);
  }

  function noteTextColor(n) { return n.textColor || (n.color ? readableOn(n.color) : ''); }
  // título "auto" = mesma cor do texto
  function noteTitleColor(n) { return n.titleColor || noteTextColor(n); }

  // ---------- Nova nota (botão +) ----------
  $('#btnNew').addEventListener('click', () => {
    const now = Date.now();
    const n = { id: uid(), title: '', body: '', html: '', color: '', textColor: '', titleColor: '', font: '', pinned: false, created: now, updated: now };
    notes.unshift(n);
    saveNotes();
    openEditor(n.id, true);
  });

  $('#search').addEventListener('input', e => { query = e.target.value.trim().toLowerCase(); render(); });

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }
  function highlight(text) {
    const safe = escapeHtml(text);
    if (!query) return safe;
    const q = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return safe.replace(new RegExp(q, 'gi'), m => `<mark>${m}</mark>`);
  }
  const dateFmt = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

  function render() {
    const list = notes
      .filter(n => filter !== 'pinned' || n.pinned)
      .filter(n => n.id !== editingId || n.title.trim() || n.body.trim()) // nota nova ainda vazia não aparece
      .filter(n => !query || (n.title + ' ' + n.body).toLowerCase().includes(query))
      .sort((a, b) => (b.pinned - a.pinned) || (b.updated - a.updated));

    const el = $('#notes');
    el.innerHTML = '';
    for (const n of list) {
      const card = document.createElement('article');
      card.className = 'note card';
      card.tabIndex = 0;
      if (n.color) {
        card.style.background = rgba(n.color, Math.max(theme.cardOpacity, 0.85));
      }
      if (noteTextColor(n)) card.style.color = noteTextColor(n);
      if (n.font) card.style.setProperty('--note-font', n.font);
      card.innerHTML = `
        <button class="pin ${n.pinned ? 'on' : ''}" title="${n.pinned ? 'Desafixar' : 'Fixar'}" aria-label="Fixar">📌</button>
        ${n.title ? `<h3${n.titleColor ? ` style="color:${escapeHtml(n.titleColor)}"` : ''}>${highlight(n.title)}</h3>` : ''}
        ${n.body.trim() ? `<div class="note-body">${noteHtml(n)}</div>` : ''}
        <span class="date">${dateFmt.format(n.updated)}</span>`;
      const bodyEl = card.querySelector('.note-body');
      if (bodyEl) markMatches(bodyEl, query);
      card.querySelector('.pin').addEventListener('click', e => {
        e.stopPropagation();
        n.pinned = !n.pinned;
        saveNotes(); render();
      });
      card.addEventListener('click', () => openEditor(n.id));
      card.addEventListener('keydown', e => { if (e.key === 'Enter') openEditor(n.id); });
      el.appendChild(card);
      if (bodyEl && bodyEl.scrollHeight > bodyEl.clientHeight + 2) bodyEl.classList.add('clip');
    }
    hydrateImages(el);
    $('#empty').hidden = list.length > 0;
    $('#empty').textContent = list.length || !query ? 'Nenhuma nota ainda. Toque no + para criar a primeira ✍️' : 'Nenhuma nota encontrada.';
  }

  // ---------- Editor ----------
  const editor = $('#editor');
  const editTitle = $('#editTitle');
  const editBody = $('#editBody');
  const editFont = $('#editFont');

  function current() { return notes.find(n => n.id === editingId); }

  function paintEditor(n) {
    const inner = $('.editor-inner', editor);
    inner.style.background = n.color ? n.color : '';
    editor.style.background = n.color ? n.color : '';
    $('.editor-actions', editor).style.background = n.color ? n.color : '';
    inner.style.color = noteTextColor(n);
    editTitle.style.color = noteTitleColor(n);
    const uiColor = n.color ? readableOn(n.color) : '';
    $$('.editor-opts, .editor-actions, #editMeta', editor).forEach(el => { el.style.color = uiColor; });
    editBody.style.fontFamily = n.font || '';
    const dot = $('#dotNote');
    dot.style.background = n.color || '';
    dot.classList.toggle('none', !n.color);
    $('#dotTitle').style.color = noteTitleColor(n) || 'var(--text)';
    $('#dotText').style.color = noteTextColor(n) || 'var(--text)';
    $('#btnPin').textContent = n.pinned ? '📌 Desafixar' : '📌 Fixar';
    $('#editMeta').textContent = `Criada em ${dateFmt.format(n.created)} · Editada em ${dateFmt.format(n.updated)}`;
  }

  function openEditor(id, isNew = false) {
    editingId = id;
    const n = current();
    if (!n) return;
    editTitle.value = n.title;
    editBody.innerHTML = noteHtml(n);
    hydrateImages(editBody);
    editFont.value = n.font || '';
    closeOptPanels();
    buildSwatches($('#editSwatches'), n.color, c => { n.color = c; touch(n); paintEditor(n); });
    buildSwatches($('#editTitleSwatches'), n.titleColor || '', c => { n.titleColor = c; touch(n); paintEditor(n); }, TEXT_COLORS, true);
    buildSwatches($('#editTextSwatches'), n.textColor || '', c => { n.textColor = c; touch(n); paintEditor(n); }, TEXT_COLORS, true);
    paintEditor(n);
    // o editor vira a página (sem janela flutuante): no iPhone o cursor fica no lugar certo
    if (!editor.open) listScroll = window.scrollY;
    document.body.classList.add('editing');
    if (!editor.open) editor.show();
    window.scrollTo(0, 0);
    // nota salva abre sem teclado: o foco fica no botão Voltar.
    // O teclado só aparece quando tocar no título ou no texto.
    if (isNew) editTitle.focus();
    else $('#btnBack').focus({ preventScroll: true });
  }
  // botões "Cor da nota / do título / do texto": cada um abre as próprias opções
  function closeOptPanels() {
    $$('.opt-panel', editor).forEach(p => { p.hidden = true; });
    $$('.opt-btn', editor).forEach(b => b.setAttribute('aria-expanded', 'false'));
  }
  $$('.opt-btn', editor).forEach(b => b.addEventListener('click', () => {
    const panel = document.getElementById(b.dataset.panel);
    const open = panel.hidden;
    closeOptPanels();
    panel.hidden = !open;
    b.setAttribute('aria-expanded', String(open));
  }));

  let listScroll = 0;
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && editor.open) editor.close(); });

  function touch(n) { n.updated = Date.now(); saveNotes(); render(); }

  editTitle.addEventListener('input', () => { const n = current(); if (n) { n.title = editTitle.value; touch(n); } });
  setupRich(editBody);
  editBody.addEventListener('input', () => {
    const n = current(); if (!n) return;
    n.html = sanitizeHtml(editBody.innerHTML);
    n.body = htmlToText(n.html);
    touch(n);
  });
  editFont.addEventListener('change', () => { const n = current(); if (n) { n.font = editFont.value; touch(n); paintEditor(n); } });
  $('#btnPin').addEventListener('click', () => { const n = current(); if (n) { n.pinned = !n.pinned; touch(n); paintEditor(n); } });
  $('#btnDuplicate').addEventListener('click', () => {
    const n = current(); if (!n) return;
    const now = Date.now();
    const copyNote = { ...n, id: uid(), title: n.title ? n.title + ' (cópia)' : '', pinned: false, created: now, updated: now };
    notes.unshift(copyNote);
    saveNotes(); render();
    openEditor(copyNote.id);
    toast('Nota duplicada');
  });
  $('#btnDelete').addEventListener('click', () => {
    const idx = notes.findIndex(n => n.id === editingId);
    if (idx < 0) return;
    const [removed] = notes.splice(idx, 1);
    saveNotes(); render();
    editor.close();
    toast('Nota excluída', 'Desfazer', () => { notes.splice(idx, 0, removed); saveNotes(); render(); });
  });
  editor.addEventListener('close', () => {
    const n = current();
    if (n && !n.title.trim() && !n.body.trim()) { notes = notes.filter(x => x !== n); saveNotes(); render(); }
    editingId = null;
    document.body.classList.remove('editing');
    window.scrollTo(0, listScroll);
  });

  // ---------- Toast ----------
  let toastTimer;
  function toast(msg, actionLabel, action) {
    const t = $('#toast');
    t.innerHTML = '';
    t.append(document.createTextNode(msg));
    if (actionLabel) {
      const b = document.createElement('button');
      b.textContent = actionLabel;
      b.addEventListener('click', () => { action(); t.hidden = true; });
      t.append(b);
    }
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 4500);
  }

  // ---------- Compartilhar ----------
  function appUrl() { return location.origin + location.pathname.replace(/index\.html$/, ''); }

  async function copy(text, okMsg) {
    try { await navigator.clipboard.writeText(text); toast(okMsg || 'Copiado!'); }
    catch { prompt('Copie o link:', text); }
  }

  function loadQrLib() {
    if (window.QRCode) return Promise.resolve();
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  $('#btnShare').addEventListener('click', async () => {
    const url = appUrl();
    $('#shareUrl').value = url;
    const qr = $('#qr');
    qr.innerHTML = '';
    $('#shareDialog').showModal();
    try {
      await loadQrLib();
      new window.QRCode(qr, { text: url, width: 200, height: 200, correctLevel: window.QRCode.CorrectLevel.M });
    } catch { qr.textContent = ''; }
  });
  $('#btnCopy').addEventListener('click', async () => {
    const url = $('#shareUrl').value;
    if (navigator.share) {
      try { await navigator.share({ title: theme.appTitle, text: 'Instale este app de notas personalizável:', url }); return; }
      catch (e) { if (e.name === 'AbortError') return; }
    }
    copy(url, 'Link copiado!');
  });
  if (navigator.share) $('#btnCopy').textContent = 'Enviar';

  // ---------- Instalação PWA ----------
  let deferredPrompt = null;
  const btnInstall = $('#btnInstall');
  const isStandalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    btnInstall.hidden = false;
  });
  if (isIos && !isStandalone) btnInstall.hidden = false;

  btnInstall.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') btnInstall.hidden = true;
      deferredPrompt = null;
    } else if (isIos) {
      $('#iosDialog').showModal();
    }
  });
  window.addEventListener('appinstalled', () => { btnInstall.hidden = true; toast('App instalado! 🎉'); });

  // iOS (app instalado): garante que tocar num campo abre o teclado
  let touchMoved = false;
  document.addEventListener('touchstart', () => { touchMoved = false; }, { passive: true });
  document.addEventListener('touchmove', () => { touchMoved = true; }, { passive: true });
  document.addEventListener('touchend', e => {
    if (touchMoved) return;
    const el = e.target.closest && e.target.closest('input:not([type=checkbox]):not([type=range]):not([type=color]):not([type=file]), textarea');
    if (el && document.activeElement !== el && !el.disabled) el.focus();
  }, { passive: true });

  setTimeout(cleanupImages, 3000);

  // ---------- Versão e "Atualizar app" ----------
  const APP_VERSION = 16;
  $('#appVersion').textContent = 'Versão ' + APP_VERSION;
  if (/[?&]v=/.test(location.search)) history.replaceState(null, '', location.pathname);
  $('#btnUpdate').addEventListener('click', async () => {
    toast('Atualizando…');
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
      if (window.caches) {
        const keys = await caches.keys();
        await Promise.all(keys.filter(k => k.startsWith('notas-')).map(k => caches.delete(k)));
      }
    } catch { /* segue mesmo assim */ }
    // suas notas e o tema ficam salvos: só os arquivos do app são baixados de novo
    location.replace(location.pathname + '?v=' + Date.now());
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(reg => {
        reg.update();
        // no iPhone o app volta do segundo plano sem recarregar: procura versão nova ao voltar
        document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update().catch(() => {}); });
      }).catch(() => {});
    });
    // quando sai uma versão nova, recarrega uma vez para aplicar
    let reloaded = false;
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || reloaded) return;
      const active = document.activeElement;
      if (active && /INPUT|TEXTAREA/.test(active.tagName)) return; // não interrompe quem está digitando
      reloaded = true;
      location.reload();
    });
  }

  // Sincroniza entre abas
  window.addEventListener('storage', e => {
    if (e.key === NOTES_KEY) { notes = store.get(NOTES_KEY, []); render(); }
    if (e.key === THEME_KEY) { theme = { ...DEFAULT_THEME, ...store.get(THEME_KEY, {}) }; applyTheme(); render(); }
  });

  applyTheme();
  render();
})();
