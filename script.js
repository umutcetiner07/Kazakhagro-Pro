/* KazakhAgro — script.js
   Features: i18n, mobile nav, custom cursor, scroll reveal,
             counter animation, map tooltips, lead form        */

(function () {
  'use strict';

  /* ── i18n ─────────────────────────────────────────────── */
  let currentLang = 'ru';

  function applyLang(lang) {
    if (!window.KazakhAgroI18n || !window.KazakhAgroI18n[lang]) return;
    currentLang = lang;
    const d = window.KazakhAgroI18n[lang];

    /* text content */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (d[key] !== undefined) el.textContent = d[key];
    });

    /* innerHTML (contains HTML tags) */
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-html');
      if (d[key] !== undefined) el.innerHTML = d[key];
    });

    /* placeholders */
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-placeholder');
      if (d[key] !== undefined) el.placeholder = d[key];
    });

    /* lang buttons */
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      const pressed = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', pressed);
      btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    });

    /* html lang attribute */
    document.documentElement.lang = lang;

    /* page title */
    const titles = {
      ru: 'KazakhAgro | AI-тепличный комплекс на гидропонике — Инвестиционная платформа',
      en: 'KazakhAgro | AI-Driven Hydroponic Greenhouse — Investment Platform',
      kk: 'KazakhAgro | AI гидропоникалық теплица — Инвестициялық платформа',
      tr: 'KazakhAgro | YZ Destekli Hidroponik Sera — Yatırım Platformu',
    };
    if (titles[lang]) document.title = titles[lang];

    /* nav toggle aria-label */
    const toggle = document.querySelector('.nav-toggle');
    if (toggle && d.aria_menu) toggle.setAttribute('aria-label', d.aria_menu);

    /* map SVG city labels */
    updateMapLabels(d);
  }

  function updateMapLabels(d) {
    var pairs = [
      ['city_almaty', '[data-city="almaty"] text'],
      ['city_shymkent', '[data-city="shymkent"] text'],
      ['city_astana', '[data-city="astana"] text'],
    ];
    pairs.forEach(function (p) {
      var el = document.querySelector(p[1]);
      if (el && d[p[0]]) el.textContent = d[p[0]];
    });
  }

  /* bind lang buttons */
  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLang(btn.getAttribute('data-lang'));
    });
  });

  /* ── MOBILE NAV ───────────────────────────────────────── */
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      var d = window.KazakhAgroI18n[currentLang] || {};
      navToggle.setAttribute('aria-label', open ? (d.aria_menu_close || 'Закрыть') : (d.aria_menu || 'Открыть меню'));
    });

    /* close on nav link click */
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── HEADER SCROLL ────────────────────────────────────── */
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── CUSTOM CURSOR ────────────────────────────────────── */
  var curDot = document.getElementById('cursor-dot');
  var curRing = document.getElementById('cursor-ring');

  if (curDot && curRing) {
    var mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      curDot.style.left = mx + 'px';
      curDot.style.top = my + 'px';
    });

    (function animRing() {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      curRing.style.left = rx + 'px';
      curRing.style.top = ry + 'px';
      requestAnimationFrame(animRing);
    })();

    /* hide cursor when leaving window */
    document.addEventListener('mouseleave', function () {
      curDot.style.opacity = '0';
      curRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      curDot.style.opacity = '1';
      curRing.style.opacity = '1';
    });
  }

  /* ── SCROLL REVEAL ────────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.classList.add('in');
          }, i * 60);
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    /* fallback: show all */
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ── COUNTER ANIMATION ────────────────────────────────── */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var start = null;
    var duration = 1400;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); /* easeOutCubic */
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statsSection = document.querySelector('.stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    var statsObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.count').forEach(animateCount);
          statsObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statsObs.observe(statsSection);
  }

  /* ── MAP TOOLTIPS ─────────────────────────────────────── */
  var mapTooltip = document.getElementById('map-tooltip');
  var mapVisual = document.querySelector('.map-visual');

  if (mapTooltip && mapVisual) {
    document.querySelectorAll('.map-pin').forEach(function (pin) {
      pin.addEventListener('mouseenter', function () {
        var city = pin.getAttribute('data-city');
        var d = window.KazakhAgroI18n[currentLang] || window.KazakhAgroI18n.ru;
        var key = 'city_tooltip_' + city;
        mapTooltip.textContent = d[key] || city;
        mapTooltip.classList.add('show');
      });
      pin.addEventListener('mouseleave', function () {
        mapTooltip.classList.remove('show');
      });
    });

    /* highlight matching city card */
    document.querySelectorAll('.map-pin').forEach(function (pin) {
      pin.addEventListener('mouseenter', function () {
        var city = pin.getAttribute('data-city');
        document.querySelectorAll('.map-city-card').forEach(function (card) {
          card.style.opacity = card.getAttribute('data-city') === city ? '1' : '0.5';
        });
      });
      pin.addEventListener('mouseleave', function () {
        document.querySelectorAll('.map-city-card').forEach(function (card) {
          card.style.opacity = '';
        });
      });
    });

    /* reverse: hover city card → highlight pin */
    document.querySelectorAll('.map-city-card').forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        var city = card.getAttribute('data-city');
        document.querySelectorAll('.map-pin').forEach(function (pin) {
          pin.style.opacity = pin.getAttribute('data-city') === city ? '1' : '0.35';
        });
      });
      card.addEventListener('mouseleave', function () {
        document.querySelectorAll('.map-pin').forEach(function (pin) {
          pin.style.opacity = '';
        });
      });
    });
  }

  /* ── LEAD FORM ────────────────────────────────────────── */
  var formSubmit = document.getElementById('form-submit');
  var formWrap = document.getElementById('lead-form-wrap');
  var formSuccess = document.getElementById('form-success');

  if (formSubmit && formWrap && formSuccess) {
    formSubmit.addEventListener('click', function () {
      var name = document.getElementById('f-name').value.trim();
      var email = document.getElementById('f-email').value.trim();
      var d = window.KazakhAgroI18n[currentLang] || window.KazakhAgroI18n.ru;

      if (!name || !email) {
        var msg = currentLang === 'en' ? 'Please fill in Name and Email.'
          : currentLang === 'tr' ? 'Lütfen Ad ve Email alanlarını doldurun.'
          : currentLang === 'kk' ? 'Аты мен Email толтырыңыз.'
          : 'Заполните имя и email.';
        alert(msg);
        return;
      }

      /* build mailto */
      var type = document.getElementById('f-type').value;
      var company = document.getElementById('f-company').value;
      var phone = document.getElementById('f-phone').value;
      var msg2 = document.getElementById('f-msg').value;

      var subject = 'KazakhAgro — ' + type + ' — ' + name;
      var body = 'Name: ' + name + '\nCompany: ' + company + '\nPhone: ' + phone
        + '\nType: ' + type + '\n\n' + msg2;

      window.location.href = 'mailto:umutcetiner@gmail.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);

      /* show success */
      formWrap.style.display = 'none';
      formSuccess.style.display = 'block';
    });
  }

  /* ── FOOTER YEAR ──────────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── INIT LANG ────────────────────────────────────────── */
  applyLang('ru');

})();
