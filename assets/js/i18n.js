/*
  Site-wide EN/HI language switcher.
  Reads translations from window.CVD_I18N_COMMON (shared nav/footer, loaded on every
  page) and window.CVD_I18N_PAGE (page-specific strings, loaded only on that page).
  Elements opt in with data-i18n="key" (replaces innerHTML) or
  data-i18n-attr="attr1:key1|attr2:key2" (replaces one or more attributes).
  Each dictionary entry is {en: "...", hi: "..."}.
*/
(function () {
  "use strict";

  var STORAGE_KEY = "cvd_lang";

  function getStoredLang() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore (private browsing, etc.) */
    }
  }

  function getLang() {
    return getStoredLang() === "hi" ? "hi" : "en";
  }

  function buildDictionary() {
    var dict = {};
    if (window.CVD_I18N_COMMON) {
      for (var k1 in window.CVD_I18N_COMMON) {
        if (Object.prototype.hasOwnProperty.call(window.CVD_I18N_COMMON, k1)) {
          dict[k1] = window.CVD_I18N_COMMON[k1];
        }
      }
    }
    if (window.CVD_I18N_PAGE) {
      for (var k2 in window.CVD_I18N_PAGE) {
        if (Object.prototype.hasOwnProperty.call(window.CVD_I18N_PAGE, k2)) {
          dict[k2] = window.CVD_I18N_PAGE[k2];
        }
      }
    }
    return dict;
  }

  function valueFor(entry, lang) {
    if (!entry) return null;
    return entry[lang] || entry.en || null;
  }

  function applyLang(lang) {
    var dict = buildDictionary();

    document.documentElement.setAttribute("lang", lang === "hi" ? "hi" : "en");
    document.documentElement.setAttribute("data-lang", lang);

    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var val = valueFor(dict[el.getAttribute("data-i18n")], lang);
      if (val != null) el.innerHTML = val;
    }

    var attrNodes = document.querySelectorAll("[data-i18n-attr]");
    for (var j = 0; j < attrNodes.length; j++) {
      var attrEl = attrNodes[j];
      var pairs = attrEl.getAttribute("data-i18n-attr").split("|");
      for (var p = 0; p < pairs.length; p++) {
        var parts = pairs[p].split(":");
        if (parts.length < 2) continue;
        var attrName = parts[0];
        var attrKey = parts.slice(1).join(":");
        var attrVal = valueFor(dict[attrKey], lang);
        if (attrVal != null) attrEl.setAttribute(attrName, attrVal);
      }
    }

    var toggles = document.querySelectorAll(".cvd-lang-toggle [data-lang-option]");
    for (var t = 0; t < toggles.length; t++) {
      var isActive = toggles[t].getAttribute("data-lang-option") === lang;
      toggles[t].classList.toggle("is-active", isActive);
      toggles[t].setAttribute("aria-pressed", isActive ? "true" : "false");
    }
  }

  function setLang(lang) {
    var next = lang === "hi" ? "hi" : "en";
    storeLang(next);
    applyLang(next);
  }

  function init() {
    applyLang(getLang());

    var toggles = document.querySelectorAll(".cvd-lang-toggle");
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].addEventListener("click", function (e) {
        var opt = e.target.closest ? e.target.closest("[data-lang-option]") : null;
        if (!opt) return;
        setLang(opt.getAttribute("data-lang-option"));
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.CVD_I18N = { apply: applyLang, getLang: getLang, setLang: setLang };
})();
