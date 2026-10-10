/* main.js — shared across all pages */

// Tells the inline head script that JS is running (it un-hides reveal content otherwise).
window.siteReady = true;

const EMAIL = 'md.sweelam@gmail.com';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Theme ─────────────────────────────────────────────────
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

function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
}

// Circular reveal from the toggle where View Transitions are supported.
function toggleTheme(origin) {
    const next = !isDark();
    const commit = () => {
        applyTheme(next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
    };

    if (!document.startViewTransition || reducedMotion) {
        commit();
        return;
    }

    const rect = origin ? origin.getBoundingClientRect() : null;
    const x = rect ? rect.left + rect.width / 2 : innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : 0;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    document.startViewTransition(commit).ready.then(() => {
        document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 550, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' }
        );
    });
}

// ── Toast ─────────────────────────────────────────────────
let toastTimer = null;
function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span></span>`;
    toast.querySelector('span').textContent = message;
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

function copyEmail(button) {
    const done = () => {
        showToast('Email copied to clipboard');
        if (button) {
            button.classList.add('is-copied');
            setTimeout(() => button.classList.remove('is-copied'), 2000);
        }
    };
    if (navigator.clipboard) {
        navigator.clipboard.writeText(EMAIL).then(done, () => { location.href = `mailto:${EMAIL}`; });
    } else {
        location.href = `mailto:${EMAIL}`;
    }
}

// ── Command palette ───────────────────────────────────────
const ICONS = {
    hash:   '<path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3 8 21"/><path d="M16 3l-2 18"/>',
    page:   '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>',
    theme:  '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    copy:   '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    mail:   '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    ext:    '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
};

const svg = (name, size = 16) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

function goToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    else location.href = `/#${id}`;
}

const openUrl = url => window.open(url, '_blank', 'noopener');

const COMMANDS = [
    { group: 'Navigate', label: 'About',                  icon: 'hash', run: () => goToSection('about') },
    { group: 'Navigate', label: 'Services',               icon: 'hash', run: () => goToSection('services') },
    { group: 'Navigate', label: 'Books',                  icon: 'hash', run: () => goToSection('books') },
    { group: 'Navigate', label: 'Online courses',         icon: 'hash', run: () => goToSection('courses') },
    { group: 'Navigate', label: 'Testimonials',           icon: 'hash', run: () => goToSection('testimonials') },
    { group: 'Navigate', label: 'Latest news',            icon: 'hash', run: () => goToSection('news') },
    { group: 'Pages',    label: 'Mentorship program',     icon: 'page', run: () => { location.href = '/mentorship/'; } },
    { group: 'Pages',    label: 'All news & announcements', icon: 'page', run: () => { location.href = '/news/'; } },
    { group: 'Actions',  label: 'Toggle dark mode',       icon: 'theme', run: () => toggleTheme(document.getElementById('theme-toggle')) },
    { group: 'Actions',  label: 'Copy email address',     icon: 'copy', hint: EMAIL, run: () => copyEmail() },
    { group: 'Actions',  label: 'Send an email',          icon: 'mail', run: () => { location.href = `mailto:${EMAIL}`; } },
    { group: 'Links',    label: 'Blog',                   icon: 'ext', hint: 'blog.msweelam.dev', run: () => openUrl('https://blog.msweelam.dev') },
    { group: 'Links',    label: 'Get the book on Leanpub', icon: 'ext', run: () => openUrl('https://leanpub.com/thehighwaypathtoscalablesystems') },
    { group: 'Links',    label: 'GitHub',                 icon: 'ext', run: () => openUrl('https://github.com/sweelam') },
    { group: 'Links',    label: 'LinkedIn',               icon: 'ext', run: () => openUrl('https://www.linkedin.com/in/mohamedsweelam') },
    { group: 'Links',    label: 'YouTube channel',        icon: 'ext', run: () => openUrl('https://www.youtube.com/@ArabSoftwareArchTalks') },
];

