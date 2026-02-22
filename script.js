(function () {
  'use strict';

  var STORAGE_KEY = 'kazakhagro-lang';
  var DEFAULT_LANG = 'ru';
  var LANGS = ['ru', 'en', 'kk'];

  var header = document.querySelector('.site-header');
  var nav = header && header.querySelector('.nav');
  var toggle = header && header.querySelector('.nav-toggle');
  var yearEl = document.getElementById('year');
  var translations = window.KazakhAgroI18n;

  function getLang() {
    var stored = typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY);
    return stored && LANGS.indexOf(stored) !== -1 ? stored : DEFAULT_LANG;
  }

  function setLang(lang) {
    if (LANGS.indexOf(lang) === -1) return;
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'kk' ? 'kk' : lang === 'en' ? 'en' : 'ru';
    applyTranslations(lang);
    updateLangButtons(lang);
    updateAriaLabel(lang);
  }

  function applyTranslations(lang) {
    if (!translations || !translations[lang]) return;
    var t = translations[lang];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] != null) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (t[key] != null) el.innerHTML = t[key];
    });
  }

  function updateLangButtons(lang) {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });
  }

  function updateAriaLabel(lang) {
    if (!toggle || !translations || !translations[lang]) return;
    var open = nav && nav.classList.contains('is-open');
    toggle.setAttribute('aria-label', open ? translations[lang].aria_menu_close : translations[lang].aria_menu);
  }

  function setYear() {
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  function initNav() {
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
      var lang = getLang();
      if (translations && translations[lang]) {
        toggle.setAttribute('aria-label', open ? translations[lang].aria_menu_close : translations[lang].aria_menu);
      } else {
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      }
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.matchMedia('(max-width: 768px)').matches) {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          var lang = getLang();
          if (translations && translations[lang]) {
            toggle.setAttribute('aria-label', translations[lang].aria_menu);
          }
        }
      });
    });
  }

  function initLangSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        if (lang) setLang(lang);
      });
    });
  }

  setYear();
  setLang(getLang());
  initNav();
  initLangSwitcher();
})();
