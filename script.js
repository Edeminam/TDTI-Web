/* ============================================================
   TECHRISE DTI — Main Script
   ============================================================ */

/* ── PAGE LOADER ─────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      initRevealObserver();
      initBlurReveal();
      initSASCounter();
      animateHeroIn();
    }
  }, 2200);
});

/* ── UPCOMING WEBINAR BAR DISMISS ────────────────────────── */
const closeUpcomingBar = document.getElementById('close-upcoming-bar');
if (closeUpcomingBar) {
  closeUpcomingBar.addEventListener('click', () => {
    const bar = document.getElementById('upcoming-webinar');
    if (bar) bar.classList.add('dismissed');
  });
}

/* ── CUSTOM CURSOR ───────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  }
});

(function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  if (follower) {
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
  }
  requestAnimationFrame(animateFollower);
})();

document.querySelectorAll('a, button, .program-row, .amount-chip, .dot').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor && cursor.classList.add('hover');
    follower && follower.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor && cursor.classList.remove('hover');
    follower && follower.classList.remove('hover');
  });
});

/* ── HERO ENTRANCE ANIMATION ─────────────────────────────── */
function animateHeroIn() {
  const items = document.querySelectorAll('.hero .reveal-up');
  items.forEach((el, i) => {
    const delay = parseFloat(el.dataset.delay || 0) * 1000 + i * 80;
    setTimeout(() => el.classList.add('visible'), delay + 200);
  });
}

/* ── NAVBAR SCROLL BEHAVIOUR ─────────────────────────────── */
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (navbar) {
    if (current > 60) {
      navbar.classList.add('scrolled');
      /* Switch to light mode when over light sections */
      const lightSections = ['about', 'programs', 'partners', 'contact'];
      const inLight = lightSections.some(id => {
        const s = document.getElementById(id);
        if (!s) return false;
        const rect = s.getBoundingClientRect();
        return rect.top <= 68 && rect.bottom > 68;
      });
      navbar.classList.toggle('light-mode', inLight);
    } else {
      navbar.classList.remove('scrolled', 'light-mode');
    }
  }
  lastScroll = current;
}, { passive: true });

/* ── HAMBURGER / FULLSCREEN MENU ──────────────────────────── */
const menuToggle  = document.getElementById('menu-toggle');
const menuOverlay = document.getElementById('menu-overlay');

function openMenu() {
  menuOverlay.classList.add('open');
  document.body.classList.add('menu-open');
  menuToggle.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  menuOverlay.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

menuToggle && menuToggle.addEventListener('click', () => {
  const isOpen = menuOverlay.classList.contains('open');
  isOpen ? closeMenu() : openMenu();
});

document.querySelectorAll('.menu-link:not(.menu-dropdown-toggle)').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.querySelectorAll('.menu-sublink').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* ── PROGRAMS DROPDOWNS (NAVBAR & MENU OVERLAY) ─────────── */
const menuProgramsToggle = document.getElementById('menu-programs-toggle');
const menuProgramsGroup = document.getElementById('menu-programs-group');
if (menuProgramsToggle && menuProgramsGroup) {
  menuProgramsToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = menuProgramsGroup.classList.toggle('open');
    menuProgramsToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

const navProgramsDropdown = document.getElementById('nav-programs-dropdown');
const programsDropdownTrigger = document.getElementById('programs-dropdown-trigger');
if (programsDropdownTrigger && navProgramsDropdown) {
  programsDropdownTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navProgramsDropdown.classList.toggle('open');
    programsDropdownTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!navProgramsDropdown.contains(e.target)) {
      navProgramsDropdown.classList.remove('open');
      programsDropdownTrigger.setAttribute('aria-expanded', 'false');
    }
  });

  navProgramsDropdown.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      navProgramsDropdown.classList.remove('open');
      programsDropdownTrigger.setAttribute('aria-expanded', 'false');
    });
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMenu();
    if (navProgramsDropdown) {
      navProgramsDropdown.classList.remove('open');
      if (programsDropdownTrigger) programsDropdownTrigger.setAttribute('aria-expanded', 'false');
    }
  }
});

/* ── PARTICLE CANVAS ─────────────────────────────────────── */
const canvas = document.getElementById('hero-particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resizeCanvas() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    const brandColors = ['1,49,243', '0,174,102', '255,173,9'];
    for (let i = 0; i < count; i++) {
      particles.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        r:  Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        a:  Math.random() * 0.6 + 0.2,
        color: brandColors[Math.floor(Math.random() * brandColors.length)]
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.a})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
    animId = requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();

  const ro = new ResizeObserver(() => {
    resizeCanvas();
    createParticles();
  });
  ro.observe(canvas.parentElement);
}

