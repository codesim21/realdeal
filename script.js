// Eden Roots Website JavaScript
// Handles all interactive functionality for the website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initFormHandling();
    initGalleryModal();
    initScrollAnimations();
    initMobileMenu();
    initThemeToggle();
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form handling for contact form
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }
            
            // Get input values manually since we're not using FormData properly
            const inputs = this.querySelectorAll('input, textarea');
            const formDataObj = {};
            
            inputs.forEach(input => {
                if (input.type === 'submit') return;
                formDataObj[input.placeholder.toLowerCase().replace(/\s+/g, '_')] = input.value;
            });
            
            // Validate form
            if (validateForm(formDataObj)) {
                // Show success message
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                
                // Reset form
                this.reset();
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    }
    
    // Add real-time validation
    const formInputs = document.querySelectorAll('.form-input, .form-textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Form validation
function validateForm(data) {
    const requiredFields = ['first_name', 'last_name', 'email_address'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            return false;
        }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email_address)) {
        return false;
    }
    
    return true;
}

// Individual field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.placeholder.toLowerCase();
    
    // Clear previous error
    clearFieldError(field);
    
    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    return true;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--destructive)';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Gallery modal functionality
function initGalleryModal() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    galleryImages.forEach(image => {
        image.addEventListener('click', function() {
            openImageModal(this.src, this.alt);
        });
    });
}

// Open image modal
function openImageModal(src, alt) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'image-modal-overlay';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        cursor: pointer;
    `;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        position: relative;
    `;
    
    // Create image
    const modalImage = document.createElement('img');
    modalImage.src = src;
    modalImage.alt = alt;
    modalImage.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 0.5rem;
    `;
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        position: absolute;
        top: -2rem;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        padding: 0.5rem;
    `;
    
    // Assemble modal
    modalContent.appendChild(modalImage);
    modalContent.appendChild(closeButton);
    modalOverlay.appendChild(modalContent);
    
    // Add to document
    document.body.appendChild(modalOverlay);
    document.body.style.overflow = 'hidden';
    
    // Close modal functionality
    function closeModal() {
        document.body.removeChild(modalOverlay);
        document.body.style.overflow = '';
    }
    
    closeButton.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .service-card, .gallery-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Mobile menu functionality
function initMobileMenu() {
    // Create mobile menu toggle button
    const headerContent = document.querySelector('.header-content');
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '☰';
    mobileMenuToggle.style.cssText = `
        display: block;
        background: none;
        border: none;
        color: var(--foreground);
        font-size: 1.5rem;
        cursor: pointer;
    `;
    
    // Add toggle button to header
    headerContent.appendChild(mobileMenuToggle);
    
    // Create mobile menu
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.style.cssText = `
        position: fixed;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100vh;
        background-color: var(--background);
        z-index: 999;
        transition: left 0.3s ease;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    `;
    
    // Determine base path for links based on current page
    const isPriceListPage = window.location.pathname.includes('pricelist.html');
    const basePath = isPriceListPage ? 'index.html' : '';
    
    // Create mobile menu content
    const mobileMenuContent = document.createElement('div');
    mobileMenuContent.innerHTML = `
        <div class="mobile-menu-header">
            <div class="logo-section">
                <div class="logo-icon">
                    <span class="logo-text">ER</span>
                </div>
                <div class="logo-text-section">
                    <h1 class="logo-title">Eden Roots</h1>
                    <p class="logo-subtitle">Natural Hair Specialists</p>
                </div>
            </div>
            <button class="mobile-menu-close">×</button>
        </div>
        <nav class="mobile-nav">
            <a href="${basePath}#home" class="mobile-nav-link">Home</a>
            <a href="${basePath}#about" class="mobile-nav-link">About</a>
            <a href="${basePath}#services" class="mobile-nav-link">Services</a>
            <a href="${basePath}#gallery" class="mobile-nav-link">Gallery</a>
            <a href="pricelist.html" class="mobile-nav-link">Price List</a>
            <a href="${basePath}#contact" class="mobile-nav-link">Contact</a>
        </nav>
        <button class="btn btn-primary mobile-book-btn" onclick="window.location.href='${basePath}#contact'">Book Appointment</button>
    `;
    
    mobileMenu.appendChild(mobileMenuContent);
    document.body.appendChild(mobileMenu);
    
    // Style mobile menu elements
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        .mobile-menu-close {
            background: none;
            border: none;
            font-size: 2rem;
            color: var(--foreground);
            cursor: pointer;
        }
        .mobile-nav {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .mobile-nav-link {
            color: var(--foreground);
            text-decoration: none;
            font-size: 1.125rem;
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--border);
        }
        .mobile-book-btn {
            margin-top: auto;
            width: 100%;
        }
        @media (min-width: 768px) {
            .mobile-menu-toggle {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.style.left = '0';
        document.body.style.overflow = 'hidden';
    });
    
    // Close mobile menu
    const closeMobileMenu = function() {
        mobileMenu.style.left = '-100%';
        document.body.style.overflow = '';
    };
    
    mobileMenu.querySelector('.mobile-menu-close').addEventListener('click', closeMobileMenu);
    
    // Close menu when clicking on links
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            // If it's an external link (like pricelist.html), don't prevent default
            if (this.getAttribute('href').startsWith('http') || this.getAttribute('href').includes('.html')) {
                // Allow navigation, menu will close naturally
            } else {
                // For anchor links, close menu first
                closeMobileMenu();
            }
        });
    });
    
    // Close menu when clicking Book Appointment button
    const mobileBookBtn = mobileMenu.querySelector('.mobile-book-btn');
    if (mobileBookBtn) {
        mobileBookBtn.addEventListener('click', closeMobileMenu);
    }
    
    // Close menu when clicking outside
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });
}

// Theme toggle functionality (for future dark mode support)
function initThemeToggle() {
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Create theme toggle button (optional - can be added to header later)
    // This is prepared for future implementation
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style notification
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background-color: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        max-width: 20rem;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Service booking functionality
function initServiceBooking() {
    const serviceButtons = document.querySelectorAll('.service-btn');
    
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceCard = this.closest('.service-card');
            const serviceTitle = serviceCard.querySelector('.service-title').textContent;
            
            // Scroll to contact form
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = contactSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Pre-fill the textarea with service information
                setTimeout(() => {
                    const textarea = document.querySelector('.form-textarea');
                    if (textarea) {
                        textarea.value = `I'm interested in booking: ${serviceTitle}\n\nPlease provide more details about your hair journey and any specific requirements.`;
                        textarea.focus();
                    }
                }, 500);
            }
        });
    });
}

// Initialize service booking
document.addEventListener('DOMContentLoaded', function() {
    initServiceBooking();
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = 'var(--background)';
        header.style.backdropFilter = 'none';
    }
});

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);


