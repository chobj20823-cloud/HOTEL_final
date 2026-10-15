"use strict";

/**
 * reservation-flow.js – 예약 페이지의 단계별 진행
 * ---------------------------------------------------------------------------
 * - rooms.html에서 [이 객실 예약하기] 클릭 시 (?room=...):
 *   방은 이미 골랐으므로 ① 일정·인원 선택 화면에서 시작하고,
 *   일정 선택 완료 시 ② 객실 선택을 건너뛰고 바로 ③ 정보 입력 단계로 넘어갑니다. (1번 -> 3번)
 * - 일반 접속 시: ① 일정·인원 -> ② 객실 선택 -> ③ 정보 입력 -> ④ 예약 완료
 */
(function (global) {
  const U = global.Hotel.Util;
  const STORAGE_KEY = "hotelReservations";

  // 현재 진행 상태 (search: 일정/인원, room: 선택한 객실, step: 현재 단계 1~4, fromRoomPage: 룸페이지에서 넘어왔는지 여부)
  const state = { search: null, room: null, step: 1, fromRoomPage: false };

  /** 날짜/인원 폼 값을 읽어 검증합니다. */
  function readSearchForm() {
    const checkIn = U.qs("#rsCheckIn").value;
    const checkOut = U.qs("#rsCheckOut").value;
    if (!checkIn || !checkOut) { return { data: null, error: "체크인/체크아웃 날짜를 선택해 주세요." }; }

    const inDate = U.parseISODate(checkIn);
    const outDate = U.parseISODate(checkOut);
    const today = U.parseISODate(U.toISODate(new Date()));
    const nights = U.nightsBetween(inDate, outDate);
    if (inDate < today) { return { data: null, error: "지난 날짜는 선택할 수 없습니다." }; }
    if (nights < 1) { return { data: null, error: "체크아웃은 체크인 이후 날짜여야 합니다." }; }

    return {
      data: {
        checkIn: checkIn, checkOut: checkOut, nights: nights,
        rooms: Number(U.qs("#rsRooms").value),
        adults: Number(U.qs("#rsAdults").value),
        children: Number(U.qs("#rsChildren").value)
      },
      error: ""
    };
  }

  function showSearchError(msg) {
    const box = U.qs("#searchError");
    if (!box) { return; }
    box.textContent = msg;
    box.classList.toggle("is-hidden", !msg);
  }

  /** 우측 '예약 요약' 갱신 */
  function renderSummary() {
    const s = state.search;
    const set = function (id, text) { const el = U.qs(id); if (el) { el.textContent = text; } };
    if (!s) { return; }
    set("#sumCheckIn", s.checkIn);
    set("#sumCheckOut", s.checkOut);
    set("#sumNights", s.nights + "박");
    set("#sumRooms", s.rooms + "개");
    set("#sumGuests", "성인 " + s.adults + " · 아동 " + s.children);
    if (state.room) {
      set("#sumRoom", state.room.name);
      set("#sumTotal", U.formatPrice(state.room.price * s.nights * s.rooms));
    } else {
      set("#sumRoom", "미선택");
      set("#sumTotal", "-");
    }
  }

  /** 단계 전환 (패널 표시 + 단계 표시 갱신) */
  function setStep(step) {
    state.step = step;
    U.qsa("[data-step-panel]").forEach(function (panel) {
      panel.classList.toggle("is-hidden", Number(panel.dataset.stepPanel) !== step);
    });
    U.qsa(".steps li").forEach(function (li) {
      const n = Number(li.dataset.step);
      li.classList.toggle("is-active", n === step);
      li.classList.toggle("is-done", n < step);
      if (n === step) { li.setAttribute("aria-current", "step"); } else { li.removeAttribute("aria-current"); }
    });
    renderSummary();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /** STEP2: 객실 목록 렌더링 (인원이 정원을 넘으면 선택 불가) */
  function renderRooms() {
    const s = state.search;
    if (!s) return;
    const guests = s.adults + s.children;
    U.qs("#roomList").innerHTML = global.Hotel.ROOMS.map(function (room) {
      const total = room.price * s.nights * s.rooms;
      const tooMany = guests > room.capacity * s.rooms;
      const isSelected = state.room && state.room.id === room.id;
      return '<article class="room-option' + (isSelected ? " is-selected" : "") + '">' +
        '<img src="' + U.escapeHtml(room.image) + '" alt="' + U.escapeHtml(room.name) + '">' +
        "<div><h3>" + U.escapeHtml(room.name) + "</h3><p>" + U.escapeHtml(room.desc) + "</p></div>" +
        '<div class="total"><strong>' + U.formatPrice(total) + "</strong>" +
        "<small>1박 " + U.formatPrice(room.price) + " × " + s.nights + "박 × " + s.rooms + "개</small>" +
        (tooMany
          ? '<span class="field-error">최대 ' + (room.capacity * s.rooms) + "인</span>"
          : (isSelected
              ? '<button type="button" class="btn btn-primary" data-room-id="' + U.escapeHtml(room.id) + '">선택됨 ✓</button>'
              : '<button type="button" class="btn btn-primary" data-room-id="' + U.escapeHtml(room.id) + '">선택</button>')) +
        "</div></article>";
    }).join("");
  }

  function selectRoom(roomId) {
    const room = global.Hotel.ROOMS.find(function (r) {
      return r.id === roomId || (r.aliases && r.aliases.indexOf(roomId) !== -1);
    });
    if (!room) { return false; }
    if (state.search && (state.search.adults + state.search.children > room.capacity * state.search.rooms)) {
      return false;
    }
    state.room = room;
    return true;
  }

  /** STEP3: 예약자 정보 검증 */
  function validateGuestForm(form) {
    let valid = true;
    const rules = {
      guestName: function (v) { return v.trim().length >= 2 ? "" : "이름을 2자 이상 입력해 주세요."; },
      guestPhone: function (v) { return /^01[016789]-?\d{3,4}-?\d{4}$/.test(v.trim()) ? "" : "올바른 휴대폰 번호를 입력해 주세요."; },
      guestEmail: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "올바른 이메일을 입력해 주세요."; }
    };
    Object.keys(rules).forEach(function (id) {
      const input = U.qs("#" + id, form);
      const group = input ? input.closest(".form-group") : null;
      const errEl = group ? U.qs(".field-error", group) : null;
      if (!input || !group || !errEl) { return; }
      const msg = rules[id](input.value);
      group.classList.toggle("has-error", Boolean(msg));
      errEl.textContent = msg;
      if (msg) { valid = false; }
    });
    const agree = U.qs("#agree", form);
    const agreeErr = U.qs("#agreeError");
    if (agree && agreeErr) {
      agreeErr.textContent = agree.checked ? "" : "개인정보 수집·이용에 동의해 주세요.";
      if (!agree.checked) { valid = false; }
    }
    return valid;
  }

  function makeCode() {
    return "OV" + Date.now().toString(36).toUpperCase().slice(-6) + Math.floor(Math.random() * 90 + 10);
  }

  function saveReservation(reservation) {
    let list = [];
    try { list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch (err) { list = []; }
    list.push(reservation);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (err) { /* 저장 실패는 무시 */ }
  }

  function submitReservation(form) {
    if (!validateGuestForm(form) || !state.room) { return; }
    const s = state.search;
    const reservation = {
      code: makeCode(),
      room: state.room.name,
      checkIn: s.checkIn, checkOut: s.checkOut, nights: s.nights,
      rooms: s.rooms, adults: s.adults, children: s.children,
      total: state.room.price * s.nights * s.rooms,
      name: U.qs("#guestName", form).value.trim(),
      phone: U.qs("#guestPhone", form).value.trim(),
      email: U.qs("#guestEmail", form).value.trim(),
      request: U.qs("#guestRequest", form).value.trim(),
      createdAt: new Date().toISOString()
    };
    saveReservation(reservation);

    U.qs("#doneCode").textContent = reservation.code;
    U.qs("#doneTable").innerHTML =
      "<tr><th>객실</th><td>" + U.escapeHtml(reservation.room) + "</td></tr>" +
      "<tr><th>일정</th><td>" + reservation.checkIn + " ~ " + reservation.checkOut + " (" + reservation.nights + "박)</td></tr>" +
      "<tr><th>인원</th><td>객실 " + reservation.rooms + "개 / 성인 " + reservation.adults + "명 / 아동 " + reservation.children + "명</td></tr>" +
      "<tr><th>예약자</th><td>" + U.escapeHtml(reservation.name) + "</td></tr>" +
      "<tr><th>결제 금액</th><td><strong>" + U.formatPrice(reservation.total) + "</strong></td></tr>";
    form.reset();
    setStep(4);
  }

  /** 폼 기본값 + URL 쿼리로 넘어온 값 채우기 */
  function applyDefaults(params) {
    const inEl = U.qs("#rsCheckIn");
    const outEl = U.qs("#rsCheckOut");
    const today = new Date();
    inEl.min = U.toISODate(today);
    const defIn = U.toISODate(U.addDays(today, 1));
    const defOut = U.toISODate(U.addDays(today, 2));

    inEl.value = params.get("checkIn") || defIn;
    outEl.value = params.get("checkOut") || defOut;
    outEl.min = U.toISODate(U.addDays(U.parseISODate(inEl.value), 1));

    ["rooms", "adults", "children"].forEach(function (key) {
      const sel = U.qs("#rs" + key.charAt(0).toUpperCase() + key.slice(1));
      const val = params.get(key);
      if (sel && val && Array.prototype.some.call(sel.options, function (o) { return o.value === val; })) { sel.value = val; }
    });
  }

  global.Hotel.ReservationFlow = {
    init: function () {
      const searchForm = U.qs("#searchForm");
      const guestForm = U.qs("#guestForm");
      if (!searchForm || !guestForm) { return; }

      const params = new URLSearchParams(window.location.search);
      applyDefaults(params);

      const inEl = U.qs("#rsCheckIn");
      const outEl = U.qs("#rsCheckOut");
      const submitBtn = U.qs("#btnSearchSubmit");
      const bannerEl = U.qs("#selectedRoomBanner");
      const bannerName = U.qs("#selectedRoomName");
      const bannerDesc = U.qs("#selectedRoomDesc");

      // 초기 검색 상태 생성
      const initResult = readSearchForm();
      if (initResult.data) {
        state.search = initResult.data;
      }

      // 룸 페이지에서 넘어온 파라미터 체크 (예: ?room=deluxe-king)
      const roomParam = params.get("room");
      if (roomParam && selectRoom(roomParam)) {
        state.fromRoomPage = true;
        // 상단 배너 표시
        if (bannerEl && bannerName && bannerDesc) {
          bannerName.textContent = " " + state.room.name;
          bannerDesc.textContent = state.room.desc + " · 1박 " + U.formatPrice(state.room.price);
          bannerEl.classList.remove("is-hidden");
        }
        // 버튼 텍스트 변경
        if (submitBtn) {
          submitBtn.textContent = "다음 (예약자 정보 입력) ➔";
        }
      }

      // 날짜/인원 실시간 변경 시 우측 요약 및 총 금액 즉시 재계산
      searchForm.addEventListener("change", function () {
        showSearchError("");
        const res = readSearchForm();
        if (res.data) {
          state.search = res.data;
          renderSummary();
        }
      });

      // 체크인 변경 → 체크아웃 최소값/값 자동 보정
      inEl.addEventListener("change", function () {
        showSearchError("");
        if (!inEl.value) { return; }
        const minOut = U.toISODate(U.addDays(U.parseISODate(inEl.value), 1));
        outEl.min = minOut;
        if (!outEl.value || outEl.value < minOut) { outEl.value = minOut; }
        const res = readSearchForm();
        if (res.data) { state.search = res.data; renderSummary(); }
      });

      outEl.addEventListener("change", function () {
        showSearchError("");
        if (!inEl.value || !outEl.value) { return; }
        const minOut = U.toISODate(U.addDays(U.parseISODate(inEl.value), 1));
        if (outEl.value < minOut) {
          outEl.value = minOut;
          showSearchError("체크아웃은 체크인 다음 날부터 선택할 수 있어 날짜를 조정했습니다.");
        }
        const res = readSearchForm();
        if (res.data) { state.search = res.data; renderSummary(); }
      });

      // STEP 1 제출
      searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const result = readSearchForm();
        if (!result.data) { showSearchError(result.error); return; }
        showSearchError("");
        state.search = result.data;

        // 룸페이지에서 방을 골라서 들어온 경우: 1번 -> 3번으로 직행
        if (state.fromRoomPage && state.room) {
          const guests = state.search.adults + state.search.children;
          const maxCap = state.room.capacity * state.search.rooms;
          if (guests > maxCap) {
            showSearchError(state.room.name + "의 최대 정원은 객실당 " + state.room.capacity + "명 (총 " + maxCap + "명)입니다. 객실 수를 늘리거나 인원을 조정해 주세요.");
            return;
          }
          setStep(3);
          return;
        }

        // 일반 접속인 경우: 1번 -> 2번 객실 선택
        state.room = null;
        renderRooms();
        setStep(2);
      });

      // STEP 2: 객실 선택 (이벤트 위임)
      U.qs("#roomList").addEventListener("click", function (e) {
        const btn = e.target.closest("[data-room-id]");
        if (btn && selectRoom(btn.dataset.roomId)) { setStep(3); }
      });

      // 이전 버튼 클릭 시
      document.addEventListener("click", function (e) {
        if (e.target.closest("[data-step-back]")) {
          // 룸페이지에서 1->3으로 직행한 경우, 3에서 '이전' 누르면 1번(일정/인원)으로 복귀
          if (state.step === 3 && state.fromRoomPage) {
            setStep(1);
          } else {
            setStep(Math.max(1, state.step - 1));
          }
        }
      });

      // STEP 3 제출: 예약 확정
      guestForm.addEventListener("submit", function (e) {
        e.preventDefault();
        submitReservation(guestForm);
      });

      // 룸페이지에서 넘어왔든 직접 접속했든 언제나 1번(일정·인원)부터 시작
      setStep(1);
      window.scrollTo(0, 0);
    }
  };
})(window);
