"use strict";

/* ══════════════════════════════════════════════════════════════
   PLACEHOLDER DATA — wire to admin/CMS. Do NOT ship these values.
   Replace with a fetch() to your CMS endpoint and re-render.
   ══════════════════════════════════════════════════════════════ */
const DARSHAN_TIMINGS = [
  { name: "मंगला दर्शन", latin: "MANGALA DARSHAN", time: "[time]" },
  { name: "शृंगार दर्शन", latin: "SHRINGAR DARSHAN", time: "[time]" },
  { name: "राजभोग दर्शन", latin: "RAJ BHOG DARSHAN", time: "[time]" },
  { name: "संध्या आरती", latin: "SANDHYA AARTI", time: "[time]" },
  { name: "शयन दर्शन", latin: "SHAYAN DARSHAN", time: "[time]" },
];

document.getElementById("timings-list").innerHTML = DARSHAN_TIMINGS.map(
  (d) => `<li><span class="t-name">${d.name}<span class="t-latin">${d.latin}</span></span>
          <span class="t-time">${d.time}</span></li>`
).join("");

document.getElementById("yr").textContent = new Date().getFullYear();

/* ─── helpers ─── */
const $ = (id) => document.getElementById(id);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// 0 → section top hits viewport top, 1 → sticky pin releases
function pinProgress(section) {
  const travel = section.offsetHeight - innerHeight;
  return travel > 0 ? clamp01(-section.getBoundingClientRect().top / travel) : 0;
}

/* ─── scroll-scrubbed video ───
   Scroll sets a target time; a RAF loop eases currentTime toward it.
   Seeks are skipped while one is in flight and below ~1 frame of delta,
   so we never spam the decoder. */
function makeScrubber(video, section) {
  video.pause();
  const state = { time: 0 };
  video.addEventListener("error", () => enableFallback(video, section), { once: true });
  return (progress) => {
    if (!video.duration) return;
    const target = progress * Math.max(video.duration - 0.05, 0);
    state.time = reduceMotion ? target : state.time + (target - state.time) * 0.16;
    if (!video.seeking && Math.abs(video.currentTime - state.time) > 1 / 30) {
      video.currentTime = state.time;
    }
  };
}

// Graceful fallback: unpin the section and let the video play normally.
function enableFallback(video, section) {
  section.classList.add("no-scrub");
  video.loop = true;
  video.autoplay = true;
  video.play().catch(() => {});
}

/* ─── elements ─── */
const nav = $("nav");
const heroSection = $("hero");
const heroTitle = $("hero-title");
const indicator = $("scroll-indicator");
const heroFade = $("hero-fade");
const darshanSection = $("darshan");
const darshanVideo = $("darshan-video");
const darshanIn = $("darshan-in");
const darshanTitle = $("darshan-title");

const scrubHero = makeScrubber($("hero-video"), heroSection);
const scrubDarshan = makeScrubber(darshanVideo, darshanSection);

// iOS Safari renders seeked frames reliably only after one play/pause.
function primeVideo(v) {
  v.play().then(() => v.pause()).catch(() => {});
}

// Defer the second video until the user is halfway through the hero.
let darshanLoaded = false;
function loadDarshan() {
  darshanLoaded = true;
  darshanVideo.src = darshanVideo.dataset.src;
  darshanVideo.load();
  primeVideo(darshanVideo);
}

/* ─── yatra · Hisar → Agrohadham → ChotoVrindavan ───
   Phases over the pin: intro → map reveal → Hisar pulse → route seg 1 →
   Agrohadham → route seg 2 → video scrub (temple emergence) → arrival hold.
   The SVG route overlays the video's first frame (the map); it fades out
   under the divine-light burst before the video draws its own route. */
const journeySection = $("yatra");
const yatraVideo = $("yatra-video");
const yatraSvg = $("yatra-svg");
const jVeil = $("j-veil");
const jIntro = $("j-intro");
const jCap1 = $("j-cap-1");
const jCap2 = $("j-cap-2");
const jArrival = $("j-arrival");
const hisarStop = $("hisar-stop");
const agrohaStop = $("agroha-stop");
const destGlow = $("dest-glow");
const scrubYatra = makeScrubber(yatraVideo, journeySection);

