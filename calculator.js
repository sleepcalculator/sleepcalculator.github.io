// Sleep Cycle Calculator Logic
const SLEEP_CYCLE_LENGTH = 90; // minutes
const SLEEP_CYCLES_COUNT = [4, 5, 6, 7]; // number of cycles for recommendations

// Convert time string (HH:MM) to minutes since midnight
function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

// Convert minutes since midnight to time string (HH:MM)
function minutesToTime(minutes) {
    // Handle negative or very large numbers
    minutes = ((minutes % 1440) + 1440) % 1440;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// Calculate wake-up times based on bedtime
function calculateWakeUp() {
    const bedtimeInput = document.getElementById('bedtime').value;
    
    if (!bedtimeInput) {
        alert('Please select a bedtime');
        return;
    }

    const bedtimeMinutes = timeToMinutes(bedtimeInput);
    const resultsContainer = document.getElementById('results-container');
    const resultsGrid = document.getElementById('results');
    
    resultsGrid.innerHTML = '';
    
    // Calculate wake times for each cycle option
    SLEEP_CYCLES_COUNT.forEach(cycles => {
        const sleepDuration = cycles * SLEEP_CYCLE_LENGTH;
        const wakeTimeMinutes = bedtimeMinutes + sleepDuration;
        const wakeTime = minutesToTime(wakeTimeMinutes);
        const hours = cycles * 1.5; // 90 minutes = 1.5 hours
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div>
                <strong>Bedtime:</strong> ${bedtimeInput} → <strong>Wake Time:</strong> ${wakeTime}<br/>
                <small>${cycles} cycles (${hours} hours) - Feel refreshed with ${cycles} complete sleep cycles</small>
            </div>
        `;
        resultsGrid.appendChild(resultItem);
    });
    
    resultsContainer.classList.remove('results-hidden');
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Calculate bedtimes based on wake-up time
function calculateBedTime() {
    const wakeTimeInput = document.getElementById('wakeTime').value;
    
    if (!wakeTimeInput) {
        alert('Please select a wake time');
        return;
    }

    const wakeTimeMinutes = timeToMinutes(wakeTimeInput);
    const resultsContainer = document.getElementById('results-container');
    const resultsGrid = document.getElementById('results');
    
    resultsGrid.innerHTML = '';
    
    // Calculate bedtimes for each cycle option
    SLEEP_CYCLES_COUNT.forEach(cycles => {
        const sleepDuration = cycles * SLEEP_CYCLE_LENGTH;
        const bedtimeMinutes = wakeTimeMinutes - sleepDuration;
        const bedtime = minutesToTime(bedtimeMinutes);
        const hours = cycles * 1.5; // 90 minutes = 1.5 hours
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div>
                <strong>Bedtime:</strong> ${bedtime} → <strong>Wake Time:</strong> ${wakeTimeInput}<br/>
                <small>${cycles} cycles (${hours} hours) - Go to bed at ${bedtime} to wake refreshed</small>
            </div>
        `;
        resultsGrid.appendChild(resultItem);
    });
    
    resultsContainer.classList.remove('results-hidden');
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// FAQ Toggle Functionality
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const isOpen = answer.style.display !== 'none';
    
    // Close all other FAQs
    document.querySelectorAll('.faq-answer').forEach(item => {
        if (item !== answer) {
            item.style.display = 'none';
            item.previousElementSibling.classList.remove('active');
        }
    });
    
    // Toggle current FAQ
    if (isOpen) {
        answer.style.display = 'none';
        element.classList.remove('active');
    } else {
        answer.style.display = 'block';
        element.classList.add('active');
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add enter key support for form inputs
    const bedtimeInput = document.getElementById('bedtime');
    const wakeTimeInput = document.getElementById('wakeTime');
    
    if (bedtimeInput) {
        bedtimeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') calculateWakeUp();
        });
    }
    
    if (wakeTimeInput) {
        wakeTimeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') calculateBedTime();
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll event for header styling
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
});

// Add animation on scroll
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.step-card, .benefit-card, .tip-card, .cycle-card').forEach(el => {
        observer.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', observeElements);
