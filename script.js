/* ============================================
   KARRIEHOLD — SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ========================================
       NAVBAR: SCROLL & MOBILE TOGGLE
       ======================================== */

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    function handleNavbarScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    navToggle.addEventListener('click', function () {
        const isOpen = navMenu.classList.contains('open');
        navMenu.classList.toggle('open');
        navToggle.classList.toggle('active');
        document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    /* ========================================
       HERO: BG ZOOM ON LOAD
       ======================================== */

    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        setTimeout(function () {
            heroBg.classList.add('zoomed');
        }, 100);
    }

    /* ========================================
       SMOOTH SCROLL FOR ANCHOR LINKS
       ======================================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    /* ========================================
       SCROLL REVEAL ANIMATION
       ======================================== */

    const revealTargets = document.querySelectorAll(
        '.service-kort, .testimonial-kort, .om-os-content, .om-os-images, .faq-item, .kontakt-info, .kontakt-formular, .newsletter-inner, .footer-col, .footer-brand'
    );

    revealTargets.forEach(function (el) {
        el.classList.add('reveal');
    });

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, index) {
            if (entry.isIntersecting) {
                const delay = (index % 3) * 100;
                setTimeout(function () {
                    entry.target.classList.add('visible');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach(function (el) {
        revealObserver.observe(el);
    });

    /* ========================================
       REJSEKORT ANIMATION ON LOAD
       ======================================== */

    const rejseKort = document.querySelectorAll('.rejse-kort');

    const kortObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, i) {
            if (entry.isIntersecting) {
                setTimeout(function () {
                    entry.target.classList.add('visible');
                }, i * 120);
                kortObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    rejseKort.forEach(function (kort) {
        kortObserver.observe(kort);
    });

    /* ========================================
       REJSER FILTER
       ======================================== */

    const filterBtns = document.querySelectorAll('.filter-btn');
    const allKort = document.querySelectorAll('.rejse-kort');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            allKort.forEach(function (kort) {
                if (filter === 'alle' || kort.getAttribute('data-category') === filter) {
                    kort.classList.remove('hidden');
                    kort.style.animation = 'none';
                    kort.offsetHeight;
                    kort.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    kort.classList.add('hidden');
                }
            });
        });
    });

    /* ========================================
       FAQ ACCORDION
       ======================================== */

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        btn.addEventListener('click', function () {
            const isOpen = this.getAttribute('aria-expanded') === 'true';

            faqItems.forEach(function (other) {
                const otherBtn = other.querySelector('.faq-question');
                const otherAnswer = other.querySelector('.faq-answer');
                otherBtn.setAttribute('aria-expanded', 'false');
                otherAnswer.classList.remove('open');
            });

            if (!isOpen) {
                this.setAttribute('aria-expanded', 'true');
                answer.classList.add('open');
            }
        });
    });

    /* ========================================
       TESTIMONIALS SLIDER
       ======================================== */

    const track = document.getElementById('testimonials-track');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.testimonial-slide').length;
    let autoplayTimer;

    function goToSlide(n) {
        currentSlide = (n + totalSlides) % totalSlides;
        track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
        dots.forEach(function (d, i) {
            d.classList.toggle('active', i === currentSlide);
        });
    }

    function startAutoplay() {
        autoplayTimer = setInterval(function () {
            goToSlide(currentSlide + 1);
        }, 5500);
    }

    function resetAutoplay() {
        clearInterval(autoplayTimer);
        startAutoplay();
    }

    prevBtn && prevBtn.addEventListener('click', function () {
        goToSlide(currentSlide - 1);
        resetAutoplay();
    });

    nextBtn && nextBtn.addEventListener('click', function () {
        goToSlide(currentSlide + 1);
        resetAutoplay();
    });

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            goToSlide(i);
            resetAutoplay();
        });
    });

    startAutoplay();

    /* Swipe support for testimonials */
    let touchStartX = 0;
    if (track) {
        track.addEventListener('touchstart', function (e) {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', function (e) {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
                resetAutoplay();
            }
        }, { passive: true });
    }

    /* ========================================
       KONTAKT FORMULAR
       ======================================== */

    const kontaktForm = document.getElementById('kontakt-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');

    if (kontaktForm) {
        kontaktForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let valid = true;

            const fields = [
                { id: 'navn', msg: 'Indtast venligst dit navn' },
                { id: 'email', msg: 'Indtast en gyldig e-mailadresse' },
                { id: 'besked', msg: 'Beskriv venligst din drømmetur' }
            ];

            fields.forEach(function (f) {
                const input = document.getElementById(f.id);
                const errorEl = input.parentNode.querySelector('.form-fejl');
                const value = input.value.trim();

                if (!value || (f.id === 'email' && !isValidEmail(value))) {
                    input.classList.add('error');
                    if (errorEl) {
                        errorEl.textContent = f.msg;
                        errorEl.classList.add('visible');
                    }
                    valid = false;
                } else {
                    input.classList.remove('error');
                    if (errorEl) errorEl.classList.remove('visible');
                }
            });

            if (!valid) return;

            submitBtn.classList.add('loading');
            submitBtn.querySelector('span').textContent = 'Sender...';
            submitBtn.disabled = true;

            setTimeout(function () {
                submitBtn.classList.remove('loading');
                submitBtn.style.display = 'none';
                formSuccess.classList.add('visible');
                kontaktForm.reset();
            }, 1800);
        });

        kontaktForm.querySelectorAll('input, textarea').forEach(function (input) {
            input.addEventListener('input', function () {
                this.classList.remove('error');
                const errorEl = this.parentNode.querySelector('.form-fejl');
                if (errorEl) errorEl.classList.remove('visible');
            });
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /* ========================================
       NEWSLETTER FORM
       ======================================== */

    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterSuccess = document.getElementById('newsletter-success');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            if (!emailInput.value || !isValidEmail(emailInput.value.trim())) {
                emailInput.style.borderColor = '#e74c3c';
                setTimeout(function () {
                    emailInput.style.borderColor = '';
                }, 2000);
                return;
            }

            newsletterForm.style.display = 'none';
            newsletterSuccess.classList.add('visible');
        });
    }

    /* ========================================
       BACK TO TOP BUTTON
       ======================================== */

    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    backToTop && backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ========================================
       ACTIVE NAV LINK ON SCROLL
       ======================================== */

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(function (link) {
                    link.style.color = '';
                    if (link.getAttribute('href') === '#' + id) {
                        link.style.color = 'var(--gold)';
                    }
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(function (section) {
        sectionObserver.observe(section);
    });

    /* ========================================
       STAT NUMBER COUNT-UP ANIMATION
       ======================================== */

    function animateCount(el, target, suffix) {
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(function () {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = current + suffix;
        }, 25);
    }

    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !statsAnimated) {
            statsAnimated = true;
            statNumbers.forEach(function (el) {
                const text = el.textContent.trim();
                const num = parseInt(text);
                const suffix = text.replace(num, '');
                el.textContent = '0' + suffix;
                animateCount(el, num, suffix);
            });
        }
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) statsObserver.observe(heroStats);

    /* ========================================
       OVERLAY CLICK TO CLOSE MOBILE MENU
       ======================================== */

    document.addEventListener('click', function (e) {
        if (navMenu.classList.contains('open') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

});
