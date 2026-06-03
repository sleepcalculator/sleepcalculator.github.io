// ============================================================
// SLEEP CALCULATOR - FULL APPLICATION LOGIC
// ============================================================

// --- UTILITIES ---
function formatTime12(hour24, minute) {
  let h12 = hour24 % 12;
  if (h12 === 0) h12 = 12;
  const ampm = hour24 < 12 ? 'AM' : 'PM';
  return `${h12}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

function timeToMinutes(hour12, minute, ampm) {
  let hour24 = hour12 % 12;
  if (ampm === 'PM') hour24 += 12;
  return hour24 * 60 + minute;
}

function minutesToTime(minutes) {
  let hour24 = Math.floor(minutes / 60) % 24;
  let minute = minutes % 60;
  return formatTime12(hour24, minute);
}

function addMinutes(timeStr, mins) {
  // timeStr: "HH:MM AM/PM"
  let parts = timeStr.split(' ');
  let timeParts = parts[0].split(':');
  let h12 = parseInt(timeParts[0]);
  let m = parseInt(timeParts[1]);
  let ampm = parts[1];
  let totalMins = timeToMinutes(h12, m, ampm) + mins;
  return minutesToTime(totalMins);
}

function minutesToTimeObject(totalMins) {
  let hour24 = Math.floor(totalMins / 60) % 24;
  let minute = totalMins % 60;
  let h12 = hour24 % 12;
  if (h12 === 0) h12 = 12;
  let ampm = hour24 < 12 ? 'AM' : 'PM';
  return { hour: h12, minute: minute, ampm: ampm };
}

function parseTimeInput(hourEl, minuteEl, ampmContainer) {
  let hour = parseInt(hourEl.value);
  let minute = parseInt(minuteEl.value);
  let ampm = ampmContainer.querySelector('.ampm-btn.active').dataset.val;
  return { hour, minute, ampm };
}

// --- SLEEP CYCLE CALCULATIONS ---
const SLEEP_ONSET_MIN = 14; // average time to fall asleep
const CYCLE_MIN = 90;

function calculateBedtimes(wakeHour, wakeMin, wakeAmpm) {
  let wakeMins = timeToMinutes(wakeHour, wakeMin, wakeAmpm);
  let results = [];
  // 4 to 6 cycles back
  for (let cycles = 4; cycles <= 6; cycles++) {
    let totalCycleMins = cycles * CYCLE_MIN;
    let bedtimeMins = wakeMins - totalCycleMins - SLEEP_ONSET_MIN;
    let bedtimeMinsNormalized = (bedtimeMins + 1440) % 1440;
    let timeObj = minutesToTimeObject(bedtimeMinsNormalized);
    let sleepStartMins = (bedtimeMinsNormalized + SLEEP_ONSET_MIN) % 1440;
    let sleepEndMins = wakeMins;
    if (sleepEndMins < sleepStartMins) sleepEndMins += 1440;
    let sleepDuration = sleepEndMins - sleepStartMins;
    let hours = Math.floor(sleepDuration / 60);
    let mins = sleepDuration % 60;
    results.push({
      time: `${timeObj.hour}:${timeObj.minute.toString().padStart(2, '0')} ${timeObj.ampm}`,
      cycles: cycles,
      sleepHours: hours,
      sleepMins: mins,
      isIdeal: cycles === 5
    });
  }
  return results;
}

function calculateWakeTimes(sleepHour, sleepMin, sleepAmpm) {
  let sleepMins = timeToMinutes(sleepHour, sleepMin, sleepAmpm);
  let fallAsleepMins = (sleepMins + SLEEP_ONSET_MIN) % 1440;
  let results = [];
  for (let cycles = 4; cycles <= 6; cycles++) {
    let wakeMins = (fallAsleepMins + cycles * CYCLE_MIN) % 1440;
    let timeObj = minutesToTimeObject(wakeMins);
    let sleepDuration = cycles * CYCLE_MIN;
    let hours = Math.floor(sleepDuration / 60);
    let mins = sleepDuration % 60;
    results.push({
      time: `${timeObj.hour}:${timeObj.minute.toString().padStart(2, '0')} ${timeObj.ampm}`,
      cycles: cycles,
      sleepHours: hours,
      sleepMins: mins,
      isIdeal: cycles === 5
    });
  }
  return results;
}

function calculateNowWakeTimes() {
  let now = new Date();
  let currentHour = now.getHours();
  let currentMin = now.getMinutes();
  let fallAsleepMins = (currentHour * 60 + currentMin + SLEEP_ONSET_MIN) % 1440;
  let results = [];
  for (let cycles = 4; cycles <= 6; cycles++) {
    let wakeMins = (fallAsleepMins + cycles * CYCLE_MIN) % 1440;
    let timeObj = minutesToTimeObject(wakeMins);
    let sleepDuration = cycles * CYCLE_MIN;
    let hours = Math.floor(sleepDuration / 60);
    let mins = sleepDuration % 60;
    results.push({
      time: `${timeObj.hour}:${timeObj.minute.toString().padStart(2, '0')} ${timeObj.ampm}`,
      cycles: cycles,
      sleepHours: hours,
      sleepMins: mins,
      isIdeal: cycles === 5
    });
  }
  return results;
}

function calculateDuration(bedHour, bedMin, bedAmpm, wakeHour, wakeMin, wakeAmpm) {
  let bedMins = timeToMinutes(bedHour, bedMin, bedAmpm);
  let fallAsleepMins = (bedMins + SLEEP_ONSET_MIN) % 1440;
  let wakeMins = timeToMinutes(wakeHour, wakeMin, wakeAmpm);
  let durationMins = wakeMins - fallAsleepMins;
  if (durationMins < 0) durationMins += 1440;
  let cycles = durationMins / CYCLE_MIN;
  let hours = Math.floor(durationMins / 60);
  let mins = durationMins % 60;
  let isOptimal = Math.abs(cycles - Math.round(cycles)) < 0.1;
  return { durationMins, cycles: cycles.toFixed(1), hours, mins, isOptimal };
}

// --- RENDER RESULTS ---
function renderResults(results, title) {
  const resultsDiv = document.getElementById('calc-results');
  const titleSpan = document.getElementById('results-title');
  const gridDiv = document.getElementById('results-grid');
  
  titleSpan.textContent = title;
  gridDiv.innerHTML = '';
  
  results.forEach(res => {
    const chip = document.createElement('div');
    chip.className = 'result-chip';
    if (res.isIdeal) chip.classList.add('ideal');
    
    chip.innerHTML = `
      <div class="chip-time">${res.time}</div>
      <div class="chip-label">${res.cycles} cycles • ${res.sleepHours}h ${res.sleepMins}m</div>
      <div class="chip-rem">~${Math.round(res.cycles * 22.5)} min REM</div>
      ${res.isIdeal ? '<div class="chip-badge">★ Ideal</div>' : ''}
    `;
    gridDiv.appendChild(chip);
  });
  
  resultsDiv.style.display = 'block';
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// --- SCHEDULE PLANNER ---
function generateWeeklySchedule() {
  const ageGroup = document.getElementById('age-group').value;
  let targetHours = parseFloat(document.getElementById('target-hours').value);
  
  // Get weekday wake time
  const wdWake = parseTimeInput(
    document.getElementById('wd-wake-h'),
    document.getElementById('wd-wake-m'),
    document.getElementById('wd-ampm')
  );
  // Get weekend wake time
  const weWake = parseTimeInput(
    document.getElementById('we-wake-h'),
    document.getElementById('we-wake-m'),
    document.getElementById('we-ampm')
  );
  
  const wdWakeMins = timeToMinutes(wdWake.hour, wdWake.minute, wdWake.ampm);
  const weWakeMins = timeToMinutes(weWake.hour, weWake.minute, weWake.ampm);
  
  // Calculate bedtimes by subtracting sleep duration + onset
  const totalBedMins = targetHours * 60;
  const wdBedMins = (wdWakeMins - totalBedMins - SLEEP_ONSET_MIN + 1440) % 1440;
  const weBedMins = (weWakeMins - totalBedMins - SLEEP_ONSET_MIN + 1440) % 1440;
  
  const wdBed = minutesToTimeObject(wdBedMins);
  const weBed = minutesToTimeObject(weBedMins);
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const scheduleGrid = document.getElementById('schedule-grid');
  scheduleGrid.innerHTML = '';
  
  for (let i = 0; i < days.length; i++) {
    const isWeekend = i >= 5;
    const bed = isWeekend ? weBed : wdBed;
    const wake = isWeekend ? weWake : wdWake;
    const dayDiv = document.createElement('div');
    dayDiv.className = 'schedule-day';
    if (isWeekend) dayDiv.classList.add('weekend');
    dayDiv.innerHTML = `
      <div class="sched-day-name">${days[i]}</div>
      <div class="sched-icon">🌙</div>
      <div class="sched-sleep">${bed.hour}:${bed.minute.toString().padStart(2, '0')} ${bed.ampm}</div>
      <div class="sched-icon">☀️</div>
      <div class="sched-wake">${wake.hour}:${wake.minute.toString().padStart(2, '0')} ${wake.ampm}</div>
    `;
    scheduleGrid.appendChild(dayDiv);
  }
  
  const tipDiv = document.getElementById('schedule-tip');
  let tipMessage = '';
  if (ageGroup === 'teen') {
    tipMessage = `💡 Teen tip: Your brain needs 8-10 hours for development. Stick to the ${targetHours}-hour schedule as much as possible, and avoid social jetlag by keeping weekend sleep times within 1 hour of weekdays.`;
  } else if (ageGroup === 'senior') {
    tipMessage = `💡 Senior insight: With age, sleep becomes lighter. Consider adding a 20-30 min afternoon nap if you wake early, but prioritize the ${targetHours}-hour target for night sleep.`;
  } else {
    tipMessage = `💡 Consistency is key! Try to maintain the same bedtime and wake time even on weekends. Your ${targetHours}-hour schedule with ${targetHours/1.5} full cycles will optimize REM and deep sleep.`;
  }
  tipDiv.textContent = tipMessage;
  
  document.getElementById('schedule-output').style.display = 'block';
}

// --- SLEEP DEBT CALCULATOR ---
function initSleepDebtInputs() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const container = document.getElementById('debt-days');
  container.innerHTML = '';
  days.forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'debt-day';
    dayDiv.innerHTML = `
      <label>${day.slice(0,3)}</label>
      <input type="number" id="debt-${day.toLowerCase()}" class="debt-hours" value="7.5" step="0.5" min="0" max="16">
    `;
    container.appendChild(dayDiv);
  });
}

function calculateSleepDebt() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  let target = parseFloat(document.getElementById('debt-target').value);
  let totalActual = 0;
  let totalTarget = target * 7;
  
  days.forEach(day => {
    let val = parseFloat(document.getElementById(`debt-${day}`).value);
    if (isNaN(val)) val = 0;
    totalActual += val;
  });
  
  const debt = totalTarget - totalActual;
  const resultDiv = document.getElementById('debt-result');
  
  if (debt > 0) {
    resultDiv.className = 'debt-result in-debt';
    const recoveryDays = Math.ceil(debt / 0.5); // assuming 30 min extra per day max
    resultDiv.innerHTML = `
      <div class="debt-big negative">-${debt.toFixed(1)} hours</div>
      <div class="debt-sub">You're ${debt.toFixed(1)} hours behind your sleep target this week.</div>
      <div class="debt-advice">💤 To recover, aim for ${Math.min(9.5, target + 0.5)} hours for the next ${recoveryDays} days, or add weekend naps. Chronic sleep debt impairs immunity and focus.</div>
    `;
  } else {
    resultDiv.className = 'debt-result no-debt';
    const surplus = Math.abs(debt);
    resultDiv.innerHTML = `
      <div class="debt-big positive">+${surplus.toFixed(1)} hours</div>
      <div class="debt-sub">Great job! You've met or exceeded your sleep target.</div>
      <div class="debt-advice">✨ Keep this routine! Your sleep consistency is excellent for cognitive performance and metabolic health.</div>
    `;
  }
  resultDiv.style.display = 'block';
}

// --- LIVE CLOCK & HANDS ---
function updateLiveClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  // Digital display
  const h12 = hours % 12 || 12;
  const ampm = hours < 12 ? 'AM' : 'PM';
  const digitalStr = `${h12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  const digitalEl = document.getElementById('clock-digital');
  if (digitalEl) digitalEl.textContent = digitalStr;
  
  // Rotate hands
  const hourHand = document.getElementById('hour-hand');
  const minuteHand = document.getElementById('minute-hand');
  const secondHand = document.getElementById('second-hand');
  
  if (hourHand && minuteHand && secondHand) {
    const hourDeg = (hours % 12) * 30 + minutes * 0.5;
    const minuteDeg = minutes * 6;
    const secondDeg = seconds * 6;
    
    hourHand.style.transform = `rotate(${hourDeg}deg)`;
    minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    secondHand.style.transform = `rotate(${secondDeg}deg)`;
  }
  
  // Update current time display in Sleep Now panel
  const currentTimeSpan = document.getElementById('current-time-display');
  if (currentTimeSpan) {
    currentTimeSpan.textContent = digitalStr;
  }
}

// --- STARS ANIMATION ---
function generateStars() {
  const starsContainer = document.getElementById('stars');
  if (!starsContainer) return;
  starsContainer.innerHTML = '';
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    star.style.animationDuration = `${Math.random() * 2 + 2}s`;
    starsContainer.appendChild(star);
  }
}

