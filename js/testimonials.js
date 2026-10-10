/* testimonials.js — data + renderers shared by the homepage and mentorship page.
   To add a testimonial: append a new object to the array below.               */

const testimonials = [
    {
        name:  'Mahmoud Hossam',
        role:  'Senior Software Engineer',
        image: 'img/mahmoud-photo.jpg',
        text:  'والله الواحد في قمة سعادته ان حضرتك المنتور بتاعه ... شكرا جدا ليك يا باش مهندس محمد سويلم.'
    },
    {
        name:  'Mahmoud Hossam',
        role:  'Senior Software Engineer',
        image: 'img/mahmoud-photo.jpg',
        text:  'سلام عليكم يبشمهندس .... انا بكلم حضرتك عشان اقولك ان التيم ليدر بتاعى خلانى اعمل architecture لبروجكت هيتعمل والحمدلله عملت كل حاجه زى ما هو طلب وكمان عملت HLD وورتهوله وابتدينا فيه وكان مبسوط جدا — فانا حابب اشكر حضرتك عشان حضرتك اللى علمتنى كده.'
    },
    {
        name:  'Abdelrahman Abdelnasser',
        role:  'ACPC Finalist',
        image: 'img/abdelrhman-abdelnasser-photo.jpg',
        text:  'With great pride and pleasure, I announce my commencement in a special mentorship program with Engineer Mohamed Sweelam. I am committed to giving my best effort and working diligently to achieve continuous development and success.'
    },
    {
        name:  'Hossam Hamdy',
        role:  'Software Engineer',
        image: 'img/hossam-hamdy-photo.jpg',
        text:  'بخص الشكر البشمهندس العظيم محمد سويلم انه قبلنى معاه فى المينتورشيب واللي بيساعدنى فيها اتعلم كل ما يخص التيكنولوجى وحرصه المستمر على اختصار الطريق عليا واهتمامه لنقل خبرات وتجارب سنين.'
    },
    {
        name:  'Danny Khreet',
        role:  'Team Leader',
        image: 'img/danny-khreet.jpg',
        text:  'I just wrapped up an amazing training on modern backend development. Mohamed has a way of breaking down complex topics into simple, actionable insights that really stick. It wasn\'t just about learning new tools — it was about understanding how to build better systems and think like a true developer.'
    },
    {
        name:  'Ibrahim Megahed',
        role:  'Senior Software Engineer',
        image: 'img/ibrahim-megahed.jpg',
        text:  'كنت واحد من اللي حضروا التدريب واتبسطت بالمحتوى وفعلا كان في حاجات اول مرة اسمع عنها في ال Distributed Systems وفتحتلى افاق. جزاك الله خيرا على وقتك وترتيبك للمحتوى وصبرك.'
    },
    {
        name:  'Taher Mahmoud',
        role:  'Software Engineer',
        image: 'img/taher-mahmoud.jpg',
        text:  'I recently attended the Modern Backend Development Training, and it was an absolutely exceptional experience! Mohamed Sweelam has a remarkable ability to break down complex and challenging concepts into simple, digestible explanations.'
    },
    {
        name:  'Mohamed Warda',
        role:  'Software Engineer',
        image: 'img/warda-photo.jpg',
        text:  '"Having a mentor is like having a compass in the wilderness." I\'m immensely grateful to have Eng. Mohamed Sweelam as my Mentor — his willingness to share his expertise and invest his time has made a profound impact on both my career and personal development.'
    },
    {
        name:  'Ahmed Adel',
        role:  'Software Engineer',
        image: 'img/ahmed-adel-photo.jpg',
        text:  'I\'m excited to announce that I\'ve started a mentorship program with Engineer Mohamed Sweelam. I am dedicated to giving my best effort to achieve continuous growth and success.'
    },
    {
        name:  'Mohamed Essam',
        role:  'Java Developer',
        image: 'img/mohamed-essam-photo.jpg',
        text:  'I\'m thrilled to announce that I\'ve started a mentorship program with Eng. Mohamed Sweelam. I hope I get the most out of this program — it will be a great milestone in my career.'
    },
    {
        name:  'Abdulaziz Al Hariri',
        role:  'Software Engineer',
        image: 'img/abdulaziz-alhariri.jpg',
        text:  'يشرفني أن أتقدم بخالص شكري وامتناني للأستاذ Mohamed Sweelam على الاستشارة الرائعة. الأستاذ محمد له باع طويل في المجال وصاحب جهود مباركة في نشر العلم ومشاركة خبراته على يوتيوب.'
    }
];

// Project root, resolved from this script's URL so images load from any page (and file://).
const ASSET_BASE = new URL('..', document.currentScript.src).href;

const QUOTE_ICON = '<svg class="testimonial-quote" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.6 6C6.5 7.3 4.5 10 4.5 13.6V18h5.4v-5.4H7.2c0-2 1.2-3.6 3.3-4.5L9.6 6Zm9 0c-3.1 1.3-5.1 4-5.1 7.6V18h5.4v-5.4h-2.7c0-2 1.2-3.6 3.3-4.5L18.6 6Z"/></svg>';

// Arabic quotes render right-to-left so punctuation and mixed English land correctly.
const isRtl = text => /[\u0600-\u06FF]/.test(text.slice(0, 40));

function createTestimonialCard(t, hidden = false) {
    return `
        <figure class="testimonial-card spotlight"${hidden ? ' aria-hidden="true"' : ''}>
            ${QUOTE_ICON}
            <blockquote class="testimonial-text" dir="${isRtl(t.text) ? 'rtl' : 'ltr'}"${isRtl(t.text) ? ' lang="ar"' : ''}>${t.text}</blockquote>
            <figcaption class="testimonial-header">
                <img src="${ASSET_BASE}${t.image}" alt="" class="testimonial-image" loading="lazy" width="40" height="40">
                <div class="testimonial-info">
                    <h3>${t.name}</h3>
                    <p>${t.role}</p>
                </div>
                <div class="testimonial-rating" role="img" aria-label="5 out of 5 stars">★★★★★</div>
            </figcaption>
        </figure>`;
}

// Two rows of cards drifting in opposite directions. Each track is rendered
// twice so the loop is seamless; the copy is hidden from assistive tech.
function initTestimonialWall(container, items = testimonials) {
    if (!container) return;
    const half = Math.ceil(items.length / 2);
    const rows = [items.slice(0, half), items.slice(half)];

    container.innerHTML = rows.map((row, r) => {
        const cards = row.map(t => createTestimonialCard(t)).join('');
        const copy  = row.map(t => createTestimonialCard(t, true)).join('');
        const duration = `${row.length * 9}s`;
        return `
            <div class="wall__row${r % 2 ? ' wall__row--reverse' : ''}" style="--marquee-duration:${duration}">
                <div class="wall__track">${cards}</div>
                <div class="wall__track" aria-hidden="true">${copy}</div>
            </div>`;
    }).join('');
}
