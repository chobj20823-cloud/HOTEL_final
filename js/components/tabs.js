"use strict";

/**
 * tabs.js – 접근성 탭 컴포넌트 (ROOMS 페이지 객실 타입 전환)
 * 마크업 규칙:
 *   <div data-tabs>
 *     <div role="tablist"><button role="tab" data-tab="deluxe" aria-selected="true">…</button></div>
 *     <section role="tabpanel" data-tab-panel="deluxe">…</section>
 *   </div>
 * - 이벤트 위임: tablist 하나에만 클릭/키보드 이벤트를 연결합니다.
 * - URL 해시(#suite 등)로 특정 탭을 바로 열 수 있습니다.
 */
(function (global) {
  const U = global.Hotel.Util;

  /** 하나의 탭 그룹을 담당하는 객체 생성 */
  function createTabGroup(root) {
    const tabs = U.qsa("[role='tab']", root);
    const panels = U.qsa("[data-tab-panel]", root);

    function activate(id, focus) {
      const target = tabs.find(function (t) { return t.dataset.tab === id; });
      if (!target) { return false; }

      tabs.forEach(function (t) {
        const on = t === target;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p) {
        const on = p.dataset.tabPanel === id;
        p.hidden = !on;
        p.classList.toggle("is-active", on);
      });
      if (focus) { target.focus(); }
      return true;
    }

    const list = U.qs("[role='tablist']", root);
    if (!list) { return; }

    list.addEventListener("click", function (e) {
      const btn = e.target.closest("[role='tab']");
      if (btn && list.contains(btn)) { activate(btn.dataset.tab, false); }
    });

    // 좌/우 방향키로 탭 이동
    list.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") { return; }
      const current = tabs.findIndex(function (t) { return t.getAttribute("aria-selected") === "true"; });
      const step = e.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(current + step + tabs.length) % tabs.length];
      activate(next.dataset.tab, true);
      e.preventDefault();
    });

    // 해시로 진입 시 해당 탭 열기 (예: rooms.html#suite)
    const hashId = global.location.hash.replace("#", "");
    if (!hashId || !activate(hashId, false)) {
      activate(tabs[0] ? tabs[0].dataset.tab : "", false);
    }
  }

  global.Hotel.Tabs = Object.freeze({
    init: function () {
      U.qsa("[data-tabs]").forEach(createTabGroup);
    }
  });
})(window);
