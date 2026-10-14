# 변경 내역 – 메인페이지 리뉴얼 & 예약 기능 (2026-10-13)

## 디자인
- 윈덤 강원고성 메인 블루(`#2a85c6`)를 기준 팔레트로 적용 (`--blue-500`), 스카이블루(`#87ceeb`)·화이트 포인트 유지
- 히어로 블루 오버레이, `EXTRAORDINARY ROOM` 스타일 타이포 (Oswald / Noto Sans KR)

## 추가/변경 파일
| 파일 | 내용 |
|------|------|
| `index.html` | 헤더, 히어로+예약바, ROOMS, STORY, POOL, DINING, FACILITIES, 푸터, 예약 모달 |
| `css/common.css` | 디자인 토큰, 리셋, 공통 버튼/타이틀 |
| `css/main.css` | 메인 레이아웃, 반응형 |
| `css/booking.css` | 예약 바/모달 스타일 |
| `js/common.js` | `Hotel` 네임스페이스, 객실 데이터(`Object.freeze`), 유틸 |
| `js/components/header.js` · `reveal.js` | 헤더 스크롤/모바일 메뉴, 스크롤 등장 효과 |
| `js/components/booking-bar.js` | 날짜·인원 검색 및 검증, `booking:search` 이벤트 발행 |
| `js/components/booking-modal.js` | 객실 선택 → 정보 입력(검증) → 예약 완료, `localStorage` 저장 |
| `js/app.js` | 엔트리 |
| `images/*` | AI 생성 이미지 4종 (히어로, 객실, 풀, 다이닝) |

## 예약 기능 흐름
1. 히어로 하단 바에서 체크인/아웃·인원 선택 → 2. 객실 선택(인원 초과 객실 비활성) → 3. 예약자 정보 입력 및 검증 → 4. 예약번호 발급(`hotelReservations` localStorage 저장)
