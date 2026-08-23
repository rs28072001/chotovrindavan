const nav = document.querySelector('.nav');
const hero = document.querySelector('.hero');
const heroBg = document.querySelector('.hero-bg');
const cursor = document.querySelector('.cursor');
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

if (window.matchMedia('(pointer:fine)').matches) {
  document.body.classList.add('has-cursor');
  window.addEventListener('pointermove', e => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

document.querySelectorAll('.amounts button').forEach(button => button.addEventListener('click', () => {
  document.querySelector('.amounts .selected')?.classList.remove('selected');
  button.classList.add('selected');
}));

document.querySelector('.sound').addEventListener('click', e => {
  e.currentTarget.classList.toggle('playing');
  e.currentTarget.querySelector('span').textContent = e.currentTarget.classList.contains('playing') ? '◉' : '◌';
});

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