const routeSeg = (id) => {
  const paths = $(id).querySelectorAll("path");
  const len = paths[0].getTotalLength();
  paths.forEach((p) => { p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
  return { paths, len };
};
const seg1 = routeSeg("seg1");
const seg2 = routeSeg("seg2");
const drawSeg = (s, t) => s.paths.forEach((p) => (p.style.strokeDashoffset = s.len * (1 - t)));

const ramp = (p, a, b) => clamp01((p - a) / (b - a));
// fades in at `a`, out approaching `b`
const fadeIO = (p, a, b, f = 0.05) => clamp01(Math.min((p - a) / f, (b - p) / f));

// static state: reduced motion or a video failure → complete map + arrival text
let journeyStatic = reduceMotion;
function showJourneyStill() {
  journeyStatic = true;
  journeySection.classList.add("no-scrub", "arrived");
  $("yatra-final").hidden = false;
}
if (reduceMotion) {
  showJourneyStill();
} else {
  new IntersectionObserver(([e], obs) => {
    if (!e.isIntersecting) return;
    yatraVideo.src = yatraVideo.dataset.src;
    yatraVideo.load();
    primeVideo(yatraVideo);
    obs.disconnect();
  }, { rootMargin: "200%" }).observe(journeySection);
  yatraVideo.addEventListener("error", showJourneyStill, { once: true });
}

/* ─── anubhav · vertical scroll drives the scene track sideways ───
   The section grows by the track's horizontal overflow; pinProgress then
   maps 0→1 onto translateX. Mobile/reduced-motion: CSS unpins the section
   and the track is a plain swipeable scroller (expDistance stays 0). */
const expSection = $("experience");
const sceneTrack = $("scene-track");
let expDistance = 0;

function sizeExperience() {
  if (reduceMotion || !matchMedia("(min-width: 861px)").matches) {
    expDistance = 0;
    expSection.style.height = "";
    sceneTrack.style.transform = "";
    return;
  }
  expDistance = Math.max(sceneTrack.scrollWidth - innerWidth + sceneTrack.offsetLeft, 0);
  expSection.style.height = `calc(100vh + ${expDistance}px)`;
}

/* ─── golden particles (transition section only) ─── */
const canvas = $("particles");
const ctx = canvas.getContext("2d");
let particlesOn = false;
let specks = [];

function sizeParticles() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  specks = Array.from({ length: innerWidth < 860 ? 24 : 48 }, () => ({
    x: Math.random() * canvas.clientWidth,
    y: Math.random() * canvas.clientHeight,
    r: 0.5 + Math.random() * 1.4,
    vy: 0.08 + Math.random() * 0.25,
    tw: Math.random() * Math.PI * 2,
  }));
}

function drawParticles(t) {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);
  for (const s of specks) {
    s.y -= s.vy;
    if (s.y < -4) { s.y = h + 4; s.x = Math.random() * w; }
    const a = 0.12 + 0.3 * Math.abs(Math.sin(s.tw + t / 1600));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212, 175, 95, ${a})`;
    ctx.fill();
  }
}

new IntersectionObserver(([e]) => (particlesOn = e.isIntersecting && !reduceMotion), {
  rootMargin: "20%",
}).observe($("transition"));

/* ─── content reveals ─── */
const revealObs = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); }
    }),
  { rootMargin: "-80px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

/* ─── the single RAF loop: all hot updates go direct to the DOM ─── */
let rafId = 0;
function frame(t) {
  const heroP = pinProgress(heroSection);

  // video maps to first 92% of the pin; the last 8% holds the Krishna frame
  scrubHero(clamp01(heroP / 0.92));

  heroTitle.style.opacity = clamp01(1 - heroP * 4);
  heroTitle.style.transform = `translateY(${heroP * -60}px)`;
  indicator.style.opacity = clamp01(1 - heroP * 9);
  heroFade.style.opacity = clamp01((heroP - 0.84) / 0.16); // ease into golden darkness

  nav.classList.toggle("visible", heroP > 0.6);
  if (heroP > 0.5 && !darshanLoaded) loadDarshan();

  const dP = pinProgress(darshanSection);
  scrubDarshan(clamp01(dP / 0.88)); // last 12% holds the full Darshan frame
  darshanIn.style.opacity = clamp01(1 - dP * 9); // emerge from the golden darkness
  darshanTitle.style.opacity = clamp01((dP - 0.86) / 0.1);

  if (!journeyStatic) {
    const jP = pinProgress(journeySection);
    jIntro.style.opacity = clamp01(1 - ramp(jP, 0.05, 0.11));
    jIntro.style.transform = `translateY(${jP * -140}px)`;
    jVeil.style.opacity = clamp01(1 - ramp(jP, 0.08, 0.16));

    hisarStop.style.opacity = fadeIO(jP, 0.17, 0.55);
    jCap1.style.opacity = fadeIO(jP, 0.19, 0.3);
    drawSeg(seg1, ramp(jP, 0.26, 0.42));
    agrohaStop.style.opacity = fadeIO(jP, 0.41, 0.6);
    jCap2.style.opacity = fadeIO(jP, 0.42, 0.52);
    drawSeg(seg2, ramp(jP, 0.46, 0.56));
    destGlow.style.opacity = fadeIO(jP, 0.5, 0.68);
    yatraSvg.style.opacity = clamp01(1 - ramp(jP, 0.7, 0.78));

    // temple emergence: video scrubs across the middle, holds the arrival frame
    scrubYatra(ramp(jP, 0.56, 0.93));

    jArrival.style.opacity = ramp(jP, 0.94, 1);
  }

  if (expDistance > 0) {
    sceneTrack.style.transform = `translateX(${-pinProgress(expSection) * expDistance}px)`;
  }

  if (particlesOn) drawParticles(t);
  rafId = requestAnimationFrame(frame);
}

document.addEventListener("visibilitychange", () => {
  cancelAnimationFrame(rafId);
  if (!document.hidden) rafId = requestAnimationFrame(frame);
});

addEventListener("resize", () => { sizeParticles(); sizeExperience(); }, { passive: true });

// iOS Safari needs one play/pause on first touch before seeks render frames.
addEventListener(
  "touchstart",
  () => {
    for (const v of document.querySelectorAll("video")) {
      if (v.src) primeVideo(v);
    }
  },
  { once: true, passive: true }
);

sizeParticles();
sizeExperience();
rafId = requestAnimationFrame(frame);
