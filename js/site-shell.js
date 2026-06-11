(function () {
  'use strict';

  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  var iconOpen = document.getElementById('icon-open');
  var iconClose = document.getElementById('icon-close');
  if (!toggle || !menu) return;

  var links = document.querySelectorAll('.mobile-nav-link');

  toggle.addEventListener('click', function () {
    var isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    if (iconOpen) iconOpen.classList.toggle('hidden', !isOpen);
    if (iconClose) iconClose.classList.toggle('hidden', isOpen);
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Menü öffnen' : 'Menü schließen');
  });

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.add('hidden');
      if (iconOpen) iconOpen.classList.remove('hidden');
      if (iconClose) iconClose.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();
