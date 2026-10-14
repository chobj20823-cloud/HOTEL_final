# 변경 내역 – 윈덤 실사 사진 적용, SVG 로고 생성, 버튼 국문 표준화 (2026-10-13)

## 1. 로고 제작 및 적용
- 레퍼런스(윈덤 강원고성)의 심볼 구조(블루 그라데이션 박스 + 꽃잎/웨이브 문양)와 대문자 트래킹 타이포그래피를 오마주한 [images/logo.svg](file:///c:/Users/chobj/Desktop/호텔%20초안_조범준/images/logo.svg) 직접 생성.
- 상단 히어로(투명 헤더) 및 푸터에서는 CSS 필터를 통해 자동 화이트 로고로 전환되고, 스크롤 또는 서브페이지(화이트 헤더)에서는 선명한 블루 컬러 로고로 자동 렌더링.
- [index.html](file:///c:/Users/chobj/Desktop/호텔%20초안_조범준/index.html) 및 [reservation.html](file:///c:/Users/chobj/Desktop/호텔%20초안_조범준/reservation.html)에 모두 적용.

## 2. 윈덤 강원고성 공식 사이트 실사 사진 적용
레퍼런스 사이트(`https://wyndhamgoseonggangwon.com/`)에서 공식 고화질 이미지 리소스를 직접 다운로드하여 각 파트에 매핑:
- **Hero 메인 배경**: `images/ref/bg_main.png` (맑은 동해 바다와 수평선이 맞닿은 인피니티 풀 전경)
- **ROOMS 객실 3종**:
  - 디럭스 오션: `images/ref/img_room1.jpg`
  - 프리미어 오션: `images/ref/img_room2.jpg`
  - 스카이 스위트: `images/ref/img_room_detail_top1.png`
  - `js/common.js` 객실 데이터셋과 메인페이지 카드에 동일하게 연동
- **STORY 섹션**: `images/ref/img_story.png` (호텔 타워 및 루프탑 전경)
- **POOL 섹션**: `images/ref/img_pool_infinity.png` (오션뷰 인피니티 풀 실사)
- **DINING 섹션**: `images/ref/img_dining_ananas.png` (아나나스 오션뷰 뷔페 실사)

## 3. 이미지/섹션 버튼 국문 수정
- Hero: `More >` → `자세히 보기 >`
- POOL: `풀 패키지 예약` → `풀 패키지 예약하기`
- DINING: `다이닝 문의` → `다이닝 예약 및 문의`
- 각 버튼 링크를 독립 예약 페이지인 [reservation.html](file:///c:/Users/chobj/Desktop/호텔%20초안_조범준/reservation.html)로 직관적으로 연결
