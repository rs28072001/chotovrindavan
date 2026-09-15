/* ==========================================================================
   Maharatri – theme scripts
   Dependencies (loaded before this file in index.html):
   jQuery, Bootstrap 5 bundle, Slick, Magnific Popup, WOW.js, imagesLoaded, Isotope
   ========================================================================== */
(function ($) {
  "use strict";

  /* ---------------------------------------------------------------- Preloader */
  $(window).on("load", function () {
    $(".sigma_preloader").addClass("hidden");
  });

  /* ------------------------------------------------------------ Sticky header */
  var $header = $(".sigma_header.can-sticky");
  function stickyHeader() {
    var on = $(window).scrollTop() > 100;
    if (on === $header.hasClass("sticky")) return;
    // Going sticky takes the nav out of flow and hides the top bar, which
    // would yank the page up by the header's height. Reserve that space
    // (measured before the class lands) so the content stays put.
    if (on) $header.css("min-height", $header.outerHeight());
    $header.toggleClass("sticky", on);
    if (!on) $header.css("min-height", "");
  }

  /* -------------------------------------------------------------- Back to top */
  var $top = $(".sigma_top");
  function backToTop() {
    $top.toggleClass("active", $(window).scrollTop() > 400);
  }
  $top.on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 600);
  });

  /* ------------------------------------------------- Keyboard activation */
  // Several controls are divs/li with role="button" (back-to-top, the
  // off-canvas toggler). Make Enter and Space behave like a click.
  $(document).on("keydown", '[role="button"][tabindex="0"]', function (e) {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      $(this).trigger("click");
    }
  });

  $(window).on("scroll", function () {
    stickyHeader();
    backToTop();
  });
  stickyHeader();
  backToTop();

  /* ----------------------------------------------------- Off-canvas side menus */
  function toggleAside(side) {
    var $aside = $(".sigma_aside-" + side);
    var open = !$aside.hasClass("open");
    $aside.toggleClass("open", open).attr("aria-hidden", !open);
    $(".aside-trigger-" + side).attr("aria-expanded", open);
    $("body").toggleClass("aside-open", open);
  }
  $(".aside-trigger-left").on("click", function () { toggleAside("left"); });
  $(".aside-trigger-right").on("click", function () { toggleAside("right"); });

  // Mobile sub-menu accordion
  $(".sigma_aside .menu-item-has-children > a").on("click", function (e) {
    e.preventDefault();
    var $li = $(this).parent();
    $li.siblings(".menu-item-has-children").removeClass("active").children(".sub-menu").slideUp(250);
    $li.toggleClass("active").children(".sub-menu").slideToggle(250);
  });

  /* -------------------------------------------------------------- Search form */
  $(".sigma_search-trigger").on("click", function (e) {
    e.preventDefault();
    $(".sigma_search-form-wrapper").toggleClass("open");
    if ($(".sigma_search-form-wrapper").hasClass("open")) {
      $(".sigma_search-form input").trigger("focus");
    }
  });
  $(document).on("keyup", function (e) {
    if (e.key === "Escape") {
      $(".sigma_search-form-wrapper").removeClass("open");
      $(".sigma_aside.open").each(function () {
        toggleAside($(this).hasClass("sigma_aside-left") ? "left" : "right");
      });
    }
  });

  /* ------------------------------------------------------------------ Sliders */
  $(".sigma_banner-slider").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 7000,
    arrows: true,
    dots: false,
    pauseOnHover: false
  });

  // Home hero. Arrows live outside the slider markup so they stay put while
  // the slides cross-fade.
  var $hero = $(".cvd-hero-slider");
  if ($hero.length) {
    $hero.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true,
      speed: 900,
      autoplay: true,
      autoplaySpeed: 7000,
      arrows: false,
      dots: true,
      appendDots: $(".cvd-hero-dots"),
      pauseOnHover: false
    });
    $(".cvd-hero-prev").on("click", function () { $hero.slick("slickPrev"); });
    $(".cvd-hero-next").on("click", function () { $hero.slick("slickNext"); });
  }

  $(".basic-dot-slider").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    autoplay: true,
    autoplaySpeed: 5000,
    adaptiveHeight: true
  });

  var $testimonials = $(".sigma_testimonial-slider");
  $testimonials.slick({
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    autoplay: true,
    autoplaySpeed: 6000,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 1 } }
    ]
  });
  // Home testimonials sit in a narrow column, so one card at a time.
  var $cvdTestimonials = $(".cvd-testimonial-slider");
  if ($cvdTestimonials.length) {
    $cvdTestimonials.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: false,
      autoplay: true,
      autoplaySpeed: 6000,
      adaptiveHeight: true
    });
  }

  // Arrows live outside the slider markup, so bind globally and drive whichever
  // testimonial slider this page actually has.
  function testimonialNav(dir) {
    var $t = $cvdTestimonials.length ? $cvdTestimonials : $testimonials;
    if ($t.length) $t.slick(dir);
  }
  $(document).on("click", ".slider-prev", function () { testimonialNav("slickPrev"); });
  $(document).on("click", ".slider-next", function () { testimonialNav("slickNext"); });

  // Quote-style testimonial slider (testimonials.html, home-v3.html)
  $(".sigma_testimonial-slider-1").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    autoplay: true,
    autoplaySpeed: 6000,
    adaptiveHeight: true
  });

  /* ------------------------------------------------- Portfolio filter (Isotope) */
  var $grid = $(".portfolio-filter");
  if ($grid.length && $.fn.isotope) {
    $grid.imagesLoaded(function () {
      $grid.isotope({ itemSelector: ".portfolio-filter > div", layoutMode: "fitRows" });
    });
    $(".filter-items .portfolio-trigger").on("click", function () {
      $(this).addClass("active").siblings().removeClass("active");
      // Keep toggle buttons (puja.html) in sync for assistive tech.
      $(this).closest(".filter-items").find("[aria-pressed]").attr("aria-pressed", "false");
      $(this).filter("[aria-pressed]").attr("aria-pressed", "true");
      $grid.isotope({ filter: $(this).data("filter") });
    });
  }

  /* ------------------------------------------------------ Scroll animations */
  if (typeof WOW === "function") {
    new WOW({ mobile: false }).init();
  }

  /* ------------------------------------------- Progress bars / counters / rings */
  function inViewport(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  function animateCounter($el) {
    var from = parseInt($el.data("from"), 10) || 0;
    var to = parseInt($el.data("to"), 10) || 0;
    $({ n: from }).animate({ n: to }, {
      duration: 1500,
      easing: "swing",
      step: function () { $el.text(Math.round(this.n)); },
      complete: function () { $el.text(to); }
    });
  }

  function revealProgress() {
    $(".progress-bar:not(.done)").each(function () {
      if (inViewport(this)) {
        $(this).addClass("done").css({ transition: "width 0.8s", width: $(this).attr("aria-valuenow") + "%" });
      }
    });
    $(".sigma_progress-round:not(.done)").each(function () {
      if (inViewport(this)) {
        $(this).addClass("done").css("stroke-dashoffset", $(this).data("to") + "px");
      }
    });
    $(".counter:not(.done)").each(function () {
      if (inViewport(this)) {
        $(this).addClass("done");
        animateCounter($(this));
      }
    });
  }
  $(window).on("scroll load", revealProgress);
  revealProgress();

  /* --------------------------------------------------- Volunteer social toggle */
  $(".trigger-volunteers-socials").on("click", function (e) {
    e.preventDefault();
    $(this).closest(".sigma_sm").toggleClass("visible");
  });

  /* ------------------------------------------------------- Lightbox (optional) */
  if ($.fn.magnificPopup) {
    $(".gallery-thumb").magnificPopup({
      type: "image",
      gallery: { enabled: true },
      mainClass: "mfp-fade",
      removalDelay: 200
    });
    $(".popup-youtube, .popup-vimeo").magnificPopup({ type: "iframe", mainClass: "mfp-fade", removalDelay: 200 });
  }

  /* -------------------------------------------------------------- Countdown */
  // <ul class="sigma_countdown-timer" data-countdown="YYYY-MM-DD HH:MM"> (event-details.html)
  $(".sigma_countdown-timer[data-countdown]").each(function () {
    var $t = $(this);
    var target = new Date($t.data("countdown").replace(" ", "T")).getTime();
    if (isNaN(target)) return;
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function tick() {
      var diff = Math.max(0, target - Date.now());
      var s = Math.floor(diff / 1000);
      $t.find(".days").text(Math.floor(s / 86400));
      $t.find(".hours").text(pad(Math.floor((s % 86400) / 3600)));
      $t.find(".minutes").text(pad(Math.floor((s % 3600) / 60)));
      $t.find(".seconds").text(pad(s % 60));
    }
    tick();
    setInterval(tick, 1000);
  });

  /* ----------------------------------------------------- Chart (puja-details) */
  // Sample data: replace with your own figures.
  var chartCanvas = document.getElementById("myChart");
  if (chartCanvas && typeof Chart !== "undefined") {
    var accent = getComputedStyle(document.documentElement).getPropertyValue("--mht-accent").trim() || "#db4242";
    var primary = getComputedStyle(document.documentElement).getPropertyValue("--mht-primary").trim() || "#7E4555";
    new Chart(chartCanvas, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          { label: "Pujas performed", backgroundColor: primary, data: [42, 55, 61, 70, 84, 96] },
          { label: "Devotees served", backgroundColor: accent, data: [120, 150, 190, 210, 260, 300] }
        ]
      },
      options: { responsive: true, legend: { position: "bottom" }, scales: { yAxes: [{ ticks: { beginAtZero: true } }] } }
    });
  }

  /* ------------------------------------------------------------ Contact form */
  // Replace this with your own handler (AJAX, Formspree, PHP mailer, etc.).
  $("form[method='post']").on("submit", function (e) {
    if (!this.action) {
      e.preventDefault();
      alert("Form submitted. Wire this form up to your backend in assets/js/main.js.");
    }
  });
})(jQuery);
