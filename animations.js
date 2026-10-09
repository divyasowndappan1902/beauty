
document.addEventListener("DOMContentLoaded", () => {
    // Handle prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        document.documentElement.style.scrollBehavior = 'auto';
        document.querySelectorAll('.opacity-0').forEach(el => el.classList.remove('opacity-0', 'translate-y-10', 'scale-95'));
        return; // Skip complex animations
    }

    // Initialize GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    const path = window.location.pathname;
    const isPage = (page) => path.includes(page) || (page === 'index' && (path.endsWith('/') || path.endsWith('beauty')));

    // Clean up tailwind classes that might conflict with GSAP
    document.querySelectorAll('.opacity-0').forEach(el => {
        el.classList.remove('opacity-0', 'translate-y-10', 'scale-95');
        el.style.opacity = '0'; // Let GSAP handle it starting from 0
    });

    // --- GLOBAL ANIMATIONS ---

    // 1. Header scroll shadow
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('shadow-md', 'bg-white/95');
                header.classList.remove('bg-white/80');
            } else {
                header.classList.remove('shadow-md', 'bg-white/95');
                header.classList.add('bg-white/80');
            }
        });
    }

    // 2. Smooth navbar underline
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = path.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('border-b-2', 'border-[#38251E]');
        }
    });

    // 3. Mobile menu GSAP stagger
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden') && typeof gsap !== 'undefined') {
                const links = mobileMenu.querySelectorAll('a');
                gsap.fromTo(links, 
                    { opacity: 0, x: -20 }, 
                    { opacity: 1, x: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out' }
                );
            }
        });
    }

    // 4. Footer subtle fade-up
    const footer = document.querySelector('footer');
    if (footer) {
        footer.setAttribute('data-aos', 'fade-up');
        footer.setAttribute('data-aos-duration', '1000');
        footer.setAttribute('data-aos-anchor-placement', 'top-bottom');
    }

    // 5. Global FAQ Accordion
    const setupAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item, section > div.max-w-4xl > div.space-y-4 > div');
        faqItems.forEach(item => {
            const btn = item.querySelector('button');
            if(!btn) return;
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const content = item.querySelector('div[style], p.hidden, .faq-content') || item.lastElementChild;
                const icon = item.querySelector('svg, .faq-icon');
                
                const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

                // Close all
                document.querySelectorAll('.faq-content, section > div.max-w-4xl > div.space-y-4 > div > div:last-child').forEach(c => {
                    if(c.style) c.style.maxHeight = '0px';
                });
                document.querySelectorAll('.faq-icon, section > div.max-w-4xl > div.space-y-4 > div svg').forEach(i => {
                    if (typeof gsap !== 'undefined') gsap.to(i, { rotation: 0, duration: 0.3 });
                });

                if (!isOpen) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    if (icon && typeof gsap !== 'undefined') {
                        gsap.to(icon, { rotation: 45, duration: 0.3 });
                    }
                }
            });
        });
    };
    setupAccordion();


    // --- PAGE SPECIFIC ANIMATIONS ---

    if (isPage('index')) {
        // Hero
        const heroSection = document.querySelector('main');
        if (heroSection && typeof gsap !== 'undefined') {
            const smokyText = heroSection.querySelectorAll('.smoky-text');
            const otherHeroText = heroSection.querySelectorAll('p, a, button');
            const heroImg = heroSection.querySelector('img');
            
            if (smokyText.length > 0) {
                gsap.fromTo(smokyText, 
                    { opacity: 0, filter: 'blur(12px)', scale: 1.05 }, 
                    { opacity: 1, filter: 'blur(0px)', scale: 1, stagger: 0.2, duration: 1.8, delay: 0.2, ease: 'power2.out' }
                );
            }
            
            if (otherHeroText.length > 0) {
                gsap.fromTo(otherHeroText, 
                    { y: 40, opacity: 0 }, 
                    { y: 0, opacity: 1, stagger: 0.15, duration: 1, delay: 0.6, ease: 'power3.out' }
                );
            }

            if (heroImg) {
                gsap.fromTo(heroImg, 
                    { clipPath: 'inset(20% 20% 20% 20%)', scale: 1.1 }, 
                    { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.5, delay: 0.4, ease: 'power2.out'
                    }
                );
            }
            
            const glassCards = heroSection.querySelectorAll('.glass-card');
            if (glassCards.length > 0) {
                gsap.fromTo(glassCards, 
                    { opacity: 0, y: 20 }, 
                    { opacity: 1, y: 0, duration: 1, delay: 0.8, stagger: 0.2, ease: 'power2.out',
                      onComplete: () => {
                          glassCards.forEach((card, i) => {
                              gsap.to(card, {
                                  y: -12,
                                  duration: 2.2 + (i * 0.4),
                                  yoyo: true,
                                  repeat: -1,
                                  ease: 'sine.inOut'
                              });
                          });
                      }
                    }
                );
            }
        }

        // Shop by Category
        document.querySelectorAll('section:nth-of-type(1) .group').forEach((el, i) => {
            el.setAttribute('data-aos', 'zoom-in');
            el.setAttribute('data-aos-delay', (i * 100).toString());
        });

        // Best Sellers
        const productGrid = document.querySelector('section:nth-of-type(2) .grid');
        if (productGrid && typeof gsap !== 'undefined') {
            const cards = productGrid.querySelectorAll('.group');
            gsap.fromTo(cards, 
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: productGrid, start: 'top 85%' } }
            );
        }

        // Three-Step Glow Routine
        document.querySelectorAll('section:nth-of-type(3) .grid > div').forEach((el, i) => {
            el.setAttribute('data-aos', 'fade-up');
            el.setAttribute('data-aos-delay', (i * 150).toString());
        });

        // Ingredients
        const ingredients = document.querySelectorAll('section:nth-of-type(4) .grid > div');
        ingredients.forEach((el, i) => {
            el.setAttribute('data-aos', i % 2 === 0 ? 'fade-right' : 'fade-left');
        });

        // Promotional Banner
        const promo = document.querySelector('section:nth-of-type(5)');
        if (promo && typeof gsap !== 'undefined') {
            gsap.fromTo(promo, 
                { clipPath: 'inset(0% 100% 0% 0%)' }, 
                { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power3.inOut', scrollTrigger: { trigger: promo, start: 'top 80%' } }
            );
            gsap.fromTo(promo.querySelectorAll('h2, p, a'), 
                { y: 30, opacity: 0 }, 
                { y: 0, opacity: 1, stagger: 0.1, delay: 0.5, duration: 0.8, scrollTrigger: { trigger: promo, start: 'top 80%' } }
            );
        }

        // Testimonials
        document.querySelectorAll('section:nth-of-type(6) .grid > div').forEach((el, i) => {
            el.setAttribute('data-aos', 'fade-up');
            el.setAttribute('data-aos-delay', (i * 100).toString());
        });

        // Sale Countdown
        const countdowns = document.querySelectorAll('section:nth-of-type(7) .font-serif.text-4xl, section:nth-of-type(7) .font-serif.text-5xl');
        if (countdowns.length > 0 && typeof gsap !== 'undefined') {
            gsap.fromTo(countdowns, 
                { scale: 0.5, opacity: 0 }, 
                { scale: 1, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'back.out(1.7)', scrollTrigger: { trigger: countdowns[0].parentElement, start: 'top 90%' } }
            );
        }

        // Social Beauty Gallery
        document.querySelectorAll('section:nth-of-type(8) img').forEach((el, i) => {
            el.setAttribute('data-aos', 'zoom-in');
            el.setAttribute('data-aos-delay', ((i % 4) * 100).toString());
        });
    }

    if (isPage('about')) {
        // Hero
        const heroSection = document.querySelector('section');
        if (heroSection && typeof gsap !== 'undefined') {
            const heroText = heroSection.querySelectorAll('h1, p');
            const heroImg = heroSection.querySelectorAll('img:not([alt*="Logo"]):not(.h-10):not(.h-12)');
            gsap.fromTo(heroText, { x: -30, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.2, duration: 1, delay: 0.2 });
            if (heroImg.length > 0) {
                gsap.fromTo(heroImg, { x: 30, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.2, duration: 1, delay: 0.4
                });
            }
        }

        // Brand History
        const historySection = document.querySelector('section:nth-of-type(2)');
        if (historySection && typeof gsap !== 'undefined') {
            const milestones = historySection.querySelectorAll('.grid > div');
            if (milestones.length > 0) {
                const tl = gsap.timeline({ scrollTrigger: { trigger: historySection, start: 'top 70%' }});
                tl.fromTo(milestones, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.2, duration: 0.8, ease: 'power2.out' });
            }
        }

        // Mission
        const missionImgs = document.querySelectorAll('section:nth-of-type(3) img');
        const missionTexts = document.querySelectorAll('section:nth-of-type(3) h2, section:nth-of-type(3) p');
        if (typeof gsap !== 'undefined' && missionImgs.length > 0) {
            gsap.fromTo(missionImgs, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, scrollTrigger: { trigger: missionImgs[0], start: 'top 80%' }});
            gsap.fromTo(missionTexts, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, scrollTrigger: { trigger: missionTexts[0], start: 'top 80%' }});
        }

        // Values
        document.querySelectorAll('section:nth-of-type(4) .grid > div').forEach((el, i) => {
            el.setAttribute('data-aos', 'fade-up');
            el.setAttribute('data-aos-delay', (i * 100).toString());
        });

        // Formulation Lab
        const formLab = document.querySelector('.formulation-steps-container');
        if (formLab && typeof gsap !== 'undefined') {
            const line = formLab.querySelector('.formulation-line-progress');
            const steps = formLab.querySelectorAll('.formulation-step');
            
            const tl = gsap.timeline({ scrollTrigger: { trigger: formLab, start: 'top 75%' }});
            if (line) {
                line.classList.remove('scale-y-0');
                tl.fromTo(line, { scaleY: 0 }, { scaleY: 1, duration: 1.5, ease: 'power2.inOut', transformOrigin: 'top' }, 0);
            }
            if (steps.length > 0) tl.fromTo(steps, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.3, duration: 0.8, ease: 'power2.out' }, 0.2);
            
            const img = document.querySelector('.formulation-img');
            if (img) gsap.fromTo(img, { opacity: 0, filter: 'blur(10px)' }, { opacity: 1, filter: 'blur(0px)', duration: 1.5, scrollTrigger: { trigger: img, start: 'top 80%' }});
        }

        // Beauty by Numbers
        const counters = document.querySelectorAll('.counter, .counter-float');
        counters.forEach(c => {
            const targetStr = c.getAttribute('data-target');
            if(!targetStr) return;
            const target = parseFloat(targetStr);
            if (isNaN(target)) return;
            const isFloat = c.classList.contains('counter-float');
            
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(c, { innerHTML: 0 }, {
                    innerHTML: target,
                    duration: 2,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: c, start: 'top 90%', once: true },
                    modifiers: {
                        innerHTML: function(i) {
                            return isFloat ? parseFloat(i).toFixed(1) : Math.ceil(i).toLocaleString();
                        }
                    }
                });
            }
            c.closest('.stat-card')?.setAttribute('data-aos', 'zoom-in');
        });
    }

    if (isPage('services')) {
        // Hero
        const heroSection = document.querySelector('section');
        if (heroSection && typeof gsap !== 'undefined') {
            gsap.fromTo(heroSection.querySelectorAll('h1, p'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.2, duration: 1, delay: 0.2 });
            const heroImg = heroSection.querySelectorAll('img:not([alt*="Logo"]):not(.h-10):not(.h-12)');
            if (heroImg.length > 0) {
                gsap.fromTo(heroImg, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1, delay: 0.4
                });
            }
        }

        // Six Services
        document.querySelectorAll('section:nth-of-type(2) .grid > div').forEach((el, i) => {
            el.setAttribute('data-aos', 'fade-up');
            el.setAttribute('data-aos-delay', (i * 100).toString());
        });

        // Personal Beauty Consultation
        const consult = document.querySelector('section:nth-of-type(3)');
        if (consult) {
            consult.querySelectorAll('img').forEach(img => img.setAttribute('data-aos', 'fade-right'));
            consult.querySelectorAll('h2, p, ul > li').forEach((el, i) => {
                el.setAttribute('data-aos', 'fade-left');
                el.setAttribute('data-aos-delay', (i * 50).toString());
            });
        }

        // Bridal
        const bridal = document.querySelector('section:nth-of-type(4)');
        if (bridal) {
            bridal.querySelectorAll('img').forEach(img => img.setAttribute('data-aos', 'zoom-in'));
            bridal.querySelectorAll('h2, p, a').forEach((el, i) => {
                el.setAttribute('data-aos', 'fade-up');
                el.setAttribute('data-aos-delay', (i * 100).toString());
            });
        }

        // Team - Image Reveal Animation
        const teamCards = document.querySelectorAll('section:nth-of-type(5) .team-card');
        if (teamCards.length > 0 && typeof gsap !== 'undefined') {
            teamCards.forEach((card, i) => {
                const img = card.querySelector('img');
                const imgWrapper = img ? img.parentElement : null;
                const info = card.querySelector('.info');
                
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%'
                    }
                });

                if (imgWrapper && img) {
                    tl.fromTo(imgWrapper, 
                        { clipPath: 'inset(100% 0% 0% 0%)' }, 
                        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power3.inOut' }
                    );
                    tl.fromTo(img, 
                        { scale: 1.2 }, 
                        { scale: 1, duration: 1.2, ease: 'power3.out' },
                        "<"
                    );
                }
                
                if (info) {
                    tl.fromTo(info, 
                        { y: 30, opacity: 0 }, 
                        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
                        "-=0.6"
                    );
                }
            });
        }

        // Beauty Journey
        const journeyLab = document.querySelector('.journey-timeline-container');
        if (journeyLab && typeof gsap !== 'undefined') {
            const line = journeyLab.querySelector('.journey-line-progress');
            const lineMobile = document.querySelectorAll('.journey-line-progress')[1];
            const steps = journeyLab.querySelectorAll('.journey-step');
            
            const tl = gsap.timeline({ scrollTrigger: { trigger: journeyLab, start: 'top 75%' }});
            if (line) {
                line.classList.remove('scale-y-0');
                tl.fromTo([line, lineMobile], { scaleY: 0 }, { scaleY: 1, duration: 2, ease: 'power2.inOut', transformOrigin: 'top' }, 0);
            }
            if (steps.length > 0) tl.fromTo(steps, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.4, duration: 0.8, ease: 'power2.out' }, 0.2);
        }

        // Beauty Transformations
        document.querySelectorAll('.transform-card').forEach((el, i) => {
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(el, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' }});
            }
        });

        // CTA
        const cta = document.querySelector('section:last-of-type');
        if (cta && typeof gsap !== 'undefined') {
            gsap.fromTo(cta, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, scrollTrigger: { trigger: cta, start: 'top 80%' }});
        }
    }

    if (isPage('blog')) {
        // Hero
        const heroSection = document.querySelector('section');
        if (heroSection && typeof gsap !== 'undefined') {
            gsap.fromTo(heroSection.querySelectorAll('h1, p'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.2, duration: 1, delay: 0.2 });
            const heroImg = heroSection.querySelectorAll('img:not([alt*="Logo"]):not(.h-10):not(.h-12)');
            if (heroImg.length > 0) {
                gsap.fromTo(heroImg, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1, delay: 0.4
                });
            }
        }

        // Featured Story
        const featured = document.querySelector('section:nth-of-type(2)');
        if (featured && typeof gsap !== 'undefined') {
            const img = featured.querySelector('img');
            if (img) gsap.fromTo(img, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: featured, start: 'top 80%' }});
            const texts = featured.querySelectorAll('.uppercase, h2, p, .flex');
            gsap.fromTo(texts, { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, delay: 0.3, scrollTrigger: { trigger: featured, start: 'top 80%' }});
        }

        // Latest Articles
        document.querySelectorAll('section:nth-of-type(3) .grid > article').forEach((el, i) => {
            el.setAttribute('data-aos', 'fade-up');
            el.setAttribute('data-aos-delay', (i * 100).toString());
        });

        // Category Filters
        const filters = document.querySelectorAll('section:nth-of-type(3) .flex-wrap > a');
        if (filters.length > 0 && typeof gsap !== 'undefined') {
            gsap.fromTo(filters, { opacity: 0, x: -10 }, { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, scrollTrigger: { trigger: filters[0].parentElement, start: 'top 85%' }});
        }

        // Beauty Guides
        const guides = document.querySelectorAll('.guide-card');
        if (guides.length > 0 && typeof gsap !== 'undefined') {
            gsap.fromTo(guides, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.2, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: guides[0].parentElement, start: 'top 80%' }});
        }
    }

    if (isPage('contact')) {
        // Hero
        const heroSection = document.querySelector('section');
        if (heroSection && typeof gsap !== 'undefined') {
            gsap.fromTo(heroSection.querySelectorAll('h1, p'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.2, duration: 1, delay: 0.2 });
            const heroImg = heroSection.querySelectorAll('img:not([alt*="Logo"]):not(.h-10):not(.h-12)');
            if (heroImg.length > 0) {
                gsap.fromTo(heroImg, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1, delay: 0.4
                });
            }
        }

        // Contact Form
        const form = document.querySelector('form');
        if (form) {
            form.setAttribute('data-aos', 'fade-up');
            form.setAttribute('data-aos-duration', '800');
        }

        // Contact Details
        document.querySelectorAll('.space-y-8 > div').forEach((el, i) => {
            el.setAttribute('data-aos', 'fade-left');
            el.setAttribute('data-aos-delay', (i * 150).toString());
        });

        // Contact Info Cards (Visit us, Call us, Email, Opening hours)
        document.querySelectorAll('div.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4 > div').forEach((el, i) => {
            el.setAttribute('data-aos', 'fade-up');
            el.setAttribute('data-aos-delay', (i * 100).toString());
            el.setAttribute('data-aos-duration', '800');
        });

        // Map
        const map = document.querySelector('iframe');
        if (map) {
            map.parentElement.setAttribute('data-aos', 'fade-in');
        }
    }

    // --- FINALLY INITIALIZE AOS ---
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            offset: 50,
            duration: 800,
            easing: 'ease-out-cubic'
        });
        
        // Refresh ScrollTrigger and AOS after a small delay to handle layout shifts
        setTimeout(() => {
            AOS.refresh();
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        }, 500);
    }
});
