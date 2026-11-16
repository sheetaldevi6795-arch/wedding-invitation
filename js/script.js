/**
 * Deepanshu & Mamta — Royal Wedding Invitation v3.0
 * script.js — Interactive Royal Experience, Audio Synthesizer,
 *             Gallery Lightbox, Carousel Slider & Custom Photo Upload
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════════════
     1. FLOATING PETALS & GOLDEN SPARKLES
  ════════════════════════════════════════════════════ */
  const petalsContainer = document.getElementById('petals-container');
  const petalColors = [
    '#D4AF6A', '#E5C77A', '#F5D5C4', 
    '#FFF0E0', '#F0C5A8', '#E8D5BC', 
    '#FFD6B0', '#E5A47A', '#FCEEE3'
  ];

  function createPetal() {
    if (!petalsContainer) return;
    const p = document.createElement('div');
    p.className = 'petal';
    
    const size     = +(Math.random() * 14 + 8).toFixed(1);
    const color    = petalColors[Math.floor(Math.random() * petalColors.length)];
    const startX   = +(Math.random() * 102).toFixed(1);
    const duration = +(Math.random() * 9 + 8).toFixed(1);
    const delay    = +(Math.random() * 4).toFixed(2);
    const radius   = Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%';

    p.style.cssText = `
      left: ${startX}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${radius};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      box-shadow: 0 0 6px rgba(212,175,106,0.3);
    `;

    petalsContainer.appendChild(p);
    setTimeout(() => p.remove(), (duration + delay) * 1000 + 400);
  }

  function createSparkle() {
    if (!petalsContainer) return;
    const s = document.createElement('div');
    s.className = 'sparkle-dot';
    const size = Math.floor(Math.random() * 5 + 3);
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const dur  = (Math.random() * 2 + 1.5).toFixed(1);

    s.style.cssText = `
      left: ${posX}%;
      top: ${posY}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${dur}s;
    `;

    petalsContainer.appendChild(s);
    setTimeout(() => s.remove(), dur * 1000);
  }

  // Seed initial particles & interval loops
  for (let i = 0; i < 18; i++) setTimeout(createPetal, i * 260);
  setInterval(createPetal, 900);
  setInterval(createSparkle, 700);

  /* ═══════════════════════════════════════════════════
     2. INVITATION OPENER (Envelope Ceremony)
  ════════════════════════════════════════════════════ */
  const openBtn     = document.getElementById('open-btn');
  const cover       = document.getElementById('cover');
  const mainContent = document.getElementById('main-content');
  const overlay     = document.getElementById('envelope-overlay');

  if (openBtn) {
    openBtn.addEventListener('click', openInvitation);
  }

  function openInvitation() {
    openBtn.disabled = true;
    openBtn.style.opacity = '0.7';
    overlay.classList.add('active');

    setTimeout(() => {
      overlay.classList.add('open');

      setTimeout(() => {
        cover.style.transition = 'opacity 0.6s ease';
        cover.style.opacity = '0';
        mainContent.classList.add('visible');

        setTimeout(() => {
          cover.style.display = 'none';
          overlay.style.display = 'none';
          window.scrollTo({ top: 0, behavior: 'instant' });
          initReveal();
          initCarouselAutoPlay();
          startWeddingMusic();
        }, 500);
      }, 900);
    }, 180);
  }

  /* ═══════════════════════════════════════════════════
     3. WEDDING AUDIO & WEB AUDIO SYNTHESIZER FALLBACK
  ════════════════════════════════════════════════════ */
  const bgMusic      = document.getElementById('bg-music');
  const musicBtn     = document.getElementById('music-btn');
  const musicTooltip = document.getElementById('music-tooltip');
  let isPlaying      = false;
  let audioCtx       = null;
  let synthInterval  = null;

  // Indian Raga Notes (Bhairavi / Yaman auspicious frequencies)
  const ragaFreqs = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];

  function playSynthMelodyNote() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc  = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      const freq = ragaFreqs[Math.floor(Math.random() * ragaFreqs.length)];
      osc.type = 'triangle'; // Santoor / Flute warm sound
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 1.3);
    } catch (e) {
      // AudioContext unavailable
    }
  }

  function startWeddingMusic() {
    if (!bgMusic) return;
    bgMusic.volume = 0.35;

    bgMusic.play()
      .then(() => setAudioState(true))
      .catch(() => {
        // Fallback: Start soft Santoor procedural melodic chimes
        if (!synthInterval) {
          synthInterval = setInterval(playSynthMelodyNote, 800);
        }
        setAudioState(true);
      });
  }

  function stopWeddingMusic() {
    if (bgMusic) bgMusic.pause();
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
    setAudioState(false);
  }

  function setAudioState(active) {
    isPlaying = active;
    if (active) {
      musicBtn.classList.add('playing');
      musicTooltip.textContent = 'Pause Music';
    } else {
      musicBtn.classList.remove('playing');
      musicTooltip.textContent = 'Play Music';
    }
  }

  musicBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopWeddingMusic();
    } else {
      startWeddingMusic();
    }
  });

  /* ═══════════════════════════════════════════════════
     4. LIVE WEDDING COUNTDOWN TIMER
  ════════════════════════════════════════════════════ */
  const WEDDING_TARGET = new Date('2026-12-05T16:00:00+05:30');
  const cdElements = {
    days:    document.getElementById('days'),
    hours:   document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
  };

  function padZero(n) { return String(n).padStart(2, '0'); }

  function updateNumberDisplay(el, val) {
    if (!el || el.textContent === val) return;
    el.style.transform = 'translateY(-6px)';
    el.style.opacity   = '0.35';
    setTimeout(() => {
      el.textContent   = val;
      el.style.transform = '';
      el.style.opacity   = '';
    }, 160);
  }

  function calculateCountdown() {
    const diff = WEDDING_TARGET - new Date();
    if (diff <= 0) {
      Object.values(cdElements).forEach(el => { if (el) el.textContent = '00'; });
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    updateNumberDisplay(cdElements.days,    padZero(d));
    updateNumberDisplay(cdElements.hours,   padZero(h));
    updateNumberDisplay(cdElements.minutes, padZero(m));
    updateNumberDisplay(cdElements.seconds, padZero(s));
  }

  calculateCountdown();
  setInterval(calculateCountdown, 1000);

  /* ═══════════════════════════════════════════════════
     5. MOBILE NAVIGATION MENU
  ════════════════════════════════════════════════════ */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    navLinks.querySelectorAll('a').forEach(anchor => {
      anchor.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  /* ═══════════════════════════════════════════════════
     6. SCROLL REVEAL (Intersection Observer)
  ════════════════════════════════════════════════════ */
  function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = [...(el.parentElement?.querySelectorAll('.reveal') || [])];
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = `${Math.max(0, idx * 0.08)}s`;
        el.classList.add('visible');
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  if (mainContent.classList.contains('visible')) initReveal();

  /* ═══════════════════════════════════════════════════
     7. FEATURED HERO CAROUSEL / SLIDER
  ════════════════════════════════════════════════════ */
  const carouselTrack = document.getElementById('carousel-track');
  const carSlides     = document.querySelectorAll('.carousel-slide');
  const carDots       = document.querySelectorAll('.carousel-dots .dot');
  const carPrev       = document.getElementById('car-prev');
  const carNext       = document.getElementById('car-next');
  let currentSlide    = 0;
  let carTimer        = null;

  function goToSlide(idx) {
    if (!carouselTrack || !carSlides.length) return;
    currentSlide = (idx + carSlides.length) % carSlides.length;
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    carDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  if (carNext && carPrev) {
    carNext.addEventListener('click', nextSlide);
    carPrev.addEventListener('click', prevSlide);
  }

  carDots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });

  function initCarouselAutoPlay() {
    if (carTimer) clearInterval(carTimer);
    carTimer = setInterval(nextSlide, 5000);
  }

  const carWrap = document.getElementById('royal-carousel');
  if (carWrap) {
    carWrap.addEventListener('mouseenter', () => clearInterval(carTimer));
    carWrap.addEventListener('mouseleave', initCarouselAutoPlay);
  }

  /* ═══════════════════════════════════════════════════
     8. CATEGORY FILTERABLE PHOTO GALLERY
  ════════════════════════════════════════════════════ */
  const tabButtons   = document.querySelectorAll('.tab-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ═══════════════════════════════════════════════════
     9. PHOTO GALLERY LIGHTBOX & TOUCH SWIPE
  ════════════════════════════════════════════════════ */
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbCounter = document.getElementById('lb-counter');
  const lbClose   = document.getElementById('lb-close');
  const lbPrev    = document.getElementById('lb-prev');
  const lbNext    = document.getElementById('lb-next');

  let activeGallery = [];
  let currentLbIndex = 0;

  function refreshActiveGalleryList() {
    activeGallery = [...document.querySelectorAll('.gallery-item:not(.hidden)')];
  }

  function openLightbox(index) {
    refreshActiveGalleryList();
    if (!activeGallery[index]) return;
    currentLbIndex = index;
    updateLightboxContent();

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => lightbox.classList.add('visible'));
  }

  function closeLightbox() {
    lightbox.classList.remove('visible');
    setTimeout(() => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }, 350);
  }

  function updateLightboxContent() {
    const item = activeGallery[currentLbIndex];
    if (!item) return;

    const fullSrc = item.dataset.full;
    const caption = item.dataset.caption || item.querySelector('h4')?.textContent || 'Royal Moment';

    lbImg.style.opacity = '0';
    lbImg.style.transform = 'scale(0.95)';

    setTimeout(() => {
      lbImg.src = fullSrc;
      lbImg.onload = () => {
        lbImg.style.opacity = '1';
        lbImg.style.transform = 'scale(1)';
        lbImg.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      };
    }, 120);

    lbCaption.textContent = caption;
    lbCounter.textContent = `${currentLbIndex + 1} of ${activeGallery.length}`;
  }

  function showNextPhoto() {
    currentLbIndex = (currentLbIndex + 1) % activeGallery.length;
    updateLightboxContent();
  }

  function showPrevPhoto() {
    currentLbIndex = (currentLbIndex - 1 + activeGallery.length) % activeGallery.length;
    updateLightboxContent();
  }

  function bindGalleryItemClicks() {
    document.querySelectorAll('.gallery-item').forEach((item, i) => {
      item.onclick = () => {
        refreshActiveGalleryList();
        const currentActiveIdx = activeGallery.indexOf(item);
        openLightbox(currentActiveIdx !== -1 ? currentActiveIdx : 0);
      };
    });
  }
  bindGalleryItemClicks();

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbNext)  lbNext.addEventListener('click', showNextPhoto);
  if (lbPrev)  lbPrev.addEventListener('click', showPrevPhoto);

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') showNextPhoto();
    if (e.key === 'ArrowLeft')  showPrevPhoto();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Touch Swipe on mobile for Lightbox
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) {
      diff < 0 ? showNextPhoto() : showPrevPhoto();
    }
  }, { passive: true });

  /* ═══════════════════════════════════════════════════
     10. CUSTOM PHOTO UPLOADS (Groom, Bride & Gallery)
  ════════════════════════════════════════════════════ */
  const groomInput   = document.getElementById('groom-photo-input');
  const brideInput   = document.getElementById('bride-photo-input');
  const generalInput = document.getElementById('general-photo-input');
  const btnUploadGal = document.getElementById('btn-upload-gallery');
  const btnGroomPic  = document.getElementById('btn-change-groom');
  const btnBridePic  = document.getElementById('btn-change-bride');
  const groomImg     = document.getElementById('groom-img');
  const brideImg     = document.getElementById('bride-img');
  const galleryGrid  = document.getElementById('gallery-grid');

  // Trigger file inputs
  if (btnGroomPic)  btnGroomPic.onclick  = () => groomInput.click();
  if (btnBridePic)  btnBridePic.onclick  = () => brideInput.click();
  if (btnUploadGal) btnUploadGal.onclick = () => generalInput.click();

  // Load custom photos from localStorage if previously stored
  const savedGroom = localStorage.getItem('deepanshu_groom_photo');
  const savedBride = localStorage.getItem('mamta_bride_photo');
  if (savedGroom && groomImg) groomImg.src = savedGroom;
  if (savedBride && brideImg) brideImg.src = savedBride;

  // Handle Groom photo change
  if (groomInput) {
    groomInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          groomImg.src = evt.target.result;
          try { localStorage.setItem('deepanshu_groom_photo', evt.target.result); } catch (err) {}
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Handle Bride photo change
  if (brideInput) {
    brideInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          brideImg.src = evt.target.result;
          try { localStorage.setItem('mamta_bride_photo', evt.target.result); } catch (err) {}
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Handle adding user photos to gallery
  if (generalInput) {
    generalInput.addEventListener('change', (e) => {
      const files = [...e.target.files];
      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const item = document.createElement('div');
          item.className = 'gallery-item';
          item.dataset.category = 'prewedding';
          item.dataset.full = evt.target.result;
          item.dataset.caption = file.name.replace(/\.[^/.]+$/, "") || 'Wedding Memory';

          item.innerHTML = `
            <img src="${evt.target.result}" alt="Uploaded photo" />
            <div class="gallery-hover">
              <span class="hover-badge">PERSONAL MEMORY</span>
              <h4>${item.dataset.caption}</h4>
              <i class="fas fa-search-plus"></i>
            </div>
          `;

          // Prepend newly uploaded photos to top of gallery
          galleryGrid.prepend(item);
          bindGalleryItemClicks();
        };
        reader.readAsDataURL(file);
      });
      alert(`🎉 ${files.length} photo(s) added successfully to the gallery!`);
    });
  }

  /* ═══════════════════════════════════════════════════
     11. WALL OF BLESSINGS (Guestbook)
  ════════════════════════════════════════════════════ */
  const blessingForm = document.getElementById('blessing-form');
  const blessingsWall = document.getElementById('blessings-wall');

  if (blessingForm && blessingsWall) {
    blessingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('guest-name').value.trim();
      const rel  = document.getElementById('guest-relation').value.trim() || 'Well-wisher';
      const msg  = document.getElementById('guest-msg').value.trim();

      if (!name || !msg) return;

      const card = document.createElement('div');
      card.className = 'blessing-card';
      card.style.animation = 'fadeInUp 0.6s ease';
      card.innerHTML = `
        <i class="fas fa-quote-left card-quote"></i>
        <p class="blessing-quote">${msg}</p>
        <div class="blessing-sender">
          <strong>${name}</strong>
          <span>${rel}</span>
        </div>
      `;

      blessingsWall.prepend(card);
      blessingForm.reset();
      alert('🙏 Thank you for blessing Deepanshu & Mamta! Your warm wish has been added.');
    });
  }

  /* ═══════════════════════════════════════════════════
     12. BACK TO TOP BUTTON
  ════════════════════════════════════════════════════ */
  const backTop = document.getElementById('back-top');
  window.addEventListener('scroll', () => {
    if (backTop) {
      backTop.classList.toggle('visible', window.scrollY > 450);
    }
  }, { passive: true });

  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ═══════════════════════════════════════════════════
     13. WHATSAPP INVITATION SHARE
  ════════════════════════════════════════════════════ */
  const whatsappBtn = document.getElementById('whatsapp-btn');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const shareMsg = encodeURIComponent(
        `🌺 *ROYAL WEDDING INVITATION* 🌺\n\n` +
        `With the divine blessings of Lord Ganesha, you are cordially invited to celebrate the auspicious wedding of:\n\n` +
        `🤵 *Deepanshu Mangla*\n` +
        `       & \n` +
        `👰 *Mamta Goyal*\n\n` +
        `📅 *Saturday, 5th December 2026*\n` +
        `📍 *Mapple Gold*, Hall No. 5, D Mall, Sunder Vihar, Paschim Vihar, New Delhi – 110087\n\n` +
        `🌟 *Celebration Schedule:*\n` +
        `• 4:00 PM — Gurchari\n` +
        `• 6:00 PM — Departure of Baraat\n` +
        `• 8:00 PM — Dinner & Royal Feast\n\n` +
        `🔗 *View Full Digital Invitation:* ${window.location.href}\n\n` +
        `_We look forward to welcoming you!_ 🙏`
      );
      window.open(`https://api.whatsapp.com/send?text=${shareMsg}`, '_blank', 'noopener,noreferrer');
    });
  }

  /* ═══════════════════════════════════════════════════
     14. ADD TO GOOGLE CALENDAR
  ════════════════════════════════════════════════════ */
  const addCalBtn = document.getElementById('add-cal-btn');
  if (addCalBtn) {
    addCalBtn.addEventListener('click', () => {
      const calUrl =
        `https://calendar.google.com/calendar/render?action=TEMPLATE` +
        `&text=${encodeURIComponent('Deepanshu & Mamta Royal Wedding 🌺')}` +
        `&dates=20261205T103000Z/20261205T180000Z` +
        `&location=${encodeURIComponent('Mapple Gold, Hall No. 5, D Mall, Sunder Vihar, Paschim Vihar, New Delhi 110087')}` +
        `&details=${encodeURIComponent('Wedding Ceremony of Deepanshu Mangla & Mamta Goyal.\n\nEvents:\n• Gurchari: 4:00 PM\n• Baraat: 6:00 PM\n• Dinner: 8:00 PM\n\nHosts: Lt. Smt. Shakuntla Devi & Lt. Sh. Hukam Chand Mangla')}`;
      window.open(calUrl, '_blank', 'noopener,noreferrer');
    });
  }

  /* ═══════════════════════════════════════════════════
     15. SMOOTH NAVIGATION SCROLL & ACTIVE LINK HIGHLIGHT
  ════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('wedding-nav')?.offsetHeight || 60;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    });
  });

  const allSections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let currentId = '';
    allSections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        currentId = sec.id;
      }
    });

    allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentId}`);
    });
  }, { passive: true });

});
