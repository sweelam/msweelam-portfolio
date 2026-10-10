/* main.js — shared across all pages */

// ── Theme toggle ──────────────────────────────────────────
function applyTheme(dark) {
    const html = document.documentElement;
    if (dark) {
        html.setAttribute('data-theme', 'dark');
    } else {
        html.removeAttribute('data-theme');
    }
    document.querySelectorAll('.site-logo').forEach(img => {
        img.src = dark ? img.dataset.dark : img.dataset.light;
    });
}

document.addEventListener('DOMContentLoaded', () => {

    // ── Theme toggle ──────────────────────────────────────
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(savedTheme === 'dark' || (!savedTheme && prefersDark));

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const nowDark = document.documentElement.getAttribute('data-theme') === 'dark';
            applyTheme(!nowDark);
            localStorage.setItem('theme', !nowDark ? 'dark' : 'light');
        });
    }

    // ── Mobile nav toggle ─────────────────────────────────
    const toggle  = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
        });

        // Close when clicking a nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ── Smooth scrolling for anchor links ─────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ── Schedule dropdowns (mentorship page) ──────────────
    document.querySelectorAll('.dropdown-toggle').forEach(button => {
        button.addEventListener('click', () => {
            button.parentElement.classList.toggle('open');
        });
    });

    // ── Visitor counter (Cloudflare Worker at /api) ───────
    // Stays hidden when the API isn't reachable (e.g. local dev).
    const visitorCount = document.getElementById('visitor-count');
    if (visitorCount) {
        fetch('/api/visitors', { method: 'POST' })
            .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
            .then(({ visitors }) => {
                const dot = document.createElement('span');
                dot.className = 'visitor-count__dot';
                dot.setAttribute('aria-hidden', 'true');
                const num = document.createElement('strong');
                num.className = 'visitor-count__num';
                const label = document.createElement('span');
                label.textContent = visitors === 1 ? 'visitor' : 'visitors';
                visitorCount.replaceChildren(dot, num, label);
                visitorCount.hidden = false;

                // Count up from 0, unless the user prefers reduced motion.
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    num.textContent = visitors.toLocaleString();
                    return;
                }
                const duration = 1200;
                const start = performance.now();
                const tick = (now) => {
                    const t = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - t, 3);
                    num.textContent = Math.round(visitors * eased).toLocaleString();
                    if (t < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            })
            .catch(() => {});
    }

});

// ── Carousel ─────────────────────────────────────────────
// Used by mentorship page. Called after track is populated.
function initCarousel({ track, items, dotsEl, prevBtn, nextBtn, cardSelector, interval = 3000 }) {
    const totalSlides = items.length;
    let currentIndex = 0;
    let autoplayTimer = null;

    // Double cards for seamless loop
    const existingCards = track.querySelectorAll(cardSelector);
    if (existingCards.length === totalSlides) {
        existingCards.forEach(card => track.appendChild(card.cloneNode(true)));
    }

    function getCardWidth() {
        const card = track.querySelector(cardSelector);
        if (!card) return 0;
        const gap = parseFloat(getComputedStyle(track).gap) || 20;
        return card.offsetWidth + gap;
    }

    function goTo(index, animate = true) {
        currentIndex = index;
        track.style.transition = animate ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        track.style.transform = `translateX(-${getCardWidth() * currentIndex}px)`;
        updateDots();
    }

    function next() {
        const nextIndex = currentIndex + 1;
        goTo(nextIndex);
        if (nextIndex >= totalSlides) setTimeout(() => goTo(0, false), 650);
    }

    function prev() {
        goTo(currentIndex <= 0 ? totalSlides - 1 : currentIndex - 1);
    }

    if (dotsEl) {
        dotsEl.innerHTML = items.map((_, i) =>
            `<button class="carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`
        ).join('');
        dotsEl.querySelectorAll('.carousel-dot').forEach(dot => {
            dot.addEventListener('click', () => { goTo(parseInt(dot.dataset.index, 10)); restartAutoplay(); });
        });
    }

    function updateDots() {
        if (!dotsEl) return;
        const norm = currentIndex % totalSlides;
        dotsEl.querySelectorAll('.carousel-dot').forEach((dot, i) =>
            dot.classList.toggle('active', i === norm)
        );
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); restartAutoplay(); });

    const outer = track.closest('.carousel-outer');
    if (outer) {
        outer.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
        outer.addEventListener('mouseleave', startAutoplay);
    }

    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); restartAutoplay(); }
    });

    window.addEventListener('resize', () => goTo(currentIndex, false));

    function startAutoplay()   { autoplayTimer = setInterval(next, interval); }
    function restartAutoplay() { clearInterval(autoplayTimer); startAutoplay(); }

    startAutoplay();
}
