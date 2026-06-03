// ============================================================
// FOOTER.JS - Dynamic Footer Component
// ============================================================

(function() {
  // Get current year for copyright
  const currentYear = new Date().getFullYear();
  
  // Create footer HTML structure
  const footerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-logo">
              <div class="footer-logo-icon">🌙</div>
              <span class="footer-logo-text">Sleep Calculator</span>
            </div>
            <p class="footer-desc">
              The science-based sleep calculator that helps you wake up refreshed 
              by aligning your alarm with natural 90-minute sleep cycles.
            </p>
          </div>
          
          <div class="footer-col">
            <h4>Tools</h4>
            <ul class="footer-links">
              <li><a href="/#calculator">Sleep Cycle Calculator</a></li>
              <li><a href="/#calculator">Bedtime Calculator</a></li>
              <li><a href="/#schedule">Schedule Planner</a></li>
              <li><a href="/#sleep-debt">Sleep Debt Tracker</a></li>
              <li><a href="/#rem-sleep">REM Sleep Guide</a></li>
            </ul>
          </div>
          
          <div class="footer-col">
            <h4>Learn</h4>
            <ul class="footer-links">
              <li><a href="/#how-it-works">Sleep Cycles</a></li>
              <li><a href="/#tips">Sleep Hygiene</a></li>
              <li><a href="/#faq">FAQ</a></li>
              <li><a href="/#about-sleep-calculator">About Sleep Science</a></li>
            </ul>
          </div>
          
          <div class="footer-col">
            <h4>Resources</h4>
            <ul class="footer-links">              
              <li><a href="about">About</a></li>
              <li><a href="contact">Contact</a></li>
              <li><a href="privacy">Privacy Policy</a></li>
              <li><a href="terms">Terms of Use</a></li>
              <li><a href="cookies">Cookies Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="footer-copyright">
            © ${currentYear} Sleep Calculator — Smart Sleep for Everyone
          </div>
          <div class="footer-disclaimer">
            ⚕️ Medical Disclaimer: This tool provides educational information only. 
            Consult a healthcare professional for sleep disorders or medical concerns.
          </div>
        </div>
      </div>
    </footer>
  `;
  
  // Insert footer into the DOM
  const footerRoot = document.getElementById('footer-root');
  if (footerRoot) {
    footerRoot.innerHTML = footerHTML;
  }
  
  // Add smooth scroll to footer links
  function initFooterSmoothScroll() {
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        link.addEventListener('click', function(e) {
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
          }
        });
      }
    });
  }
  
  // Add CSS for active nav link highlighting
  function addActiveLinkStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .nav-links a.active, .mobile-nav a.active {
        color: var(--primary) !important;
      }
      .nav-links a.active::after {
        width: 100% !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Run after footer is inserted
  setTimeout(() => {
    initFooterSmoothScroll();
    addActiveLinkStyles();
  }, 100);
})();
