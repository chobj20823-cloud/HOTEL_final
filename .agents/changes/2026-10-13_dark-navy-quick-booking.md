# 변경 내역 – 다크 네이비 테마 전환 & 빠른 예약 폼 보강 (2026-10-13)

## 디자인
- 메인 배경: 딥 네이비 `#0a2540` (레퍼런스 블루 `#2a85c6`를 어둡게 낮춘 톤). 스카이블루 `#87ceeb`는 라벨·강조, 흰색은 본문 텍스트
- 히어로: 상단/하단이 진한 네이비 그라데이션 오버레이 + 텍스트 그림자로 가독성 확보, 하단은 배경색으로 자연스럽게 이어짐
- 색상 변경은 `css/common.css` 의 `:root` 변수만 수정

## 빠른 예약(Quick Booking)
- 필드: 체크인, 체크아웃(+박 수 표시), **객실 수**, 성인, 아동, 객실 조회 버튼
- 검증: 과거 날짜 금지 / 체크인 변경 시 체크아웃 자동 보정 / 체크아웃이 앞 날짜면 보정+안내
- 총액 = 1박 요금 × 박 수 × 객실 수, 정원 = 객실 정원 × 객실 수

## 접근성/반응형
- `label for`, `output`, `aria-label`, `:focus-visible`, `.sr-only`, `prefers-reduced-motion`
- 예약 바: 데스크탑 6열 → 태블릿 3열 → 모바일 2열 → 소형 1열 (Grid)

## 수정 파일
`css/common.css`, `css/main.css`, `css/booking.css`, `index.html`, `js/components/booking-bar.js`, `js/components/booking-modal.js`
