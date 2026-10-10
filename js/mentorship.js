/* mentorship.js — data + rendering for the mentorship page */

// ── Courses ───────────────────────────────────────────────
const courses = [
    {
        title: 'Event Driven Architecture "Advanced Patterns and Practices"',
        description: 'Learn how to build Event-Centric Scalable Systems — CQRS, Saga, Outbox, and more.',
        image: '../img/eda.jpeg',
        link: 'https://www.udemy.com/course/eda-advanced-patterns-and-practices/?referralCode=4B1A85E1F31238EF7679'
    },
    {
        title: 'Building Scalable Systems using Spring Boot',
        description: 'Master the art of designing and implementing scalable systems with Spring Boot.',
        image: '../img/scalable-systems.png',
        link: 'https://www.udemy.com/course/building-scalable-systems-using-spring-boot/?referralCode=CB05AE2070DF263B6393'
    },
    {
        title: 'The Ultimate Guide to Backend Development',
        description: 'Become a proficient backend developer with this comprehensive course covering all essential concepts.',
        image: '../img/modern-backend.png',
        link: 'https://www.udemy.com/course/ultimate-backend/?referralCode=3570134DDB42A4CD38A9'
    },
    {
        title: 'API Design and Management',
        description: 'Learn how to design, build, and manage robust APIs for modern applications.',
        image: '../img/api-design.png',
        link: 'https://www.youtube.com/playlist?list=PLgAqrVq84PDcOryFRPZmhXR_FwGauGtyv'
    }
];

function createCourseCard(course) {
    return `
        <a class="course-card spotlight" href="${course.link}" target="_blank" rel="noopener noreferrer">
            <div class="course-card__image">
                <img src="${course.image}" alt="" loading="lazy">
                <span class="course-card__badge">${course.link.includes('youtube') ? 'Free · YouTube' : 'Udemy'}</span>
            </div>
            <div class="course-card__body">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-card__footer">
                    View course
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </div>
            </div>
        </a>`;
}

// ── Books ─────────────────────────────────────────────────
const books = [
    {
        title: 'The Highway Path to Scalable Systems',
        author: 'Mohamed Sweelam & Jasser Mahmoud',
        description: 'A Comprehensive Guide to Architectural Decisions, Principles, and Real-World Case Studies.',
        downloadUrl: 'https://leanpub.com/thehighwaypathtoscalablesystems',
    }
];

function createBookCard(book) {
    return `
        <a class="book-card spotlight" href="${book.downloadUrl}" target="_blank" rel="noopener noreferrer">
            <div class="book-card__cover">
                <img src="../img/book-cover.png" alt="${book.title} cover" loading="lazy">
            </div>
            <div class="book-card__body">
                <h3>${book.title}</h3>
                <p class="book-card__author">by ${book.author}</p>
                <p class="book-card__desc">${book.description}</p>
                <div class="book-card__cta">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Get the Book
                </div>
            </div>
        </a>`;
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Books
    const booksContainer = document.getElementById('books-container');
    if (booksContainer) {
        booksContainer.innerHTML = books.map(createBookCard).join('');
    }

    // Courses carousel
    const coursesTrack = document.getElementById('courses-container');
    if (coursesTrack) {
        coursesTrack.innerHTML = courses.map(createCourseCard).join('');
        initCarousel({
            track:        coursesTrack,
            items:        courses,
            dotsEl:       document.getElementById('courses-dots'),
            prevBtn:      document.getElementById('courses-prev'),
            nextBtn:      document.getElementById('courses-next'),
            cardSelector: '.course-card',
            interval:     10000,
        });
    }

    // Testimonials — shared wall from testimonials.js
    initTestimonialWall(document.getElementById('testimonials-wall'));
});
