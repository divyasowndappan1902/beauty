const fs = require('fs');
let js = fs.readFileSync('animations.js', 'utf8');

const helper = `
    const startFloating = (el, delay = 0) => {
        if (!el) return;
        el.classList.remove('animate-float', 'animate-float-reverse', 'animate-float-slow');
        gsap.to(el, {
            y: -15,
            duration: 3,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            delay: delay
        });
    };
`;

js = js.replace('// --- PAGE SPECIFIC ANIMATIONS ---', '// --- PAGE SPECIFIC ANIMATIONS ---\n' + helper);

js = js.replace(
    /\{ clipPath: 'inset\(0% 0% 0% 0%\)', scale: 1, duration: 1\.5, delay: 0\.4, ease: 'power2\.out'[\s\n]*\}/,
    "{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.5, delay: 0.4, ease: 'power2.out', onComplete: () => startFloating(heroImg) }"
);

js = js.replace(
    /\{ x: 0, opacity: 1, stagger: 0\.2, duration: 1, delay: 0\.4[\s\n]*\}\);/,
    "{ x: 0, opacity: 1, stagger: 0.2, duration: 1, delay: 0.4, onComplete: () => heroImg.forEach(img => startFloating(img)) });"
);

js = js.replace(
    /\{ opacity: 1, scale: 1, duration: 1, delay: 0\.4[\s\n]*\}\);/g,
    "{ opacity: 1, scale: 1, duration: 1, delay: 0.4, onComplete: () => heroImg.forEach(img => startFloating(img)) });"
);

fs.writeFileSync('animations.js', js);
console.log('Restored up-down animation to hero images.');