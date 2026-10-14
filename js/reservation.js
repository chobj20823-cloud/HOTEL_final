"use strict";

/** reservation.js – 예약 페이지 엔트리: 컴포넌트 초기화 */
(function (global) {
  document.addEventListener("DOMContentLoaded", function () {
    global.Hotel.Header.init();
    global.Hotel.ReservationFlow.init();
  });
})(window);
