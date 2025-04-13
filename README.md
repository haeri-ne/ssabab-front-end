# 📌 Vue 기반 식단표 평가 서비스

✅ **Vue 3 + Vuetify를 사용하여 구축된 식단표 평가 웹 애플리케이션**  
✅ **Vite 기반의 빠른 빌드 환경 제공**  
✅ **Pinia를 활용한 상태 관리 + Vue Router로 페이지 전환 구현**  
✅ **식단표 별점 평가 및 한줄평 기능 포함**

---

## 📌 프로젝트 개요
이 프로젝트는 **학교/회사 급식 식단표를 평가하고 피드백을 남길 수 있는 웹 서비스**입니다.  
관리자는 **메뉴를 등록하고 수정**할 수 있으며, 일반 사용자는 **식단표에 대해 별점을 매기고 한줄평을 남길 수 있습니다.**

🚀 **주요 기능**
- `별점 기반 식단 평가`
- `한줄평 작성`
- `일자별 식단표 등록 및 수정 (관리자)`
- `Vuetify 기반의 반응형 UI`
- `Pinia를 이용한 글로벌 상태 관리`
- `Vue Router를 통한 SPA 라우팅`

---

## 📌 프로젝트 구조
\`\`\`plaintext
📂 src/
│
├── 📂 assets/                # 정적 자원 (이미지 등)
│
├── 📂 components/            # 재사용 가능한 컴포넌트
│   ├── AdminLogin.vue        # 관리자 로그인
│   ├── AdminMenuCreate.vue   # 관리자 메뉴 생성
│   ├── AdminMenuEdit.vue     # 관리자 메뉴 수정
│   ├── Header.vue            # 헤더
│   ├── MenuCard.vue          # 두 메뉴의 음식 목록과 사용자가 남긴 평점을 보여주는 컴포넌트
│   └── ReviewCard.vue        # 선택한 메뉴의 음식에 별점과 한줄평을 남길 수 있는 컴포넌트
│
├── 📂 plugins/
│   └── vuetify.js           # Vuetify 플러그인 설정
│
├── 📂 router/
│   └── index.js             # Vue Router 설정
│
├── 📂 store/                # Pinia 스토어
│   ├── dateStore.js          # 사용자가 원하는 날짜를 관리
│   ├── logStore.js           # 프론트, 백 로그 기록 전송
│   └── menuStore.js          # 특정 날짜의 메뉴를 가져오고, 사용자가 남긴 평점을 저장
│
├── 📂 utils/                # 유틸 함수 모음
│   ├── timeUtil.js           # 한국 시간으로 조정
│   └── uuidUtil.js           # 로컬 스토리지 별 사용자 ID 생성 및 관리
│
├── 📂 views/                # 주요 페이지 라우트 컴포넌트
│   ├── AdminView.vue         # 관리자 페이지
│   ├── HomeView.vue          # 로딩 페이지
│   ├── MenusView.vue         # 메뉴 및 평점 조회 페이지
│   ├── ReviewView.vue        # 리뷰 작성 페이지
│   └── ReviewCompletedView.vue # 리뷰 작성 완료 안내 페이지
│
├── App.vue                  # 루트 컴포넌트
└── main.js                  # 애플리케이션 진입점
\`\`\`

---

## 🌐 페이지 라우팅 정보

| 경로 | 페이지 컴포넌트 | 설명 |
|------|------------------|------|
| \`/\` | \`HomeView.vue\` | 로딩 페이지 |
| \`/menus\` | \`MenusView.vue\` | 메뉴 및 평점 조회 페이지 |
| \`/review\` | \`ReviewView.vue\` | 리뷰 작성 폼 페이지 |
| \`/review-completed\` | \`ReviewCompletedView.vue\` | 리뷰 작성 완료 안내 페이지 |
| \`/admin\` | \`AdminView.vue\` | 관리자 메뉴 등록 및 수정 화면 |

---

## 🔄 상태 관리 (Pinia Store)

| 스토어 | 설명 |
|--------|------|
| \`dateStore.js\` | 선택된 날짜 관리 |
| \`logStore.js\` | 사용자의 리뷰/접속 기록 관련 상태 |
| \`menuStore.js\` | 메뉴 데이터 관리 및 캐싱 등 |

---

## 🛠 유틸 함수

| 파일 | 설명 |
|------|------|
| \`timeUtil.js\` | UTC → KST 변환 유틸리티 함수 제공 |
| \`uuidUtil.js\` | UUID 생성 함수 제공 (고유한 사용자 ID 생성용) |

---

## 📌 설치 및 실행 방법

### 🔹 1️⃣ 프로젝트 클론
\`\`\`bash
git clone https://github.com/haeri-ne/ssabab-front-end.git
\`\`\`

### 🔹 2️⃣ 패키지 설치
\`\`\`bash
npm install
\`\`\`

### 🔹 3️⃣ 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`

### 🔹 4️⃣ 배포용 빌드
\`\`\`bash
npm run build
\`\`\`

---

## 📌 기술 스택

| 구분       | 기술 |
|------------|------|
| **Frontend** | Vue 3 |
| **빌드 도구** | Vite |
| **UI 프레임워크** | Vuetify 3 |
| **상태 관리** | Pinia |
| **라우팅** | Vue Router |
| **기타** | UUID 생성, 날짜 유틸 등 |

---