/* ── SCROLL REVEAL ───────────────────────────────────────── */
function initRevealObserver() {
  const els = document.querySelectorAll('.reveal-up:not(.hero .reveal-up)');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.delay || 0) * 1000;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => obs.observe(el));
}

/* ── SAS STAT COUNTER ANIMATION ─────────────────────────── */
function initSASCounter() {
  const statEls = document.querySelectorAll('.sas-stat-value[data-target]');
  if (!statEls.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const count = Math.floor(eased * target);
          el.textContent = progress >= 1 ? count + '+' : count;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => obs.observe(el));
}

/* ── BLUR TEXT REVEAL ────────────────────────────────────── */
function initBlurReveal() {
  const section = document.querySelector('.about-blur-section');
  const words   = document.querySelectorAll('.blur-word');
  if (!section || !words.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        words.forEach((w, i) => {
          setTimeout(() => w.classList.add('revealed'), i * 120);
        });
        obs.unobserve(section);
      }
    });
  }, { threshold: 0.35 });

  obs.observe(section);
}

/* ── PROGRAM ROW — HOVER IMAGE FOLLOW CURSOR ─────────────── */
document.querySelectorAll('.program-row').forEach(row => {
  const img = row.querySelector('.program-hover-img');
  if (!img) return;

  row.addEventListener('mousemove', (e) => {
    const x = e.clientX + 24;
    const y = e.clientY - img.offsetHeight / 2;
    img.style.left = x + 'px';
    img.style.top  = y + 'px';
  });
});

/* ── COUNTER ANIMATION ───────────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isFloat = String(target).includes('.');
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = easeOut(progress) * target;
    el.textContent = isFloat
      ? value.toFixed(1)
      : Math.floor(value).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(update);
}

const statsObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const count = parseInt(el.dataset.count, 10);
      animateCounter(el, count);
      statsObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-count]').forEach(el => {
  statsObs.observe(el);
});

/* ── STORIES CAROUSEL ────────────────────────────────────── */
const cards = document.querySelectorAll('.story-card');
const dots  = document.querySelectorAll('.dot');
let currentStory = 0;

function showStory(index) {
  cards.forEach(c => c.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  currentStory = (index + cards.length) % cards.length;
  cards[currentStory] && cards[currentStory].classList.add('active');
  dots[currentStory]  && dots[currentStory].classList.add('active');
}

document.getElementById('story-prev') &&
  document.getElementById('story-prev').addEventListener('click', () => showStory(currentStory - 1));
document.getElementById('story-next') &&
  document.getElementById('story-next').addEventListener('click', () => showStory(currentStory + 1));

dots.forEach(dot => {
  dot.addEventListener('click', () => showStory(parseInt(dot.dataset.dot, 10)));
});

/* Auto-advance stories */
setInterval(() => showStory(currentStory + 1), 6000);

/* ── DONATE AMOUNT CHIPS ─────────────────────────────────── */
document.querySelectorAll('.amount-chip').forEach(chip => {
  chip.addEventListener('click', function () {
    document.querySelectorAll('.amount-chip').forEach(c => c.classList.remove('selected'));
    this.classList.add('selected');
  });
});

/* ── CONTACT FORM ────────────────────────────────────────── */
const form    = document.getElementById('contact-form');
const success = document.getElementById('form-success');

form && form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.getElementById('form-submit');
  if (btn) {
    btn.querySelector('span').textContent = 'Sending...';
    btn.disabled = true;
  }
  setTimeout(() => {
    form.reset();
    if (success) success.classList.add('show');
    if (btn) {
      btn.querySelector('span').textContent = 'Send Message';
      btn.disabled = false;
    }
    setTimeout(() => success && success.classList.remove('show'), 5000);
  }, 1500);
});

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── PARALLAX HERO MAP ─────────────────────────────────── */
const heroMapWrapper = document.getElementById('hero-map-wrapper');
if (heroMapWrapper) {
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;
  let scrollYOffset = 0;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    mouseX = (e.clientX - cx) / cx * 18;
    mouseY = (e.clientY - cy) / cy * 14;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      scrollYOffset = window.scrollY * 0.2;
    }
  }, { passive: true });

  function animateHeroMap() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;
    heroMapWrapper.style.transform = `translate3d(${currentX}px, ${currentY + scrollYOffset}px, 0) scale(1.05)`;
    requestAnimationFrame(animateHeroMap);
  }
  animateHeroMap();
}

