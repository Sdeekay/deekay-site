// ============================================================
// Tweaks — aggressive design knobs for Deekay Consulting
// ============================================================
(() => {
  const DEFAULTS = {
    theme: 'navy',
    light: false,
    layout: 'grid',           // grid | bento | rows
    headline: 'sans',         // sans | serif
    cardfx: 'lift',           // lift | tilt | glow | invert
    cursor: 'default',        // default | dot
    radius: 22,
    density: 96,
    textScale: 1.0,
    glassBlur: 16,
    glassOpacity: 0.06,
    grain: 0.4,
    orbSize: 78,
    orbHue: 0,
    orbBands: true,
    mist: true,
    accentH: 205,
    accentC: 0.05,
    accentL: 78,
  };

  const THEMES = [
    { id: 'navy',     label: 'Navy',     bg: '#1B2A4A', a: '#A8C5DA' },
    { id: 'midnight', label: 'Midnight', bg: '#0E1024', a: '#9D8FFF' },
    { id: 'forest',   label: 'Forest',   bg: '#15291F', a: '#C7D984' },
    { id: 'claret',   label: 'Claret',   bg: '#2A1310', a: '#E8B190' },
    { id: 'sand',     label: 'Sand',     bg: '#F2EBDB', a: '#9C5A2D' },
    { id: 'paper',    label: 'Paper',    bg: '#FAF7F0', a: '#B53A1F' },
  ];

  const state = { ...DEFAULTS };

  // ---- DOM scaffold ----
  const toggle = document.createElement('button');
  toggle.id = 'tweaks-toggle';
  toggle.title = 'Tweaks';
  toggle.innerHTML = '◐';

  const panel = document.createElement('aside');
  panel.id = 'tweaks-panel';
  panel.innerHTML = `
    <div class="tw-head">
      <b>Tweaks</b>
      <button class="reset" type="button">Reset</button>
    </div>
    <div class="tw-body">

      <div class="tw-section">Thème</div>
      <div class="tw-swatches" id="tw-themes"></div>

      <div class="tw-row tw-toggle">
        <span>Mode clair</span>
        <button class="switch" data-key="light" type="button"></button>
      </div>

      <div class="tw-section">Mise en page</div>
      <div class="tw-row">
        <div class="tw-lbl"><span>Layout services</span></div>
        <div class="tw-seg" data-key="layout">
          <button data-v="grid">Grille</button>
          <button data-v="bento">Bento</button>
          <button data-v="rows">Lignes</button>
        </div>
      </div>
      <div class="tw-row">
        <div class="tw-lbl"><span>Titres</span></div>
        <div class="tw-seg" data-key="headline">
          <button data-v="sans">Sans</button>
          <button data-v="serif">Serif italique</button>
        </div>
      </div>
      <div class="tw-row">
        <div class="tw-lbl"><span>Hover cartes</span></div>
        <div class="tw-seg" data-key="cardfx">
          <button data-v="lift">Lift</button>
          <button data-v="tilt">Tilt</button>
          <button data-v="glow">Glow</button>
          <button data-v="invert">Invert</button>
        </div>
      </div>

      <div class="tw-section">Densité &amp; rythme</div>
      <div class="tw-row">
        <div class="tw-lbl"><span>Rayon des cartes</span><span data-out="radius"></span></div>
        <input type="range" data-key="radius" min="0" max="36" step="1">
      </div>
      <div class="tw-row">
        <div class="tw-lbl"><span>Espacement section</span><span data-out="density"></span></div>
        <input type="range" data-key="density" min="40" max="200" step="4">
      </div>
      <div class="tw-row">
        <div class="tw-lbl"><span>Échelle de typo</span><span data-out="textScale"></span></div>
        <input type="range" data-key="textScale" min="0.85" max="1.4" step="0.01">
      </div>

      <div class="tw-section">Glassmorphism</div>
      <div class="tw-row">
        <div class="tw-lbl"><span>Flou (blur)</span><span data-out="glassBlur"></span></div>
        <input type="range" data-key="glassBlur" min="0" max="40" step="1">
      </div>
      <div class="tw-row">
        <div class="tw-lbl"><span>Opacité surface</span><span data-out="glassOpacity"></span></div>
        <input type="range" data-key="glassOpacity" min="0" max="0.25" step="0.005">
      </div>
      <div class="tw-row">
        <div class="tw-lbl"><span>Grain</span><span data-out="grain"></span></div>
        <input type="range" data-key="grain" min="0" max="1" step="0.05">
      </div>

      <div class="tw-section">Orbe</div>
      <div class="tw-row">
        <div class="tw-lbl"><span>Taille orbe</span><span data-out="orbSize"></span></div>
        <input type="range" data-key="orbSize" min="30" max="100" step="1">
      </div>
      <div class="tw-row">
        <div class="tw-lbl"><span>Teinte orbe</span><span data-out="orbHue"></span></div>
        <input type="range" data-key="orbHue" min="-180" max="180" step="1">
      </div>
      <div class="tw-row tw-toggle">
        <span>Bandes pearlescentes</span>
        <button class="switch" data-key="orbBands" type="button"></button>
      </div>
      <div class="tw-row tw-toggle">
        <span>Brume / particules</span>
        <button class="switch" data-key="mist" type="button"></button>
      </div>

      <div class="tw-section">Couleur accent</div>
      <div class="tw-row">
        <div class="tw-lbl"><span>Teinte</span><span data-out="accentH"></span></div>
        <input type="range" data-key="accentH" min="0" max="360" step="1">
      </div>
      <div class="tw-row">
        <div class="tw-lbl"><span>Saturation</span><span data-out="accentC"></span></div>
        <input type="range" data-key="accentC" min="0" max="0.25" step="0.005">
      </div>
      <div class="tw-row">
        <div class="tw-lbl"><span>Luminosité</span><span data-out="accentL"></span></div>
        <input type="range" data-key="accentL" min="40" max="95" step="1">
      </div>

      <div class="tw-section">Effets</div>
      <div class="tw-row">
        <div class="tw-lbl"><span>Curseur</span></div>
        <div class="tw-seg" data-key="cursor">
          <button data-v="default">Default</button>
          <button data-v="dot">Cercle suiveur</button>
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(toggle);
  document.body.appendChild(panel);

  // Custom cursor element
  const cursor = document.createElement('div');
  cursor.className = 'tw-cursor';
  document.body.appendChild(cursor);
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .card')) cursor.classList.add('is-hover');
    else cursor.classList.remove('is-hover');
  });

  // ---- Theme swatches ----
  const themesEl = panel.querySelector('#tw-themes');
  THEMES.forEach(t => {
    const s = document.createElement('button');
    s.className = 'tw-swatch';
    s.dataset.theme = t.id;
    s.title = t.label;
    s.style.background = `linear-gradient(135deg, ${t.bg} 0 50%, ${t.a} 50% 100%)`;
    themesEl.appendChild(s);
  });

  // ---- Apply state to DOM ----
  function apply() {
    const root = document.documentElement;
    root.dataset.theme = state.theme;
    root.dataset.light = state.light ? '1' : '0';
    root.dataset.layout = state.layout;
    root.dataset.headline = state.headline;
    root.dataset.cardfx = state.cardfx;
    root.dataset.cursor = state.cursor;

    root.style.setProperty('--tw-radius', state.radius + 'px');
    root.style.setProperty('--tw-section-pad', state.density + 'px');
    root.style.setProperty('--tw-text-scale', state.textScale);
    root.style.setProperty('--tw-glass-blur', state.glassBlur + 'px');
    root.style.setProperty('--tw-glass-opacity', state.glassOpacity);
    root.style.setProperty('--tw-grain', state.grain);
    root.style.setProperty('--tw-orb-size', state.orbSize + 'vw');
    root.style.setProperty('--tw-orb-hue', state.orbHue);
    root.style.setProperty('--tw-accent-h', state.accentH);
    root.style.setProperty('--tw-accent-c', state.accentC);
    root.style.setProperty('--tw-accent-l', state.accentL);

    // Theme presets override accent + bg via [data-theme]; only override accent if user moved sliders
    // (For simplicity we let theme set accent via CSS rules and slider = additional override)

    // Orb attrs
    const orbEl = document.querySelector('.orb');
    if (orbEl) {
      orbEl.dataset.bands = state.orbBands ? '1' : '0';
      orbEl.dataset.mist = state.mist ? '1' : '0';
    }

    // Cursor on/off
    cursor.classList.toggle('is-on', state.cursor === 'dot');

    // Update controls UI
    panel.querySelectorAll('.tw-swatch').forEach(s => s.classList.toggle('is-active', s.dataset.theme === state.theme));
    panel.querySelectorAll('.tw-seg').forEach(seg => {
      const k = seg.dataset.key;
      seg.querySelectorAll('button').forEach(b => b.classList.toggle('is-active', b.dataset.v === String(state[k])));
    });
    panel.querySelectorAll('.switch').forEach(sw => {
      const k = sw.dataset.key;
      sw.classList.toggle('is-on', !!state[k]);
    });
    panel.querySelectorAll('input[type="range"]').forEach(r => {
      const k = r.dataset.key;
      r.value = state[k];
      const out = panel.querySelector(`[data-out="${k}"]`);
      if (out) {
        let v = state[k];
        if (k === 'glassOpacity' || k === 'accentC') v = (+v).toFixed(3);
        else if (k === 'textScale') v = (+v).toFixed(2) + '×';
        else if (k === 'grain') v = (+v).toFixed(2);
        else v = Math.round(+v) + (
          k === 'radius' ? 'px' :
          k === 'density' ? 'px' :
          k === 'glassBlur' ? 'px' :
          k === 'orbSize' ? 'vw' :
          k === 'orbHue' ? '°' :
          k === 'accentH' ? '°' :
          k === 'accentL' ? '%' : ''
        );
        out.textContent = v;
      }
    });
  }

  // ---- Wire events ----
  toggle.addEventListener('click', () => panel.classList.toggle('is-open'));

  panel.querySelector('.reset').addEventListener('click', () => {
    Object.assign(state, DEFAULTS);
    apply();
  });

  panel.querySelectorAll('.tw-swatch').forEach(s => {
    s.addEventListener('click', () => { state.theme = s.dataset.theme; apply(); });
  });

  panel.querySelectorAll('.tw-seg').forEach(seg => {
    seg.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => { state[seg.dataset.key] = b.dataset.v; apply(); });
    });
  });

  panel.querySelectorAll('.switch').forEach(sw => {
    sw.addEventListener('click', () => { state[sw.dataset.key] = !state[sw.dataset.key]; apply(); });
  });

  panel.querySelectorAll('input[type="range"]').forEach(r => {
    r.addEventListener('input', () => {
      const k = r.dataset.key;
      const v = +r.value;
      state[k] = v;
      apply();
    });
  });

  apply();
})();
