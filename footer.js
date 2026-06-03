// Footer Component
class Footer {
    constructor() {
        this.render();
    }

    render() {
        const currentYear = new Date().getFullYear();
        const footerHTML = `
            <footer>
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-section">
                            <h3>About Sleep Calculator</h3>
                            <p>Sleep Calculator is your ultimate tool for optimizing your sleep schedule using scientifically-backed sleep cycle principles. Get the best sleep of your life.</p>
                            <p><strong>Science-Backed Sleep Solutions</strong></p>
                        </div>
                        <div class="footer-section">
                            <h3>Sleep Calculator Tools</h3>
                            <ul>
                                <li><a href="#hero">Sleep Schedule Calculator</a></li>
                                <li><a href="#hero">REM Sleep Calculator</a></li>
                                <li><a href="#hero">Bedtime Calculator</a></li>
                                <li><a href="#hero">Wake Time Calculator</a></li>
                                <li><a href="#hero">Sleep Cycle Calculator</a></li>
                            </ul>
                        </div>
                        <div class="footer-section">
                            <h3>Learn More</h3>
                            <ul>
                                <li><a href="#sleep-cycles">Understanding Sleep Cycles</a></li>
                                <li><a href="#rem-sleep">REM Sleep Guide</a></li>
                                <li><a href="#sleep-tips">Sleep Improvement Tips</a></li>
                                <li><a href="#how-it-works">How Calculator Works</a></li>
                                <li><a href="#faq">Frequently Asked Questions</a></li>
                            </ul>
                        </div>
                        <div class="footer-section">
                            <h3>Sleep Resources</h3>
                            <ul>
                                <li><a href="#" onclick="return false">Sleep Science Research</a></li>
                                <li><a href="#" onclick="return false">Health Benefits Guide</a></li>
                                <li><a href="#" onclick="return false">Sleep Hygiene Tips</a></li>
                                <li><a href="#" onclick="return false">Bedtime Routine Guide</a></li>
                                <li><a href="#" onclick="return false">Contact Support</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer-divider">
                        <div class="footer-bottom">
                            <p>&copy; ${currentYear} Sleep Calculator. All rights reserved. | 
                            <a href="#" onclick="return false">Privacy Policy</a> | 
                            <a href="#" onclick="return false">Terms of Service</a> | 
                            <a href="#" onclick="return false">Disclaimer</a></p>
                        </div>
                        <div class="footer-bottom">
                            <p>Built with 💜 for better sleep | 
                            <strong>Sleep Calculator App</strong> - Calculate your perfect sleep schedule</p>
                        </div>
                    </div>
                </div>
            </footer>
        `;

        const footerContainer = document.getElementById('footer-container');
        footerContainer.innerHTML = footerHTML;
    }
}

// Initialize footer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Footer();
});
