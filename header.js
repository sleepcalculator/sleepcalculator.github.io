// ============================================================
// HEADER.JS - Dynamic Header Component
// ============================================================

(function() {
  // Create header HTML structure
  const headerHTML = `
    <header class="site-header">
      <div class="container header-inner">
        <a href="#" class="logo">
          <div class="logo-icon">🌙</div>
          <span>SleepCycle<span style="color: var(--primary);">.calc</span></span>
        </a>
        
        <nav class="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#calculator">Calculator</a></li>
          <li><a href="#how-it-works">Science</a></li>
          <li><a href="#schedule">Planner</a></li>
          <li><a href="#tips">Tips</a></li>
          <li><a href="#faq">FAQ</a></li>
        </nav>
        
        <div class="header-cta">
          <a href="#calculator" class="btn btn-primary" style="padding: 10px 20px;">Try Now</a>
          <button class="menu-btn" aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      
      <div class="mobile-nav">
        <a href="#home">Home</a>
        <a href="#calculator">Calculator</a>
        <a href="#how-it-works">Science</a>
        <a href="#schedule">Planner</a>
        <a href="#tips">Tips</a>
        <a href="#faq">FAQ</a>
        <a href="#calculator" style="color: var(--primary); font-weight: 600;">Try Now →</a>
      </div>
    </header>
  `;
  
  // Insert header into the DOM
  const headerRoot = document.getElementById('header-root');
  if (headerRoot) {
    headerRoot.innerHTML = headerHTML;
  }
  
  // Handle active nav link highlighting based on scroll position
  function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
    
    if (sections.length === 0) return;
    
    let current = '';
    const scrollPos = window.scrollY + 120; // Offset for header
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        current = section.getAttribute('id');
      }
    });
    
    // If at very top, highlight home
    if (window.scrollY < 100) {
      current = 'home';
    }
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
  
  // Smooth scroll for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('.nav-links a, .mobile-nav a, .logo, .header-cta .btn').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
            const targetPosition = targetElement.offsetTop - headerHeight;
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
            // Close mobile menu if open
            const mobileNav = document.querySelector('.mobile-nav');
            if (mobileNav && mobileNav.classList.contains('open')) {
              mobileNav.classList.remove('open');
            }
          }
        }
      });
    });
  }
  
  // Run after header is inserted
  setTimeout(() => {
    setActiveNavLink();
    initSmoothScroll();
    window.addEventListener('scroll', setActiveNavLink);
  }, 100);
})();
