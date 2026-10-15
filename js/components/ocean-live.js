"use strict";

/**
 * ocean-live.js – 고성 바다 실시간 라이브 인포 & 파도 ASMR 사운드 엔진
 * Web Audio API를 활용하여 외부 오디오 파일 없이 잔잔한 바다 파도 소리를 실시간 합성/재생합니다.
 */
(function (global) {
  const Hotel = global.Hotel || (global.Hotel = {});

  const OceanSoundEngine = {
    audioCtx: null,
    isPlaying: false,
    noiseNode: null,
    filterNode: null,
    gainNode: null,
    lfoNode: null,
    lfoGain: null,

    initAudio: function () {
      if (this.audioCtx) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      this.audioCtx = new AudioContext();

      // 1. 핑크 노이즈 (Pink Noise) 생성 (파도의 기본 백색소음)
      const bufferSize = this.audioCtx.sampleRate * 3;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }

      this.noiseNode = this.audioCtx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      // 2. 바다 물결 느낌의 로우패스 필터 (BiquadFilter)
      this.filterNode = this.audioCtx.createBiquadFilter();
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setValueAtTime(650, this.audioCtx.currentTime);
      this.filterNode.Q.setValueAtTime(1.5, this.audioCtx.currentTime);

      // 3. 파도가 밀려오고 쓸려나가는 주기적 LFO (약 5초 주기)
      this.lfoNode = this.audioCtx.createOscillator();
      this.lfoNode.type = "sine";
      this.lfoNode.frequency.setValueAtTime(0.18, this.audioCtx.currentTime); // ~5.5초 주기

      this.lfoGain = this.audioCtx.createGain();
      this.lfoGain.gain.setValueAtTime(320, this.audioCtx.currentTime);

      this.lfoNode.connect(this.lfoGain);
      this.lfoGain.connect(this.filterNode.frequency);

      // 4. 마스터 게인 노드 (볼륨 조절 및 페이드인/아웃)
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);

      // 연결 파이프라인
      this.noiseNode.connect(this.filterNode);
      this.filterNode.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.noiseNode.start();
      this.lfoNode.start();
    },

    toggle: function () {
      this.initAudio();
      if (!this.audioCtx) return false;

      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      if (!this.isPlaying) {
        // 페이드인 (1.5초)
        this.gainNode.gain.cancelScheduledValues(now);
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
        this.gainNode.gain.linearRampToValueAtTime(0.42, now + 1.5);
        this.isPlaying = true;
      } else {
        // 페이드아웃 (1.5초)
        this.gainNode.gain.cancelScheduledValues(now);
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
        this.gainNode.gain.linearRampToValueAtTime(0, now + 1.5);
        this.isPlaying = false;
      }
      return this.isPlaying;
    }
  };

  const OceanLive = {
    init: function () {
      const soundBtn = document.getElementById("btnOceanSound");
      const statusText = soundBtn ? soundBtn.querySelector(".sound-status") : null;
      const waveIcon = soundBtn ? soundBtn.querySelector(".sound-wave") : null;
      const countdownEl = document.getElementById("sunriseCountdown");

      // 파도 사운드 토글 리스너
      if (soundBtn) {
        soundBtn.addEventListener("click", function () {
          const playing = OceanSoundEngine.toggle();
          soundBtn.classList.toggle("is-active", playing);
          soundBtn.setAttribute("aria-pressed", String(playing));
          if (statusText) statusText.textContent = playing ? "ON" : "OFF";
          if (waveIcon) waveIcon.classList.toggle("is-playing", playing);

          // 사운드 켜질 때 전체 히어로에 은은한 오션 펄스 피드백
          const hero = document.getElementById("booking");
          if (hero) hero.classList.toggle("has-ocean-sound", playing);
        });
      }

      // 일출 카운트다운 타이머
      function updateSunriseCountdown() {
        if (!countdownEl) return;
        const now = new Date();
        const tomorrowSunrise = new Date();
        tomorrowSunrise.setHours(6, 14, 0, 0);
        if (now.getHours() >= 6 && (now.getHours() > 6 || now.getMinutes() >= 14)) {
          tomorrowSunrise.setDate(tomorrowSunrise.getDate() + 1);
        }
        const diffMs = tomorrowSunrise.getTime() - now.getTime();
        const diffHours = Math.floor(diffMs / 3600000);
        const diffMins = Math.floor((diffMs % 3600000) / 60000);
        countdownEl.textContent = `${diffHours}시간 ${diffMins}분 후`;
      }

      updateSunriseCountdown();
      setInterval(updateSunriseCountdown, 60000);
    }
  };

  Hotel.OceanLive = OceanLive;
})(window);
