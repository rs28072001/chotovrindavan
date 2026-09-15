# Choto Vrindavan Dham — Hindu Temple Website

Static HTML site (no build step). Open any `.html` in a browser, or serve the
folder:

```bash
cd maharatri-template
python3 -m http.server 8080      # then visit http://localhost:8080
```

## Pages (35)

| Area | Files |
|------|-------|
| Home | `index.html`, `home-v3.html` |
| About & people | `about-us.html`, `pandits.html`, `pandit-details.html`, `volunteers.html`, `volunteer-detail.html`, `testimonials.html` |
| Puja & seva | `puja.html`, `puja-details.html`, `services.html`, `services-2.html`, `courses.html`, `course-details.html` |
| Giving | `donation.html`, `donation-archive.html`, `pricing.html` |
| Events & media | `events.html`, `event-details.html`, `broadcast.html`, `gallery.html` |
| Blog | `blog-grid.html`, `blog-details.html` |
| Account | `login.html`, `register.html`, `forgot-password.html`, `my-account.html` |
| Utility | `contact-us.html`, `faq.html`, `search-results.html`, `thank-you.html`, `coming-soon.html`, `maintenance.html`, `privacy-policy.html`, `terms-and-conditions.html` |

Every internal link resolves. `search-results.html`, `coming-soon.html`,
`maintenance.html`, `thank-you.html` and `forgot-password.html` are system
pages reached from a flow, not from the menu — that is intentional.

## Structure

```
*.html                      One file per page (shared chrome inlined in each)
assets/
  css/
    style.css               Base theme (namespace: .sigma_*) — avoid editing
    responsive.css          Theme breakpoint overrides — avoid editing
    theme-colors/color1.css BRAND COLOURS. Edit here.
    custom.css              DESIGN SYSTEM + all project work. Edit here.
    plugins/                Bootstrap 5, Slick, Magnific Popup, Animate.css, Ion.RangeSlider
  js/main.js                All page behaviour
  img/                      Images grouped by section
```

`custom.css` loads last and is organised in seven labelled layers:
design system → header → mobile nav → landing page → footer → utilities →
responsive. Work inside the matching layer.

## Design system

**Colour** — `assets/css/theme-colors/color1.css`:

| Token | Value | Use |
|---|---|---|
| `--mht-primary` / `--cvd-maroon` | `#7E4555` | Brand maroon. Buttons, links, accents. |
| `--mht-accent` / `--cvd-ink` | `#43222B` | Deep aubergine. Headings, dark surfaces. |
| `--cvd-maroon-deep` | `#5A2B3A` | Footer, stats strip, top bar. |
| `--cvd-maroon-darkest` | `#3B1B25` | Events section, hero and CTA scrims. |
| `--cvd-gold` / `--cvd-gold-soft` | `#C9A227` / `#E0C173` | Rules, numerals, small emphasis. |
| `--cvd-cream` / `--cvd-cream-deep` | `#FBF6EE` / `#F4EADA` | Alternating section grounds. |
| `--cvd-red` | `#C0392B` | Controlled accent only (live dot, heart). |

Keep red for live/urgent signals. Everything else stays in the maroon–cream–gold
family.

**Type** — Cormorant Garamond (display: `h1`, `h2`, `.section-title .title`,
pull quotes, statistics) over Poppins (everything else). Headings use
`clamp()` so they scale without breakpoint-specific font sizes.

**Spacing** — sections use `.cvd-sec` (`--cvd-sec-y: clamp(64px, 7.5vw, 118px)`).
Use it rather than one-off paddings so the vertical rhythm stays even.

**Components** (see layer 1 and 4 of `custom.css`): `.cvd-card`,
`.cvd-card-body`, `.cvd-media` + `.cvd-ratio-*`, `.cvd-badge`, `.cvd-eyebrow`,
`.cvd-sec-head`, `.cvd-quick-card`, `.cvd-event-card`, `.cvd-puja-card`,
`.cvd-testimonial`, `.cvd-pullquote`, `.cvd-stat`, `.cvd-news-card`,
`.cvd-volunteer-card`, `.cvd-mandala`.

**Section grounds** alternate white → cream (`.cvd-cream`) → warm cream
(`.cvd-live`) → dark (`.cvd-dark`). `.cvd-dark` carries the temple photo
watermark and flips heading/eyebrow colours automatically; `.cvd-mandala`
(with `-left` / `-right`) drops in the line-art watermark from
`assets/img/mandala.svg`.

**Images** — card images always sit in a `.cvd-media` with a fixed
`.cvd-ratio-*`, so no two cards crop differently. Where a photo's subject
matters (the About portraits, the hero) the ratio matches the file's native
dimensions and `object-position` holds the focal point. Do not swap in a ratio
that crops a deity's face or a temple spire.

## Shared header / footer / mobile menu

They are inlined in every page between
`<!-- partial:partia/__NAME.html -->` and `<!-- partial -->` markers
(`__header.html`, `__mobile-nav.html`, `__footer.html`). Change one page, then
copy the block into the rest — or script it against those markers.

The active nav item is marked with `class="menu-item current-menu-item"` on the
`<li data-nav="...">` for that page's section.

