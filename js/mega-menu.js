(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var items = document.querySelectorAll('[data-mega-item]');
  var mobileGroups = document.querySelectorAll('[data-mobile-mega]');
  if (!items.length && !mobileGroups.length) return;

  var closeTimer = null;
  var desktop = function () { return window.matchMedia('(min-width: 1024px)').matches; };

  function closeAll() {
    items.forEach(function (item) {
      item.classList.remove('is-open');
      var btn = item.querySelector('[data-mega-trigger]');
      var panel = item.querySelector('[data-mega-panel]');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (panel) panel.style.removeProperty('top');
    });
  }

  function positionPanel(item) {
    var panel = item.querySelector('[data-mega-panel]');
    if (!panel || !header || !desktop()) return;

    var headerRect = header.getBoundingClientRect();
    panel.style.top = headerRect.bottom + 'px';
  }

  function openItem(item) {
    closeAll();
    item.classList.add('is-open');
    var trigger = item.querySelector('[data-mega-trigger]');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    positionPanel(item);
  }

  function scheduleClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(closeAll, 160);
  }

  function cancelClose() {
    clearTimeout(closeTimer);
  }

  items.forEach(function (item) {
    var trigger = item.querySelector('[data-mega-trigger]');
    var panel = item.querySelector('[data-mega-panel]');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      if (item.classList.contains('is-open')) {
        closeAll();
      } else {
        openItem(item);
      }
    });

    item.addEventListener('mouseenter', function () {
      if (!desktop()) return;
      cancelClose();
      openItem(item);
    });

    item.addEventListener('mouseleave', function () {
      if (!desktop()) return;
      scheduleClose();
    });

    panel.addEventListener('mouseenter', cancelClose);
    panel.addEventListener('mouseleave', scheduleClose);
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-mega-item]') && !e.target.closest('[data-mega-panel]')) {
      closeAll();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });

  window.addEventListener('resize', function () {
    var open = document.querySelector('[data-mega-item].is-open');
    if (open) positionPanel(open);
  });

  window.addEventListener('scroll', function () {
    var open = document.querySelector('[data-mega-item].is-open');
    if (open) positionPanel(open);
  }, { passive: true });

  mobileGroups.forEach(function (group) {
    var btn = group.querySelector('[data-mobile-mega-trigger]');
    var panel = group.querySelector('[data-mobile-mega-panel]');
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      var open = !panel.classList.contains('hidden');
      panel.classList.toggle('hidden', open);
      btn.setAttribute('aria-expanded', String(!open));
    });
  });
})();