/* ============================================================
   WEBINARS & MASTERCLASSES INTERACTIVE FUNCTIONALITY
   ============================================================ */

const webinarData = {
  'reinvent-future': {
    youtubeId: 'edQm-xG6qok',
    title: 'TECHRISE DTI WEBINAR: Reinventing Yourself for a Digital Future: A Beginner Perspective',
    category: 'Career Transition',
    duration: 'YouTube Full Webinar',
    speaker: 'TechRise DTI',
    role: 'Webinar Series & Mentorship',
    avatar: 'img/Techrise icon logo.png',
    poster: 'img/thumb_reinvent_future.jpg',
    description: 'A transformative webinar exploring how beginners from any background can pivot into the digital economy, develop in-demand tech skills, and position themselves for high-growth global opportunities.',
    resource: 'TechRise Digital Career Starter Guide'
  },
  'tech-path': {
    youtubeId: 'sX_nxPTKjxw',
    title: 'HOW TO IDENTIFY YOUR TECH PATH: FROM CURIOSITY TO CAREER',
    category: 'Career Guidance',
    duration: 'YouTube Full Masterclass',
    speaker: 'TechRise DTI',
    role: 'Tech Career Mentors',
    avatar: 'img/Techrise icon logo.png',
    poster: 'img/thumb_tech_path.jpg',
    description: 'Learn how to navigate the vast tech ecosystem, discover whether Software Engineering, Product Design, Data, or Cloud fits your natural strengths, and build a structured roadmap from initial curiosity to your first tech job.',
    resource: 'Tech Career Roadmap Checklist'
  },
  'uiux-masterclass': {
    youtubeId: 'dIOBxXVQ1Tw',
    title: 'UI/UX DESIGN MASTERCLASS',
    category: 'Product Design',
    duration: 'YouTube Masterclass',
    speaker: 'TechRise DTI',
    role: 'Design Academy Mentors',
    avatar: 'img/Techrise icon logo.png',
    poster: 'img/thumb_uiux_masterclass.jpg',
    description: 'An in-depth masterclass breaking down the core principles of User Interface (UI) and User Experience (UX) design, wireframing, Figma workflows, user research, and creating high-converting digital products.',
    resource: 'UI/UX Design Starter Kit & Wireframe Templates'
  },
  'design-code-create': {
    youtubeId: 'ONCXKWmWNho',
    title: 'DESIGN. CODE. CREATE.: A BEGINNER\'S GUIDE TO TECH SUCCESS.',
    category: 'Tech Fundamentals',
    duration: 'YouTube Webinar',
    speaker: 'TechRise DTI',
    role: 'Skills Development Lead',
    avatar: 'img/Techrise icon logo.png',
    poster: 'img/thumb_design_code_create.jpg',
    description: 'Bridging the gap between visual design and software coding. Discover the essential tools, workflows, and mindset required to turn creative ideas into functional digital applications.',
    resource: 'Design to Code Workflow Guide'
  },
  'break-into-tech': {
    youtubeId: 'ARrZbt5qQsc',
    title: 'BREAKING INTO TECH WITHOUT A COMPUTER SCIENCE DEGREE.',
    category: 'Career Strategy',
    duration: 'YouTube Masterclass',
    speaker: 'TechRise DTI',
    role: 'Career Mentorship Series',
    avatar: 'img/Techrise icon logo.png',
    poster: 'img/thumb_break_into_tech.jpg',
    description: 'Practical, unfiltered advice on entering tech with non-traditional backgrounds. Learn how to showcase proof of work, leverage online certifications, and stand out to recruiters globally.',
    resource: 'Non-CS Resume & Proof of Work Guide'
  },
  'masterclass-jan': {
    youtubeId: 'R4AZbvnuj9Y',
    title: 'Tech for Non-Tech Founders: Building & Using Technology Confidently',
    category: 'Special Masterclass',
    duration: 'YouTube Masterclass',
    speaker: 'TechRise DTI',
    role: 'Masterclass Series',
    avatar: 'img/Techrise icon logo.png',
    poster: 'img/thumb_masterclass_jan.jpg',
    description: 'An essential session for non-technical founders, entrepreneurs, and business owners looking to understand, leverage, and use technology confidently to build and grow their ventures.',
    resource: 'Future Skills Masterclass Slide Deck'
  },
  'livestream-qa': {
    youtubeId: '9Hrw22e5gS4',
    title: 'Building Scalable Tech Companies from Africa: Lessons on Talent, Capital & Global Impact',
    category: 'Community Live',
    duration: 'YouTube Live Stream',
    speaker: 'TechRise DTI',
    role: 'Community Leadership',
    avatar: 'img/Techrise icon logo.png',
    poster: 'img/thumb_livestream_qa.jpg',
    description: 'Deep-dive conversation on what it takes to scale a tech company from Africa — covering talent acquisition, raising capital, accessing global markets, and leaving a lasting impact.',
    resource: 'TechRise Community Resource Directory'
  }
};

