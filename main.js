// main.js - Core animations and interactions

// 1. Luxury Cosmetics Preloader Dismissal
function dismissPreloader() {
    const preloader = document.getElementById("preloader");
    if (!preloader || preloader.dataset.dismissed) return;
    preloader.dataset.dismissed = "true";

    if (window.gsap) {
        gsap.to(preloader, {
            opacity: 0,
            duration: 0.55,
            ease: "power2.inOut",
            onComplete: () => {
                preloader.remove();
                if (window.ScrollTrigger) ScrollTrigger.refresh();
            }
        });
    } else {
        preloader.style.transition = "opacity 0.55s ease";
        preloader.style.opacity = "0";
        setTimeout(() => {
            preloader.remove();
        }, 550);
    }
}

// Fallback safety timeout so user is never stuck
setTimeout(dismissPreloader, 3500);

window.addEventListener("load", () => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Allow the luxury preloader animation to be clearly visible and enjoyed (~1.8s)
    setTimeout(dismissPreloader, 1800);

    // 2. Headings Scroll Animation (Cosmetics style: elegant fade + slight upward drift)
    const headings = document.querySelectorAll("h1, h2, h3");
    headings.forEach((heading) => {
      // Skip headings inside preloader, hero main, glass cards, and smoky text
      if (heading.closest('#preloader') || heading.closest('main') || heading.closest('.glass-card') || heading.classList.contains('gsap-preloader-text') || heading.classList.contains('smoky-text')) return;
      
      gsap.fromTo(heading, 
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 95%",
            once: true
          }
        }
      );
    });
});

// 3. Global Handler: Redirect all dummy buttons and links to 404.html
document.addEventListener("click", (e) => {
    // Handle links
    const link = e.target.closest("a");
    if (link) {
        // Keep functional dashboard tab switches, history back, and category filters
        if (link.hasAttribute("data-target") || link.classList.contains("nav-link") || link.classList.contains("go-back-btn") || link.classList.contains("category-filter-btn") || link.hasAttribute("data-filter") || link.classList.contains("dashboard-logo") || link.hasAttribute("data-refresh")) {
            return;
        }

        const href = link.getAttribute("href") || "";
        if (href.startsWith("javascript:history") || href.startsWith("javascript:window.history")) {
            return;
        }

        if (href === "#" || href === "" || href === "javascript:void(0)" || href === "javascript:;") {
            e.preventDefault();
            window.location.href = "404.html";
            return;
        }
        return;
    }

    // Handle buttons
    const btn = e.target.closest("button");
    if (btn) {
        // Allow password visibility toggle, go back button, and category filters
        const onclickAttr = btn.getAttribute("onclick") || "";
        if (btn.id === "mobile-menu-toggle" || btn.classList.contains("faq-btn") || btn.id === "dashboard-menu-toggle" || onclickAttr.includes("pwd") || onclickAttr.includes("togglePwd") || onclickAttr.includes("history") || btn.classList.contains("go-back-btn") || btn.classList.contains("category-filter-btn") || btn.hasAttribute("data-filter") || btn.classList.contains("dashboard-logo") || btn.hasAttribute("data-refresh")) {
            return;
        }

        // Allow dashboard tabs if buttons are used
        if (btn.hasAttribute("data-target") || btn.classList.contains("nav-link")) {
            return;
        }

        // Allow form submission on real forms (contact, login, signup)
        const form = btn.closest("form");
        if (form && (form.id === "contact-form" || form.id === "login-form" || form.id === "signup-form" || form.id === "newsletterForm")) {
            if (btn.type === "submit" || btn.id === "contact-submit-btn") {
                return;
            }
        }

        // All other buttons are dummy buttons -> redirect to 404.html
        e.preventDefault();
        window.location.href = "404.html";
    }
});


