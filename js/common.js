"use strict";

/**
 * common.js – 네임스페이스(Hotel)와 공통 유틸리티
 * 전역 오염을 막기 위해 window.Hotel 하나만 사용합니다.
 */
(function (global) {
  const Hotel = global.Hotel || {};

  /** 윈덤 강원고성 객실 데이터 (전체 6개 시그니처 룸 동기화) */
  Hotel.ROOMS = Object.freeze([
    Object.freeze({
      id: "deluxe-king",
      aliases: ["deluxe", "king"],
      name: "디럭스 오션 킹",
      desc: "시몬스 뷰티레스트 프리미엄 킹 · 전면 오션뷰 · 36㎡ (약 11평)",
      price: 240000,
      image: "images/rooms/room_top1.png",
      capacity: 2
    }),
    Object.freeze({
      id: "deluxe-twin",
      aliases: ["twin"],
      name: "디럭스 오션 트윈",
      desc: "독립 슈퍼싱글 베드 2개 · 발코니 티테이블 · 38㎡ (약 11.5평)",
      price: 260000,
      image: "images/rooms/room_top4.png",
      capacity: 3
    }),
    Object.freeze({
      id: "premier-terrace",
      aliases: ["premier", "terrace"],
      name: "프리미어 오션 테라스",
      desc: "광폭 테라스 · 독립형 바다 조망 욕조 · 48㎡ (약 14.5평)",
      price: 350000,
      image: "images/rooms/room_top7.png",
      capacity: 3
    }),
    Object.freeze({
      id: "executive-suite",
      aliases: ["suite", "executive"],
      name: "이그제큐티브 스위트",
      desc: "침실·거실 분리형 · EFL 라운지 2인 무료 · 월풀 스파 · 72㎡ (약 22평)",
      price: 520000,
      image: "images/rooms/efl_top1.png",
      capacity: 3
    }),
    Object.freeze({
      id: "family-suite",
      aliases: ["family"],
      name: "패밀리 오션 스위트",
      desc: "2베드룸 (킹1+싱글2)+2욕실 · 6인 다이닝 · 85㎡ (약 26평)",
      price: 610000,
      image: "images/rooms/room_top10.png",
      capacity: 6
    }),
    Object.freeze({
      id: "presidential-penthouse",
      aliases: ["penthouse", "presidential"],
      name: "프레지덴셜 펜트하우스",
      desc: "28층 최상층 단독 · 루프탑 야외 자쿠지 풀 · 전담 버틀러 VIP · 145㎡ (약 44평)",
      price: 1400000,
      image: "images/rooms/efl_top4.png",
      capacity: 6
    })
  ]);

  Hotel.Util = Object.freeze({
    qs: function (selector, root) { return (root || document).querySelector(selector); },
    qsa: function (selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); },

    /** Date → "YYYY-MM-DD" (로컬 시간 기준) */
    toISODate: function (date) {
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return date.getFullYear() + "-" + m + "-" + d;
    },

    /** "YYYY-MM-DD" → Date (로컬 자정) */
    parseISODate: function (str) {
      const parts = String(str).split("-");
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    },

    addDays: function (date, days) {
      const copy = new Date(date.getTime());
      copy.setDate(copy.getDate() + days);
      return copy;
    },

    nightsBetween: function (checkIn, checkOut) {
      return Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000);
    },

    formatPrice: function (num) { return Number(num).toLocaleString("ko-KR") + "원"; },

    /** XSS 방지용 이스케이프 */
    escapeHtml: function (text) {
      return String(text).replace(/[&<>"']/g, function (ch) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
      });
    }
  });

  global.Hotel = Hotel;
})(window);
