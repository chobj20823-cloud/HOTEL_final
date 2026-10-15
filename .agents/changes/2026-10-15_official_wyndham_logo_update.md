# 변경 내역 – 공식 윈덤 로고 이미지(PNG) 교체 및 중복 텍스트 제거 (2026-10-15)

## 1. 수정 배경 및 목적
- **공식 브랜드 로고 적용**: 기존 SVG 형태에서 실제 공식 윈덤 로고 원본 이미지(컬러/화이트 고해상도 배경 투명 PNG)로 교체하여 브랜드 정체성 및 비주얼 완성도 극대화.
- **로고 옆 중복 텍스트 제거**: 로고 이미지 자체에 `WYNDHAM GOSEONG GANGWON`이 포함되어 있음에도 불구하고, 스크립트 fallback으로 인해 옆에 노출되던 `<span class="logo-text">WYNDHAM</span>` 텍스트를 제거하여 시각적 중복 및 레이아웃 어색함 해소.

---

## 2. 세부 반영 내역

### 1) 공식 로고 이미지 등록 (`images/`)
- `images/logo.png`: 공식 컬러 로고 (윈덤 블루 사각 심볼 & `WYNDHAM®` + 뉴트럴 그레이 `GOSEONG GANGWON`)
- `images/logo-white.png`: 공식 화이트 로고 (어두운 배경 및 투명 헤더용 순백색 로고)
- `images/logo.svg`: 미사용 SVG 파일 제거

### 2) CSS 로고 표시 분기 및 최적화 (`css/main.css`)
- **CSS 필터 제거**: `brightness(0) invert(1)` 필터를 완전히 제거하여 왜곡 없는 100% 원본 픽셀 출력.
- **헤더 상태별 자동 분기**:
  - 히어로 위 투명 헤더: `.logo-img--white` (`logo-white.png`) 노출
  - 스크롤 시 / 서브페이지 흰색 헤더: `.logo-img--color` (`logo.png`) 노출
  - 푸터 (네이비 배경): `logo-white.png` 노출
- **로고 높이 최적화**: `--logo-h: 48px`(모바일 44px)로 헤더(80px) 중앙에 알맞은 균형 배치.

### 3) 폰트 지원 강화 (`css/common.css`)
- Google Fonts `Montserrat:wght@500;600;700` 임포트 추가.

### 4) 중복 텍스트 및 불필요한 스크립트 로직 제거
- 7개 전 페이지의 헤더 및 푸터에서 `<span class="logo-text">WYNDHAM</span>` 마크업 전면 제거.
- `js/components/header.js`에서 텍스트 로고를 강제 노출시키던 `initLogoFallback` 함수 제거.

---

## 3. 수정된 파일 목록
- `images/logo.png` : 공식 윈덤 컬러 로고 PNG 추가
- `images/logo-white.png` : 공식 윈덤 화이트 로고 PNG 추가
- `images/logo.svg` : 기존 SVG 삭제
- `css/main.css` : 로고 PNG 분기 스타일 및 높이 조정
- `css/common.css` : Montserrat 폰트 임포트
- `js/components/header.js` : 로고 텍스트 fallback 로직 정리
- `index.html`, `rooms.html`, `pool.html`, `dining.html`, `facilities.html`, `story.html`, `reservation.html` : 공식 로고 PNG 적용 및 `span.logo-text` 제거

---

## 4. Git 반영 사항
- **메인 브랜치 푸시 완료**: 사용자의 최종 반영 요청에 따라 본 보고서와 함께 `main` 브랜치에 커밋 및 `git push origin main` 완료.
