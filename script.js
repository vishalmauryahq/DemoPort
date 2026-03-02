// Global variables
const mousePosition = { x: 0, y: 0 }
let isMenuOpen = false
let activeSection = "hero"

// DOM elements
const navbar = document.getElementById("navbar")
const menuToggle = document.getElementById("menuToggle")
const menuIcon = document.getElementById("menuIcon")
const navLinks = document.getElementById("navLinks")
const mouseGradient = document.getElementById("mouseGradient")
const heroText = document.getElementById("heroText")
const contactForm = document.getElementById("contactForm")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners()
  updateActiveSection()
})

// Event listeners
function initializeEventListeners() {
  // Mouse movement tracking
  document.addEventListener("mousemove", handleMouseMove)

  // Scroll tracking
  window.addEventListener("scroll", handleScroll)

  // Navigation
  setupNavigation()

  // Form submission
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit)
  }

  // Parallax effects
  window.addEventListener("scroll", updateParallaxElements)
}

// Mouse movement handler
function handleMouseMove(e) {
  mousePosition.x = e.clientX
  mousePosition.y = e.clientY

  // Update mouse gradient
  if (mouseGradient) {
    mouseGradient.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, var(--primary) 0%, transparent 50%)`
  }

  // Update parallax elements
  updateParallaxElements()
}

// Scroll handler
function handleScroll() {
  updateActiveSection()
  updateParallaxElements()
}

// Navigation setup
function setupNavigation() {
  // Menu toggle
  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMobileMenu)
  }

  // Navigation links
  const navButtons = document.querySelectorAll(".nav-link, [data-section]")
  navButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const section = this.getAttribute("data-section")
      if (section) {
        scrollToSection(section)
      }
    })
  })
}

// Toggle mobile menu
function toggleMobileMenu() {
  isMenuOpen = !isMenuOpen

  if (navLinks) {
    navLinks.classList.toggle("active", isMenuOpen)
  }

  if (menuIcon) {
    menuIcon.textContent = isMenuOpen ? "✕" : "☰"
  }
}

// Scroll to section
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  // Close mobile menu
  if (isMenuOpen) {
    toggleMobileMenu()
  }
}

// Update active section
function updateActiveSection() {
  const sections = ["hero", "about", "projects", "contact"]
  const scrollPosition = window.scrollY + 100

  for (const section of sections) {
    const element = document.getElementById(section)
    if (element) {
      const { offsetTop, offsetHeight } = element
      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        if (activeSection !== section) {
          activeSection = section
          updateNavigationHighlight()
        }
        break
      }
    }
  }
}

// Update navigation highlight
function updateNavigationHighlight() {
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    const section = link.getAttribute("data-section")
    if (section === activeSection) {
      link.classList.add("active")
    } else {
      link.classList.remove("active")
    }
  })
}

// Update parallax elements
function updateParallaxElements() {
  const parallaxElements = document.querySelectorAll(".parallax-element")
  const scrollY = window.scrollY

  parallaxElements.forEach((element) => {
    const speed = 0.02
    const yPos = -(scrollY * speed)
    const mouseEffect = mousePosition.y * 0.02
    element.style.transform = `translateY(${yPos + mouseEffect}px)`
  })
}

// Form submission handler
function handleFormSubmit(e) {
  e.preventDefault()

  // Get form data
  const formData = new FormData(e.target)
  const name = formData.get("name") || e.target.querySelector('input[type="text"]').value
  const email = formData.get("email") || e.target.querySelector('input[type="email"]').value
  const message = formData.get("message") || e.target.querySelector("textarea").value

  // Simple validation
  if (!name || !email || !message) {
    alert("Please fill in all fields")
    return
  }

  // Simulate form submission
  const submitButton = e.target.querySelector(".form-submit")
  const originalText = submitButton.textContent

  submitButton.textContent = "Sending..."
  submitButton.disabled = true

  setTimeout(() => {
    alert("Message sent successfully! (This is a demo)")
    e.target.reset()
    submitButton.textContent = originalText
    submitButton.disabled = false
  }, 2000)
}

// Smooth reveal animations on scroll
function observeElements() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  )

  // Observe elements that should animate in
  const animatedElements = document.querySelectorAll(".project-card, .about-text, .contact-card")
  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
}

// Initialize animations when DOM is loaded
document.addEventListener("DOMContentLoaded", observeElements)

// Add some interactive effects
document.addEventListener("DOMContentLoaded", () => {
  // Add hover effects to project cards
  const projectCards = document.querySelectorAll(".project-card")
  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-8px) scale(1.02)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
    })
  })

  // Add click effects to buttons
  const buttons = document.querySelectorAll(".btn")
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      this.style.transform = "scale(0.95)"
      setTimeout(() => {
        this.style.transform = ""
      }, 150)
    })
  })
})

// Performance optimization: throttle scroll events
function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Apply throttling to scroll events
window.addEventListener("scroll", throttle(handleScroll, 16)) // ~60fps
