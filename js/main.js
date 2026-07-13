/* ===== Enoteca Lu Mieru — main.js ===== */
(function () {
  'use strict';
  var root = document.documentElement, reduce = root.classList.contains('reduce-motion');
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
  var intro = document.getElementById('intro');
  if (intro && !reduce) {
    document.body.style.overflow = 'hidden';
    var done = function () { intro.classList.add('is-done'); document.body.style.overflow = ''; setTimeout(function () { if (intro && intro.parentNode) intro.parentNode.removeChild(intro); }, 700); window.removeEventListener('click', done); };
    setTimeout(done, 2000); window.addEventListener('click', done);
  } else if (intro) { intro.parentNode && intro.parentNode.removeChild(intro); }
  var header = document.getElementById('siteHeader');
  var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 40); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  var burger = document.getElementById('burger'), nav = document.getElementById('nav'), mq = window.matchMedia('(max-width:960px)'), lastFocus = null;
  function isMobile() { return mq.matches; }
  function setMenu(open) {
    nav.classList.toggle('open', open); burger.setAttribute('aria-expanded', open ? 'true' : 'false'); burger.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
    if (isMobile()) { nav.inert = !open; if (open) { lastFocus = document.activeElement; var f = nav.querySelector('a'); f && f.focus(); } else if (lastFocus) { lastFocus.focus(); } } else { nav.inert = false; }
  }
  if (burger) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A' && isMobile()) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') setMenu(false); });
    var syncMq = function () { if (!isMobile()) { nav.classList.remove('open'); nav.inert = false; burger.setAttribute('aria-expanded', 'false'); } else { if (!nav.classList.contains('open')) nav.inert = true; } };
    mq.addEventListener ? mq.addEventListener('change', syncMq) : mq.addListener(syncMq); syncMq();
  }
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  function showAll() { reveals.forEach(function (el) { el.classList.add('is-visible'); }); }
  if (reduce || !('IntersectionObserver' in window)) { showAll(); }
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    var fired = false, wd = new IntersectionObserver(function () { fired = true; wd.disconnect(); }); wd.observe(document.body); setTimeout(function () { if (!fired) showAll(); }, 1500);
  }
  var W = [[600, 780], [930, 1170]];
  var HOURS = { 1: [], 2: W, 3: W, 4: W, 5: W, 6: W, 0: [] };
  function romeNow() { return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' })); }
  function fmt(m) { var h = Math.floor(m / 60), mm = m % 60; return (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm; }
  function updateHours(lang) {
    var el = document.getElementById('hoursStatus'); if (!el) return;
    var now = romeNow(), day = now.getDay(), mins = now.getHours() * 60 + now.getMinutes();
    var wins = HOURS[day] || [], open = false, nc = null, no = null, nd = null;
    wins.forEach(function (w) { if (mins >= w[0] && mins < w[1]) { open = true; nc = w[1]; } });
    if (!open) { for (var i = 0; i < wins.length; i++) { if (mins < wins[i][0]) { no = wins[i][0]; break; } } }
    if (!open && no === null) { for (var d = 1; d <= 7; d++) { var x = (day + d) % 7; if ((HOURS[x] || []).length) { nd = { d: x, o: HOURS[x][0][0] }; break; } } }
    var t = { it: { open: 'Aperto ora', closes: 'chiude alle', closed: 'Chiuso ora', opens: 'apre oggi alle', opensDay: 'apre', days: ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'] }, en: { open: 'Open now', closes: 'closes at', closed: 'Closed now', opens: 'opens today at', opensDay: 'opens', days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] } }[lang] || {};
    var html;
    if (open) html = '<span class="dot"></span>' + t.open + ' · ' + t.closes + ' ' + fmt(nc);
    else if (no !== null) html = '<span class="dot"></span>' + t.closed + ' · ' + t.opens + ' ' + fmt(no);
    else if (nd) html = '<span class="dot"></span>' + t.closed + ' · ' + t.opensDay + ' ' + t.days[nd.d] + ' ' + fmt(nd.o);
    else html = '<span class="dot"></span>' + t.closed;
    el.className = 'hours__status ' + (open ? 'is-open' : 'is-closed'); el.innerHTML = html;
    document.querySelectorAll('.hours__table tr').forEach(function (r) { r.classList.toggle('today', parseInt(r.getAttribute('data-day'), 10) === day); });
  }
  var EN = {
    'skip': 'Skip to content', 'nav.about': 'The shop', 'nav.what': 'What you find', 'nav.gallery': 'Gallery', 'nav.where': 'Where & hours', 'nav.reviews': 'Reviews', 'cta.visit': 'Come and see us',
    'hero.eyebrow': 'Wine shop · loose wine · NoLo, Milan', 'hero.concept': 'Wine, the real thing.',
    'hero.lead': "In Salento dialect “lu mieru” means wine. And here wine is at home: loose and bottled, good and honestly priced, with Giuseppe ready to suggest the right bottle. A small neighbourhood wine shop, the way it used to be.",
    'hero.cta1': 'What you find', 'hero.cta2': 'Where we are',
    'hero.stat1': 'on Google · 35 reviews', 'hero.stat2': '& bottled', 'hero.stat3': 'Via Venini 52', 'hero.tag': 'Via Venini 52',
    'story.label': 'The shop', 'story.title': 'A bottle, and a bit of advice.',
    'story.p1': "Lu Mieru is the little wine shop on Via Venini, in the heart of NoLo. The speciality is <strong>loose wine</strong> — good, genuine, priced by the litre — but on the shelves you'll also find a carefully chosen bottled selection, from the classics to small-producer gems.",
    'story.p2': "The secret is the owner: <strong>Giuseppe</strong>, “a friend as well as truly great”, as clients write. Kind, knowledgeable, always ready to let you taste something new and find you the right wine — at the right price.",
    'story.chip1': 'Loose wine', 'story.chip2': 'Small producers', 'story.chip3': 'Honest prices',
    'what.label': 'What you find', 'what.title': 'Good wine, within everyone\'s reach.',
    'what.1t': 'Loose wine', 'what.1d': 'Our signature: quality wine by the litre. Bring your container or we give you one.',
    'what.2t': 'Bottled wines', 'what.2d': 'A careful selection, from the great classics to labels we love to share.',
    'what.3t': 'Small producers', 'what.3d': 'Natural wines and regional cellars, chosen one by one, often to taste.',
    'what.4t': 'Advice & pairings', 'what.4d': "Tell us what you're cooking or the evening you have in mind: Giuseppe finds you the right bottle.",
    'what.note': 'Honest prices, always. Drop by: the best part is getting advice.',
    'gallery.label': 'Gallery', 'gallery.title': 'Inside the shop.',
    'where.label': 'Where & hours', 'where.title': 'On Via Venini, in NoLo.',
    'day.mon': 'Monday', 'day.tue': 'Tuesday', 'day.wed': 'Wednesday', 'day.thu': 'Thursday', 'day.fri': 'Friday', 'day.sat': 'Saturday', 'day.sun': 'Sunday', 'closed': 'Closed',
    'rev.label': 'Reviews', 'rev.title': "In our clients' words.",
    'book.label': 'Contact', 'book.title': 'Drop by for a good glass.',
    'book.lead': "Looking for a bottle for dinner or want to fill your demijohn? Message us on WhatsApp or call: Giuseppe is waiting on Via Venini.",
    'book.call': 'Call · 342 515 1529',
    'faq.title': 'Frequently asked questions',
    'faq.q1': 'Do you sell loose wine?', 'faq.a1': 'Yes, it\'s our speciality: quality loose wine, priced by the litre. You can bring your own container or we provide one. Alongside there\'s also a fine bottled selection.',
    'faq.q2': 'What wines do you have?', 'faq.a2': 'Good wines at honest prices, loose and bottled, from the classics to small-producer labels. Giuseppe is always ready to suggest the right pairing.',
    'faq.q3': 'Where are you and what are your hours?', 'faq.a3': 'On Via Giulio e Corrado Venini 52, in NoLo. Open Tuesday to Saturday 10–13 and 15:30–19:30. Closed Monday and Sunday.',
    'faq.q4': 'What does “Lu Mieru” mean?', 'faq.a4': 'In Salento dialect “lu mieru” simply means “the wine”. A name that says it all.',
    'footer.where': 'Where we are', 'footer.hours': 'Tue–Sat 10–13 · 15:30–19:30 · Mon & Sun closed', 'footer.what': 'The shop', 'footer.w1': 'Loose wine · bottled wines', 'footer.w2': 'Small producers · advice & pairings', 'footer.credit': 'Demo website — Bespoke Studio',
    'ab.call': 'Call', 'ab.dir': 'Directions'
  };
  var IT = {};
  [].slice.call(document.querySelectorAll('[data-i18n]')).forEach(function (el) { IT[el.getAttribute('data-i18n')] = el.innerHTML; });
  function applyLang(lang) {
    var dict = lang === 'en' ? EN : IT;
    [].slice.call(document.querySelectorAll('[data-i18n]')).forEach(function (el) { var k = el.getAttribute('data-i18n'); if (dict[k] != null) el.innerHTML = dict[k]; });
    root.setAttribute('lang', lang);
    var it = document.querySelector('.lang__it'), en = document.querySelector('.lang__en');
    if (it && en) { it.classList.toggle('is-active', lang === 'it'); en.classList.toggle('is-active', lang === 'en'); }
    var lt = document.getElementById('langToggle'); if (lt) lt.setAttribute('aria-label', lang === 'it' ? 'Switch language to English' : 'Passa all\'italiano');
    try { localStorage.setItem('lm-lang', lang); } catch (e) {}
    updateHours(lang);
  }
  var langToggle = document.getElementById('langToggle'), curLang = 'it';
  try { curLang = localStorage.getItem('lm-lang') || 'it'; } catch (e) {}
  if (langToggle) langToggle.addEventListener('click', function () { applyLang(root.getAttribute('lang') === 'it' ? 'en' : 'it'); });
  applyLang(curLang);
  setInterval(function () { updateHours(root.getAttribute('lang')); }, 60000);
  var lb = document.getElementById('lightbox'), lbImg = document.getElementById('lightboxImg'), lbClose = document.getElementById('lightboxClose'), lbLast = null;
  function openLb(src, alt) { lbImg.src = src; lbImg.alt = alt || ''; lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); lbLast = document.activeElement; lbClose.focus(); document.body.style.overflow = 'hidden'; }
  function closeLb() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); lbImg.src = ''; document.body.style.overflow = ''; lbLast && lbLast.focus(); }
  [].slice.call(document.querySelectorAll('.shot')).forEach(function (btn) { btn.addEventListener('click', function () { var img = btn.querySelector('img'); openLb(btn.getAttribute('data-full'), img ? img.alt : ''); }); });
  lbClose && lbClose.addEventListener('click', closeLb);
  lb && lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('open')) closeLb(); });
})();
