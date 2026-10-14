# 변경 내역 – 메인 카테고리 5종 서브페이지 구현 및 네비게이션 연동 (2026-10-14)

## 1. 개요
메인페이지 네비게이션 메뉴에 위치한 5개 핵심 카테고리(`ROOMS`, `POOL`, `DINING`, `FACILITIES`, `STORY`)를 독립 서브페이지로 구현하고, 사이트 전반의 헤더/푸터 및 본문 링크를 정식 연결했습니다.

---

## 2. 신규 생성된 서브페이지 목록

| 페이지 파일 | 카테고리 | 주요 구성 요소 및 인터랙션 |
| :--- | :--- | :--- |
| [rooms.html](file:///c:/Users/chobj/Desktop/호텔%20초안_조범준/rooms.html) | **ROOMS** | • 3개 객실(디럭스, 프리미어, 스위트) 인터랙티브 탭 컴포넌트<br>• 침대/인원/면적/전망 스펙 테이블 및 룸 어메니티 태그<br>• 체크인/체크아웃, 추가 인원, 조식 안내 테이블 |
| [pool.html](file:///c:/Users/chobj/Desktop/호텔%20초안_조범준/pool.html) | **POOL** | • 인피니티 풀, 프라이빗 카바나 풀, 키즈 풀 3단 좌우 교차 상세 소개<br>• 수온, 수심, 운영 규정 및 풀 데스크 이용 안내<br>• 풀 패키지 연계 예약 CTA |
| [dining.html](file:///c:/Users/chobj/Desktop/호텔%20초안_조범준/dining.html) | **DINING** | • 올데이 뷔페 '아나나스', '스카이 풀 바', '오션 버거 라운지' 3대 레스토랑 카드<br>• 아나나스 조식/중식/석식 운영 시간 및 요금 안내<br>• 미식 다이닝 모자이크 갤러리 |
| [facilities.html](file:///c:/Users/chobj/Desktop/호텔%20초안_조범준/facilities.html) | **FACILITIES** | • 부대시설 핵심 특징 4종 아이콘 그리드<br>• 24시간 오션뷰 피트니스 센터 & 그랜드 볼룸 연회장 상세 스펙<br>• 층별 편의시설 운영 시간표 |
| [story.html](file:///c:/Users/chobj/Desktop/호텔%20초안_조범준/story.html) | **STORY** | • 윈덤 브랜드 철학 및 고성 자연과의 조화 스토리텔링<br>• 4대 수치 통계 밴드 (100% 오션뷰, 24H 풀뷰 등)<br>• 자연/휴식/로컬 3대 핵심 가치 카드 & 4개년 연혁 타임라인 |

---

## 3. 공통 디자인 시스템 및 모듈화

### CSS 모듈: [css/sub.css](file:///c:/Users/chobj/Desktop/호텔%20초안_조범준/css/sub.css)
- **컬러 시스템 계승**: 메인페이지의 5단계 비율(화이트 55%, 아이스블루 20%, 스카이블루 12%, 오션블루 8%, 네이비 5%) 토큰 엄격 적용.
- **서브 히어로 (Sub-Hero)**: 64vh 높이, 켄 번스(Ken Burns) 무한 줌 애니메이션, 헤더 가독성 그라데이션 오버레이.
- **스티키 카테고리 바 (`.sub-nav`)**: 헤더 바로 아래에 고정되어 다른 카테고리로의 이동 편의성 제공 및 현재 페이지 표시(`aria-current="page"`).
- **공통 컴포넌트 UI**: 상세 행 좌우 교차 레이아웃(`.detail-row`), 키-밸류 스펙 리스트(`.spec-list`), 카드 그리드(`.card-grid`), 모자이크 갤러리(`.gallery`), 연혁 타임라인(`.timeline`), 하단 공통 예약 CTA 밴드(`.cta-band`).

### JS 모듈: [js/components/tabs.js](file:///c:/Users/chobj/Desktop/호텔%20초안_조범준/js/components/tabs.js)
- **웹 접근성 WAI-ARIA 준수**: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls` 지원.
- **이벤트 위임 패턴**: 상위 탭 리스트 하나에만 리스너를 바인딩하여 메모리 최적화.
- **키보드 접근성**: 좌/우 화살표 방향키를 통한 탭 전환 지원.
- **URL 해시 딥링킹**: URL 뒤에 `#suite` 형태로 진입 시 스카이 스위트 탭이 자동 활성화.

### JS 엔트리: [js/sub.js](file:///c:/Users/chobj/Desktop/호텔%20초안_조범준/js/sub.js)
- 서브페이지 구동에 필요한 `Header`, `Reveal`, `Tabs` 컴포넌트만 안전하게 선별 초기화.

---

## 4. 기존 페이지 네비게이션 연동
- **[index.html](file:///c:/Users/chobj/Desktop/호텔%20초안_조범준/index.html)**:
  - 헤더 GNB 및 푸터 링크를 내부 앵커(`#rooms` 등)에서 정식 서브페이지(`rooms.html` 등)로 교체.
  - ROOMS 섹션 및 FACILITIES 섹션 설명글 옆에 `객실 자세히 보기 >`, `시설 자세히 보기 >` 텍스트 링크 추가.
- **[reservation.html](file:///c:/Users/chobj/Desktop/호텔%20초안_조범준/reservation.html)**:
  - 헤더 GNB 및 푸터 링크를 서브페이지 경로로 전면 통일.
- **[css/common.css](file:///c:/Users/chobj/Desktop/호텔%20초안_조범준/css/common.css)**:
  - 본문 섹션 내 링크를 위한 공통 `.text-link` 스타일 추가.