function initCommandPalette() {
    const dialog = document.createElement('dialog');
    dialog.className = 'cmdk';
    dialog.setAttribute('aria-label', 'Command menu');
    dialog.innerHTML = `
        <div class="cmdk__search">
            ${svg('search', 18)}
            <input class="cmdk__input" type="text" placeholder="Type a command or search…" aria-label="Search commands"
                role="combobox" aria-expanded="true" aria-controls="cmdk-list" autocomplete="off" spellcheck="false">
            <kbd>esc</kbd>
        </div>
        <ul class="cmdk__list" id="cmdk-list" role="listbox"></ul>
        <div class="cmdk__foot">
            <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
            <span><kbd>↵</kbd> select</span>
            <span><kbd>esc</kbd> close</span>
        </div>`;
    document.body.appendChild(dialog);

    const input = dialog.querySelector('.cmdk__input');
    const list  = dialog.querySelector('.cmdk__list');
    let results = [];
    let active = 0;

    function render() {
        const q = input.value.trim().toLowerCase();
        results = COMMANDS.filter(c => !q || `${c.group} ${c.label} ${c.hint || ''}`.toLowerCase().includes(q));
        active = Math.min(active, Math.max(results.length - 1, 0));

        if (!results.length) {
            list.innerHTML = `<li class="cmdk__empty">No results for “${input.value.replace(/[<>&]/g, '')}”</li>`;
            input.removeAttribute('aria-activedescendant');
            return;
        }

        let html = '';
        let lastGroup = '';
        results.forEach((c, i) => {
            if (c.group !== lastGroup) {
                html += `<li class="cmdk__group" role="presentation">${c.group}</li>`;
                lastGroup = c.group;
            }
            html += `<li class="cmdk__item" id="cmdk-${i}" role="option" data-index="${i}" aria-selected="${i === active}">
                ${svg(c.icon)}<span>${c.label}</span>${c.hint ? `<span class="cmdk__hint">${c.hint}</span>` : ''}
            </li>`;
        });
        list.innerHTML = html;
        input.setAttribute('aria-activedescendant', `cmdk-${active}`);
    }

    function setActive(i) {
        if (!results.length) return;
        active = (i + results.length) % results.length;
        list.querySelectorAll('.cmdk__item').forEach(el =>
            el.setAttribute('aria-selected', String(Number(el.dataset.index) === active)));
        input.setAttribute('aria-activedescendant', `cmdk-${active}`);
        const el = list.querySelector(`[data-index="${active}"]`);
        if (el) el.scrollIntoView({ block: 'nearest' });
    }

    function run(i) {
        const cmd = results[i];
        if (!cmd) return;
        dialog.close();
        cmd.run();
    }

    function open() {
        if (dialog.open) return;
        input.value = '';
        active = 0;
        render();
        dialog.showModal();
        input.focus();
    }

    input.addEventListener('input', () => { active = 0; render(); });
    input.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
        else if (e.key === 'Enter') { e.preventDefault(); run(active); }
    });
    list.addEventListener('click', e => {
        const item = e.target.closest('.cmdk__item');
        if (item) run(Number(item.dataset.index));
    });
    list.addEventListener('mousemove', e => {
        const item = e.target.closest('.cmdk__item');
        if (item && Number(item.dataset.index) !== active) setActive(Number(item.dataset.index));
    });
    // Close on backdrop click
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

    document.addEventListener('keydown', e => {
        const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            dialog.open ? dialog.close() : open();
        } else if (e.key === '/' && !typing && !dialog.open) {
            e.preventDefault();
            open();
        }
    });

    document.querySelectorAll('[data-cmdk-open]').forEach(btn => btn.addEventListener('click', open));

    // Show the right modifier key
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) {
        document.querySelectorAll('.kbd-mod').forEach(k => { k.textContent = 'Ctrl K'; });
    }
}

