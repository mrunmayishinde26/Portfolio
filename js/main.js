(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  };

  /* ── Theme ── */
  const root = document.documentElement;
  const saved = store.get('theme');
  if (saved) root.dataset.theme = saved;
  else if (matchMedia('(prefers-color-scheme: light)').matches) root.dataset.theme = 'light';
  $('#theme').addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next; store.set('theme', next);
    $('meta[name="theme-color"]').content = next === 'dark' ? '#0a0a18' : '#f3f2ff';
  });

  /* ── Mobile menu ── */
  const menu = $('#menu'), links = $('#links');
  menu.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menu.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', (e) => { if (e.target.closest('a')) { links.classList.remove('open'); menu.setAttribute('aria-expanded', false); } });

  /* ── Scroll progress + active link ── */
  const bar = $('#progress');
  const sections = $$('main section[id]');
  const navLinks = $$('.links a');
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100 + '%';
    let cur = '';
    for (const s of sections) if (s.getBoundingClientRect().top < innerHeight * 0.35) cur = s.id;
    navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ── Reveal (with stagger) ── */
  $$('.reveal').forEach((el) => {
    const sibs = $$(':scope > .reveal', el.parentElement);
    el.style.setProperty('--d', (sibs.indexOf(el) * 0.08) + 's');
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  /* ── Counters ── */
  const count = (el) => {
    const to = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = to.toFixed(dec) + suf; return; }
    const t0 = performance.now(), dur = 1500;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * e).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { count(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => cio.observe(el));

  /* ── Typed roles ── */
  const roles = ['AI & ML engineer in the making', 'SDK integration specialist', 'Computer-vision researcher', 'Builder of LLM-powered tools'];
  const typed = $('#typed');
  if (reduce) typed.textContent = roles[0];
  else {
    let r = 0, c = 0, del = false;
    const step = () => {
      const w = roles[r];
      typed.textContent = w.slice(0, c);
      if (!del && c === w.length) { del = true; return setTimeout(step, 1600); }
      if (del && c === 0) { del = false; r = (r + 1) % roles.length; return setTimeout(step, 350); }
      c += del ? -1 : 1;
      setTimeout(step, del ? 28 : 62);
    };
    step();
  }

  /* ── Profile JSON card ── */
  const profile = [
    '<span class="p">{</span>',
    '  <span class="k">"name"</span><span class="p">:</span> <span class="s">"Mrunmayi Shinde"</span><span class="p">,</span>',
    '  <span class="k">"role"</span><span class="p">:</span> <span class="s">"Technical Onboarding Specialist @ CleverTap"</span><span class="p">,</span>',
    '  <span class="k">"education"</span><span class="p">:</span> <span class="s">"MCA · MET Institute (Univ. of Mumbai)"</span><span class="p">,</span>',
    '  <span class="k">"focus"</span><span class="p">:</span> <span class="p">[</span><span class="s">"Machine Learning"</span><span class="p">,</span> <span class="s">"Computer Vision"</span><span class="p">,</span> <span class="s">"Explainable AI"</span><span class="p">],</span>',
    '  <span class="k">"stack"</span><span class="p">:</span> <span class="p">[</span><span class="s">"Python"</span><span class="p">,</span> <span class="s">"React"</span><span class="p">,</span> <span class="s">"Node.js"</span><span class="p">,</span> <span class="s">"TensorFlow"</span><span class="p">],</span>',
    '  <span class="k">"published"</span><span class="p">:</span> <span class="s">"Deepfake detection · 92.3% accuracy"</span><span class="p">,</span>',
    '  <span class="k">"building"</span><span class="p">:</span> <span class="s">"LLM-powered analytics tooling"</span><span class="p">,</span>',
    '  <span class="k">"openToCollab"</span><span class="p">:</span> <span class="n">true</span>',
    '<span class="p">}</span>',
  ];
  const pre = $('#profile');
  if (reduce) pre.innerHTML = profile.join('\n');
  else {
    let i = 0;
    const next = () => {
      if (i >= profile.length) return;
      pre.innerHTML = profile.slice(0, ++i).join('\n') + '<span class="caret"></span>';
      setTimeout(next, 260);
    };
    setTimeout(next, 600);
  }

  /* ── Cursor spotlight on glass ── */
  if (fine) {
    document.addEventListener('pointermove', (e) => {
      const g = e.target.closest && e.target.closest('.glass');
      if (!g) return;
      const r = g.getBoundingClientRect();
      g.style.setProperty('--mx', e.clientX - r.left + 'px');
      g.style.setProperty('--my', e.clientY - r.top + 'px');
    }, { passive: true });

    /* ── 3D tilt ── */
    if (!reduce) $$('.tilt').forEach((el) => {
      el.addEventListener('pointerenter', () => { el.style.transition = 'transform .12s ease-out, border-color .3s'; });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transition = 'transform .5s ease, border-color .3s'; el.style.transform = ''; });
    });
  }

  /* ── Screenshot tabs ── */
  const shot = $('#shot');
  $$('.shot-tabs button').forEach((b) => b.addEventListener('click', () => {
    $$('.shot-tabs button').forEach((x) => x.setAttribute('aria-selected', x === b));
    shot.style.opacity = 0;
    setTimeout(() => { shot.src = b.dataset.img; shot.style.opacity = 1; }, 180);
  }));

  /* ── Copy email ── */
  const copy = $('#copy');
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('mrunmayi.shinde2602@gmail.com'); copy.textContent = 'Copied ✓'; }
    catch { copy.textContent = 'Press Ctrl/⌘+C'; }
    setTimeout(() => (copy.textContent = 'Copy email'), 1800);
  });
  $('#year').textContent = new Date().getFullYear();

  /* ── Neural-network canvas ── */
  const cv = $('#net'), ctx = cv.getContext('2d');
  let W, H, pts = [], mouse = { x: -999, y: -999 }, running = true;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const colors = () => (root.dataset.theme === 'light' ? ['79,70,229', '8,145,178'] : ['34,211,238', '167,139,250']);
  const size = () => {
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(95, Math.floor((W * H) / 17000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.6 + 0.8 }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const [c1, c2] = colors(), L = 140;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (!reduce) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 120) { p.x += dx / d * 0.9; p.y += dy / d * 0.9; }
      }
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < L) { ctx.strokeStyle = `rgba(${c1},${(1 - d / L) * 0.35})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
      const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (md < 170) { ctx.strokeStyle = `rgba(${c2},${(1 - md / 170) * 0.6})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
      ctx.fillStyle = `rgba(${c2},0.85)`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    }
    if (running && !reduce) requestAnimationFrame(draw);
  };
  addEventListener('resize', () => { size(); if (reduce) draw(); });
  addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });
  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running && !reduce) draw(); });
  size(); draw();

  /* ── Offline AI assistant (answers from the CV) ── */
  const kb = [
    { k: ['hi', 'hello', 'hey', 'who are you', 'about', 'introduce', 'yourself'], a: "Hi! I'm Mrunmayi's portfolio assistant. She's an <b>MCA postgraduate in AI &amp; ML</b> and a <b>Technical Onboarding Specialist at CleverTap</b>, with research in deepfake detection and projects in computer vision and LLM-powered tooling." },
    { k: ['clevertap', 'work', 'job', 'role', 'experience', 'current', 'company', 'sdk'], a: "At <b>CleverTap</b> (Jul 2025 – now) she helps international clients integrate the SDK across <b>Android, iOS, Web, React Native, Flutter and Cordova</b>, debugs SDK / REST API / JSON / push issues, validates analytics data, and built an AI event-recommendation engine. She started there as an Onboarding Intern in Jan 2025." },
    { k: ['project', 'built', 'build', 'portfolio', 'recommend', 'engine', 'llm'], a: "Flagship: the <b>AI-Powered Event Recommendation Engine</b> — scan a site or APK and get tailored CleverTap events, SDK code, journeys and campaigns using LLMs (Claude, Groq, Gemini, OpenAI). Also: facial-recognition banking auth, YOLOv3 object detection, lung-cancer detection with CNNs, and UI Tech. See <a href=\"#projects\">Projects</a>." },
    { k: ['research', 'paper', 'publish', 'deepfake', 'publication', 'journal'], a: "Published <b>“Deep Fake AI Detection System”</b> (IJRPR, 2025) — CNNs + hybrid ML on FaceForensics++, Celeb-DF and DFDC: <b>92.3% accuracy, 91.7% precision, 93% recall, 92.35% F1</b>. <a href=\"#research\">Read more</a>." },
    { k: ['skill', 'tech', 'stack', 'language', 'tools', 'python', 'react', 'node', 'know'], a: "Python, Java, Swift, C/C++, JavaScript, React.js, Node.js, Express · ML/DL: TensorFlow, OpenCV, CNNs, scikit-learn, NumPy, Pandas · SQL, MongoDB, Power BI · REST APIs, SDK integration, Linux, Git · Security &amp; digital forensics. <a href=\"#skills\">Full list</a>." },
    { k: ['education', 'study', 'degree', 'mca', 'college', 'university', 'cgpa', 'cgpi', 'grade', 'percentile'], a: "<b>MCA</b> at MET Institute of Computer Science (Univ. of Mumbai), 2023–25, CGPI <b>9.28/10</b>, 98.09 percentile in MAH-MCA-CET. Before that, <b>B.Sc. IT</b> at Patkar-Varde College, CGPA <b>9.70/10</b>." },
    { k: ['certif', 'aws', 'google', 'coursera', 'badge', 'course'], a: "Certifications: <b>AWS Academy – Machine Learning Foundations</b>, <b>AWS Academy – Cloud Foundations</b> and the <b>Google AI Professional Certificate</b> (Coursera)." },
    { k: ['award', 'honour', 'honor', 'aavishkar', 'convention', 'present'], a: "She presented “UI Tech” at the <b>17th Aavishkar Research Convention</b> (Zonal Round, University of Mumbai, Dec 2022)." },
    { k: ['goal', 'future', 'looking', 'aim', 'interest', 'explainable', 'xai', 'phd', 'masters'], a: "She wants to deepen her knowledge of <b>machine learning, neural networks and explainable AI</b> through advanced academic study and research." },
    { k: ['contact', 'email', 'reach', 'hire', 'connect', 'github', 'mail'], a: "Email <a href=\"mailto:mrunmayi.shinde2602@gmail.com\">mrunmayi.shinde2602@gmail.com</a> or find her code on <a href=\"https://github.com/MrunmayiS2600\" target=\"_blank\" rel=\"noopener\">GitHub</a>." },
    { k: ['where', 'location', 'based', 'live', 'city', 'mumbai'], a: "She's based in <b>Mumbai, India</b>." },
    { k: ['language', 'english', 'marathi', 'speak'], a: "Mother tongue <b>Marathi</b>; English at a proficient level (C1 listening/writing, C2 reading, B2 speaking)." },
  ];
  const aiBox = $('#ai'), fab = $('#aiFab'), log = $('#aiLog'), form = $('#aiForm'), input = $('#aiInput'), sugg = $('#aiSugg');
  const add = (html, who) => { const d = document.createElement('div'); d.className = 'msg ' + who; d.innerHTML = html; log.append(d); log.scrollTop = log.scrollHeight; return d; };
  const answer = (q) => {
    const t = q.toLowerCase();
    let best = null, score = 0;
    for (const e of kb) { const s = e.k.reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0); if (s > score) { score = s; best = e; } }
    return best ? best.a : "I only know what's on Mrunmayi's CV — try asking about her <b>work at CleverTap</b>, <b>projects</b>, <b>research</b>, <b>skills</b> or <b>how to contact her</b>.";
  };
  const ask = (q) => {
    if (!q.trim()) return;
    add(q.replace(/[<>&]/g, ''), 'me');
    const t = add('<span class="dots"><i></i><i></i><i></i></span>', 'bot');
    setTimeout(() => { t.innerHTML = answer(q); log.scrollTop = log.scrollHeight; }, reduce ? 0 : 650);
  };
  ['What does she do at CleverTap?', 'Show her projects', 'Tell me about the research', 'Skills?', 'How can I contact her?'].forEach((q) => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = q; b.addEventListener('click', () => ask(q)); sugg.append(b);
  });
  form.addEventListener('submit', (e) => { e.preventDefault(); ask(input.value); input.value = ''; });
  const toggle = (open) => {
    aiBox.hidden = !open; fab.setAttribute('aria-expanded', open);
    if (open) { if (!log.children.length) add("Hi! 👋 Ask me anything about Mrunmayi's work, research and skills.", 'bot'); input.focus(); }
  };
  fab.addEventListener('click', () => toggle(aiBox.hidden));
  $('#aiClose').addEventListener('click', () => toggle(false));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !aiBox.hidden) toggle(false); });
  log.addEventListener('click', (e) => { if (e.target.closest('a[href^="#"]')) toggle(false); });

  /* ── Marquee: duplicate track for a seamless loop ── */
  const mq = $('#mq');
  if (mq) mq.innerHTML += mq.innerHTML;

  /* ── Cursor glow + parallax blobs + magnetic buttons ── */
  if (fine && !reduce) {
    const glow = $('#glow');
    let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy;
    addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; glow.classList.add('on'); }, { passive: true });
    (function loop() {
      gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12;
      glow.style.transform = 'translate(' + gx + 'px,' + gy + 'px)';
      requestAnimationFrame(loop);
    })();
    const blobs = $$('.blob');
    addEventListener('scroll', () => blobs.forEach((b, i) => { b.style.translate = '0 ' + (scrollY * (i + 1) * -0.06) + 'px'; }), { passive: true });
    $$('.btn').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * 0.18 + 'px,' + (e.clientY - r.top - r.height / 2) * 0.28 + 'px)';
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  /* ── Screenshot lightbox ── */
  const lb = $('#lb'), lbImg = $('#lbImg');
  const openLb = () => { lbImg.src = shot.src; lbImg.alt = shot.alt; lb.hidden = false; };
  $('#shotBtn').addEventListener('click', openLb);
  $('#expand').addEventListener('click', openLb);
  $('#lbClose').addEventListener('click', () => { lb.hidden = true; });
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.hidden = true; });

  /* ── Command palette (Ctrl/⌘ + K) ── */
  const ck = $('#cmdk'), ckIn = $('#cmdkInput'), ckList = $('#cmdkList');
  const go = (id) => () => { document.getElementById(id).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); };
  const cmds = [
    ['Go to Home', 'section', go('home')], ['Go to About', 'section', go('about')], ['Go to Experience', 'section', go('experience')],
    ['Go to Projects', 'section', go('projects')], ['Go to Research', 'section', go('research')], ['Go to Skills', 'section', go('skills')],
    ['Go to Education', 'section', go('education')], ['Go to Contact', 'section', go('contact')],
    ['Toggle dark / light theme', 'action', () => $('#theme').click()],
    ['Ask my AI assistant', 'action', () => toggle(true)],
    ['Email Mrunmayi', 'link', () => { location.href = 'mailto:mrunmayi.shinde2602@gmail.com'; }],
    ['Open GitHub profile', 'link', () => window.open('https://github.com/MrunmayiS2600', '_blank', 'noopener')],
    ['Read the research paper', 'link', () => window.open('https://ijrpr.com/uploads/V6ISSUE6/IJRPR48717.pdf', '_blank', 'noopener')],
  ];
  let sel = 0, shown = cmds;
  const run = (i) => { const c = shown[i]; if (!c) return; ck.hidden = true; setTimeout(c[2], 60); };
  const render = () => {
    ckList.innerHTML = '';
    shown.forEach((c, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = i === sel ? 'sel' : '';
      b.innerHTML = '<span>' + c[0] + '</span><small>' + c[1] + '</small>';
      b.addEventListener('click', () => run(i));
      b.addEventListener('pointermove', () => { if (sel !== i) { sel = i; render(); } });
      ckList.append(b);
    });
    if (!shown.length) ckList.innerHTML = '<p class="small-note" style="padding:14px">No matching command.</p>';
    const s = $('.sel', ckList); if (s) s.scrollIntoView({ block: 'nearest' });
  };
  const openCk = () => { ck.hidden = false; ckIn.value = ''; shown = cmds; sel = 0; render(); ckIn.focus(); };
  ckIn.addEventListener('input', () => { const q = ckIn.value.toLowerCase(); shown = cmds.filter((c) => c[0].toLowerCase().includes(q)); sel = 0; render(); });
  ckIn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, shown.length - 1); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); render(); }
    else if (e.key === 'Enter') { e.preventDefault(); run(sel); }
  });
  ck.addEventListener('click', (e) => { if (e.target === ck) ck.hidden = true; });
  $('#cmdBtn').addEventListener('click', openCk);
  addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (ck.hidden) openCk(); else ck.hidden = true; }
    if (e.key === 'Escape') { ck.hidden = true; lb.hidden = true; }
  });
})();
