// State
let currentMode = "bedtime"
let currentTime = "23:00"
let sleepCycles = 5
let fallAsleepTime = 15
let currentTheme = "purple"

// Elements
const clockTime = document.getElementById("clockTime")
const timeInput = document.getElementById("timeInput")
const modeBtns = document.querySelectorAll(".mode-btn")
const advancedToggle = document.getElementById("advancedToggle")
const advancedOptions = document.getElementById("advancedOptions")
const calculateBtn = document.getElementById("calculateBtn")
const results = document.getElementById("results")
const resultsGrid = document.getElementById("resultsGrid")
const sleepCyclesInput = document.getElementById("sleepCycles")
const fallAsleepInput = document.getElementById("fallAsleep")

// Initialize
function init() {
  updateClockDisplay()
  attachEventListeners()
  setTheme(currentTheme)
}

// Event Listeners
function attachEventListeners() {
  // Mode selection
  modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modeBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      currentMode = btn.dataset.mode
      updateClockLabel()
    })
  })

  // Time input
  timeInput.addEventListener("change", (e) => {
    currentTime = e.target.value
    updateClockDisplay()
  })

  // Time buttons
  document.getElementById("increaseTime").addEventListener("click", () => {
    adjustTime(15)
  })

  document.getElementById("decreaseTime").addEventListener("click", () => {
    adjustTime(-15)
  })

  // Advanced options toggle
  advancedToggle.addEventListener("click", () => {
    advancedOptions.classList.toggle("open")
    advancedToggle.classList.toggle("active")
  })

  // Advanced options buttons
  document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action
      const target = btn.dataset.target
      const input = document.getElementById(target)
      const currentValue = Number.parseInt(input.value)
      const min = Number.parseInt(input.min)
      const max = Number.parseInt(input.max)
      const step = Number.parseInt(input.step) || 1

      if (action === "increase" && currentValue < max) {
        input.value = currentValue + step
      } else if (action === "decrease" && currentValue > min) {
        input.value = currentValue - step
      }

      updateValues()
    })
  })

  // Direct input changes
  sleepCyclesInput.addEventListener("change", updateValues)
  fallAsleepInput.addEventListener("change", updateValues)

  // Calculate button
  calculateBtn.addEventListener("click", calculateSleepTimes)

  // Theme selection
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const color = btn.dataset.color
      setTheme(color)
    })
  })
}

// Update clock display
function updateClockDisplay() {
  clockTime.textContent = currentTime
}

// Update clock label
function updateClockLabel() {
  const label = document.querySelector(".clock-label")
  label.textContent = currentMode === "bedtime" ? "WAKE TIME" : "BED TIME"
}

// Adjust time by minutes
function adjustTime(minutes) {
  const [hours, mins] = currentTime.split(":").map(Number)
  const date = new Date()
  date.setHours(hours, mins + minutes)

  const newHours = String(date.getHours()).padStart(2, "0")
  const newMins = String(date.getMinutes()).padStart(2, "0")

  currentTime = `${newHours}:${newMins}`
  timeInput.value = currentTime
  updateClockDisplay()
}

// Update values from inputs
function updateValues() {
  sleepCycles = Number.parseInt(sleepCyclesInput.value)
  fallAsleepTime = Number.parseInt(fallAsleepInput.value)
}

// Calculate sleep times
function calculateSleepTimes() {
  updateValues()
  const [hours, minutes] = currentTime.split(":").map(Number)
  const baseTime = new Date()
  baseTime.setHours(hours, minutes, 0, 0)

  const times = []
  const cycleDuration = 90 // minutes
  const cycleOptions = [3, 4, 5, 6]

  if (currentMode === "bedtime") {
    // Calculate bedtimes for waking at set time
    cycleOptions.forEach((cycles) => {
      const totalSleepMinutes = cycles * cycleDuration + fallAsleepTime
      const bedTime = new Date(baseTime.getTime() - totalSleepMinutes * 60 * 1000)
      times.push({
        time: formatTime(bedTime),
        label: `${cycles} cycles (${formatDuration(cycles * cycleDuration)})`,
      })
    })
  } else {
    // Calculate wake times for sleeping at set time
    cycleOptions.forEach((cycles) => {
      const totalSleepMinutes = cycles * cycleDuration + fallAsleepTime
      const wakeTime = new Date(baseTime.getTime() + totalSleepMinutes * 60 * 1000)
      times.push({
        time: formatTime(wakeTime),
        label: `${cycles} cycles (${formatDuration(cycles * cycleDuration)})`,
      })
    })
  }

  displayResults(times)
}

// Format time
function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

// Format duration
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

// Display results
function displayResults(times) {
  resultsGrid.innerHTML = ""

  times.forEach((item, index) => {
    const card = document.createElement("div")
    card.className = "result-card"
    card.style.animationDelay = `${index * 0.1}s`

    card.innerHTML = `
            <div class="result-time">${item.time}</div>
            <div class="result-label">${item.label}</div>
        `

    resultsGrid.appendChild(card)
  })

  results.classList.add("visible")
  results.scrollIntoView({ behavior: "smooth", block: "nearest" })
}

// Theme functionality
function setTheme(theme) {
  currentTheme = theme
  document.documentElement.setAttribute("data-theme", theme)

  // Update active theme button
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.classList.remove("active")
  })
  document.querySelector(`[data-color="${theme}"]`).classList.add("active")

  // Save to localStorage
  localStorage.setItem("sleepCalcTheme", theme)
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem("sleepCalcTheme")
  if (savedTheme) {
    setTheme(savedTheme)
  }
}

// Initialize app
loadSavedTheme()
init()
