// main.js — Enhanced interactive behavior and animations
document.addEventListener('DOMContentLoaded', function () {
  // Mobile navigation toggle
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('main-nav');
  
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      mainNav.classList.toggle('active');
      
      // Change icon based on state
      this.textContent = expanded ? '☰' : '✕';
      
      // Prevent body scrolling when menu is open
      document.body.style.overflow = expanded ? '' : 'hidden';
    });
    
    // Close menu when clicking on a link
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
        navToggle.textContent = '☰';
        document.body.style.overflow = '';
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('active') && 
          !mainNav.contains(e.target) && 
          e.target !== navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
        navToggle.textContent = '☰';
        document.body.style.overflow = '';
      }
    });
  }
  
  // Header scroll effect
  const header = document.querySelector('.site-header');
  if (header) {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        header.style.padding = '0.5rem 0';
        header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        
        if (currentScroll > lastScroll && currentScroll > 200) {
          header.style.transform = 'translateY(-100%)';
        } else {
          header.style.transform = 'translateY(0)';
        }
      } else {
        header.style.padding = '1rem 0';
        header.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
      }
      
      lastScroll = currentScroll;
    });
  }
  
  // Add animation classes to elements when they enter viewport
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.card, article, .hero-text, .hero-image');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
      observer.observe(el);
    });
  };
  
  // Run animation observer
  animateOnScroll();
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Form validation with improved UX
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    // Add real-time validation
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });
      
      input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          validateField(this);
        }
      });
    });
    
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });
      
      if (!isValid) {
        // Shake form to indicate errors
        contactForm.classList.add('shake');
        setTimeout(() => {
          contactForm.classList.remove('shake');
        }, 500);
        
        return;
      }
      
      // Form is valid - simulate submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      const statusEl = document.getElementById('formStatus');
      
      // Show loading state
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        statusEl.textContent = 'Thank you! Your message has been sent.';
        statusEl.style.color = '#087c5b';
        statusEl.classList.add('show');
        
        // Reset form
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Hide status message after 5 seconds
        setTimeout(() => {
          statusEl.classList.remove('show');
        }, 5000);
      }, 1500);
    });
    
    // Field validation function
    function validateField(field) {
      const value = field.value.trim();
      const errorEl = field.nextElementSibling;
      
      // Remove any existing error messages
      if (errorEl && errorEl.classList.contains('error-message')) {
        errorEl.remove();
      }
      
      // Check required fields
      if (field.hasAttribute('required') && !value) {
        showError(field, 'This field is required');
        return false;
      }
      
      // Email validation
      if (field.type === 'email' && value) {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(value)) {
          showError(field, 'Please enter a valid email address');
          return false;
        }
      }
      
      // If valid, remove error styling
      field.classList.remove('error');
      return true;
    }
    
    function showError(field, message) {
      field.classList.add('error');
      
      const errorEl = document.createElement('p');
      errorEl.className = 'error-message';
      errorEl.textContent = message;
      errorEl.style.color = '#d9534f';
      errorEl.style.fontSize = '0.875rem';
      errorEl.style.marginTop = '0.25rem';
      
      field.parentNode.insertBefore(errorEl, field.nextSibling);
    }
  }
  
  // Card interaction improvements
  const cards = document.querySelectorAll('.card');
  cards.forEach(function(card) {
    card.setAttribute('tabindex', '0');
    
    card.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
  
  // Lazy loading for images
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }
});

// Add CSS for form validation and animations
const style = document.createElement('style');
style.textContent = `
  .error {
    border-color: #d9534f !important;
    box-shadow: 0 0 0 3px rgba(217, 83, 79, 0.1) !important;
  }
  
  .shake {
    animation: shake 0.5s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-8px); }
    40%, 80% { transform: translateX(8px); }
  }
  
  img[data-src] {
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  img.loaded {
    opacity: 1;
  }
  
  #formStatus {
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    margin-top: 1rem;
    padding: 0.75rem;
    border-radius: 4px;
    text-align: center;
  }
  
  #formStatus.show {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);