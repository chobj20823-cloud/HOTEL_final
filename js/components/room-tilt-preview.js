"use strict";

/**
 * room-tilt-preview.js – 3D 틸트 카드 인터랙션 & 객실 퀵뷰(Quick View) 모달
 */
(function (global) {
  const Hotel = global.Hotel || (global.Hotel = {});

  const ROOM_DETAILS = {
    deluxe: {
      name: "디럭스 오션 (Deluxe Ocean)",
      badge: "BEST FOR COUPLES",
      size: "32㎡ (약 10평)",
      bed: "킹 베드 1개",
      capacity: "기준 2인 / 최대 2인",
      view: "파노라마 오션뷰 (봉포해변 조망)",
      price: "220,000원~",
      image: "images/ref/img_room1.jpg",
      amenities: ["인피니티 온수풀 무료 입장", "오션뷰 프라이빗 발코니", "시몬스 뷰티레스트 프리미엄 베딩", "네스프레소 커피머신 & 캡슐 4종", "몰튼브라운 어메니티 4종", "초고속 무료 Wi-Fi"],
      desc: "문을 열자마자 펼쳐지는 청정 고성 바다의 수평선. 절제된 모던 우드 톤의 인테리어와 시몬스 최고급 베딩이 여행의 피로를 완벽하게 씻어주는 아늑한 힐링 공간입니다."
    },
    premier: {
      name: "프리미어 오션 (Premier Ocean)",
      badge: "FAMILY & FRIENDS",
      size: "42㎡ (약 13평)",
      bed: "퀸 베드 2개",
      capacity: "기준 3인 / 최대 4인",
      view: "와이드 파노라마 오션뷰",
      price: "320,000원~",
      image: "images/ref/img_room2.jpg",
      amenities: ["인피니티 온수풀 무료 입장", "파노라마 오션 테라스 & 선베드", "다이닝 테이블 & 미니바", "네스프레소 버츄오 머신", "몰튼브라운 프리미엄 어메니티", "블루투스 제네바 스피커"],
      desc: "넓은 2베드 구성으로 가족 및 소중한 친구들과 함께 머물기에 이상적인 객실입니다. 2면 개방창을 통해 설악산 능선과 동해 바다가 한눈에 내려다보입니다."
    },
    suite: {
      name: "스카이 스위트 (Sky Suite)",
      badge: "SIGNATURE LUXURY",
      size: "66㎡ (약 20평)",
      bed: "킹 베드 2개 (독립 침실 분리)",
      capacity: "기준 4인 / 최대 5인",
      view: "최상층 270도 파노라믹 뷰",
      price: "520,000원~",
      image: "images/ref/img_room_detail_top1.png",
      amenities: ["VIP 전용 인피니티 풀 카바나 1회 무료", "독립형 오션뷰 자쿠지 욕조", "독립 리빙룸 & 와인 셀러", "LG 스타일러 & 다이슨 에어랩 구비", "딥티크(Diptyque) 럭셔리 어메니티", "조식 2인 무료 바우처 제공"],
      desc: "리조트 최상층에 위치한 시그니처 펜트하우스 스위트. 독립된 거실과 마스터 침실, 바다를 감상하며 즐기는 프라이빗 자쿠지 스파가 궁극의 럭셔리 호캉스를 선사합니다."
    }
  };

  const RoomTiltPreview = {
    init: function () {
      this.initTilt();
      this.initModal();
    },

    /** 1. 3D 틸트 및 광택 효과 */
    initTilt: function () {
      const cards = document.querySelectorAll(".room-card");
      if (!cards.length) return;

      cards.forEach(function (card) {
        // 내부 광택 요소 삽입
        let shine = card.querySelector(".tilt-shine");
        if (!shine) {
          shine = document.createElement("div");
          shine.className = "tilt-shine";
          card.appendChild(shine);
        }

        card.addEventListener("mousemove", function (e) {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -7;
          const rotateY = ((x - centerX) / centerX) * 7;

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
          shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(184, 221, 242, 0.28) 0%, rgba(255, 255, 255, 0) 65%)`;
          shine.style.opacity = "1";
        });

        card.addEventListener("mouseleave", function () {
          card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
          shine.style.opacity = "0";
        });
      });
    },

    /** 2. 객실 퀵뷰 모달 */
    initModal: function () {
      const modal = document.getElementById("roomModal");
      if (!modal) return;

      const modalClose = modal.querySelector(".room-modal-close");
      const backdrop = modal.querySelector(".room-modal-backdrop");
      const previewBtns = document.querySelectorAll("[data-preview-room]");

      function openModal(roomId) {
        const data = ROOM_DETAILS[roomId];
        if (!data) return;

        modal.querySelector("#modalRoomTitle").textContent = data.name;
        modal.querySelector("#modalRoomBadge").textContent = data.badge;
        modal.querySelector("#modalRoomImg").src = data.image;
        modal.querySelector("#modalRoomImg").alt = data.name;
        modal.querySelector("#modalRoomDesc").textContent = data.desc;
        modal.querySelector("#modalRoomSize").textContent = data.size;
        modal.querySelector("#modalRoomBed").textContent = data.bed;
        modal.querySelector("#modalRoomCapacity").textContent = data.capacity;
        modal.querySelector("#modalRoomView").textContent = data.view;
        modal.querySelector("#modalRoomPrice").textContent = data.price;

        const amenityList = modal.querySelector("#modalRoomAmenities");
        if (amenityList) {
          amenityList.innerHTML = data.amenities.map(a => `<li><span class="chk">✓</span> ${a}</li>`).join("");
        }

        const bookBtn = modal.querySelector("#modalBookBtn");
        if (bookBtn) {
          bookBtn.href = `reservation.html?room=${roomId}`;
        }

        modal.classList.add("is-active");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("no-scroll");
      }

      function closeModal() {
        modal.classList.remove("is-active");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("no-scroll");
      }

      previewBtns.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          const roomId = this.dataset.previewRoom;
          openModal(roomId);
        });
      });

      if (modalClose) modalClose.addEventListener("click", closeModal);
      if (backdrop) backdrop.addEventListener("click", closeModal);

      window.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.classList.contains("is-active")) {
          closeModal();
        }
      });
    }
  };

  Hotel.RoomTiltPreview = RoomTiltPreview;
})(window);