// --- SCROLL ANIMATION (Reveal) ---
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  document.querySelectorAll('.section, .stage-card, .tip-card, .content-block, .rem-facts, .faq-item').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// --- FAQ ACCORDION ---
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const qBtn = item.querySelector('.faq-q');
    const aDiv = item.querySelector('.faq-a');
    qBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(i => {
        i.classList.remove('open');
        const innerA = i.querySelector('.faq-a');
        if (innerA) innerA.classList.remove('open');
      });
      if (!isOpen) {
        item.classList.add('open');
        aDiv.classList.add('open');
      }
    });
  });
}

// --- HEADER SCROLL EFFECT ---
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// --- MOBILE MENU TOGGLE ---
function initMobileMenu() {
  const menuBtn = document.querySelector('.menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }
}

// --- TAB SWITCHING IN CALCULATOR ---
function initCalcTabs() {
  const tabs = document.querySelectorAll('.calc-tab');
  const panels = {
    bedtime: document.getElementById('panel-bedtime'),
    waketime: document.getElementById('panel-waketime'),
    now: document.getElementById('panel-now')
  };
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.mode;
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // Hide all panels
      Object.values(panels).forEach(p => p.classList.remove('active'));
      // Show selected panel
      if (mode === 'bedtime') panels.bedtime.classList.add('active');
      else if (mode === 'waketime') panels.waketime.classList.add('active');
      else if (mode === 'now') panels.now.classList.add('active');
      // Hide results when switching mode
      document.getElementById('calc-results').style.display = 'none';
    });
  });
}

