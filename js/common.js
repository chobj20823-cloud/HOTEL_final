"use strict";

/**
 * common.js – 네임스페이스(Hotel)와 공통 유틸리티
 * 전역 오염을 막기 위해 window.Hotel 하나만 사용합니다.
 */
(function (global) {
  const Hotel = global.Hotel || {};

  /** 객실 데이터 (수정 방지를 위해 freeze) */
  Hotel.ROOMS = Object.freeze([
    Object.freeze({ id: "deluxe", name: "디럭스 오션", desc: "침대 1 · 최대 2인 · 32㎡ · 오션뷰", price: 220000, image: "images/ref/img_room1.jpg", capacity: 2 }),
    Object.freeze({ id: "premier", name: "프리미어 오션", desc: "침대 2 · 최대 3인 · 42㎡ · 파노라마 오션뷰", price: 320000, image: "images/ref/img_room2.jpg", capacity: 3 }),
    Object.freeze({ id: "suite", name: "스카이 스위트", desc: "침대 2 · 최대 4인 · 66㎡ · 프라이빗 테라스", price: 520000, image: "images/ref/img_room_detail_top1.png", capacity: 4 })
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
