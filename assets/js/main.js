/**
 * ANNABOOK OFFICIAL - MAIN JAVASCRIPT
 * Handles Slider, Sidebar Navigation, WhatsApp/Telegram Interactions,
 * Blog Filtering & Full Article Modals, and Accordions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Home Page Hero 5-Banner Image Slider (Exclusively on Home Page)
  // Auto-rotates every 5000ms (5 seconds) continuously in an infinite loop
  // --------------------------------------------------------------------------
  const slider = document.querySelector('.hero-slider-section');
  const sidebarItems = document.querySelectorAll('.sidebar-scroll-area .sidebar-item');

  if (slider) {
    const slides = slider.querySelectorAll('.slider-slide');
    const dots = slider.querySelectorAll('.slider-dot');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    let currentSlideIndex = 0;
    let slideInterval = null;
    const intervalTime = 5000; // Exactly 5 seconds per banner

    function updateSliderView() {
      slides.forEach((slide, idx) => {
        if (idx === currentSlideIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      dots.forEach((dot, idx) => {
        if (idx === currentSlideIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function goToSlide(index) {
      if (!slides.length) return;
      currentSlideIndex = (index + slides.length) % slides.length;
      updateSliderView();
    }

    function nextSlide() {
      goToSlide(currentSlideIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentSlideIndex - 1);
    }

    function startAutoSlide() {
      stopAutoSlide();
      slideInterval = setInterval(nextSlide, intervalTime);
    }

    function stopAutoSlide() {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    }

    // Sidebar Category Click Listeners
    sidebarItems.forEach(item => {
      item.addEventListener('click', (e) => {
        // Highlight active sidebar item
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Optional mapping from category to relevant banner slide
        const cat = item.getAttribute('data-category');
        if (cat === 'cricket') goToSlide(0);
        else if (cat === 'football') goToSlide(1);
        else if (cat === 'casino' || cat === 'live-casino') goToSlide(2);
        else if (cat === 'kabaddi') goToSlide(3);
        else if (cat === 'basketball') goToSlide(4);

        startAutoSlide();
      });
    });

    // Arrow Controls
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        startAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        startAutoSlide();
      });
    }

    // Pagination Dots (5 dots)
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        startAutoSlide();
      });
    });

    // Pause on Hover
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
        startAutoSlide();
      }
      if (e.key === 'ArrowLeft') {
        prevSlide();
        startAutoSlide();
      }
    });

    // Touch Swipe Gestures for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 45) {
        nextSlide();
        startAutoSlide();
      } else if (touchEndX - touchStartX > 45) {
        prevSlide();
        startAutoSlide();
      }
    }, { passive: true });

    // Initial setup
    updateSliderView();
    startAutoSlide();
  }

  // --------------------------------------------------------------------------
  // 2. WhatsApp & Telegram Interactions
  // Official WhatsApp: +91 9549376324 | Telegram: @Anna_Book_Official
  // Pre-filled Message: "hello AnnaBook, i want to get my betting ID now"
  // --------------------------------------------------------------------------
  const TELEGRAM_URL = 'https://t.me/Anna_Book_Official';
  const WA_DEFAULT_MSG = 'hello AnnaBook, i want to get my betting ID now';
  const WHATSAPP_URL = 'https://wa.me/919549376324?text=' + encodeURIComponent(WA_DEFAULT_MSG);

  function openWhatsApp(msg) {
    const text = msg || WA_DEFAULT_MSG;
    const url = 'https://wa.me/919549376324?text=' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const whatsappButtons = document.querySelectorAll('.trigger-whatsapp, .whatsapp-pill, a[href*="wa.me"]');

  whatsappButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      // Open with pre-filled message
      if (!href || href === '#' || href.indexOf('wa.me') !== -1) {
        e.preventDefault();
        openWhatsApp(WA_DEFAULT_MSG);
      }
    });
  });

  // Modal handlers
  const waModal = document.getElementById('whatsappNoticeModal');
  const modalCloseBtns = document.querySelectorAll('.modal-close-trigger');

  function openWhatsAppNoticeModal(msg) {
    openWhatsApp(msg || WA_DEFAULT_MSG);
  }

  window.openWhatsApp = openWhatsApp;
  window.openWhatsAppNoticeModal = openWhatsAppNoticeModal;

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach((m) => {
      m.classList.remove('open');
    });
    document.body.style.overflow = '';
  }

  modalCloseBtns.forEach((btn) => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeAllModals();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // --------------------------------------------------------------------------
  // 3. Global Login Modal Handlers
  // --------------------------------------------------------------------------
  window.openLoginModal = function() {
    const modal = document.getElementById('loginModal');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const input = modal.querySelector('input');
        if (input) input.focus();
      }, 100);
    } else {
      showToast('Please connect with your account manager on Telegram @Anna_Book_Official to access the exchange.');
    }
  };

  window.handleLoginSubmit = function(e) {
    if (e) e.preventDefault();
    alert('Login demonstration: Please connect with your account manager on Telegram @Anna_Book_Official to access the live exchange server.');
    closeAllModals();
  };

  // --------------------------------------------------------------------------
  // 4. Header Scroll Effect & Mobile Nav Menu
  // --------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      document.body.classList.toggle('nav-open', isOpen);
      const icon = mobileNavToggle.querySelector('i');
      if (icon) {
        if (isOpen) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close mobile nav when clicking any nav link
    navMenu.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        document.body.classList.remove('nav-open');
        const icon = mobileNavToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Blog Filtering & Full Article Modal Reader
  // --------------------------------------------------------------------------
  const blogTabBtns = document.querySelectorAll('.blog-tab-btn');
  const blogCards = document.querySelectorAll('.blog-card');

  blogTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      blogTabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      blogCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || filter === cat) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Blog Article Data for Modal Reader
  const blogArticlesData = {
    'cricket-guide': {
      title: 'Top Strategies for Cricket Match Analysis & Exchange Trading 2026',
      category: 'Cricket Guide',
      date: 'Nov 14, 2026',
      author: 'AnnaBook Senior Analyst',
      readTime: '4 Min Read',
      image: 'assets/images/blog-cricket.webp',
      content: `
        <p>Cricket exchange betting is distinct from traditional bookmaking. In an exchange, you have the flexibility to <strong>Back</strong> (bet for an outcome) and <strong>Lay</strong> (bet against an outcome), unlocking powerful cashout and risk hedging opportunities.</p>
        <h4 style="color:#f5a623; margin:16px 0 8px;">1. Pitch & Dew Factor Analysis</h4>
        <p>In subcontinental conditions (IPL & Bilateral T20s), dew often turns second innings into batting paradises. Look at toss decisions and ground historical chase success rates before placing high-volume bets.</p>
        <h4 style="color:#f5a623; margin:16px 0 8px;">2. Capital Preservation & Green Book Strategy</h4>
        <p>A smart exchange bettor always "greens" their book when odds swing in their favor. By locking profit across both teams, you eliminate variance and ensure steady earnings regardless of the final ball outcome.</p>
        <h4 style="color:#f5a623; margin:16px 0 8px;">3. Instant Verification on AnnaBook</h4>
        <p>Never play on unverified, delayed feeds. AnnaBook IDs provide official 0-second latency data feeds and guaranteed 2-minute instant cashout to your verified UPI/bank account.</p>
      `
    },
    'ipl-2026': {
      title: 'IPL 2026 Season Mega Preview & Team Predictions',
      category: 'IPL Specials',
      date: 'Nov 12, 2026',
      author: 'Sports Desk',
      readTime: '5 Min Read',
      image: 'assets/images/blog-ipl.webp',
      content: `
        <p>The 2026 Indian Premier League is poised to be the most competitive season in cricket history. With revamped mega auctions and high-octane overseas signings, each franchise presents unique market opportunities.</p>
        <h4 style="color:#f5a623; margin:16px 0 8px;">Key Teams to Watch</h4>
        <p>Top contenders like Mumbai, Chennai, and Kolkata have fortified their death-over bowling and power-hitting lower orders. Session bets (6-over powerplay runs, 20-over team totals) will offer premier value.</p>
        <h4 style="color:#f5a623; margin:16px 0 8px;">How to Maximize Your IPL Profits on AnnaBook</h4>
        <p>AnnaBook offers the highest market limits and lowest commissions in India. Get your IPL VIP Master ID today via our official Telegram channel with a 10% instant welcome bonus.</p>
      `
    },
    'football-tips': {
      title: 'UEFA Champions League: In-Play In-Depth Analysis & Cashout Mastery',
      category: 'Football',
      date: 'Nov 09, 2026',
      author: 'Global Football Trader',
      readTime: '6 Min Read',
      image: 'assets/images/blog-football.webp',
      content: `
        <p>Football betting in the Champions League demands deep statistical rigor: xG (Expected Goals), high press intensity, and squad rotation patterns during European midweeks.</p>
        <h4 style="color:#f5a623; margin:16px 0 8px;">In-Play Momentum Swings</h4>
        <p>The 60th to 80th-minute mark frequently experiences tactical substitutions that trigger goal spurts. Exchange markets allow you to enter when odds on Over 2.5 or Over 1.5 peak and cash out upon the next conversion.</p>
        <h4 style="color:#f5a623; margin:16px 0 8px;">AnnaBook Instant Cashout Feature</h4>
        <p>With our ultra-responsive mobile exchange platform, lock in your returns with a single tap before late injury-time reversals can harm your balance.</p>
      `
    },
    'security-guide': {
      title: 'Safe & Instant Withdrawals: Essential Security Practices for Online IDs',
      category: 'Security & Guide',
      date: 'Nov 05, 2026',
      author: 'Cyber & Fraud Unit',
      readTime: '3 Min Read',
      image: 'assets/images/blog-security.webp',
      content: `
        <p>Your security is AnnaBook's #1 commitment. In today's digital landscape, thousands of unauthorized clones attempt to impersonate legitimate exchange providers.</p>
        <h4 style="color:#f5a623; margin:16px 0 8px;">Crucial Safety Rules</h4>
        <ul>
          <li><strong>Official Telegram Only:</strong> Only communicate via <code style="color:#00d2ff;">https://t.me/Anna_Book_Official</code>. Never send funds to random personal UPI IDs or unverified WhatsApp numbers.</li>
          <li><strong>2-Factor Authentication:</strong> Always enable 2FA and never share your one-time passwords with anyone claiming to be support agents.</li>
          <li><strong>Direct Payout Verification:</strong> AnnaBook processes all withdrawals directly to your registered bank or UPI account in under 2 minutes with 0% hidden fee deductions.</li>
        </ul>
      `
    }
  };

  const articleModal = document.getElementById('blogArticleModal');
  const readMoreButtons = document.querySelectorAll('.trigger-blog-modal');

  readMoreButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const articleId = btn.getAttribute('data-article-id');
      const data = blogArticlesData[articleId];
      if (data && articleModal) {
        document.getElementById('modalBlogImage').src = data.image;
        document.getElementById('modalBlogCategory').textContent = data.category;
        document.getElementById('modalBlogTitle').textContent = data.title;
        document.getElementById('modalBlogMeta').innerHTML = `
          <span><i class="fa-regular fa-calendar" style="color:var(--gold-primary);"></i> ${data.date}</span>
          <span><i class="fa-regular fa-clock" style="color:var(--gold-primary);"></i> ${data.readTime}</span>
          <span><i class="fa-solid fa-user-pen" style="color:var(--gold-primary);"></i> ${data.author}</span>
        `;
        document.getElementById('modalBlogBody').innerHTML = data.content;
        articleModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. FAQ Accordion
  // --------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach((other) => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 7. Toast Notification Utility
  // --------------------------------------------------------------------------
  function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-info" style="color:var(--gold-primary);font-size:1.3rem;"></i> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // Expose for inline handlers if needed
  window.openWhatsAppNoticeModal = openWhatsAppNoticeModal;
  window.openLoginModal = openLoginModal;
  window.handleLoginSubmit = handleLoginSubmit;
  window.closeAllModals = closeAllModals;
  window.showToast = showToast;
});
