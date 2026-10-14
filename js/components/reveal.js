"use strict";

/** reveal.js – 스크롤 시 요소 등장 애니메이션 */
(function (global) {
  const U = global.Hotel.Util;

  global.Hotel.Reveal = {
    init: function () {
      const targets = U.qsa(".reveal");
      if (!("IntersectionObserver" in window)) {
        targets.forEach(function (el) { el.classList.add("is-visible"); });
        return;
      }
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      targets.forEach(function (el) { observer.observe(el); });
    }
  };
})(window);