Navigation is a single row — Home · About · Pujas · Seva · Blog · Gallery ·
Contact — plus one primary CTA ("Visit Temple"). No utility bar, no cart, no
phone number, no email address. Events and the live broadcast live under Seva
and in the footer's Quick Links.

The footer is light cream: brand + tagline + socials, Quick Links, Our
Initiatives, and a newsletter signup, over a thin bottom bar.

## Landing page

### Hero slider

Three cross-fading slides (`.cvd-hero-slider`, Slick with `fade: true`). Each
slide is a photograph plus a cream veil over the reading side; slide 1 adds the
Krishna cutout. The mandala watermark, the "Hare Krishna" flourish and the
prev/next arrows sit *outside* the slider so they stay put while slides change.

| Piece | File |
|---|---|
| Slide 1 background | `assets/img/banner/slider-1.jpg` (from `slider1.png`, resized to 1920px and saved as JPEG — 2.0 MB → 299 KB) |
| Slide 1 figure | `assets/img/banner/png/krishna.png` (transparent PNG) |
| Slide 2 / 3 backgrounds | `assets/img/banner/9.webp`, `assets/img/banner/5.webp` |

To add a slide, copy a `.cvd-hero-slide` block. Keep backgrounds **light and
warm** — the headline is deep maroon on a cream veil, so a dark photo would
break the contrast. A slide may include a `.cvd-hero-figure` cutout or not.

Responsive: above 992px the figure sits right of the copy with the flourish
and arrows bottom-right. Below 992px the figure moves to the right edge and
the controls swap to the left; on phones the veil turns vertical and the figure
anchors the bottom-right behind the copy.

`index.html` runs the full story: hero → quick actions → mission → impact →
donation → live darshan → events → pujas → testimonials → news. Each section
carries an `id` (`#start`, `#mission`, `#impact`, `#donate`, `#live`,
`#events`, `#pujas`, `#voices`, `#news`) for in-page anchors;
`scroll-margin-top` keeps them clear of the sticky nav.

Volunteering is the fourth tile in the news grid (`.cvd-volunteer-card`)
rather than a standalone section. Acharya profiles live on
`pandits.html` / `volunteers.html`, linked from the About menu.

## Behaviour (`assets/js/main.js`)

Sticky header (reserves its own height so the page does not jump), off-canvas
mobile menu, Slick sliders, Isotope portfolio filter, WOW.js scroll reveals,
counters and progress bars, Magnific Popup lightbox/video, event countdown,
Chart.js bar chart (`puja-details.html`), and a form fallback.

- **Donation progress** — bar width comes from `aria-valuenow`.
- **Counters** — `data-from` / `data-to` on `.counter`.
- **Event countdown** — `data-countdown="YYYY-MM-DD HH:MM"` on
  `.sigma_countdown-timer` in `event-details.html`.
- **Forms** — the newsletter and contact forms have no backend. Point
  `action` at your own handler or replace the fallback in `main.js`.
- **Maps** — `contact-us.html` and `event-details.html` embed the temple's
  location (Choto Vrindavan Dham Kuleri, Agroha, Haryana 125047 —
  29.368491, 75.625902). The "Get Directions" buttons use the Google Maps
  URLs API (`/maps/dir/?api=1&destination=…`), which opens the native app on
  phones. To move the pin, take the new place's share link, load
  `https://www.google.com/maps?q=<place>&output=embed`, and use the
  `/maps/embed?pb=…` URL it redirects to.
- **WhatsApp button** — hidden by default. Set
  `href="https://wa.me/<number>"` and remove `mht-wa-disabled` to enable.

## Accessibility & motion

Skip link, visible focus rings (`:focus-visible`, gold), keyboard-openable
dropdowns (`:focus-within`), Enter/Space on `role="button"` controls, 48px
minimum tap targets in the mobile drawer, and a `prefers-reduced-motion` block
that disables the hero Ken Burns, WOW reveals, hover lifts and image zooms.

## Third-party libraries (cdnjs)

jQuery 3.7.1, Bootstrap 5.3.3, Slick 1.8.1, Magnific Popup 1.1.0, WOW 1.1.2,
imagesLoaded 5.0.0, Isotope 3.0.6, Chart.js 2.9.4 (puja-details only),
Font Awesome 5.15.4 Free, Google Fonts (Cormorant Garamond + Poppins
site-wide, plus Great Vibes on `index.html` only for the hero flourish).
Download them into `assets/` if the site must work offline.

## Known content gaps

- Copy and imagery on the **inner** pages is still placeholder in places;
  `index.html` is fully written.
- `pricing.html` quotes membership in `$`; the landing page shows giving
  totals in `₹`. Pick one before launch.
- The email addresses and phone numbers on `contact-us.html` are still the
  template's placeholders (`info@example.com`, `+123 478 390`). The address
  and map are real.
- Some images were placeholders in the original capture and should be
  replaced: `assets/img/ig/*`, `assets/img/blog/ad.webp`,
  `assets/img/products/new/1.webp`.
- Font Awesome 5 **Pro** and the original custom "flaticon" font are not
  included; icons use Font Awesome 5 **Free** equivalents.
