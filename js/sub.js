"use strict";

/** sub.js – 카테고리 서브페이지 공통 엔트리: 필요한 컴포넌트만 안전하게 초기화 */
(function (global) {
  document.addEventListener("DOMContentLoaded", function () {
    const H = global.Hotel;
    if (!H) { return; }
    if (H.Header) { H.Header.init(); }
    if (H.Reveal) { H.Reveal.init(); }
    if (H.Tabs) { H.Tabs.init(); }
  });
})(window);