// --- EVENT LISTENERS ---
function bindEventListeners() {
  // Bedtime calculator
  const calcBedtimeBtn = document.getElementById('calc-bedtime-btn');
  if (calcBedtimeBtn) {
    calcBedtimeBtn.addEventListener('click', () => {
      const hour = document.getElementById('wake-hour');
      const minute = document.getElementById('wake-min');
      const ampmContainer = document.querySelector('#panel-bedtime .ampm-toggle');
      const { hour: h, minute: m, ampm: ap } = parseTimeInput(hour, minute, ampmContainer);
      const results = calculateBedtimes(h, m, ap);
      renderResults(results, `Recommended bedtimes for waking at ${h}:${m.toString().padStart(2, '0')} ${ap}:`);
    });
  }
  
  // Wake time calculator
  const calcWaketimeBtn = document.getElementById('calc-waketime-btn');
  if (calcWaketimeBtn) {
    calcWaketimeBtn.addEventListener('click', () => {
      const hour = document.getElementById('sleep-hour');
      const minute = document.getElementById('sleep-min');
      const ampmContainer = document.getElementById('sleep-ampm');
      const { hour: h, minute: m, ampm: ap } = parseTimeInput(hour, minute, ampmContainer);
      const results = calculateWakeTimes(h, m, ap);
      renderResults(results, `Recommended wake times for sleeping at ${h}:${m.toString().padStart(2, '0')} ${ap}:`);
    });
  }
  
  // Sleep now calculator
  const calcNowBtn = document.getElementById('calc-now-btn');
  if (calcNowBtn) {
    calcNowBtn.addEventListener('click', () => {
      const results = calculateNowWakeTimes();
      renderResults(results, `If you fall asleep now (~14 min to drift off):`);
    });
  }
  
  // Duration estimator
  const durCalcBtn = document.getElementById('dur-calc-btn');
  if (durCalcBtn) {
    durCalcBtn.addEventListener('click', () => {
      const bedHour = document.getElementById('dur-sleep-h');
      const bedMin = document.getElementById('dur-sleep-m');
      const bedAmpmContainer = document.getElementById('dur-sleep-ampm');
      const wakeHour = document.getElementById('dur-wake-h');
      const wakeMin = document.getElementById('dur-wake-m');
      const wakeAmpmContainer = document.getElementById('dur-wake-ampm');
      
      const bed = parseTimeInput(bedHour, bedMin, bedAmpmContainer);
      const wake = parseTimeInput(wakeHour, wakeMin, wakeAmpmContainer);
      const result = calculateDuration(bed.hour, bed.minute, bed.ampm, wake.hour, wake.minute, wake.ampm);
      
      const resultDiv = document.getElementById('duration-result');
      resultDiv.style.display = 'block';
      resultDiv.innerHTML = `
        <div class="dur-big">${result.hours}h ${result.mins}m total sleep</div>
        <div class="dur-sub">≈ ${result.cycles} sleep cycles (90 min each) • ${result.isOptimal ? '✓ Optimal: aligns with cycle end!' : '⚠️ May wake mid-cycle — adjust bedtime or wake time by 15-30 min'}</div>
      `;
    });
  }
  
  // Schedule planner
  const genScheduleBtn = document.getElementById('gen-schedule-btn');
  if (genScheduleBtn) {
    genScheduleBtn.addEventListener('click', generateWeeklySchedule);
  }
  
  // Sleep debt
  initSleepDebtInputs();
  const calcDebtBtn = document.getElementById('calc-debt-btn');
  if (calcDebtBtn) {
    calcDebtBtn.addEventListener('click', calculateSleepDebt);
  }
  
  // AM/PM toggle buttons (dynamically for all groups)
  document.querySelectorAll('.ampm-toggle').forEach(toggle => {
    const btns = toggle.querySelectorAll('.ampm-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });
}

// --- SLEEP CHART ANIMATION (SVG drawing effect) ---
function animateSleepChart() {
  const path = document.getElementById('sleep-path');
  if (!path) return;
  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
  path.getBoundingClientRect();
  path.style.transition = 'stroke-dashoffset 2s ease-out';
  path.style.strokeDashoffset = '0';
}

// --- INITIALIZE ALL ---
document.addEventListener('DOMContentLoaded', () => {
  generateStars();
  updateLiveClock();
  setInterval(updateLiveClock, 1000);
  initCalcTabs();
  bindEventListeners();
  initScrollReveal();
  initFaqAccordion();
  initHeaderScroll();
  initMobileMenu();
  animateSleepChart();
  
  // Also ensure that when clicking nav links, mobile menu closes
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector('.mobile-nav')?.classList.remove('open');
    });
  });
});
