(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.reveal').forEach(function (el) {
    if (reducedMotion) {
      el.classList.add('is-visible');
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    observer.observe(el);
  });

  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-trigger');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var open = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(function (other) {
        if (other !== item) other.classList.remove('is-open');
      });
      item.classList.toggle('is-open', !open);
      btn.setAttribute('aria-expanded', String(!open));
    });
  });

  if (reducedMotion) return;

  var lifecycleTrack = document.getElementById('lifecycle-track');
  var lifecyclePath = document.getElementById('lifecycle-path');
  var lifecycleDots = [
    document.getElementById('lifecycle-dot-1'),
    document.getElementById('lifecycle-dot-2'),
    document.getElementById('lifecycle-dot-3')
  ];
  var leistungCards = document.querySelectorAll('.leistung-card');
  var pathLength = 0;
  var dotPositions = [];

  function resizeLifecycle() {
    if (!lifecyclePath || !lifecycleTrack) return;
    var h = lifecycleTrack.offsetHeight;
    lifecyclePath.setAttribute('d', 'M 2 0 L 2 ' + h);
    pathLength = lifecyclePath.getTotalLength();
    lifecyclePath.style.strokeDasharray = String(pathLength);
    lifecyclePath.style.strokeDashoffset = String(pathLength);
    dotPositions = [];
    leistungCards.forEach(function (card, i) {
      var cardCenter = card.offsetTop + card.offsetHeight / 2;
      dotPositions.push(cardCenter);
      if (lifecycleDots[i]) lifecycleDots[i].setAttribute('cy', String(cardCenter));
    });
  }

  function updateLifecycleLine() {
    if (!lifecycleTrack || !lifecyclePath || !pathLength) return;
    var rect = lifecycleTrack.getBoundingClientRect();
    var vh = window.innerHeight;
    var start = vh * 0.85;
    var end = -(rect.height - vh * 0.15);
    var progress = (start - rect.top) / (start - end);
    progress = Math.min(1, Math.max(0, progress));
    lifecyclePath.style.strokeDashoffset = String(pathLength * (1 - progress));
    var drawnLength = pathLength * progress;
    lifecycleDots.forEach(function (dot, i) {
      if (!dot) return;
      dot.classList.toggle('is-active', drawnLength >= dotPositions[i] - 8);
    });
  }

  if (lifecycleTrack) {
    resizeLifecycle();
    window.addEventListener('resize', resizeLifecycle);
    window.addEventListener('scroll', updateLifecycleLine, { passive: true });
    updateLifecycleLine();
  }
})();
