// Header Component
class Header {
    constructor() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        const headerHTML = `
            <header>
                <div class="header-content">
                    <a href="#" class="logo">
                        <span>💤</span> Sleep Calculator
                    </a>
                    <nav>
                        <ul id="nav-menu">
                            <li><a href="#hero">Home</a></li>
                            <li><a href="#sleep-cycles">Sleep Cycles</a></li>
                            <li><a href="#how-it-works">How It Works</a></li>
                            <li><a href="#rem-sleep">REM Sleep</a></li>
                            <li><a href="#benefits">Benefits</a></li>
                            <li><a href="#sleep-tips">Tips</a></li>
                            <li><a href="#faq">FAQ</a></li>
                        </ul>
                    </nav>
                    <button class="mobile-toggle" id="mobile-toggle">
                        <span>☰</span>
                    </button>
                </div>
            </header>
        `;

        const headerContainer = document.getElementById('header-container');
        headerContainer.innerHTML = headerHTML;
    }

    attachEventListeners() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                // Update toggle icon
                mobileToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
            });
        }

        // Close menu when a link is clicked
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.textContent = '☰';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('header')) {
                navMenu.classList.remove('active');
                mobileToggle.textContent = '☰';
            }
        });
    }
}

// Initialize header when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Header();
});
