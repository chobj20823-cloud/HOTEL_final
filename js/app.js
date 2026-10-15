"use strict";

/** app.js – 메인페이지 엔트리: 컴포넌트 초기화 */
(function (global) {
  document.addEventListener("DOMContentLoaded", function () {
    const H = global.Hotel;
    H.Header.init();
    H.Reveal.init();
    H.BookingBar.init();
    if (H.TimeAmbient) H.TimeAmbient.init();
  });
})(window);