/* ── WEBINAR SEARCH & FILTERING ──────────────────────────── */
const searchInput = document.getElementById('webinar-search');
const searchClearBtn = document.getElementById('search-clear');
const filterTabs = document.querySelectorAll('.filter-tab');
const webinarCards = document.querySelectorAll('.webinar-card');
const noResultsState = document.getElementById('no-results-state');
const videoCountBadge = document.getElementById('video-count-badge');
const resetFiltersBtn = document.getElementById('reset-filters-btn');

let activeCategory = 'all';
let searchQuery = '';

function filterWebinars() {
  if (!webinarCards.length) return;
  let visibleCount = 0;

  webinarCards.forEach(card => {
    const cardCat = card.dataset.category || '';
    const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
    const summary = (card.querySelector('.card-summary')?.textContent || '').toLowerCase();
    const speaker = (card.querySelector('.card-speaker-text')?.textContent || '').toLowerCase();

    const matchesCategory = (activeCategory === 'all' || cardCat === activeCategory);
    const matchesSearch = !searchQuery || title.includes(searchQuery) || summary.includes(searchQuery) || speaker.includes(searchQuery);

    if (matchesCategory && matchesSearch) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  if (videoCountBadge) {
    videoCountBadge.textContent = `Showing ${visibleCount} Masterclass${visibleCount === 1 ? '' : 'es'}`;
  }

  if (noResultsState) {
    noResultsState.style.display = visibleCount === 0 ? 'block' : 'none';
  }
}

if (filterTabs.length) {
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.category || 'all';
      filterWebinars();
    });
  });
}

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    if (searchClearBtn) {
      searchClearBtn.style.display = searchQuery ? 'block' : 'none';
    }
    filterWebinars();
  });

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      searchClearBtn.style.display = 'none';
      filterWebinars();
    });
  }
}

if (resetFiltersBtn) {
  resetFiltersBtn.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    searchQuery = '';
    activeCategory = 'all';
    filterTabs.forEach(t => t.classList.toggle('active', t.dataset.category === 'all'));
    if (searchClearBtn) searchClearBtn.style.display = 'none';
    filterWebinars();
  });
}

/* ── VIDEO MODAL YOUTUBE PLAYER ──────────────────────────── */
const videoModal = document.getElementById('video-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalYoutubeIframe = document.getElementById('modal-youtube-iframe');
const modalYoutubeLink = document.getElementById('modal-youtube-link');
const modalCatTag = document.getElementById('modal-cat-tag');
const modalTitle = document.getElementById('modal-title');
const modalSpeakerName = document.getElementById('modal-speaker-name');
const modalDuration = document.getElementById('modal-duration');
const modalDesc = document.getElementById('modal-description');
const modalSpeakerAvatar = document.getElementById('modal-speaker-avatar');
const modalSpeakerNameTab = document.getElementById('modal-speaker-name-tab');
const modalSpeakerRole = document.getElementById('modal-speaker-role');

let currentVideoKey = 'tech-path';

function openVideoModal(videoKey) {
  const data = webinarData[videoKey] || webinarData['tech-path'];
  currentVideoKey = videoKey;

  if (modalYoutubeIframe) {
    modalYoutubeIframe.src = `https://www.youtube.com/embed/${data.youtubeId}?autoplay=1&rel=0&modestbranding=1`;
  }
  if (modalYoutubeLink) {
    modalYoutubeLink.href = `https://www.youtube.com/watch?v=${data.youtubeId}`;
  }
  if (modalCatTag) modalCatTag.textContent = data.category;
  if (modalTitle) modalTitle.textContent = data.title;
  if (modalSpeakerName) modalSpeakerName.textContent = `By ${data.speaker}`;
  if (modalDuration) modalDuration.textContent = data.duration;
  if (modalDesc) modalDesc.textContent = data.description;
  if (modalSpeakerAvatar) modalSpeakerAvatar.src = data.avatar;
  if (modalSpeakerNameTab) modalSpeakerNameTab.textContent = data.speaker;
  if (modalSpeakerRole) modalSpeakerRole.textContent = data.role;

  // Reset tab to overview
  document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === 'overview'));
  document.querySelectorAll('.modal-tab-content').forEach(c => c.classList.toggle('active', c.id === 'tab-overview'));

  if (videoModal) {
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeVideoModal() {
  if (videoModal) {
    videoModal.classList.remove('active');
    document.body.style.overflow = '';
    if (modalYoutubeIframe) {
      modalYoutubeIframe.src = ''; // Stops audio and video playback immediately
    }
  }
}

document.querySelectorAll('.open-modal-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const key = btn.dataset.video || 'tech-path';
    openVideoModal(key);
  });
});

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeVideoModal);
}

