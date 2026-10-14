"use strict";

/**
 * header.js – 스크롤 시 헤더 변경, 모바일 메뉴, 로고 이미지 대체 처리
 * - 헤더/푸터의 로고 이미지(images/logo.png)를 불러오지 못하면 텍스트 로고(OCEAN VIEW)로 자동 대체합니다.
 */
(function (global) {
  const U = global.Hotel.Util;

  /** 로고 이미지가 없을 때 텍스트 로고로 대체 */
  function initLogoFallback() {
    U.qsa(".logo-img").forEach(function (img) {
      const logo = img.closest(".logo");
      if (!logo) { return; }
      const useText = function () { logo.classList.add("is-fallback"); };
      img.addEventListener("error", useText);
      // 이미 로딩 실패한 경우(이벤트를 놓친 경우)까지 대비
      if (img.complete && img.naturalWidth === 0) { useText(); }
    });
  }

  global.Hotel.Header = {
    init: function () {
      const header = U.qs("#header");
      const toggle = U.qs("#menuToggle");
      const gnb = U.qs("#gnb");

      initLogoFallback();
      if (!header) { return; }

      const onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 40);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      if (toggle && gnb) {
        toggle.addEventListener("click", function () {
          const open = gnb.classList.toggle("is-open");
          toggle.classList.toggle("is-open", open);
          toggle.setAttribute("aria-expanded", String(open));
        });
        // 이벤트 위임: 메뉴 링크 클릭 시 닫기
        gnb.addEventListener("click", function (e) {
          if (e.target.closest("a")) {
            gnb.classList.remove("is-open");
            toggle.classList.remove("is-open");
          }
        });
      }
    }
  };
})(window);
