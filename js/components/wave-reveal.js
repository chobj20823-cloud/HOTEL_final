"use strict";

/**
 * wave-reveal.js – 파도 물결 스크롤 리빌 (재실행 지원)
 *
 * [진입] IntersectionObserver → 섹션 20% + 하단 80px 안쪽 → 애니메이션 실행
 * [초기화] scroll 이벤트 → getBoundingClientRect().bottom <= 0
 *           (섹션이 뷰포트 위쪽으로 완전히 사라졌을 때) → 즉시 리셋
 *           void offsetWidth 강제 리플로우로 중간 상태 없이 깔끔하게 초기화
 */
(function (global) {
  const Hotel = global.Hotel || (global.Hotel = {});

  const WaveReveal = {
    init: function () {
      const waveWrapper = document.querySelector(".ocean-wave-wrapper");

      const sections = Array.from(
        document.querySelectorAll("main > section:not(.hero), main > div:not(.hero)")
      );
      if (!sections.length) return;

      const targetSelectors = [
        ".section-title",
        ".room-card",
        ".story-wrap > div",
        ".story-wrap > img",
        ".split .photo",
        ".split .text",
        ".fac-item"
      ];

      // 박스에 wave-box + stagger 딜레이 부여
      sections.forEach(function (section) {
        const boxes = section.querySelectorAll(targetSelectors.join(", "));
        boxes.forEach(function (box, idx) {
          box.classList.add("wave-box");
          box.style.setProperty("--wave-delay", (idx * 0.18) + "s");
        });
      });

      /* ── 헬퍼: 섹션 박스 즉시 리셋 ─────────────────────────────────── */
      function resetSection(section) {
        if (section.id === "rooms" && waveWrapper) {
          waveWrapper.classList.remove("is-surging");
        }
        section.querySelectorAll(".wave-box").forEach(function (box) {
          if (!box.classList.contains("is-floated")) return; // 이미 리셋됨
          box.style.transition = "none";          // ① transition OFF
          box.classList.remove("is-floated");     // ② 초기 위치로 즉시 이동
          void box.offsetWidth;                   // ③ 강제 리플로우 (동기 적용)
          box.style.transition = "";              // ④ transition 복구
        });
      }

      /* ── ① 진입 Observer : 파도 애니메이션 실행 ────────────────────── */
      const entryObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const section = entry.target;

          if (section.id === "rooms" && waveWrapper) {
            waveWrapper.classList.add("is-surging");
          }
          section.querySelectorAll(".wave-box").forEach(function (box) {
            box.classList.add("is-floated");
          });
        });
      }, {
        threshold: 0.20,
        rootMargin: "0px 0px -80px 0px"
      });

      sections.forEach(function (section) {
        entryObserver.observe(section);
      });

      /* ── ② 스크롤 감지: 섹션이 위로 완전히 사라지면 리셋 ───────────── */
      // rAF throttle 로 성능 보호
      let ticking = false;
      function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          sections.forEach(function (section) {
            const rect = section.getBoundingClientRect();
            // 섹션 하단이 뷰포트 위쪽(0)보다 위 → 완전히 사라진 상태
            if (rect.bottom <= 0) {
              resetSection(section);
            }
          });
          ticking = false;
        });
      }

      window.addEventListener("scroll", onScroll, { passive: true });
    }
  };

  Hotel.WaveReveal = WaveReveal;
})(window);