if (videoModal) {
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideoModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
    closeVideoModal();
  }
});

/* Modal Tabs */
document.querySelectorAll('.modal-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.modal-tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(`tab-${btn.dataset.tab}`);
    if (target) target.classList.add('active');
  });
});

/* ── TOAST NOTIFICATIONS & RSVP / DOWNLOADS ──────────────── */
const toast = document.getElementById('toast');
const toastText = document.getElementById('toast-text');
let toastTimeout = null;

function showToast(message) {
  if (!toast) return;
  if (toastText) toastText.textContent = message;
  toast.classList.add('active');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('active');
  }, 4000);
}

document.querySelectorAll('.rsvp-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const session = btn.dataset.session || 'Live Webinar';
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Seat Reserved ✓';
    showToast(`✓ Free seat reserved for "${session}"! We'll send you an invitation.`);
    setTimeout(() => {
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Reserve Free Seat';
    }, 4000);
  });
});

/* ── SCHOLARSHIPS DIRECTORY & MODAL INTERACTIVITY ────────── */
const scholarData = {
  'alasa': {
    name: 'Alasa Great Asekomhe',
    role: 'Full-Stack Software Developer',
    location: 'Nigeria',
    badge: 'Cohort 1 Graduate',
    avatar: 'img/beneficiary_alasa.jpg',
    track: 'Full-Stack Software Engineering (In partnership with Dev & Design)',
    outcome: 'Software Engineer & Tech Builder ✓',
    quote: '"Before TechRise, I had the passion for technology but lacked a capable workstation and structured guidance. The scholarship provided me with a high-performance laptop, internet support, and 6 months of rigorous coding mentorship. Today, I engineer modern web platforms and scalable applications with confidence."',
    skills: ['JavaScript', 'React.js', 'Node.js', 'Python', 'PostgreSQL', 'Git & GitHub']
  },
  'binta': {
    name: 'Binta Ochalifu',
    role: 'UI/UX & Product Design Scholar',
    location: 'Abuja, Nigeria',
    badge: 'TechRise Scholar',
    avatar: 'img/beneficiary_binta.jpg',
    track: 'UI/UX Design & Digital Operations Track',
    outcome: 'UI/UX Designer ✓',
    quote: '"Being awarded the scholarship through TechRise DTI opened up doors I never thought possible. The practical training in modern design tools, tech workflows, and problem solving empowered me with the confidence to thrive in the modern digital workspace."',
    skills: ['Figma', 'UI/UX Design', 'Digital Productivity', 'Product Operations', 'Problem Solving']
  },
  'etieno': {
    name: 'Etieno Usenenang',
    role: 'UI/UX & Product Designer',
    location: 'Nigeria',
    badge: 'TechRise Scholar',
    avatar: 'img/beneficiary_etieno.jpg',
    track: 'Product Design & Design Systems (In partnership with Dev & Design)',
    outcome: 'Product Designer ✓',
    quote: '"Through the TechRise scholarship, I mastered user research, wireframing, component design systems, and Figma prototyping. TechRise provided the creative environment, workstation support, and hands-on portfolio feedback I needed to transition into professional product design."',
    skills: ['Figma', 'UI/UX Design', 'User Research', 'Design Systems', 'Interactive Prototyping']
  },
  'adesemoye': {
    name: 'Adesemoye Ilerioluwa',
    role: 'Software Engineering Scholar',
    location: 'Nigeria',
    badge: 'Cohort 1 Graduate',
    avatar: 'img/beneficiary_adesemoye.jpg',
    track: 'Software Engineering & API Architecture (In partnership with Dev & Design)',
    outcome: 'Software Engineer ✓',
    quote: '"The TechRise scholarship gave me the exact tools and accountability I needed to take software engineering seriously. The laptop grant eliminated my technical bottlenecks, while the mentorship helped me understand modern architectural patterns, backend APIs, and database engineering."',
    skills: ['JavaScript', 'React.js', 'Backend APIs', 'SQL Databases', 'TypeScript', 'Git']
  },
  'nurudeen': {
    name: 'Nurudeen',
    role: 'Data Analytics & AI Scholar',
    location: 'Nigeria',
    badge: 'Cohort 1 Graduate',
    avatar: 'img/beneficiary_nurudeen.jpg',
    track: 'Data Science & Applied AI (In partnership with Dev & Design)',
    outcome: 'Data Analyst & AI Consultant ✓',
    quote: '"TechRise DTI\'s scholarship opened up the world of data analytics, predictive modeling, and applied AI tools for me. I went from reading tutorials without a computer to building interactive business intelligence dashboards and processing real datasets for actionable business insight."',
    skills: ['Python', 'SQL', 'Power BI', 'Machine Learning', 'Data Visualization', 'AI Tools']
  },
  'okoi': {
    name: 'Okoi',
    role: 'Web Development & Community Scholar',
    location: 'Nigeria',
    badge: 'Fellowship Scholar',
    avatar: 'img/beneficiary_okoi.jpg',
    track: 'Front-End Web Development (In partnership with Dev & Design)',
    outcome: 'Web Developer & Community Lead ✓',
    quote: '"The hands-on training and peer community at TechRise helped me transition from zero tech background to building functional web solutions. The mentorship didn\'t just teach me coding; it showed me how technology can solve grassroots community challenges."',
    skills: ['HTML5/CSS3', 'JavaScript', 'Responsive Web Design', 'Community Tech', 'Digital Literacy']
  },
  'goldplate': {
    name: 'Frontdesk / Goldplate Fellow',
    role: 'Digital Operations & Tech Scholar',
    location: 'Nigeria',
    badge: 'Women in Tech Fellow',
    avatar: 'img/beneficiary_happiness.jpg',
    track: 'Digital Workplace Operations & Tech Transformation',
    outcome: 'Digital Operations Specialist ✓',
    quote: '"The TechRise scholarship gave me hands-on digital workplace tools and confidence. Learning modern digital tools, client operations software, and productivity workflows allowed me to excel and lead frontdesk digital transformations with poise."',
    skills: ['Digital Operations', 'Microsoft 365', 'Client Tech', 'Digital Productivity', 'Tech Strategy']
  },
  'happiness': {
    name: 'Happiness Emmanuel',
    role: 'Digital Operations & UI/UX Scholar',
    location: 'Nigeria',
    badge: 'Women in Tech Fellow',
    avatar: 'img/beneficiary_happiness.jpg',
    track: 'Digital Operations & UI Design (Women in Tech)',
    outcome: 'Digital Operations Specialist ✓',
    quote: '"The TechRise scholarship gave me hands-on digital workplace tools and confidence. Learning modern digital tools, client operations software, and productivity workflows allowed me to excel and lead frontdesk digital transformations with poise."',
    skills: ['Figma', 'UI Design', 'Digital Operations', 'Microsoft 365', 'Productivity']
  }
};

