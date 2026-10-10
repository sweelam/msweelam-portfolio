/* news.js — renders news entries from /data/news.json */

// Project root, resolved from this script's URL so it works from any page.
const NEWS_BASE = new URL('..', document.currentScript.src).href;

function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function renderNews(entries, container) {
    if (!entries.length) {
        container.innerHTML = '<p class="news-empty">No announcements yet.</p>';
        return;
    }

    container.innerHTML = entries.map((entry, i) => {
        const linkHtml = entry.link
            ? `<a href="${entry.link}" target="_blank" rel="noopener noreferrer" class="news-entry-link">
                   ${entry.linkText || 'Read more'}
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
               </a>`
            : '';

        return `
        <article class="news-entry spotlight">
            <p class="news-date"><time datetime="${entry.date}">${formatDate(entry.date)}</time>${i === 0 ? '<span class="news-tag">Latest</span>' : ''}</p>
            <h3>${entry.title}</h3>
            ${entry.body.split('\n').map(p => `<p>${p}</p>`).join('')}
            ${linkHtml}
        </article>`;
    }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('news-list');
    if (!container) return;

    fetch(`${NEWS_BASE}data/news.json`)
        .then(r => {
            if (!r.ok) throw new Error('Failed to load news');
            return r.json();
        })
        .then(data => {
            // Sort newest first
            const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));
            const limit = container.dataset.limit ? parseInt(container.dataset.limit, 10) : 0;
            renderNews(limit ? sorted.slice(0, limit) : sorted, container);
        })
        .catch(() => {
            container.innerHTML = '<p class="news-empty">Could not load announcements.</p>';
        });
});
