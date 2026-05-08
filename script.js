(function () {
  'use strict';

  let pz = null;
  let modalImages = [];
  let modalIndex = 0;
  let touchStartX = 0, touchEndX = 0;

  const $ = (sel) => document.querySelector(sel);

  // 줌 엔진 실행
  function initPinchZoom() {
    const el = $('#modalContainer');
    if (typeof PinchZoom !== 'undefined' && el) {
      if (pz) pz.destroy();
      pz = new PinchZoom(el, {
        draggableUnzoomed: false,
        minZoom: 1,
        maxZoom: 4,
        tapZoomFactor: 2
      });
    }
  }

  // 모달 열기
  function openPhotoModal(images, index) {
    modalImages = images;
    modalIndex = index;
    const img = $('#modalImg');
    if (img) {
      if (pz) pz.scaleTo(1, { animate: false });
      img.src = modalImages[modalIndex];
      $('#modalCounter').textContent = `${modalIndex + 1} / ${modalImages.length}`;
      $('#modalPrev').style.display = modalIndex > 0 ? '' : 'none';
      $('#modalNext').style.display = modalIndex < modalImages.length - 1 ? '' : 'none';
      
      $('#photoModal').classList.add('is-open');
      document.body.style.overflow = 'hidden'; // 모달 열릴 때만 스크롤 방지
      setTimeout(initPinchZoom, 200);
    }
  }

  function closePhotoModal() {
    $('#photoModal').classList.remove('is-open');
    document.body.style.overflow = ''; // 스크롤 복구
    if (pz) pz.scaleTo(1, { animate: false });
  }

  function modalNavigate(dir) {
    const newIndex = modalIndex + dir;
    if (newIndex >= 0 && newIndex < modalImages.length) {
      modalIndex = newIndex;
      if (pz) pz.scaleTo(1, { animate: false });
      $('#modalImg').src = modalImages[modalIndex];
      $('#modalCounter').textContent = `${modalIndex + 1} / ${modalImages.length}`;
      $('#modalPrev').style.display = modalIndex > 0 ? '' : 'none';
      $('#modalNext').style.display = modalIndex < modalImages.length - 1 ? '' : 'none';
    }
  }

  function init() {
    // 1. 기본 정보 세팅
    document.title = CONFIG.meta.title;
    $('#heroNames').textContent = `${CONFIG.groom.name} · ${CONFIG.bride.name}`;
    $('#heroVenue').textContent = CONFIG.wedding.venue;

    // 2. 모달 버튼 이벤트
    $('#modalClose').onclick = closePhotoModal;
    $('#modalPrev').onclick = () => modalNavigate(-1);
    $('#modalNext').onclick = () => modalNavigate(1);

    // 3. 갤러리 생성 (기존 로직 유지)
    const galleryGrid = $('#galleryGrid');
    if (galleryGrid) {
      for (let i = 1; i <= 12; i++) {
        const src = `images/gallery/${i}.jpg`;
        const div = document.createElement('div');
        div.className = 'gallery__item';
        div.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
        div.onclick = () => {
          const allImgs = [];
          for(let j=1; j<=12; j++) allImgs.push(`images/gallery/${j}.jpg`);
          openPhotoModal(allImgs, i-1);
        };
        galleryGrid.appendChild(div);
      }
    }

    // 4. 모달 스와이프 (확대 중 아닐 때만)
    const container = $('#modalContainer');
    if (container) {
      container.ontouchstart = (e) => { touchStartX = e.changedTouches[0].screenX; };
      container.ontouchend = (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (!(pz && pz.zoomFactor > 1)) {
          const diffX = touchStartX - touchEndX;
          if (Math.abs(diffX) > 50) modalNavigate(diffX > 0 ? 1 : -1);
        }
      };
    }
  }

  init();
})();
