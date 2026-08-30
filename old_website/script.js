const nav = document.querySelector('.nav');
const hero = document.querySelector('.hero');
const heroBg = document.querySelector('.hero-bg');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function onScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 45);
  if (heroBg && !reduceMotion) {
    const progress = Math.min(window.scrollY / hero.offsetHeight, 1);
    const scale = 1 + progress * 0.5;
    heroBg.style.transform = `translateY(${window.scrollY * 0.35}px) scale(${scale})`;
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// mobile menu: close after choosing a destination
const mnav = document.querySelector('.mnav');
if (mnav) {
  mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mnav.removeAttribute('open')));
}

// journey section: vertical scroll drives horizontal movement through the scenes,
// then hands off to normal vertical scroll once the last scene is reached
const journey = document.querySelector('.journey');
const journeyTrack = journey?.querySelector('.scene-track');
if (journey && journeyTrack && !reduceMotion && window.matchMedia('(min-width:761px)').matches) {
  let scrollDistance = 0;

  function sizeJourney() {
    scrollDistance = Math.max(journeyTrack.scrollWidth - window.innerWidth + journeyTrack.offsetLeft, 0);
    journey.style.height = `calc(100vh + ${scrollDistance}px)`;
  }

  function driveJourney() {
    if (scrollDistance <= 0) return;
    const top = journey.getBoundingClientRect().top;
    const progress = Math.min(Math.max(-top / scrollDistance, 0), 1);
    journeyTrack.style.transform = `translateX(-${progress * scrollDistance}px)`;
  }

  sizeJourney();
  driveJourney();
  window.addEventListener('resize', () => {
    if (!window.matchMedia('(min-width:761px)').matches) {
      journey.style.height = '';
      journeyTrack.style.transform = '';
      return;
    }
    sizeJourney();
    driveJourney();
  });
  window.addEventListener('scroll', driveJourney, { passive: true });
}

// scroll-triggered reveal animations
const revealTargets = document.querySelectorAll('.reveal, .reveal-fade, .reveal-scale, .stagger');
if (reduceMotion) {
  revealTargets.forEach(el => el.classList.add('in-view'));
} else if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  revealTargets.forEach(el => revealObserver.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('in-view'));
}

// ---- aarti schedule (single source of truth; the static HTML strip is the no-JS fallback) ----
const AARTI_SCHEDULE = [
  { name: 'मंगला आरती', time: '06:00' },
  { name: 'श्रृंगार दर्शन', time: '08:00' },
  { name: 'राजभोग आरती', time: '12:00' },
  { name: 'उत्थापन दर्शन', time: '17:00' },
  { name: 'संध्या आरती', time: '19:00' },
  { name: 'शयन आरती', time: '20:30' },
];
const AARTI_DURATION_MIN = 30; // ponytail: assumed duration; adjust when the actual timings are confirmed

const scheduleStrip = document.querySelector('.schedule-strip');
if (scheduleStrip) {
  const toMin = t => +t.slice(0, 2) * 60 + +t.slice(3);
  const chip = scheduleStrip.querySelector('.aarti-now');

  // re-render entries from data so the strip and the status can never disagree
  scheduleStrip.querySelectorAll('span:not(:first-child)').forEach(s => s.remove());
  AARTI_SCHEDULE.forEach(a => {
    const span = document.createElement('span');
    const b = document.createElement('b');
    b.textContent = a.time;
    span.append(b, ` ${a.name}`);
    scheduleStrip.insertBefore(span, chip);
  });

  function updateAartiChip() {
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    const live = AARTI_SCHEDULE.find(a => mins >= toMin(a.time) && mins < toMin(a.time) + AARTI_DURATION_MIN);
    if (live) {
      chip.textContent = `अभी चल रही है: ${live.name}`;
    } else {
      const next = AARTI_SCHEDULE.find(a => toMin(a.time) > mins);
      if (next) {
        const wait = toMin(next.time) - mins;
        const h = Math.floor(wait / 60);
        const m = wait % 60;
        chip.textContent = `अगली: ${next.name} · ${next.time}` + (wait <= 180 ? ` (${h ? h + ' घं ' : ''}${m} मि में)` : '');
      } else {
        chip.textContent = `अगली: ${AARTI_SCHEDULE[0].name} · कल ${AARTI_SCHEDULE[0].time} बजे`;
      }
    }
    chip.hidden = false;
  }
  updateAartiChip();
  setInterval(updateAartiChip, 30000);
}

document.querySelector('#yr').textContent = new Date().getFullYear();
