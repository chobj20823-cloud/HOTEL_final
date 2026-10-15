"use strict";

/**
 * time-ambient.js – 낮, 일몰, 밤 시간대별 앰비언스 체인저
 * 
 * [동작 방식]
 * 1. 실시간 시계 연동: 페이지 최초 로드 시 실제 접속 시간에 맞춰 시작 풍경을 자동 결정합니다.
 *    - 06:00 ~ 17:00 : DAY (눈부신 청정 오션뷰)
 *    - 17:00 ~ 20:00 : SUNSET (골든 아워 노을빛 인피니티 풀)
 *    - 20:00 ~ 06:00 : NIGHT (문라이트 별빛 야경 풀)
 * 2. 수동 선택: 상단 DAY / SUNSET / NIGHT 버튼을 클릭하여 원하는 시간대 풍경으로 즉시 감상 가능합니다.
 * 3. 자동 전환 없음: 사용자의 의사와 무관하게 시간이 지나 멋대로 바뀌지 않습니다.
 */
(function (global) {
  const Hotel = global.Hotel || (global.Hotel = {});

  const THEMES = {
    day: {
      eyebrow: "WYNDHAM GOSEONG · INFINITY POOL",
      title: "ENDLESS BLUE,<br>PERFECT MOMENT",
      desc: "청정 동해 바다와 맞닿은 루프탑 인피니티 풀에서 눈부신 햇살과 함께 온전한 휴식을 경험하세요.",
      themeColor: "#0284c7"
    },
    sunset: {
      eyebrow: "GOLDEN TWILIGHT IN GOSEONG",
      title: "BURNING SKY,<br>ROMANTIC TIDE",
      desc: "설악산과 고성 바다가 붉고 찬란한 보랏빛으로 물드는 시간. 노을빛이 수면에 일렁이는 로맨틱한 순간을 마주합니다.",
      themeColor: "#ea580c"
    },
    night: {
      eyebrow: "STARLIT NIGHT OCEAN",
      title: "WHISPERING WAVES,<br>SILENT LUXURY",
      desc: "은은한 수중 조명과 쏟아지는 별빛 아래, 파도 소리만이 고요히 흐르는 밤의 인피니티 풀에서 감미로운 휴식을 취하세요.",
      themeColor: "#38bdf8"
    }
  };

  const TimeAmbient = {
    current: null,
    themesList: ["day", "sunset", "night"],

    /**
     * 접속 시각 기준 테마 판별:
     * - 06시 이상 ~ 17시 미만: day
     * - 17시 이상 ~ 20시 미만: sunset
     * - 20시 이상 ~ 06시 미만: night
     */
    getTimeBasedTheme: function () {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 17) {
        return "day";
      } else if (hour >= 17 && hour < 20) {
        return "sunset";
      } else {
        return "night";
      }
    },

    init: function () {
      const container = document.querySelector(".time-ambient-nav");
      if (!container) return;

      const buttons = container.querySelectorAll(".time-btn");
      const heroSection = document.getElementById("booking") || document.querySelector(".hero");
      const heroContent = heroSection ? heroSection.querySelector(".hero-content") : null;
      const layers = document.querySelectorAll(".hero-bg-layer");

      if (!buttons.length || !layers.length) return;

      const self = this;

      function switchTheme(themeKey, animateText) {
        if (!THEMES[themeKey] || self.current === themeKey) return;
        self.current = themeKey;

        // 1. 버튼 상태 업데이트
        buttons.forEach(function (btn) {
          const isActive = btn.dataset.time === themeKey;
          btn.classList.toggle("is-active", isActive);
          btn.setAttribute("aria-selected", isActive ? "true" : "false");
          btn.tabIndex = isActive ? 0 : -1;
        });

        // 2. 바디 테마 데이터 속성
        document.body.setAttribute("data-theme", themeKey);

        // 3. 배경 레이어 크로스페이드
        layers.forEach(function (layer) {
          const match = layer.dataset.themeLayer === themeKey;
          layer.classList.toggle("is-active", match);
        });

        // 4. 히어로 카피 텍스트 크로스페이드
        if (heroContent) {
          const data = THEMES[themeKey];
          const eyebrowEl = heroContent.querySelector(".eyebrow");
          const h1El = heroContent.querySelector("h1");
          const pEl = heroContent.querySelector("p");

          if (animateText) {
            heroContent.classList.add("is-changing");
            setTimeout(function () {
              if (eyebrowEl) eyebrowEl.textContent = data.eyebrow;
              if (h1El) h1El.innerHTML = data.title;
              if (pEl) pEl.textContent = data.desc;
              heroContent.classList.remove("is-changing");
            }, 300);
          } else {
            // 첫 진입 시 깜빡임 없이 즉시 반영
            if (eyebrowEl) eyebrowEl.textContent = data.eyebrow;
            if (h1El) h1El.innerHTML = data.title;
            if (pEl) pEl.textContent = data.desc;
          }
        }
      }

      // 클릭 이벤트 등록 (수동 전환)
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          const targetTheme = this.dataset.time;
          switchTheme(targetTheme, true);
        });

        // 키보드 접근성 (좌/우/상/하 방향키 지원)
        btn.addEventListener("keydown", function (e) {
          let targetIndex = -1;
          const currIndex = self.themesList.indexOf(self.current);

          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            targetIndex = (currIndex + 1) % self.themesList.length;
          } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            targetIndex = (currIndex - 1 + self.themesList.length) % self.themesList.length;
          }

          if (targetIndex >= 0) {
            const nextTheme = self.themesList[targetIndex];
            const nextBtn = container.querySelector(`[data-time="${nextTheme}"]`);
            if (nextBtn) {
              nextBtn.focus();
              switchTheme(nextTheme, true);
            }
          }
        });
      });

      // 인라인 스크립트로 이미 적용된 테마가 있으면 그 상태를 유지 (깜빡임 완전 방지)
      const initialTheme = global.__INITIAL_THEME__ || self.getTimeBasedTheme();
      self.current = initialTheme;
      document.body.setAttribute("data-theme", initialTheme);
    }
  };

  Hotel.TimeAmbient = TimeAmbient;
})(window);
