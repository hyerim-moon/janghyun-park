/**
 * Classic Elegant Wedding Invitation
 * Korean Mobile 청첩장 - Script
 */

(function () {
  'use strict';

  // 확대(Zoom) 엔진 변수
  let pz = null; 

  /* ═══════════════════════════════════════════
      Utility Helpers
     ═══════════════════════════════════════════ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function formatDate(dateStr, timeStr) {
    const d = new Date(`${dateStr}T${timeStr}:00`);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const h12 = d.getHours() % 12 || 12;
    const period = d.getHours() < 12 ? '오전' : '오후';
    const minuteStr = d.getMinutes() > 0 ? ` ${d.getMinutes()}분` : '';
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}요일 ${period} ${h12}시${minuteStr}`;
  }

  function getWeddingDateTime() {
    return new Date(`${CONFIG.wedding.date}T${CONFIG.wedding.time}:00`);
  }

  /* ═══════════════════════════════════════════
      Photo Modal (With Pinch Zoom & Swipe)
     ═══════════════════════════════════════════ */
  let modalImages = [];
  let modalIndex = 0;
  let touchStartX = 0, touchEndX = 0, touchStartY = 0, touchEndY = 0;

  function initPinchZoom() {
    const el = $('#modalContainer');
    // PinchZoom 라이브러리가 로드되지 않았으면 중단
    if (!el || typeof PinchZoom === 'undefined') return;
    if (pz) pz.destroy();
    pz = new PinchZoom(el, {
      draggableUnzoomed: false,
      minZoom: 1,
      maxZoom: 4,
      tapZoomFactor: 2
    });
  }

  function openPhotoModal(images, index) {
    modalImages = images;
    modalIndex = index;
    showModalImage();
    setTimeout(() => { initPinchZoom(); }, 150);
    $('#photoModal').classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function closePhotoModal() {
    $('#photoModal').classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    if (pz) pz.scaleTo(1, { animate: false });
  }

  function showModalImage() {
    const img = $('#modalImg');
    if (!img) return;
    if (pz) pz.scaleTo(1, { animate: false });
    img.src = modalImages[modalIndex];
    $('#modalCounter').textContent = `${modalIndex + 1} / ${modalImages.length}`;
    $('#modalPrev').style.display = modalIndex > 0 ? '' : 'none';
    $('#modalNext').style.display = modalIndex < modalImages.length - 1 ? '' : 'none';
  }

  function modalNavigate(dir) {
    const newIndex = modalIndex + dir;
    if (newIndex >= 0 && newIndex < modalImages.length) {
      modalIndex = newIndex;
      showModalImage();
    }
  }

  function initPhotoModal() {
    const modal = $('#photoModal');
    if (!modal) return;

    $('#modalClose').addEventListener('click', closePhotoModal);
    $('#modalPrev').addEventListener('click', () => modalNavigate(-1));
    $('#modalNext').addEventListener('click', () => modalNavigate(1));

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.id === 'modalContainer') closePhotoModal();
    });

    const container = $('#modalContainer');
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    if (pz && pz.zoomFactor > 1) return;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    if (Math.abs(diffX) < 50 || Math.abs(diffX) < Math.abs(diffY)) return;
    if (diffX > 0) modalNavigate(1); else modalNavigate(-1);
  }

  /* ═══════════════════════════════════════════
      Core Logic (Curtain, Gallery, etc.)
     ═══════════════════════════════════════════ */
  function initCurtain() {
    const curtain = $('#curtain');
    if (!curtain) return;
    if (CONFIG.useCurtain === false) {
      curtain.style.display = 'none';
      return;
    }
    $('#curtainNames').textContent = `${CONFIG.groom.name} & ${CONFIG.bride.name}`;
    $('#curtainBtn').addEventListener('click', () => {
      curtain.classList.add('is-open');
      document.body.classList.remove('no-scroll');
      setTimeout(() => { curtain.classList.add('is-hidden'); }, 1400);
    });
    document.body.classList.add('no-scroll');
  }

  function loadImagesFromFolder(folder) {
    return new Promise(resolve => {
      const images = [];
      let current = 1;
      let fails = 0;
      function tryNext() {
        if (current > 50 || fails >= 3) { resolve(images); return; }
        const img = new Image();
        img.onload = () => { images.push(`images/${folder}/${current}.jpg`); fails = 0; current++; tryNext(); };
        img.onerror = () => { fails++; current++; tryNext(); };
        img.src = `images/${folder}/${current}.jpg`;
      }
      tryNext();
    });
  }

  function renderMedia(imgs, containerId, isGallery) {
    const container = $(`#${containerId}`);
    if (!container) return;
    container.innerHTML = ''; 
    imgs.forEach((src, i) => {
      const div = document.createElement('div');
      div.className = isGallery ? 'gallery__item' : 'story__photo-item';
      div.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
      div.addEventListener('click', () => openPhotoModal(imgs, i));
      container.appendChild(div);
    });
  }

  async function init() {
    try {
      document.title = CONFIG.meta.title;
      initCurtain();
      initPhotoModal();

      // 히어로 섹션
      $('#heroPhoto').src = 'images/hero/1.jpg';
      $('#heroNames').textContent = `${CONFIG.groom.name} · ${CONFIG.bride.name}`;
      $('#heroDate').textContent = formatDate(CONFIG.wedding.date, CONFIG.wedding.time);
      $('#heroVenue').textContent = CONFIG.wedding.venue;

      // 이미지 로드 및 렌더링
      const [storyImgs, galleryImgs] = await Promise.all([
        loadImagesFromFolder('story'),
        loadImagesFromFolder('gallery')
      ]);
      renderMedia(storyImgs, 'storyPhotos', false);
      renderMedia(galleryImgs, 'galleryGrid', true);

    } catch (e) {
      console.error("초기화 중 에러 발생:", e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
