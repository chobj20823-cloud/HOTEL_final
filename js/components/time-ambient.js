"use strict";

/**
 * time-ambient.js – 낮, 일몰, 밤 시간대별 앰비언스 체인저
 * 인피니티 풀 배경 이미지, 텍스트 카피, 배경 테마 색상을 유기적으로 전환합니다.
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
    current: "day",
    autoPlayTimer: null,
    themesList: ["day", "sunset", "night"],

    init: function () {
      const container = document.querySelector(".time-ambient-nav");
      if (!container) return;

      const buttons = container.querySelectorAll(".time-btn");
      const heroSection = document.getElementById("booking");
      const heroContent = heroSection ? heroSection.querySelector(".hero-content") : null;
      const layers = document.querySelectorAll(".hero-bg-layer");

      if (!buttons.length || !layers.length) return;

      const self = this;

      function switchTheme(themeKey, isManual) {
        if (!THEMES[themeKey] || self.current === themeKey) return;
        self.current = themeKey;

        // 1. 버튼 상태 업데이트
        buttons.forEach(function (btn) {
          const isActive = btn.dataset.time === themeKey;
          btn.classList.toggle("is-active", isActive);
          btn.setAttribute("aria-selected", isActive ? "true" : "false");
          btn.tabIndex = isActive ? 0 : -1;
        });

        // 2. 바디 테마 데이터 속성 (CSS 변수 및 오버레이 반영)
        document.body.setAttribute("data-theme", themeKey);

        // 3. 배경 레이어 크로스페이드
        layers.forEach(function (layer) {
          const match = layer.dataset.themeLayer === themeKey;
          layer.classList.toggle("is-active", match);
        });

        // 4. 히어로 카피 텍스트 크로스페이드
        if (heroContent) {
          heroContent.classList.add("is-changing");
          setTimeout(function () {
            const data = THEMES[themeKey];
            const eyebrowEl = heroContent.querySelector(".eyebrow");
            const h1El = heroContent.querySelector("h1");
            const pEl = heroContent.querySelector("p");

            if (eyebrowEl) eyebrowEl.textContent = data.eyebrow;
            if (h1El) h1El.innerHTML = data.title;
            if (pEl) pEl.textContent = data.desc;

            heroContent.classList.remove("is-changing");
          }, 300);
        }

        // 사용자가 직접 클릭했을 때 자동 순환 타이머 리셋
        if (isManual) {
          self.restartAutoPlay();
        }
      }

      // 클릭 이벤트 등록
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          const targetTheme = this.dataset.time;
          switchTheme(targetTheme, true);
        });

        // 키보드 접근성 (좌/우 방향키 지원)
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

      // 초기 테마 설정
      document.body.setAttribute("data-theme", "day");

      // 12초마다 자동 순환 (은은한 앰비언스 쇼케이스)
      self.startAutoPlay(switchTheme);
    },

    startAutoPlay: function (switchFn) {
      const self = this;
      this.autoPlayTimer = setInterval(function () {
        const currIndex = self.themesList.indexOf(self.current);
        const nextIndex = (currIndex + 1) % self.themesList.length;
        switchFn(self.themesList[nextIndex], false);
      }, 12000);
    },

    restartAutoPlay: function () {
      if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer);
      }
      const self = this;
      const container = document.querySelector(".time-ambient-nav");
      if (!container) return;
      const layers = document.querySelectorAll(".hero-bg-layer");
      const heroSection = document.getElementById("booking");
      const heroContent = heroSection ? heroSection.querySelector(".hero-content") : null;
      const buttons = container.querySelectorAll(".time-btn");

      this.autoPlayTimer = setInterval(function () {
        const currIndex = self.themesList.indexOf(self.current);
        const nextIndex = (currIndex + 1) % self.themesList.length;
        const nextTheme = self.themesList[nextIndex];

        self.current = nextTheme;
        buttons.forEach(function (btn) {
          const isActive = btn.dataset.time === nextTheme;
          btn.classList.toggle("is-active", isActive);
          btn.setAttribute("aria-selected", isActive ? "true" : "false");
          btn.tabIndex = isActive ? 0 : -1;
        });
        document.body.setAttribute("data-theme", nextTheme);
        layers.forEach(function (layer) {
          layer.classList.toggle("is-active", layer.dataset.themeLayer === nextTheme);
        });
        if (heroContent) {
          heroContent.classList.add("is-changing");
          setTimeout(function () {
            const data = THEMES[nextTheme];
            const eyebrowEl = heroContent.querySelector(".eyebrow");
            const h1El = heroContent.querySelector("h1");
            const pEl = heroContent.querySelector("p");
            if (eyebrowEl) eyebrowEl.textContent = data.eyebrow;
            if (h1El) h1El.innerHTML = data.title;
            if (pEl) pEl.textContent = data.desc;
            heroContent.classList.remove("is-changing");
          }, 300);
        }
      }, 12000);
    }
  };

  Hotel.TimeAmbient = TimeAmbient;
})(window);
