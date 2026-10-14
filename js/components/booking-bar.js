"use strict";

/**
 * booking-bar.js – 히어로 하단 '빠른 예약(Quick Booking)' 폼
 * ---------------------------------------------------------------------------
 * 하는 일
 *   1) 체크인/체크아웃 기본값 및 선택 가능 최소 날짜 설정
 *   2) 날짜 유효성 검사 (과거 날짜 금지, 체크아웃은 체크인보다 뒤여야 함)
 *   3) 체크인을 바꾸면 체크아웃을 자동 보정, 체크아웃을 앞날짜로 바꿔도 자동 보정
 *   4) 검증 통과 시 reservation.html 로 이동 (선택값은 URL 쿼리로 전달)
 *   5) 객실 카드의 '예약하기' 버튼(data-book-room)도 같은 방식으로 객실까지 지정해서 이동
 *
 * 수정 포인트
 *   - DEFAULT_CHECKIN_OFFSET / DEFAULT_NIGHTS : 기본 체크인(오늘+N일), 기본 숙박일 수
 *   - RESERVATION_URL : 예약 페이지 주소
 */
(function (global) {
  const U = global.Hotel.Util;

  const DEFAULT_CHECKIN_OFFSET = 1;  // 기본 체크인 = 오늘 + 1일
  const DEFAULT_NIGHTS = 1;          // 기본 숙박 = 1박
  const RESERVATION_URL = "reservation.html";

  /** 선택값을 쿼리스트링으로 만들어 예약 페이지로 이동 */
  function goToReservation(data, roomId) {
    const params = new URLSearchParams({
      checkIn: data.checkIn, checkOut: data.checkOut,
      rooms: data.rooms, adults: data.adults, children: data.children
    });
    if (roomId) { params.set("room", roomId); }
    window.location.href = RESERVATION_URL + "?" + params.toString();
  }

  /** 오류 메시지 표시 / 숨김 */
  function showError(message) {
    const box = U.qs("#bookingError");
    if (!box) { return; }
    box.textContent = message;
    box.classList.remove("is-hidden");
  }
  function hideError() {
    const box = U.qs("#bookingError");
    if (box) { box.classList.add("is-hidden"); }
  }

  /** 박 수 표시 갱신 (예: "· 2박") */
  function updateNights() {
    const out = U.qs("#nightsOutput");
    const inEl = U.qs("#checkIn");
    const outEl = U.qs("#checkOut");
    if (!out || !inEl || !outEl || !inEl.value || !outEl.value) { return; }
    const nights = U.nightsBetween(U.parseISODate(inEl.value), U.parseISODate(outEl.value));
    out.textContent = nights > 0 ? "· " + nights + "박" : "";
  }

  /**
   * 현재 폼 값을 읽어 검증한 뒤 반환합니다.
   * @returns {{data: object|null, error: string}}
   */
  function readSearch() {
    const checkIn = U.qs("#checkIn");
    const checkOut = U.qs("#checkOut");
    if (!checkIn || !checkOut || !checkIn.value || !checkOut.value) {
      return { data: null, error: "체크인/체크아웃 날짜를 선택해 주세요." };
    }
    const inDate = U.parseISODate(checkIn.value);
    const outDate = U.parseISODate(checkOut.value);
    const today = U.parseISODate(U.toISODate(new Date()));
    const nights = U.nightsBetween(inDate, outDate);

    if (inDate < today) { return { data: null, error: "지난 날짜는 선택할 수 없습니다." }; }
    if (nights < 1) { return { data: null, error: "체크아웃은 체크인 이후 날짜여야 합니다." }; }

    return {
      data: {
        checkIn: checkIn.value,
        checkOut: checkOut.value,
        nights: nights,
        rooms: Number(U.qs("#rooms").value),
        adults: Number(U.qs("#adults").value),
        children: Number(U.qs("#children").value)
      },
      error: ""
    };
  }

  global.Hotel.BookingBar = {
    readSearch: readSearch,

    init: function () {
      const form = U.qs("#bookingForm");
      const checkIn = U.qs("#checkIn");
      const checkOut = U.qs("#checkOut");
      if (!form || !checkIn || !checkOut) { return; }

      // 1) 기본값 / 최소 선택 가능 날짜 설정
      const today = new Date();
      const defaultIn = U.addDays(today, DEFAULT_CHECKIN_OFFSET);
      checkIn.min = U.toISODate(today);                          // 오늘 이전 선택 불가
      checkIn.value = U.toISODate(defaultIn);
      checkOut.min = U.toISODate(U.addDays(defaultIn, 1));       // 체크인 다음날부터 선택 가능
      checkOut.value = U.toISODate(U.addDays(defaultIn, DEFAULT_NIGHTS));
      updateNights();

      // 2) 체크인 변경 → 체크아웃 최소값 갱신, 체크아웃이 더 앞이면 자동으로 +1일
      checkIn.addEventListener("change", function () {
        hideError();
        if (!checkIn.value) { return; }
        const minOut = U.toISODate(U.addDays(U.parseISODate(checkIn.value), 1));
        checkOut.min = minOut;
        if (!checkOut.value || checkOut.value < minOut) { checkOut.value = minOut; }
        updateNights();
      });

      // 3) 체크아웃을 체크인보다 앞/같은 날로 입력하면 안내 후 보정
      checkOut.addEventListener("change", function () {
        hideError();
        if (!checkIn.value || !checkOut.value) { return; }
        const minOut = U.toISODate(U.addDays(U.parseISODate(checkIn.value), 1));
        if (checkOut.value < minOut) {
          checkOut.value = minOut;
          showError("체크아웃은 체크인 다음 날부터 선택할 수 있어 날짜를 조정했습니다.");
        }
        updateNights();
      });

      // 4) '예약 검색' 제출
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        hideError();
        const result = readSearch();
        if (!result.data) { showError(result.error); return; }
        goToReservation(result.data);
      });

      // 5) 객실 카드의 '예약하기' 버튼 (이벤트 위임)
      document.addEventListener("click", function (e) {
        const trigger = e.target.closest("[data-book-room]");
        if (!trigger) { return; }
        const result = readSearch();
        if (!result.data) {
          showError(result.error);
          const hero = U.qs("#booking");
          if (hero) { hero.scrollIntoView({ behavior: "smooth" }); }   // 날짜 수정하도록 예약 폼으로 이동
          return;
        }
        goToReservation(result.data, trigger.dataset.bookRoom);
      });
    }
  };
})(window);
