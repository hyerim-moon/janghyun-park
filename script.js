/**
 * Classic Elegant Wedding Invitation
 * Korean Mobile 청첩장 - Script
 */

(function () {
  'use strict';

  // 확대(Zoom) 엔진 인스턴스 변수
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
      Image Auto-Detection
     ═══════════════════════════════════════════ */

  function loadImagesFromFolder(folder, maxAttempts = 50) {
    return new Promise(resolve => {
        const images = [];
        let current = 1;
        let consecutiveFails = 0;
        function tryNext() {
            if (current > maxAttempts || consecutiveFails >= 3) { resolve(images); return; }
            const img = new Image();
            const path = `images/${folder}/${current}.jpg`;
            img.onload = () => { images.push(path); consecutiveFails = 0; current++; tryNext(); };
            img.onerror = () => { consecutiveFails++; current++; tryNext(); };
            img.src = path;
        }
        tryNext();
    });
  }

  /* ═══════════════════════════════════════════
      Toast & Clipboard
     ═══════════════════════════════════════════ */

  let toastTimer = null;
  function showToast(message) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2500);
  }

  async function copyToClipboard(text, successMsg) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        showToast(successMsg || '복사되었습니다');
      } else {
        throw new Error('Fallback');
      }
    } catch (err) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed'; ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(successMsg || '복사되었습니다');
    }
  }

  /* ═══════════════════════════════════════════
      Photo Modal (With Pinch Zoom & Swipe)
     ═══════════════════════════════════════════ */

  let modalImages = [];
  let modalIndex = 0;
  let touchStartX = 0, touchEndX = 0, touchStartY = 0, touchEndY = 0;

  function initPinchZoom() {
    const el = $('#modalContainer');
    if (!el || typeof PinchZoom === 'undefined') return;
    if (pz) pz.destroy();
    pz = new PinchZoom(el, {
      draggableUnzoomed: false, minZoom: 1, maxZoom: 4, tapZoomFactor: 2
    });
  }

  function openPhotoModal(images, index) {
    modalImages = images;
    modalIndex = index;
    showModalImage();
    setTimeout(() => { initPinchZoom(); }, 100);
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
    const closeBtn = $('#modalClose');
    if (closeBtn) closeBtn.addEventListener('click', closePhotoModal);
    $('#modalPrev').addEventListener('click', () => modalNavigate(-1));
    $('#modalNext').addEventListener('click', () => modalNavigate(1));
    const modal = $('#photoModal');
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
      Initialization Logic
     ═══════════════════════════════════════════ */

  function initCurtain() {
    const curtain = $('#curtain');
    if (CONFIG.useCurtain === false) { curtain.style.display = 'none'; initPetals(); return; }
    $('#curtainNames').textContent = `${CONFIG.groom.name} & ${CONFIG.bride.name}`;
    $('#curtainBtn').addEventListener('click', () => {
      curtain.classList.add('is-open');
      document.body.classList.remove('no-scroll');
      setTimeout(() => { curtain.classList.add('is-hidden'); initPetals(); }, 1400);
    });
    document.body.classList.add('no-scroll');
  }

  function initPetals() {
    const canvas = $('#petalCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    const petals = [];
    function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    class Petal {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this
