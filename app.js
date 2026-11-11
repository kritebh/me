const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Theme handling (the saved theme is applied early by an inline script in <head>)
const themeDots = document.querySelectorAll('.theme-dot');

function getSavedTheme() {
    try {
        return localStorage.getItem('currentTheme');
    } catch (e) {
        return null;
    }
}

function markActiveTheme(mode) {
    themeDots.forEach(dot => {
        dot.setAttribute('aria-pressed', String(dot.dataset.mode === mode));
    });
}

function setTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    try {
        localStorage.setItem('currentTheme', mode);
    } catch (e) { /* storage unavailable: theme still applies for this visit */ }
    markActiveTheme(mode);
}

const savedTheme = getSavedTheme();
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
markActiveTheme(savedTheme || 'light');

themeDots.forEach(dot => {
    dot.addEventListener('click', () => setTheme(dot.dataset.mode));
});

// Smooth scroll for in-page links, offset for the sticky navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        window.scrollTo({
            top: Math.max(target.offsetTop - 80, 0),
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
        history.replaceState(null, '', this.getAttribute('href'));
    });
});

document.addEventListener('DOMContentLoaded', () => {
    if (prefersReducedMotion) return;

    // Fade in hero headline on load
    const heroHeadline = document.getElementById('hero-headline');
    if (heroHeadline) {
        heroHeadline.style.opacity = '0';
        heroHeadline.style.transform = 'translateY(20px)';
        heroHeadline.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        setTimeout(() => {
            heroHeadline.style.opacity = '1';
            heroHeadline.style.transform = 'translateY(0)';
        }, 100);
    }

    animateCounters();
    setupIntersectionObserver();
});

// Count-up animation for hero stats (the final value is already in the HTML)
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const counter = entry.target;
            const targetText = counter.getAttribute('data-target');
            const target = parseInt(targetText, 10);
            const suffix = targetText.replace(/[0-9]/g, '');
            const increment = target / (2000 / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + suffix;
                }
            };

            updateCounter();
            counterObserver.unobserve(counter);
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counter.textContent = '0';
        counterObserver.observe(counter);
    });
}

// Fade-in on scroll
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('section, .project-card, .skill-category, .timeline-item, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Project card hover lift
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Scroll effects: navbar shadow, hero parallax, active nav link
const navbar = document.querySelector('.navbar');
const heroImage = document.querySelector('.hero-image');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
let ticking = false;

function onScroll() {
    const y = window.pageYOffset;

    if (navbar) {
        navbar.style.boxShadow = y > 100 ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none';
    }

    if (heroImage && !prefersReducedMotion && y < window.innerHeight) {
        heroImage.style.transform = `translateY(${y * 0.3}px)`;
        heroImage.style.opacity = 1 - (y / window.innerHeight) * 0.5;
    }

    let current = '';
    sections.forEach(section => {
        if (y >= section.offsetTop - 200) current = section.id;
    });
    navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${current}`;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    });

    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
    }
}, { passive: true });

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