// ── Page init ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // Theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(savedTheme === 'dark' || (!savedTheme && prefersDark));

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) themeToggle.addEventListener('click', () => toggleTheme(themeToggle));

    // Mobile nav
    const toggle   = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (toggle && navLinks) {
        const close = () => {
            navLinks.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        };
        toggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
        });
        navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
        document.addEventListener('click', e => {
            if (!toggle.contains(e.target) && !navLinks.contains(e.target)) close();
        });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    }

    // Header state, scroll progress, back-to-top
    const header   = document.querySelector('.site-header');
    const progress = document.querySelector('.scroll-progress');
    const toTop    = document.querySelector('.to-top');
    let ticking = false;

    const onScroll = () => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - innerHeight;
        if (header)   header.classList.toggle('is-scrolled', y > 8);
        if (progress) progress.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
        if (toTop)    toTop.classList.toggle('is-visible', y > 900);
        ticking = false;
    };
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();

    if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));

    // Scrollspy — highlight the nav link for the section in view
    const spyLinks = navLinks ? [...navLinks.querySelectorAll('a[href^="#"]')] : [];
    const spyTargets = spyLinks
        .map(a => document.getElementById(a.getAttribute('href').split('#')[1]))
        .filter(Boolean);
    if (spyTargets.length && 'IntersectionObserver' in window) {
        const spy = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                spyLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href').endsWith(`#${entry.target.id}`)));
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        spyTargets.forEach(t => spy.observe(t));
    }

    // Reveal on scroll (staggered within [data-stagger] parents)
    document.querySelectorAll('[data-stagger]').forEach(group => {
        [...group.querySelectorAll(':scope > [data-reveal]')].forEach((el, i) => el.style.setProperty('--delay', `${i * 80}ms`));
    });
    const revealEls = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window && !reducedMotion) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-visible'));
    }

    // Count-up numbers
    const counters = document.querySelectorAll('[data-count]');
    const runCount = el => {
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        if (reducedMotion) { el.textContent = target + suffix; return; }
        const start = performance.now();
        const duration = 1400;
        const tick = now => {
            const t = Math.min((now - start) / duration, 1);
            el.textContent = Math.round(target * (1 - Math.pow(1 - t, 4))) + suffix;
            if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };
    if (counters.length && 'IntersectionObserver' in window) {
        const cio = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { runCount(entry.target); cio.unobserve(entry.target); }
            });
        }, { threshold: 0.6 });
        counters.forEach(el => cio.observe(el));
    }

    // Rotating headline words
    document.querySelectorAll('.rotator').forEach(rotator => {
        const words = [...rotator.querySelectorAll('.rotator__word')];
        if (words.length < 2 || reducedMotion) return;
        let i = 0;
        setInterval(() => {
            const current = words[i];
            i = (i + 1) % words.length;
            current.classList.remove('is-active');
            current.classList.add('is-leaving');
            words[i].classList.remove('is-leaving');
            words[i].classList.add('is-active');
            setTimeout(() => current.classList.remove('is-leaving'), 700);
        }, 2800);
    });

    // Cursor spotlight on cards
    document.addEventListener('pointermove', e => {
        const card = e.target.closest && e.target.closest('.spotlight');
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });

    // Copy email buttons
    document.querySelectorAll('[data-copy-email]').forEach(btn =>
        btn.addEventListener('click', () => copyEmail(btn)));

    // Current year
    document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

    initCommandPalette();

    // Visitor counter (Cloudflare Worker at /api)
    // One POST per page view (it increments the count); the result feeds the
    // footer badge and any [data-visitors] stat. Both stay hidden when the API
    // isn't reachable (e.g. local dev).
    const visitorCount = document.getElementById('visitor-count');
    const visitorStats = document.querySelectorAll('[data-visitors]');
    if (visitorCount || visitorStats.length) {
        const countUp = (el, value, duration = 1200) => {
            if (reducedMotion) {
                el.textContent = value.toLocaleString();
                return;
            }
            const start = performance.now();
            const tick = (now) => {
                const t = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - t, 3);
                el.textContent = Math.round(value * eased).toLocaleString();
                if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };

        // Off the live site (localhost, file://) the API doesn't exist, so show a
        // clearly-labelled sample value instead — the real count only loads on msweelam.dev.
        const isLive = /(^|\.)msweelam\.dev$/.test(location.hostname);
        const PREVIEW_VISITORS = 1234;

        fetch('/api/visitors', { method: 'POST' })
            .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
            .catch(err => {
                if (isLive) throw err;
                document.querySelectorAll('[data-visitors-label]').forEach(el => { el.textContent = '(local preview)'; });
                return { visitors: PREVIEW_VISITORS, preview: true };
            })
            .then(({ visitors, preview }) => {
                if (visitorCount) {
                    const dot = document.createElement('span');
                    dot.className = 'visitor-count__dot';
                    dot.setAttribute('aria-hidden', 'true');
                    const num = document.createElement('strong');
                    num.className = 'visitor-count__num';
                    const label = document.createElement('span');
                    label.textContent = (visitors === 1 ? 'visitor' : 'visitors') + (preview ? ' (local preview)' : '');
                    visitorCount.replaceChildren(dot, num, label);
                    visitorCount.hidden = false;
                    countUp(num, visitors);
                }
                visitorStats.forEach(el => {
                    const wrap = el.closest('[data-visitors-wrap]');
                    if (wrap) wrap.hidden = false;
                    countUp(el, visitors, 1400);
                });
            })
            .catch(() => {});
    }

});

// ── Carousel ─────────────────────────────────────────────
// Called after the track is populated.
function initCarousel({ track, items, dotsEl, prevBtn, nextBtn, cardSelector, interval = 3000 }) {
    const totalSlides = items.length;
    let currentIndex = 0;
    let autoplayTimer = null;

    // Double cards for seamless loop
    const existingCards = track.querySelectorAll(cardSelector);
    if (existingCards.length === totalSlides) {
        existingCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            clone.setAttribute('tabindex', '-1');
            track.appendChild(clone);
        });
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
        outer.addEventListener('focusin', () => clearInterval(autoplayTimer));
        outer.addEventListener('focusout', startAutoplay);
    }

    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); restartAutoplay(); }
    });

    window.addEventListener('resize', () => goTo(currentIndex, false));

    function startAutoplay() {
        clearInterval(autoplayTimer);
        if (!reducedMotion) autoplayTimer = setInterval(next, interval);
    }
    function restartAutoplay() { startAutoplay(); }

    startAutoplay();
}