/* Scholar Filtering & Search */
const scholarCards = document.querySelectorAll('.scholar-card');
const scholarFilterTabs = document.querySelectorAll('.scholar-filter-tab');
const scholarSearchInput = document.getElementById('scholar-search-input');
const scholarSearchClear = document.getElementById('scholar-search-clear');
const scholarsCountBadge = document.getElementById('scholars-count-badge');
const scholarNoResults = document.getElementById('scholar-no-results');
const scholarResetBtn = document.getElementById('scholar-reset-btn');

let activeScholarCategory = 'all';
let scholarSearchQuery = '';

function filterScholars() {
  if (!scholarCards.length) return;
  let count = 0;

  scholarCards.forEach(card => {
    const cardCat = card.dataset.category || '';
    const name = (card.querySelector('.scholar-name')?.textContent || '').toLowerCase();
    const summary = (card.querySelector('.scholar-summary')?.textContent || '').toLowerCase();
    const title = (card.querySelector('.scholar-title-tag')?.textContent || '').toLowerCase();
    const loc = (card.querySelector('.scholar-location')?.textContent || '').toLowerCase();
    const tags = Array.from(card.querySelectorAll('.scholar-tags-row span')).map(s => s.textContent.toLowerCase()).join(' ');

    const combinedText = `${name} ${summary} ${title} ${loc} ${tags}`;

    const matchesCategory = (activeScholarCategory === 'all' || cardCat.includes(activeScholarCategory));
    const matchesSearch = !scholarSearchQuery || combinedText.includes(scholarSearchQuery);

    if (matchesCategory && matchesSearch) {
      card.style.display = 'flex';
      count++;
    } else {
      card.style.display = 'none';
    }
  });

  if (scholarsCountBadge) {
    scholarsCountBadge.textContent = `Showing ${count} Beneficiar${count === 1 ? 'y' : 'ies'}`;
  }

  if (scholarNoResults) {
    scholarNoResults.style.display = count === 0 ? 'block' : 'none';
  }
}

scholarFilterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    scholarFilterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeScholarCategory = tab.dataset.category || 'all';
    filterScholars();
  });
});

if (scholarSearchInput) {
  scholarSearchInput.addEventListener('input', (e) => {
    scholarSearchQuery = e.target.value.trim().toLowerCase();
    if (scholarSearchClear) {
      scholarSearchClear.style.display = scholarSearchQuery ? 'block' : 'none';
    }
    filterScholars();
  });
}

if (scholarSearchClear) {
  scholarSearchClear.addEventListener('click', () => {
    if (scholarSearchInput) {
      scholarSearchInput.value = '';
      scholarSearchQuery = '';
      scholarSearchClear.style.display = 'none';
      filterScholars();
    }
  });
}

if (scholarResetBtn) {
  scholarResetBtn.addEventListener('click', () => {
    activeScholarCategory = 'all';
    scholarSearchQuery = '';
    if (scholarSearchInput) scholarSearchInput.value = '';
    if (scholarSearchClear) scholarSearchClear.style.display = 'none';
    scholarFilterTabs.forEach(t => t.classList.remove('active'));
    if (scholarFilterTabs[0]) scholarFilterTabs[0].classList.add('active');
    filterScholars();
  });
}

/* Scholar Modal Detail View */
const scholarModalBackdrop = document.getElementById('scholar-modal-backdrop');
const scholarModalClose = document.getElementById('scholar-modal-close');

function openScholarModal(scholarKey) {
  const data = scholarData[scholarKey];
  if (!data || !scholarModalBackdrop) return;

  const avatar = document.getElementById('modal-scholar-avatar');
  const name = document.getElementById('modal-scholar-name');
  const role = document.getElementById('modal-scholar-role');
  const loc = document.getElementById('modal-scholar-location');
  const badge = document.getElementById('modal-scholar-badge');
  const quote = document.getElementById('modal-scholar-quote');
  const track = document.getElementById('modal-scholar-track');
  const outcome = document.getElementById('modal-scholar-outcome');
  const skillsContainer = document.getElementById('modal-scholar-skills');

  if (avatar) avatar.src = data.avatar;
  if (name) name.textContent = data.name;
  if (role) role.textContent = data.role;
  if (loc) loc.textContent = data.location;
  if (badge) badge.textContent = data.badge;
  if (quote) quote.textContent = data.quote;
  if (track) track.textContent = data.track;
  if (outcome) outcome.textContent = data.outcome;

  if (skillsContainer && data.skills) {
    skillsContainer.innerHTML = data.skills.map(s => `<span>${s}</span>`).join('');
  }

  scholarModalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeScholarModal() {
  if (!scholarModalBackdrop) return;
  scholarModalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.open-scholar-modal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const key = btn.dataset.scholar;
    if (key) openScholarModal(key);
  });
});

if (scholarModalClose) {
  scholarModalClose.addEventListener('click', closeScholarModal);
}

if (scholarModalBackdrop) {
  scholarModalBackdrop.addEventListener('click', (e) => {
    if (e.target === scholarModalBackdrop) closeScholarModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && scholarModalBackdrop && scholarModalBackdrop.classList.contains('open')) {
    closeScholarModal();
  }
});