// Mobile Menu Toggle & Background Scroll Lock Logic
document.addEventListener("DOMContentLoaded", () => {
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    if (!mobileMenuToggle || !mobileMenu) return;

    // Inject styles for locking background scroll while keeping mobile menu scrollable
    if (!document.getElementById("mobile-menu-scroll-lock-styles")) {
        const style = document.createElement("style");
        style.id = "mobile-menu-scroll-lock-styles";
        style.textContent = `
            html.mobile-menu-active,
            body.mobile-menu-active {
                overflow: hidden !important;
                overflow-y: hidden !important;
                touch-action: none !important;
            }
            #mobile-menu {
                overscroll-behavior: contain !important;
                -webkit-overflow-scrolling: touch !important;
                touch-action: pan-y !important;
                max-height: calc(100vh - 70px) !important;
                max-height: calc(100dvh - 70px) !important;
                height: calc(100vh - 70px) !important;
                height: calc(100dvh - 70px) !important;
            }
        `;
        document.head.appendChild(style);
    }

    let isMenuOpen = false;

    // Block touch/wheel events on the background while allowing them inside the menu
    const blockBackgroundScroll = (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            e.preventDefault();
        }
    };

    function openMobileMenu() {
        if (isMenuOpen) return;
        isMenuOpen = true;

        mobileMenu.classList.remove("hidden");
        document.documentElement.classList.add("mobile-menu-active");
        document.body.classList.add("mobile-menu-active");
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        window.addEventListener("touchmove", blockBackgroundScroll, { passive: false });
        window.addEventListener("wheel", blockBackgroundScroll, { passive: false });

        // Update toggle icon to close (X)
        const svgIcon = mobileMenuToggle.querySelector("svg");
        if (svgIcon) {
            svgIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>`;
        }
        mobileMenuToggle.setAttribute("aria-expanded", "true");

        // Stagger animation with GSAP if available
        if (typeof gsap !== "undefined") {
            const links = mobileMenu.querySelectorAll("a");
            gsap.fromTo(links, 
                { opacity: 0, x: -20 }, 
                { opacity: 1, x: 0, stagger: 0.08, duration: 0.35, ease: "power2.out" }
            );
        }
    }

    function closeMobileMenu() {
        if (!isMenuOpen) return;
        isMenuOpen = false;

        mobileMenu.classList.add("hidden");
        document.documentElement.classList.remove("mobile-menu-active");
        document.body.classList.remove("mobile-menu-active");
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";

        window.removeEventListener("touchmove", blockBackgroundScroll, { passive: false });
        window.removeEventListener("wheel", blockBackgroundScroll, { passive: false });

        // Update toggle icon back to hamburger
        const svgIcon = mobileMenuToggle.querySelector("svg");
        if (svgIcon) {
            svgIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>`;
        }
        mobileMenuToggle.setAttribute("aria-expanded", "false");
    }

    mobileMenuToggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close when clicking any link inside the mobile menu
    const menuLinks = mobileMenu.querySelectorAll("a");
    menuLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
        if (isMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isMenuOpen) {
            closeMobileMenu();
        }
    });

    // Close on desktop resize
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768 && isMenuOpen) {
            closeMobileMenu();
        }
    });
});


// Dashboard Mobile Sidebar Toggle Logic
document.addEventListener("DOMContentLoaded", () => {
    const dashboardToggle = document.getElementById("dashboard-menu-toggle");
    const dashboardSidebar = document.getElementById("dashboard-sidebar");
    if (dashboardToggle && dashboardSidebar) {
        dashboardToggle.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            dashboardSidebar.classList.toggle("-translate-x-full");
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener("click", (e) => {
            if (window.innerWidth < 768 && !dashboardSidebar.contains(e.target) && e.target !== dashboardToggle && !dashboardToggle.contains(e.target)) {
                if (!dashboardSidebar.classList.contains("-translate-x-full")) {
                    dashboardSidebar.classList.add("-translate-x-full");
                }
            }
        });
        
        // Close sidebar when a nav link inside it is clicked on mobile
        const sidebarNavLinks = dashboardSidebar.querySelectorAll('.nav-link');
        sidebarNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    dashboardSidebar.classList.add("-translate-x-full");
                }
            });
        });
    }
});



// Replaced by animations.js (AOS and GSAP implementation)
// Note: Accordion logic remains below if needed, but we'll re-implement if necessary.
document.addEventListener("DOMContentLoaded", () => {
    // 2. Accordion Interaction (Ask Our Beauty Experts)
    const faqBtns = document.querySelectorAll('.faq-btn');
    faqBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentItem = btn.closest('.faq-item');
            const currentContent = currentItem.querySelector('.faq-content');
            const currentIcon = btn.querySelector('.faq-icon i');
            const isOpen = currentContent.style.maxHeight !== '0px' && currentContent.style.maxHeight !== '';

            // Close all
            document.querySelectorAll('.faq-content').forEach(content => {
                content.style.maxHeight = '0px';
                const parent = content.closest('.faq-item');
                if(parent) {
                    parent.classList.remove('border-[#C59A65]');
                    parent.classList.add('border-[#38251E]/10');
                }
            });
            document.querySelectorAll('.faq-icon i').forEach(icon => {
                icon.className = 'fa-solid fa-plus';
                icon.parentElement.classList.remove('bg-[#38251E]', 'text-[#FDF9F2]');
                icon.parentElement.classList.add('text-[#38251E]');
            });

            // Open clicked if it was closed
            if (!isOpen) {
                currentContent.style.maxHeight = currentContent.scrollHeight + 'px';
                currentItem.classList.remove('border-[#38251E]/10');
                currentItem.classList.add('border-[#C59A65]');
                currentIcon.className = 'fa-solid fa-minus';
                currentIcon.parentElement.classList.remove('text-[#38251E]');
                currentIcon.parentElement.classList.add('bg-[#38251E]', 'text-[#FDF9F2]');
            }
        });
    });
});
