"use strict";

/**
 * room-gallery.js
 * Interactive photo switcher with semi-transparent arrows, thumbnail navigation,
 * spec drawer toggle, and scroll-spy for rooms showroom
 */
(function (global) {
  const Hotel = global.Hotel = global.Hotel || {};

  Hotel.RoomGallery = {
    init: function () {
      this.initPhotoSwitchers();
      this.initDetailDrawers();
      this.initScrollSpy();
    },

    // 1. Multi-photo gallery: arrows + thumbnail switching
    initPhotoSwitchers: function () {
      const roomCards = document.querySelectorAll(".room-card-box");

      roomCards.forEach(function (card) {
        const mainImg = card.querySelector(".room-gallery-main img");
        const thumbs = Array.from(card.querySelectorAll(".room-thumb-btn"));
        const prevBtn = card.querySelector(".room-gallery-arrow.prev");
        const nextBtn = card.querySelector(".room-gallery-arrow.next");

        if (!mainImg || !thumbs.length) return;

        let currentIndex = 0;

        function updateTo(index) {
          if (index < 0) index = thumbs.length - 1;
          if (index >= thumbs.length) index = 0;
          currentIndex = index;

          const targetThumb = thumbs[currentIndex];
          const newSrc = targetThumb.getAttribute("data-full");
          if (!newSrc) return;

          thumbs.forEach(function (t) { t.classList.remove("is-active"); });
          targetThumb.classList.add("is-active");

          // Smooth crossfade
          mainImg.style.opacity = "0.2";
          mainImg.style.transform = "scale(0.98)";

          setTimeout(function () {
            mainImg.setAttribute("src", newSrc);
            mainImg.style.opacity = "1";
            mainImg.style.transform = "scale(1)";
          }, 150);
        }

        // Thumbnail click events
        thumbs.forEach(function (thumb, idx) {
          thumb.addEventListener("click", function () {
            if (currentIndex === idx) return;
            updateTo(idx);
          });
        });

        // Arrow button click events
        if (prevBtn) {
          prevBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            updateTo(currentIndex - 1);
          });
        }

        if (nextBtn) {
          nextBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            updateTo(currentIndex + 1);
          });
        }
      });
    },

    // 2. Expandable Deep-Dive Room Specs Drawer
    initDetailDrawers: function () {
      const triggers = document.querySelectorAll(".room-drawer-trigger");

      triggers.forEach(function (btn) {
        btn.addEventListener("click", function () {
          const targetId = this.getAttribute("data-target");
          const targetDrawer = targetId ? document.getElementById(targetId) : this.nextElementSibling;

          if (!targetDrawer) return;

          const isOpen = targetDrawer.classList.contains("is-open");

          if (isOpen) {
            targetDrawer.classList.remove("is-open");
            this.classList.remove("is-open");
            this.setAttribute("aria-expanded", "false");
            const labelSpan = this.querySelector(".drawer-label");
            if (labelSpan) labelSpan.textContent = "객실 상세 사양 & 어메니티 펼치기";
          } else {
            targetDrawer.classList.add("is-open");
            this.classList.add("is-open");
            this.setAttribute("aria-expanded", "true");
            const labelSpan = this.querySelector(".drawer-label");
            if (labelSpan) labelSpan.textContent = "객실 상세 사양 접기";
          }
        });
      });
    },

    // 3. Sticky Quick-Nav ScrollSpy
    initScrollSpy: function () {
      const navLinks = document.querySelectorAll(".room-nav-link");
      const roomBoxes = document.querySelectorAll(".room-card-box");

      if (!navLinks.length || !roomBoxes.length) return;

      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute("id");
              navLinks.forEach(function (link) {
                if (link.getAttribute("href") === "#" + id) {
                  link.classList.add("is-active");
                } else {
                  link.classList.remove("is-active");
                }
              });
            }
          });
        },
        {
          rootMargin: "-20% 0px -60% 0px",
          threshold: 0
        }
      );

      roomBoxes.forEach(function (box) {
        observer.observe(box);
      });
    }
  };

  // Auto initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      Hotel.RoomGallery.init();
    });
  } else {
    Hotel.RoomGallery.init();
  }
})(window);
