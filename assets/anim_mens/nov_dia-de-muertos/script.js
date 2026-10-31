(() => {
  'use strict';

  document.body.insertAdjacentHTML('beforeend', `
  <section class="ddm" aria-label="Animación de Día de Muertos: camino de cempasúchil">

    <svg class="ddm-fondo" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="ddm-cielo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#0d0624"/>
          <stop offset=".45" stop-color="#2a0f4a"/>
          <stop offset=".78" stop-color="#5b1f5e"/>
          <stop offset="1" stop-color="#8c3b5a"/>
        </linearGradient>
        <linearGradient id="ddm-suelo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#22103a"/>
          <stop offset="1" stop-color="#0b0416"/>
        </linearGradient>
        <radialGradient id="ddm-luna-brillo">
          <stop offset="0" stop-color="#fff4d6" stop-opacity=".5"/>
          <stop offset="1" stop-color="#fff4d6" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <rect width="1600" height="460" fill="url(#ddm-cielo)"/>
      <g class="ddm-estrellas"></g>

      <circle cx="1010" cy="140" r="130" fill="url(#ddm-luna-brillo)"/>
      <circle cx="1010" cy="140" r="46" fill="#fbf1d3"/>
      <circle cx="996" cy="128" r="8" fill="#e9dcb8" opacity=".7"/>
      <circle cx="1024" cy="152" r="6" fill="#e9dcb8" opacity=".6"/>
      <circle cx="1010" cy="165" r="4" fill="#e9dcb8" opacity=".5"/>

      <path d="M0 400 Q 200 340 400 385 T 800 372 T 1200 382 T 1600 362 V 470 H0 Z" fill="#2a1240"/>
      <g class="ddm-pueblo"></g>
      <path d="M0 432 Q 250 396 520 420 Q 700 434 800 430 Q 950 426 1100 412 Q 1350 390 1600 420 V 900 H0 Z" fill="url(#ddm-suelo)"/>

      <g fill="#0b0416" stroke="#0b0416" stroke-linecap="round">
        <path d="M210 470 v-34 M200 448 h20" stroke-width="5" fill="none"/>
        <path d="M268 478 v-26 a14 14 0 0 1 28 0 v26 z"/>
        <path d="M150 492 v-28 M140 474 h20" stroke-width="5" fill="none"/>
        <path d="M1380 466 v-34 M1370 444 h20" stroke-width="5" fill="none"/>
        <path d="M1300 474 v-24 a13 13 0 0 1 26 0 v24 z"/>
        <path d="M1450 488 v-28 M1440 470 h20" stroke-width="5" fill="none"/>
      </g>
    </svg>

    <div class="ddm-papel" aria-hidden="true"></div>

    <div class="ddm-oscuro" aria-hidden="true"></div>

    <svg class="ddm-camino" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="ddm-luz">
          <stop offset="0" stop-color="#ffbe5a" stop-opacity=".75"/>
          <stop offset="1" stop-color="#ffbe5a" stop-opacity="0"/>
        </radialGradient>
        <filter id="ddm-difuso" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="16"/>
        </filter>
      </defs>
      <path class="ddm-guia" fill="none" stroke="none"
            d="M800 432 C 770 455, 720 470, 735 505 C 750 545, 900 560, 895 625 C 890 700, 640 720, 660 810 C 670 860, 760 900, 790 960"/>
      <g class="ddm-capa-resplandor"></g>
      <g class="ddm-capa-petalos"></g>
      <g class="ddm-capa-velas"></g>
      <g class="ddm-capa-chispas"></g>
      <g class="ddm-capa-personas"></g>
    </svg>
  </section>
  `);

  const NS = 'http://www.w3.org/2000/svg';
  const raiz = document.body.querySelector('.ddm:last-of-type');
  if (!raiz) return;

  const fondo = raiz.querySelector('.ddm-fondo');
  const camino = raiz.querySelector('.ddm-camino');
  const guia = camino.querySelector('.ddm-guia');
  const capa = {
    resplandor: camino.querySelector('.ddm-capa-resplandor'),
    petalos: camino.querySelector('.ddm-capa-petalos'),
    velas: camino.querySelector('.ddm-capa-velas'),
    chispas: camino.querySelector('.ddm-capa-chispas'),
    personas: camino.querySelector('.ddm-capa-personas'),
  };

  const Y_HORIZONTE = 430;
  const Y_FRENTE = 900;
  const ANCHO_MAX = 150;
  const RETRASO_CAMINO = 700;
  const DURACION_DESPLIEGUE = 2600;
  const ESPERA_ENTRE_PERSONAS = [1500, 2700];
  const CADA_FRASE = 7000;

  const FRASES = [
    ['No para siempre en la tierra, sólo un poco aquí.', 'Nezahualcóyotl'],
    ['Como una pintura nos iremos borrando, como una flor nos iremos secando aquí sobre la tierra.', 'Nezahualcóyotl'],
    ['Amo, he sido amado, el sol acarició mi faz. ¡Vida, nada me debes! ¡Vida, estamos en paz!', 'Amado Nervo'],
    ['La muerte es democrática: güera, morena, rica o pobre, toda la gente acaba siendo calavera.', 'Atribuida a José Guadalupe Posada'],
    ['¿Acaso de verdad se vive en la tierra?', 'Nezahualcóyotl'],
    ['Nadie muere del todo mientras se le recuerde.', 'Dicho popular mexicano'],
    ['El cempasúchil marca el camino para que nuestros muertos vuelvan a casa.', 'Tradición mexicana'],
  ];

  const COLORES_PETALO = ['#ff8c00', '#ff9f1c', '#ffa62b', '#f77f00', '#ffb703', '#fb8500', '#e85d04'];
  const COLORES_PAPEL = ['#e6007e', '#ff8c00', '#7b2cbf', '#2bb673', '#ffd23f', '#00a6ed'];
  const DECORACION = ['#ff006e', '#3a86ff', '#ffbe0b', '#8338ec', '#06d6a0', '#fb5607'];
  const HUESO = '#f6f1e4';
  const OSCURO = '#1d1330';

  const TIPOS = ['catrina', 'charro', 'abuela', 'nino', 'catrina', 'charro'];
  const ROPA = {
    catrina: ['#7b2cbf', '#c9184a', '#3a0ca3', '#d00000'],
    charro: ['#111111', '#2b2d42', '#3d0c11'],
    abuela: ['#6a994e', '#264653', '#9d0208', '#5a189a'],
    nino: ['#0077b6', '#e85d04', '#2a9d8f', '#ffb703'],
  };
  const REBOZO = ['#264653', '#6d597a', '#3d405b', '#7f5539'];

  const L = guia.getTotalLength();
  const azar = (a, b) => a + Math.random() * (b - a);
  const elegir = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function el(tag, attrs = {}) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function escalaEn(y) {
    const t = Math.max(0, (y - Y_HORIZONTE) / (Y_FRENTE - Y_HORIZONTE));
    return 0.12 + 0.88 * Math.pow(t, 1.25);
  }

  function puntoYNormal(l) {
    l = Math.max(0, Math.min(L, l));
    const a = guia.getPointAtLength(l);
    const b = guia.getPointAtLength(l + 1 <= L ? l + 1 : l - 1);
    let tx = b.x - a.x, ty = b.y - a.y;
    if (l + 1 > L) { tx = -tx; ty = -ty; }
    const m = Math.hypot(tx, ty) || 1;
    return { x: a.x, y: a.y, nx: -ty / m, ny: tx / m, tx: tx / m, ty: ty / m };
  }

  function decorarFondo() {
    const estrellas = fondo.querySelector('.ddm-estrellas');
    for (let i = 0; i < 120; i++) {
      const c = el('circle', {
        cx: azar(0, 1600).toFixed(1),
        cy: (Math.pow(Math.random(), 1.4) * 400).toFixed(1),
        r: azar(0.6, 1.9).toFixed(2),
        fill: '#ffffff',
        class: 'ddm-estrella',
      });
      c.style.animationDelay = azar(-4, 0).toFixed(2) + 's';
      c.style.animationDuration = azar(2, 4.5).toFixed(2) + 's';
      estrellas.appendChild(c);
    }
    const pueblo = fondo.querySelector('.ddm-pueblo');
    for (let i = 0; i < 40; i++) {
      const c = el('circle', {
        cx: azar(0, 1600).toFixed(1),
        cy: azar(392, 428).toFixed(1),
        r: azar(1, 2.2).toFixed(2),
        fill: '#ffc76b',
        class: 'ddm-luz-pueblo',
      });
      c.style.animationDelay = azar(-5, 0).toFixed(2) + 's';
      pueblo.appendChild(c);
    }
  }

  const RUTA_BANDERA =
    'M14,0 H94 A8,8 0 0 1 102,8 V54 A12,12 0 0 1 78,54 A12,12 0 0 1 54,54 A12,12 0 0 1 30,54 A12,12 0 0 1 6,54 V8 A8,8 0 0 1 14,0 Z';

  const MOTIVOS_PAPEL = [
    (cx, cy) => {
      let out = '';
      for (let i = 0; i < 6; i++) {
        out += `<ellipse cx="${cx}" cy="${cy - 10}" rx="5.5" ry="10.5" fill="#000" transform="rotate(${i * 60} ${cx} ${cy})"/>`;
      }
      return out + `<circle cx="${cx}" cy="${cy}" r="3.2" fill="#000"/>`;
    },
    (cx, cy) => {
      let out = '';
      [10, 95, 160, 230, 300].forEach((a) => {
        out += `<ellipse cx="${cx}" cy="${cy - 11}" rx="4" ry="12" fill="#000" transform="rotate(${a} ${cx} ${cy})"/>`;
      });
      return out +
        `<circle cx="${cx - 16}" cy="${cy - 10}" r="2.6" fill="#000"/>` +
        `<circle cx="${cx + 15}" cy="${cy + 9}" r="2" fill="#000"/>` +
        `<circle cx="${cx + 2}" cy="${cy + 15}" r="1.6" fill="#000"/>`;
    },
    (cx, cy) =>
      `<path d="M${cx - 13},${cy - 2} a13,12 0 1,1 26,0 v6 q0,9 -13,9 q-13,0 -13,-9 Z" fill="#000"/>` +
      `<circle cx="${cx - 6}" cy="${cy - 2}" r="2.6" fill="#fff"/>` +
      `<circle cx="${cx + 6}" cy="${cy - 2}" r="2.6" fill="#fff"/>`,
    (cx, cy) => {
      let out = '';
      for (let i = 0; i < 8; i++) {
        out += `<ellipse cx="${cx}" cy="${cy - 11}" rx="3.4" ry="11.5" fill="#000" transform="rotate(${i * 45} ${cx} ${cy})"/>`;
      }
      return out + `<circle cx="${cx}" cy="${cy}" r="2.6" fill="#000"/>`;
    },
    (cx, cy) =>
      `<text x="${cx}" y="${cy + 7}" text-anchor="middle" font-family="var(--font-family-base, Gotham), Arial, sans-serif" font-weight="700" font-size="22" letter-spacing="1" fill="#000">UIM</text>` +
      `<ellipse cx="${cx - 25}" cy="${cy}" rx="3.2" ry="8" fill="#000" transform="rotate(-20 ${cx - 25} ${cy})"/>` +
      `<ellipse cx="${cx + 25}" cy="${cy}" rx="3.2" ry="8" fill="#000" transform="rotate(20 ${cx + 25} ${cy})"/>` +
      `<circle cx="${cx - 32}" cy="${cy - 9}" r="1.8" fill="#000"/>` +
      `<circle cx="${cx + 32}" cy="${cy - 9}" r="1.8" fill="#000"/>` +
      `<circle cx="${cx - 32}" cy="${cy + 9}" r="1.8" fill="#000"/>` +
      `<circle cx="${cx + 32}" cy="${cy + 9}" r="1.8" fill="#000"/>`,
  ];

  function crearBandera(color, indice) {
    const div = document.createElement('div');
    div.className = 'ddm-bandera';

    const idMascara = 'ddm-mascara-papel-' + indice + '-' + Math.random().toString(36).slice(2, 7);
    let puntos = '';
    for (let x = 20; x <= 88; x += 9) puntos += `<circle cx="${x}" cy="4" r="1.6" fill="#000"/>`;
    for (let y = 12; y <= 48; y += 9) {
      puntos += `<circle cx="4" cy="${y}" r="1.6" fill="#000"/>`;
      puntos += `<circle cx="104" cy="${y}" r="1.6" fill="#000"/>`;
    }
    const motivo = MOTIVOS_PAPEL[indice % MOTIVOS_PAPEL.length](54, 27);

    div.innerHTML =
      '<svg viewBox="0 0 108 76" preserveAspectRatio="xMidYMin meet">' +
      `<defs><mask id="${idMascara}" maskUnits="userSpaceOnUse" x="0" y="0" width="108" height="76">` +
      `<path d="${RUTA_BANDERA}" fill="#fff"/>` +
      puntos + motivo +
      '</mask></defs>' +
      `<path d="${RUTA_BANDERA}" fill="${color}" mask="url(#${idMascara})"/>` +
      '</svg>';
    return div;
  }

  function papelPicado() {
    const cont = raiz.querySelector('.ddm-papel');
    const n = Math.max(6, Math.round(raiz.clientWidth / 75));
    cont.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const b = crearBandera(COLORES_PAPEL[i % COLORES_PAPEL.length], i);
      b.style.animationDelay = (-i * 0.45).toFixed(2) + 's';
      cont.appendChild(b);
    }
  }

  function dibujarPetalo(ctx, a, largo, ancho, tono, t) {
    const h = ancho / 2;
    const r0 = largo * 0.18;
    const rizos = 4 + Math.floor(Math.random() * 3);
    ctx.save();
    ctx.rotate(a);
    ctx.beginPath();
    ctx.moveTo(r0 * Math.cos(-h), r0 * Math.sin(-h));
    ctx.lineTo(largo * 0.9 * Math.cos(-h), largo * 0.9 * Math.sin(-h));
    for (let j = 0; j < rizos; j++) {
      const a1 = -h + (2 * h) * (j + 0.5) / rizos;
      const a2 = -h + (2 * h) * (j + 1) / rizos;
      const rc = largo * azar(1.04, 1.12);
      const re = largo * azar(0.86, 0.94);
      ctx.quadraticCurveTo(rc * Math.cos(a1), rc * Math.sin(a1), re * Math.cos(a2), re * Math.sin(a2));
    }
    ctx.lineTo(r0 * Math.cos(h), r0 * Math.sin(h));
    ctx.closePath();

    const luz = -t * 7;
    const g = ctx.createRadialGradient(0, 0, r0, 0, 0, largo * 1.08);
    g.addColorStop(0, `hsl(${16 + tono}, 92%, ${38 + luz}%)`);
    g.addColorStop(0.55, `hsl(${27 + tono}, 100%, ${50 + luz}%)`);
    g.addColorStop(0.85, `hsl(${36 + tono}, 100%, ${56 + luz}%)`);
    g.addColorStop(1, `hsl(${46 + tono}, 100%, ${64 + luz}%)`);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = Math.max(0.6, largo / 70);
    ctx.strokeStyle = 'rgba(150, 45, 0, .45)';
    ctx.stroke();

    ctx.beginPath();
    for (let j = 1; j < rizos; j++) {
      const aj = -h + (2 * h) * j / rizos;
      ctx.moveTo(r0 * 1.6 * Math.cos(aj), r0 * 1.6 * Math.sin(aj));
      ctx.lineTo(largo * 0.8 * Math.cos(aj), largo * 0.8 * Math.sin(aj));
    }
    ctx.strokeStyle = 'rgba(170, 60, 0, .22)';
    ctx.stroke();
    ctx.restore();
  }

  function texturaFlor(tam, tono) {
    const c = document.createElement('canvas');
    c.width = c.height = tam;
    const ctx = c.getContext('2d');
    const R = tam / 2;
    ctx.translate(R, R);
    const capas = 7;
    for (let k = 0; k < capas; k++) {
      const t = k / (capas - 1);
      const largo = R * (0.9 - t * 0.66);
      const n = Math.round(15 - t * 6);
      const giro = Math.random() * Math.PI * 2;
      for (let i = 0; i < n; i++) {
        const a = giro + (i / n) * Math.PI * 2 + azar(-0.15, 0.15);
        dibujarPetalo(ctx, a, largo * azar(0.88, 1.04), (Math.PI * 2 / n) * azar(0.95, 1.25), tono, t);
      }
    }
    for (let i = 0; i < 9; i++) {
      dibujarPetalo(ctx, azar(0, Math.PI * 2), R * azar(0.12, 0.18), 1.3, tono - 4, 1);
    }
    return c.toDataURL();
  }

  function texturaPetalo(tono) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    ctx.translate(6, 32);
    dibujarPetalo(ctx, 0, 50, 1.05, tono, 0);
    return c.toDataURL();
  }

  let FLORES = null, PETALOS = null;
  function prepararTexturas() {
    if (FLORES) return;
    FLORES = [-5, 0, 5, 2].map((tono) => texturaFlor(160, tono));
    PETALOS = [-6, 0, 6].map((tono) => texturaPetalo(tono));
  }

  function crearVela(x, y, s, retraso) {
    const g = el('g', {
      class: 'ddm-vela',
      transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(s * 1.5).toFixed(3)})`,
    });
    g.style.animationDelay = retraso.toFixed(2) + 's';
    g.innerHTML =
      '<circle cx="0" cy="-16" r="16" fill="url(#ddm-luz)"/>' +
      '<rect x="-3.5" y="-13" width="7" height="13" rx="1.2" fill="#f5ecd7"/>' +
      '<path class="ddm-llama" d="M0 -23 C 3 -18, 3 -14, 0 -13 C -3 -14, -3 -18, 0 -23 Z" fill="#ffd166"/>';
    return g;
  }

  function construirCamino() {
    prepararTexturas();
    const fPet = document.createDocumentFragment();
    const fVel = document.createDocumentFragment();
    const fChi = document.createDocumentFragment();
    const izq = [], der = [];
    const pasos = 170;

    for (let i = 0; i <= pasos; i++) {
      const u = i / pasos;
      const p = puntoYNormal(u * L);
      const s = escalaEn(p.y);
      const w = ANCHO_MAX * s;
      const retraso = (1 - u) * (DURACION_DESPLIEGUE / 1000);

      izq.push(`${(p.x + p.nx * w).toFixed(1)},${(p.y + p.ny * w).toFixed(1)}`);
      der.unshift(`${(p.x - p.nx * w).toFixed(1)},${(p.y - p.ny * w).toFixed(1)}`);

      const sueltos = Math.round(w / 15);
      const flores = Math.round(1 + w / 16);
      for (let k = 0; k < sueltos + flores; k++) {
        const esFlor = k >= sueltos;
        const lado = (Math.random() + Math.random() - 1) * w * (esFlor ? 0.95 : 1.15);
        const avance = azar(-3, 3) * s;
        const x = p.x + p.nx * lado + p.tx * avance;
        const y = p.y + p.ny * lado + p.ty * avance;
        let d, alto, giro, src;
        if (esFlor) {
          d = (9 + 30 * s) * azar(0.8, 1.2);
          alto = d * 0.74;
          giro = azar(-12, 12);
          src = elegir(FLORES);
        } else {
          d = (6 + 16 * s) * azar(0.75, 1.25);
          alto = d;
          giro = azar(0, 360);
          src = elegir(PETALOS);
        }
        const img = el('image', {
          href: src,
          x: (-d / 2).toFixed(1),
          y: (-alto / 2).toFixed(1),
          width: d.toFixed(1),
          height: alto.toFixed(1),
          preserveAspectRatio: 'none',
          class: 'ddm-petalo',
        });
        img.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
        img.style.rotate = giro.toFixed(0) + 'deg';
        img.style.animationDelay = (retraso + azar(0, 0.25)).toFixed(2) + 's';
        fPet.appendChild(img);
      }

      if (i % 12 === 6 && i < pasos - 2) {
        for (const lado of [-1, 1]) {
          const x = p.x + p.nx * w * 1.4 * lado;
          const y = p.y + p.ny * w * 1.4 * lado;
          fVel.appendChild(crearVela(x, y, s, retraso + 0.3));
        }
      }

      if (Math.random() < 0.35) {
        const lado = azar(-1, 1) * w;
        const c = el('circle', {
          cx: (p.x + p.nx * lado).toFixed(1),
          cy: (p.y + p.ny * lado).toFixed(1),
          r: (0.6 + 1.6 * s).toFixed(2),
          fill: '#ffd166',
          class: 'ddm-chispa',
        });
        c.style.setProperty('--d', (20 + 60 * s).toFixed(0));
        c.style.animationDelay = (retraso + 1 + azar(0, 3)).toFixed(2) + 's';
        c.style.animationDuration = azar(2.5, 4.5).toFixed(2) + 's';
        fChi.appendChild(c);
      }
    }

    capa.resplandor.appendChild(el('polygon', {
      points: izq.concat(der).join(' '),
      fill: '#ff8c00',
      class: 'ddm-resplandor',
    }));
    capa.petalos.appendChild(fPet);
    capa.velas.appendChild(fVel);
    capa.chispas.appendChild(fChi);
  }

  function piernas(color, o) {
    return (
      `<g class="ddm-pierna" style="animation-delay:${(-o).toFixed(2)}s">` +
        `<rect x="-7" y="-47" width="4.6" height="45" rx="2.2" fill="${color}"/>` +
        `<ellipse cx="-4.7" cy="-1.6" rx="5" ry="2.6" fill="${OSCURO}"/></g>` +
      `<g class="ddm-pierna" style="animation-delay:${(-(o + 0.62)).toFixed(2)}s">` +
        `<rect x="2.4" y="-47" width="4.6" height="45" rx="2.2" fill="${color}"/>` +
        `<ellipse cx="4.7" cy="-1.6" rx="5" ry="2.6" fill="${OSCURO}"/></g>`
    );
  }

  function cuerpo(tipo, ropa, dec) {
    switch (tipo) {
      case 'catrina':
        return (
          `<path d="M-11 -79 Q0 -82 11 -79 L25 -22 Q0 -15 -25 -22Z" fill="${ropa}"/>` +
          `<path d="M-25 -22 Q-19 -14 -12 -20 Q-6 -13 0 -19 Q6 -13 12 -20 Q19 -14 25 -22 L23 -27 Q0 -21 -23 -27Z" fill="${dec}" opacity=".85"/>` +
          `<path d="M-6 -79 L0 -70 L6 -79" fill="none" stroke="${HUESO}" stroke-width="1.5"/>`
        );
      case 'charro':
        return (
          `<rect x="-13" y="-79" width="26" height="36" rx="5" fill="${ropa}"/>` +
          `<path d="M-5 -79 L0 -70 L5 -79Z" fill="#f8f9fa"/>` +
          `<path d="M-11 -76 V-48 M11 -76 V-48" stroke="#e9c46a" stroke-width="1.6"/>` +
          `<g fill="#e9c46a"><circle cx="-6" cy="-66" r="1.4"/><circle cx="6" cy="-66" r="1.4"/>` +
          `<circle cx="-6" cy="-57" r="1.4"/><circle cx="6" cy="-57" r="1.4"/></g>` +
          `<path d="M-6 -80 L0 -77 L-6 -74Z M6 -80 L0 -77 L6 -74Z" fill="#d00000"/>`
        );
      case 'abuela':
        return (
          `<path d="M-12 -60 L12 -60 L20 -5 Q0 -1 -20 -5Z" fill="${ropa}"/>` +
          `<rect x="-12" y="-79" width="24" height="22" rx="5" fill="#f1e6d2"/>` +
          `<path d="M-16 -81 Q0 -68 16 -81 L19 -52 Q0 -44 -19 -52Z" fill="${elegir(REBOZO)}"/>` +
          `<path d="M-17 -60 Q0 -52 17 -60 M-18 -56 Q0 -48 18 -56" stroke="#fff" stroke-opacity=".35" stroke-width="1.3" fill="none"/>`
        );
      default:
        return (
          `<rect x="-11" y="-79" width="22" height="30" rx="5" fill="${ropa}"/>` +
          `<rect x="-10" y="-51" width="20" height="10" rx="3" fill="#2b2d42"/>`
        );
    }
  }

  function brazos(manga, lleva, o) {
    let objeto = '';
    const saluda = lleva === 'saluda';
    if (lleva === 'ramo') {
      objeto =
        '<path d="M15.2 -49 L13 -40 M15.2 -49 L17.5 -40 M15.2 -49 V-39" stroke="#2d6a4f" stroke-width="1.2"/>' +
        '<circle cx="12.6" cy="-39" r="3.6" fill="#ff8c00"/><circle cx="17.8" cy="-39" r="3.6" fill="#ffa62b"/>' +
        '<circle cx="15.2" cy="-36" r="3.8" fill="#f77f00"/>' +
        '<circle cx="12.6" cy="-39" r="1.4" fill="#ffd166"/><circle cx="17.8" cy="-39" r="1.4" fill="#ffd166"/>' +
        '<circle cx="15.2" cy="-36" r="1.5" fill="#ffd166"/>';
    } else if (lleva === 'vela') {
      objeto =
        '<circle cx="15.5" cy="-62" r="14" fill="url(#ddm-luz)"/>' +
        '<rect x="13.5" y="-56" width="4" height="9" rx="1" fill="#f5ecd7"/>' +
        '<path class="ddm-llama" d="M15.5 -62 C17.5 -59 17.5 -57 15.5 -56 C13.5 -57 13.5 -59 15.5 -62Z" fill="#ffd166"/>';
    } else if (lleva === 'flor') {
      objeto =
        '<circle cx="15.2" cy="-50" r="4.8" fill="#ff8c00"/>' +
        '<circle cx="15.2" cy="-50" r="2.2" fill="#ffb703"/>';
    }
    return (
      `<g class="ddm-brazo" style="animation-delay:${(-(o + 0.62)).toFixed(2)}s">` +
        `<rect x="-17.5" y="-78" width="4.5" height="27" rx="2.2" fill="${manga}"/>` +
        `<circle cx="-15.2" cy="-49" r="3.1" fill="${HUESO}"/></g>` +
      `<g class="ddm-brazo${saluda ? ' ddm-saluda' : ''}" style="animation-delay:${(-o).toFixed(2)}s">` +
        `<rect x="13" y="-78" width="4.5" height="27" rx="2.2" fill="${manga}"/>` +
        `<circle cx="15.2" cy="-49" r="${saluda ? 3.8 : 3.1}" fill="${HUESO}"/>${objeto}</g>`
    );
  }

  function cabeza(dec, ojos, o) {
    const ojosSvg = ojos === 'felices'
      ? `<path d="M-9 -97.5 Q-5 -103.5 -1 -97.5 M1 -97.5 Q5 -103.5 9 -97.5" fill="none" stroke="${OSCURO}" stroke-width="2.4" stroke-linecap="round"/>` +
        `<path d="M-9.5 -103.5 Q-5 -108 -0.8 -103.5 M0.8 -103.5 Q5 -108 9.5 -103.5" fill="none" stroke="${dec}" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="0.1 2.2"/>`
      : `<circle cx="-5" cy="-99" r="5.4" fill="none" stroke="${dec}" stroke-width="1.5"/>` +
        `<circle cx="5" cy="-99" r="5.4" fill="none" stroke="${dec}" stroke-width="1.5"/>` +
        `<circle cx="-5" cy="-99" r="3.9" fill="${OSCURO}"/>` +
        `<circle cx="5" cy="-99" r="3.9" fill="${OSCURO}"/>` +
        `<circle cx="-3.8" cy="-100.6" r="1.5" fill="#fff"/>` +
        `<circle cx="6.2" cy="-100.6" r="1.5" fill="#fff"/>` +
        `<circle cx="-6" cy="-97.6" r=".7" fill="#fff"/>` +
        `<circle cx="4" cy="-97.6" r=".7" fill="#fff"/>`;
    return (
      `<g class="ddm-cabeza" style="animation-delay:${(-o).toFixed(2)}s">` +
        `<circle cx="0" cy="-99" r="13" fill="${HUESO}"/>` +
        `<rect x="-9.5" y="-94" width="19" height="12" rx="5" fill="${HUESO}"/>` +
        `<ellipse cx="-9.2" cy="-92" rx="2.8" ry="2" fill="#ff7aa2" opacity=".7"/>` +
        `<ellipse cx="9.2" cy="-92" rx="2.8" ry="2" fill="#ff7aa2" opacity=".7"/>` +
        ojosSvg +
        `<path d="M0 -92.6 C-2 -93.6 -2.4 -95.6 -1 -95.9 C-0.4 -96 0 -95.6 0 -95.2 C0 -95.6 0.4 -96 1 -95.9 C2.4 -95.6 2 -93.6 0 -92.6Z" fill="${OSCURO}"/>` +
        `<path d="M-7.8 -90.6 Q0 -88 7.8 -90.6 Q6.5 -82.5 0 -82.4 Q-6.5 -82.5 -7.8 -90.6Z" fill="${OSCURO}"/>` +
        `<path d="M-6.8 -89.8 Q0 -87.5 6.8 -89.8 L6.3 -87.9 Q0 -85.9 -6.3 -87.9Z" fill="${HUESO}"/>` +
        `<path d="M-3.4 -88.9 V-86.9 M0 -88.6 V-86.4 M3.4 -88.9 V-86.9" stroke="${OSCURO}" stroke-width=".55"/>` +
        `<ellipse cx="0" cy="-84.2" rx="3.3" ry="1.5" fill="#ff5d8f"/>` +
        `<g fill="${dec}"><circle cx="0" cy="-109.5" r="1.7"/><circle cx="-2.6" cy="-107.5" r="1.7"/>` +
        `<circle cx="2.6" cy="-107.5" r="1.7"/><circle cx="0" cy="-105.5" r="1.7"/></g>` +
        `<circle cx="0" cy="-107.5" r="1.1" fill="#ffbe0b"/>`
    );
  }

  function sombrero(tipo) {
    switch (tipo) {
      case 'catrina':
        return (
          `<ellipse cx="0" cy="-110" rx="27" ry="5.5" fill="${OSCURO}"/>` +
          `<path d="M-10 -110 Q-10 -123 0 -124 Q10 -123 10 -110Z" fill="${OSCURO}"/>` +
          `<circle cx="-9" cy="-114" r="4" fill="#ff006e"/>` +
          `<circle cx="-3" cy="-117" r="3.4" fill="#ffbe0b"/>` +
          `<circle cx="-14" cy="-111" r="3" fill="#8338ec"/>` +
          `<path d="M7 -117 q10 -10 19 -6" stroke="#ff8fab" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
        );
      case 'charro':
        return (
          `<ellipse cx="0" cy="-109" rx="32" ry="6.5" fill="#3d2b1f" stroke="#e9c46a" stroke-width="1.3"/>` +
          `<path d="M-9 -109 Q-8 -129 0 -130 Q8 -129 9 -109Z" fill="#3d2b1f" stroke="#e9c46a" stroke-width="1.3"/>` +
          `<path d="M-8.5 -113 H8.5" stroke="#e9c46a" stroke-width="2"/>`
        );
      case 'abuela':
        return `<circle cx="0" cy="-113" r="5.5" fill="#d9d4c7"/>`;
      default:
        return '';
    }
  }

  function crearPersona(tipo) {
    const ropa = elegir(ROPA[tipo]);
    const dec = elegir(DECORACION);
    const o = azar(0, 1.24);
    let lleva = '';
    const r = Math.random();
    if (tipo === 'nino') lleva = r < 0.45 ? 'flor' : r < 0.8 ? 'saluda' : '';
    else lleva = r < 0.28 ? 'vela' : r < 0.48 ? 'ramo' : r < 0.75 ? 'saluda' : '';
    const ojos = Math.random() < 0.5 ? 'felices' : 'abiertos';

    const colorPierna = tipo === 'charro' ? ropa : HUESO;
    const manga = tipo === 'charro' ? ropa : HUESO;

    const g = el('g', { class: 'ddm-persona' });
    g.style.opacity = '0';
    g.innerHTML =
      `<ellipse cx="0" cy="0" rx="17" ry="4" fill="rgba(0,0,0,.35)"/>` +
      `<g class="ddm-rebote" style="animation-delay:${(-o / 2).toFixed(2)}s">` +
        piernas(colorPierna, o) +
        cuerpo(tipo, ropa, dec) +
        brazos(manga, lleva, o) +
        `<rect x="-2" y="-84" width="4" height="7" fill="${HUESO}"/>` +
        cabeza(dec, ojos, o) +
        sombrero(tipo) + `</g>` +
      `</g>`;
    return g;
  }

  const personas = [];
  let rafId = 0, ultimo = 0, proximo = 0;
  let caminando = false, visible = true;

  function agregar(tipo, l, off) {
    const g = crearPersona(tipo);
    capa.personas.insertBefore(g, capa.personas.firstChild);
    personas.push({ g, l, off, vel: azar(0.95, 1.05), tam: tipo === 'nino' ? 0.68 : azar(0.95, 1.05), y: 0 });
  }

  function generar() {
    const tipo = elegir(TIPOS);
    const off = azar(-0.5, 0.5);
    agregar(tipo, 0, off);
    if (tipo !== 'nino' && Math.random() < 0.3) {
      agregar('nino', -22, off + (off > 0 ? -0.38 : 0.38));
    }
  }

  function cuadro(t) {
    const dt = Math.min(0.05, (t - ultimo) / 1000 || 0);
    ultimo = t;

    if (t >= proximo) {
      generar();
      proximo = t + azar(ESPERA_ENTRE_PERSONAS[0], ESPERA_ENTRE_PERSONAS[1]);
    }

    for (let i = personas.length - 1; i >= 0; i--) {
      const p = personas[i];
      const pos = puntoYNormal(Math.max(0, p.l));
      const s = escalaEn(pos.y);
      p.l += dt * p.vel * (14 + 95 * s);

      if (p.l >= L) {
        p.g.remove();
        personas.splice(i, 1);
        continue;
      }

      const w = ANCHO_MAX * s;
      const x = pos.x + pos.nx * p.off * w;
      const y = pos.y + pos.ny * p.off * w;
      const esc = s * 1.8 * p.tam;
      p.g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${esc.toFixed(3)})`);

      let op = 1;
      if (p.l < 30) op = Math.max(0, p.l / 30);
      if (L - p.l < 70) op = (L - p.l) / 70;
      p.g.style.opacity = op.toFixed(2);
      p.y = y;
    }

    const orden = [...personas].sort((a, b) => a.y - b.y);
    const hijos = capa.personas.children;
    for (let i = 0; i < orden.length; i++) {
      if (hijos[i] !== orden[i].g) {
        orden.forEach((p) => capa.personas.appendChild(p.g));
        break;
      }
    }

    rafId = requestAnimationFrame(cuadro);
  }

  function iniciarCaminata() {
    if (rafId) return;
    ultimo = performance.now();
    rafId = requestAnimationFrame(cuadro);
  }
  function pausarCaminata() {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  const zonaFrases = document.createElement('div');
  zonaFrases.className = 'ddm-frases';
  zonaFrases.setAttribute('aria-live', 'polite');
  raiz.appendChild(zonaFrases);

  let frasesId = 0, iFrase = 0, ladoDer = false;
  const ordenFrases = FRASES.map((_, i) => i).sort(() => Math.random() - 0.5);

  function mostrarFrase() {
    prepararTexturas();
    const [texto, autor] = FRASES[ordenFrases[iFrase % FRASES.length]];
    iFrase++;
    ladoDer = !ladoDer;

    const f = document.createElement('figure');
    f.className = 'ddm-frase ' + (ladoDer ? 'ddm-der' : 'ddm-izq');
    const flores = [0, 1, 2, 3].map((k) =>
      `<img class="ddm-flor ddm-flor-${k}" src="${elegir(FLORES)}" alt="">`).join('');
    f.innerHTML =
      `<img class="ddm-avatar" src="assets/anim_mens/nov_dia-de-muertos/bufalo-catrin.png" alt="Búfalo UIM catrín">` +
      `<div class="ddm-nube">` +
        `<blockquote class="ddm-cita">${texto}</blockquote>` +
        `<figcaption class="ddm-autor">${autor}</figcaption>` +
      `</div>${flores}`;
    zonaFrases.appendChild(f);

    const dura = raiz.clientWidth <= 640 ? CADA_FRASE - 1300 : CADA_FRASE * 1.55;
    requestAnimationFrame(() => requestAnimationFrame(() => f.classList.add('ddm-ver')));
    setTimeout(() => f.classList.remove('ddm-ver'), dura);
    setTimeout(() => f.remove(), dura + 1200);
  }

  function iniciarFrases() {
    if (frasesId) return;
    mostrarFrase();
    frasesId = setInterval(mostrarFrase, CADA_FRASE);
  }
  function pararFrases() {
    clearInterval(frasesId);
    frasesId = 0;
    zonaFrases.querySelectorAll('.ddm-frase').forEach((f) => f.classList.remove('ddm-ver'));
    setTimeout(() => { if (!activo) zonaFrases.innerHTML = ''; }, 900);
  }

  let activo = false;
  let temporizadores = [];

  function limpiar() {
    pausarCaminata();
    pararFrases();
    caminando = false;
    personas.length = 0;
    Object.values(capa).forEach((g) => { g.innerHTML = ''; });
  }

  function encender() {
    temporizadores.forEach(clearTimeout);
    temporizadores = [];
    limpiar();
    camino.classList.remove('ddm-saliendo');

    activo = true;
    raiz.classList.add('ddm-activo');
    document.body.style.overflow = 'hidden';

    temporizadores.push(setTimeout(construirCamino, RETRASO_CAMINO));
    temporizadores.push(setTimeout(() => {
      caminando = true;
      proximo = 0;
      if (visible) iniciarCaminata();
      iniciarFrases();
    }, RETRASO_CAMINO + DURACION_DESPLIEGUE));
  }

  function apagar() {
    temporizadores.forEach(clearTimeout);
    temporizadores = [];
    activo = false;
    pararFrases();
    raiz.classList.remove('ddm-activo');
    document.body.style.overflow = '';
    camino.classList.add('ddm-saliendo');
    temporizadores.push(setTimeout(() => {
      limpiar();
      camino.classList.remove('ddm-saliendo');
    }, 800));
  }

  document.addEventListener('anim-mens:toggle', (evento) => {
    if (evento.detail && evento.detail.activo) {
      encender();
    } else {
      apagar();
    }
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entrada]) => {
      visible = entrada.isIntersecting;
      if (!caminando) return;
      visible ? iniciarCaminata() : pausarCaminata();
    }).observe(raiz);
  }

  decorarFondo();
  papelPicado();
  let tRes;
  window.addEventListener('resize', () => {
    clearTimeout(tRes);
    tRes = setTimeout(papelPicado, 200);
  });
})();
