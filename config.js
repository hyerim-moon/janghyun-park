/**
 * Wedding Invitation Configuration
 *
 * 이 파일에서 청첩장의 모든 정보를 수정할 수 있습니다.
 * 이미지는 설정이 필요 없습니다. 아래 폴더에 순번 파일명으로 넣으면 자동 감지됩니다.
 *
 * 이미지 폴더 구조 (파일명 규칙):
 *   images/hero/1.jpg      - 메인 사진 (1장, 필수)
 *   images/story/1.jpg, 2.jpg, ...  - 스토리 사진들 (순번, 자동 감지)
 *   images/gallery/1.jpg, 2.jpg, ... - 갤러리 사진들 (순번, 자동 감지)
 *   images/location/1.jpg  - 약도/지도 이미지 (1장)
 *   images/og/1.jpg        - 카카오톡 공유 썸네일 (1장)
 */

const CONFIG = {
  // ── 초대장 열기 ──
  useCurtain: false,  // 초대장 열기 화면 사용 여부 (true: 사용, false: 바로 본문 표시)

  // ── 메인 (히어로) ──
  groom: {
    name: "박장현",
    nameEn: "Janghyun Park",
    father: "박천택",
    mother: "김미정",
    fatherDeceased: false,
    motherDeceased: false
  },

  bride: {
    name: "문혜림",
    nameEn: "Hyerim Moon",
    father: "문명오",
    mother: "김미자",
    fatherDeceased: false,
    motherDeceased: false
  },

  wedding: {
    date: "2026-09-06",
    time: "13:40",
    venue: "팔레드오페라",
    hall: "트리아농홀 3층",
    address: "대전광역시 서구 둔산남로 50 팔레드오페라",
    tel: "042-300-5000",
    mapLinks: {
      kakao: "https://kko.to/naymJTuDGY",
      naver: "https://naver.me/5XJ5pd2B"
    }
  },

  // ── 인사말 ──
  greeting: {
    title: "소중한 분들을 초대합니다",
    content: "서로 다른 길을 걸어온 두 사람이\n이제 같은 길을 함께 걸어가려 합니다.\n\n저희의 새로운 시작을\n축복해 주시면 감사하겠습니다."
  },

  // ── 우리의 이야기 ──
  story: {
    title: "우리의 이야기",
    content: "서로 다른 길을 걷던 두 사람이\n하나의 길을 함께 걷게 되었습니다.\n\n여러분을 소중한 자리에 초대합니다."
  },

  // ── 오시는 길 ──
  // (mapLinks는 wedding 객체 내에 포함)

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
      { role: "신랑", name: "박장현", bank: "국민은행", number: "599702-04-180042" },
      { role: "아버지", name: "박천택", bank: "신한은행", number: "000-000-000000" },
      { role: "어머니", name: "김미정", bank: "우리은행", number: "000-000-000000" }
    ],
    bride: [
      { role: "신부", name: "문혜림", bank: "국민은행", number: "058-24-0466-331" },
      { role: "아버지", name: "문명오", bank: "기업은행", number: "000-000-000000" },
      { role: "어머니", name: "김미자", bank: "국민은행", number: "000-000-000000" }
    ]
  },

  // ── 링크 공유 시 나타나는 문구 ──
  meta: {
    title: "박장현 ♥ 문혜림 결혼합니다",
    description: "2026년 9월 6일, 소중한 분들을 초대합니다."
  }
};
