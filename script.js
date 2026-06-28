/* ================================================
   SomosUno Landing Page — Script v4
   Lenis + GSAP + Smart Hide Navbar + Step Chevron Slider
   ================================================ */

(function () {
    'use strict';

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    window.addEventListener('beforeunload', () => {
        window.scrollTo(0, 0);
    });

    const EASE_OUT = 'power3.out';
    const EASE_IN_OUT = 'power2.inOut';

    // ================================================
    // LOADING SCREEN
    // ================================================
    const loader = document.getElementById('loader');

    // Start loader animation on DOMContentLoaded for immediate feedback
    document.addEventListener('DOMContentLoaded', () => {
        // Reset scroll position to top to ensure we see the hero backdrop
        window.scrollTo(0, 0);
        document.body.style.overflow = 'hidden';
        prepareLineStaggers();

        if (!loader) {
            initPage();
            return;
        }

        // Set initial states (hide logo parts)
        gsap.set('.loader-isotipo', { scale: 0.5, opacity: 0 });
        gsap.set('.loader-brand-text', { width: 0, opacity: 0, marginLeft: 0 });
        
        // Hide Hero elements and navbar wrapper during preloader logo animation
        gsap.set('[data-gsap="hero"]', { opacity: 0, visibility: 'hidden' });
        gsap.set('[data-gsap="watermark"]', { opacity: 0, visibility: 'hidden' });
        gsap.set('.navbar-wrapper', { opacity: 0, visibility: 'hidden' });

        const tl = gsap.timeline({
            onComplete: () => {
                loader.style.display = 'none';
                document.body.style.overflow = '';
                initPage();
            }
        });

        // 1. Isotipo appears in the center
        tl.to('.loader-isotipo', { scale: 1.1, opacity: 1, duration: 0.7, ease: 'back.out(1.5)' })
          .to('.loader-isotipo', { scale: 1.0, duration: 0.3, ease: 'power2.out' })
          
        // 2. Isotipo slides to the left and "SomosUno" emerges from the right
          .to('.loader-brand-text', { 
              width: 190, 
              opacity: 1, 
              marginLeft: 14, 
              duration: 1.0, 
              ease: 'power3.out' 
          }, '+=0.4')
          
        // 3. Preloader fades out to reveal the hero
          .to(loader, { 
              opacity: 0, 
              duration: 0.7, 
              ease: 'power2.inOut' 
          }, '+=1.0');
    });

    // ================================================
    // MAIN INIT
    // ================================================
    function initPage() {
        initLenis();
        initSmartNavbar();
        initScrollSpy();
        initMobileMenu();
        initHeroAnimations();
        initScrollAnimations();
        initCounters();
        initStepChevronSlider();
    }

    // ================================================
    // LENIS SMOOTH SCROLL
    // ================================================
    let lenis;

    function initLenis() {
        lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.85,
            touchMultiplier: 1.5,
        });

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    lenis.scrollTo(target, {
                        offset: -90,
                        duration: 1.6,
                    });

                    const navLinks = document.getElementById('navLinks');
                    const toggle = document.getElementById('mobileToggle');
                    if (navLinks && navLinks.classList.contains('nav-open')) {
                        navLinks.classList.remove('nav-open');
                        if (toggle) toggle.classList.remove('active');
                    }
                }
            });
        });
    }

    // ================================================
    // SMART NAVBAR (HIDE ON SCROLL DOWN, SHOW ON SCROLL UP, TRANSPARENT AT TOP)
    // ================================================
    function initSmartNavbar() {
        const wrapper = document.getElementById('navbarWrapper');
        const navbar = document.getElementById('navbar');
        if (!wrapper || !navbar) return;

        let lastScrollY = window.pageYOffset;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.pageYOffset;

            // Transparent at top
            if (currentScrollY <= 60) {
                navbar.classList.remove('scrolled');
                wrapper.classList.remove('nav-hidden');
            } else {
                navbar.classList.add('scrolled');

                // Smart Hide / Show
                if (currentScrollY > lastScrollY && currentScrollY > 50) {
                    // Scrolling down -> Hide nav
                    wrapper.classList.add('nav-hidden');
                } else if (currentScrollY < lastScrollY) {
                    // Scrolling up -> Show nav
                    wrapper.classList.remove('nav-hidden');
                }
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // ================================================
    // MOBILE MENU
    // ================================================
    function initMobileMenu() {
        const toggle = document.getElementById('mobileToggle');
        const navLinks = document.getElementById('navLinks');

        if (toggle && navLinks) {
            toggle.addEventListener('click', () => {
                navLinks.classList.toggle('nav-open');
                toggle.classList.toggle('active');
            });
        }
    }

    // ================================================
    // SPLIT TEXT LINE STAGGER HELPER
    // ================================================
    function prepareLineStaggers() {
        const selector = '.hero-title, .hero-subtitle, .section-headline, .vision-banner-title, .vision-banner-desc, .footer-cta-text h3';
        document.querySelectorAll(selector).forEach((el) => {
            if (el.dataset.splitDone) return;
            el.dataset.splitDone = 'true';

            const html = el.innerHTML.trim();
            let parts = [];

            if (html.includes('<br>') || html.includes('<br/>')) {
                parts = html.split(/<br\s*\/?>/i);
            } else {
                parts = [html];
            }

            el.innerHTML = parts
                .filter(p => p.trim() !== '')
                .map(part => `<span class="line-mask"><span class="line-child">${part.trim()}</span></span>`)
                .join('');
        });
    }

    // ================================================
    // HERO ANIMATIONS
    // ================================================
    function initHeroAnimations() {
        const heroTl = gsap.timeline({ defaults: { ease: EASE_OUT } });

        // Ensure navbar starts hidden (with translation) and animate it
        gsap.set('.navbar-wrapper', { opacity: 0, y: -20 });

        heroTl.fromTo('[data-gsap="watermark"]', {
            opacity: 0, scale: 1.1, y: 40,
        }, {
            opacity: 0.18, scale: 1, y: 0, duration: 1.8, visibility: 'visible',
        });

        // Hero container elements fade / slide up
        heroTl.fromTo('.hero-trust-badge, .hero-cta-group, .hero-stats-glass-container', {
            opacity: 0, y: 30,
        }, {
            opacity: 1, y: 0, duration: 1.0, stagger: 0.15, visibility: 'visible',
        }, '-=1.4');

        // Make parent title & subtitle containers visible so line-child elements can slide up through mask
        gsap.set('.hero-title, .hero-subtitle', { opacity: 1, visibility: 'visible' });

        // Line stagger for title & subtitle
        heroTl.fromTo('.hero-title .line-child, .hero-subtitle .line-child', {
            y: '115%', opacity: 0
        }, {
            y: '0%', opacity: 1, duration: 1.2, stagger: 0.15, visibility: 'visible'
        }, '-=1.2');

        heroTl.to('.navbar-wrapper', {
            opacity: 1, y: 0, duration: 0.8, visibility: 'visible'
        }, '-=0.8');

        gsap.to('[data-gsap="watermark"]', {
            y: 120, ease: 'none',
            scrollTrigger: {
                trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5,
            }
        });
    }

    // ================================================
    // SCROLL ANIMATIONS (GSAP)
    // ================================================
    function initScrollAnimations() {
        // Line stagger scroll animations
        document.querySelectorAll('.section-headline, .vision-banner-title, .vision-banner-desc, .footer-cta-text h3').forEach((el) => {
            const lines = el.querySelectorAll('.line-child');
            if (lines.length > 0) {
                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 88%',
                    onEnter: () => {
                        gsap.set(el, { opacity: 1, visibility: 'visible' });
                        gsap.fromTo(lines, { y: '115%', opacity: 0 }, {
                            y: '0%', opacity: 1, duration: 1.2, stagger: 0.14, ease: EASE_OUT, visibility: 'visible'
                        });
                    },
                    once: true
                });
            }
        });

        document.querySelectorAll('[data-gsap="fade"]').forEach((el) => {
            if (el.classList.contains('section-headline') || el.classList.contains('vision-banner-title') || el.classList.contains('vision-banner-desc')) return;
            gsap.fromTo(el, { opacity: 0, y: 40 }, {
                opacity: 1, y: 0, duration: 1, ease: EASE_OUT, visibility: 'visible',
                scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
            });
        });

        document.querySelectorAll('[data-gsap="scale"]').forEach((el) => {
            gsap.fromTo(el, { opacity: 0, scale: 0.94, y: 30 }, {
                opacity: 1, scale: 1, y: 0, duration: 1.2, ease: EASE_OUT, visibility: 'visible',
                scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
            });
        });

        initStaggerGroup('.stats-inline-row', '[data-gsap="stagger-card"]');
        initStaggerGroup('.features-grid', '[data-gsap="stagger-card"]');
        initStaggerGroup('.impact-cards', '[data-gsap="stagger-card"]');
        initStaggerGroup('.modules-grid', '[data-gsap="stagger-card"]');

        document.querySelectorAll('.slider-progress-bar').forEach(bar => {
            if (bar.id === 'stepProgressBar') return;
            const targetWidth = bar.style.width || '50%';
            bar.style.width = '0%';
            ScrollTrigger.create({
                trigger: bar.closest('.slider-progress').parentElement,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(bar, { width: targetWidth, duration: 1.8, ease: EASE_OUT, delay: 0.3 });
                },
                once: true,
            });
        });
    }

    function initStaggerGroup(parentSelector, childSelector) {
        const parent = document.querySelector(parentSelector);
        if (!parent) return;
        const children = parent.querySelectorAll(childSelector);
        if (children.length === 0) return;

        gsap.fromTo(children, { opacity: 0, y: 40 }, {
            opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: EASE_OUT, visibility: 'visible',
            scrollTrigger: { trigger: parent, start: 'top 82%', toggleActions: 'play none none none' }
        });
    }

    // ================================================
    // COUNTER ANIMATION
    // ================================================
    function initCounters() {
        document.querySelectorAll('[data-count]').forEach(el => {
            const finalNum = parseInt(el.getAttribute('data-count'));
            const suffix = el.textContent.replace(/\d+/, '');

            ScrollTrigger.create({
                trigger: el, start: 'top 85%',
                onEnter: () => {
                    gsap.fromTo(el, { innerText: 0 }, {
                        innerText: finalNum, duration: 2, ease: 'power1.out', snap: { innerText: 1 },
                        onUpdate: function () {
                            el.textContent = Math.floor(parseFloat(el.textContent)) + suffix;
                        },
                    });
                },
                once: true,
            });
        });
    }

    // ================================================
    // STEP CHEVRON SLIDER (HOW IT WORKS)
    // ================================================
    function initStepChevronSlider() {
        const wrapper = document.getElementById('stepSliderWrapper');
        const slides = document.querySelectorAll('.step-card--slide');
        const dots = document.querySelectorAll('#sliderDots .dot');
        const btnPrev = document.getElementById('btnPrevStep');
        const btnNext = document.getElementById('btnNextStep');
        const stepProgressBar = document.getElementById('stepProgressBar');
        const currentStepCounter = document.getElementById('currentStepCounter');

        if (!wrapper || slides.length === 0) return;

        let currentIndex = 0;
        const totalSlides = slides.length;
        let autoPlayTimer = null;

        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;

            slides.forEach((slide, idx) => {
                slide.classList.remove('active', 'prev-slide');
                if (idx === index) {
                    slide.classList.add('active');
                } else if (idx === (index - 1 + totalSlides) % totalSlides) {
                    slide.classList.add('prev-slide');
                }
            });

            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === index);
            });

            if (currentStepCounter) {
                currentStepCounter.textContent = `0${index + 1}`;
            }

            if (stepProgressBar) {
                const percentage = ((index + 1) / totalSlides) * 100;
                gsap.to(stepProgressBar, { width: `${percentage}%`, duration: 0.6, ease: EASE_OUT });
            }

            currentIndex = index;
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        function startAutoPlay() {
            stopAutoPlay();
            autoPlayTimer = setInterval(nextSlide, 4000);
        }

        function stopAutoPlay() {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
        }

        startAutoPlay();

        wrapper.addEventListener('mouseenter', stopAutoPlay);
        wrapper.addEventListener('mouseleave', startAutoPlay);

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                nextSlide();
            });
        }

        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                prevSlide();
            });
        }

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                goToSlide(idx);
            });
        });
    }

    // ================================================
    // SCROLL SPY FOR NAVBAR ACTIVE STATES
    // ================================================
    function initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        if (!sections.length || !navLinks.length) return;

        window.addEventListener('scroll', () => {
            let currentSec = '';
            const scrollPos = window.pageYOffset + 140; // Offset for navbar capsule height + padding

            sections.forEach(sec => {
                const top = sec.offsetTop;
                const height = sec.offsetHeight;
                const id = sec.getAttribute('id');
                // Only track sections listed in the navbar
                if (['inicio', 'beneficios', 'plataforma', 'impacto'].includes(id)) {
                    if (scrollPos >= top && scrollPos < top + height) {
                        currentSec = id;
                    }
                }
            });

            if (currentSec) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + currentSec) {
                        link.classList.add('active');
                    }
                });
            } else {
                // If above first section, highlight "inicio"
                navLinks.forEach(link => link.classList.remove('active'));
                const homeLink = document.querySelector('.nav-links a[href="#inicio"]');
                if (homeLink) homeLink.classList.add('active');
            }
        }, { passive: true });
    }

})();
