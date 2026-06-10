(function () {
  'use strict';

  var SALES = [
    {
      id: 'buero-moebel-verkauf',
      status: 'current',
      title: 'Büro Möbel Verkauf',
      subtitle: '2nd Hand · durchgeführt von FENYX',
      date: '27.09.2025',
      time: '10:00–14:00 Uhr',
      address: 'Helmholtzstraße 2, Berlin',
      poster: '../assets/fenyx.haus/posters/buero-moebel-verkauf.png',
      partnership: null,
      highlights: ['USM Haller', 'Chesterfield', 'Vintage TV', 'Snake Plant', 'Ab €10'],
      brands: ['USM Haller', 'Vitra', 'Designklassiker'],
      description: 'Unser aktueller Pop-up-Verkauf mit kuratierter Auswahl an refurbished Büromöbeln und Designstücken – vor Ort entdecken und mitnehmen.',
      searchText: 'büro möbel berlin helmholtzstraße 2nd hand',
    },
    {
      id: 'soundcloud-bueromoebel',
      status: 'past',
      title: 'Büromöbel-Verkauf',
      subtitle: 'In Kooperation mit SoundCloud',
      date: '15.12. – 16.12.2025',
      time: '10:00 – 17:00 Uhr',
      address: 'SoundCloud, Berlin',
      poster: '../assets/fenyx.haus/posters/soundcloud-bueromoebel-verkauf.png',
      partnership: 'SoundCloud',
      highlights: ['Barhocker', 'Bürodrehstühle', 'Couchtische', 'Sofas', 'Whiteboards'],
      brands: ['Herman Miller', 'Vitra', 'Steelcase', 'De Vorm', 'Hay'],
      description: 'Ein Pop-up in Kooperation mit SoundCloud – Premium-Büromöbel von Herman Miller, Vitra, Steelcase und weiteren Marken.',
      searchText: 'soundcloud kooperation berlin herman miller vitra steelcase',
    },
    {
      id: 'office-furniture-sale-2025',
      status: 'past',
      title: 'Office furniture Sale',
      subtitle: 'sustainable office transformation',
      date: '27.09.2025',
      time: '10–15 Uhr',
      address: 'Helmholtzstraße 2, Berlin',
      poster: '../assets/fenyx.haus/posters/office-furniture-sale-2025.png',
      partnership: null,
      highlights: ['USM Haller', 'Vitra', 'Brunner', 'Bar Stools', 'Office Swivel Chairs'],
      brands: ['Vitra', 'USM Haller', 'Brunner', 'Wilkhahn', 'Sedus'],
      description: 'Pop-up mit ausgewählten refurbished Büromöbeln, Designklassikern und nachhaltigen Arbeitsplatzlösungen.',
      searchText: 'office furniture sale berlin sustainable',
    },
    {
      id: '2nd-hand-furniture-sale',
      status: 'past',
      title: '2nd Hand Furniture Sale',
      subtitle: 'curated vintage & refurbished pieces',
      date: 'Früherer Verkauf',
      time: 'Pop-up Event',
      address: 'Berlin',
      poster: '../assets/fenyx.haus/posters/2nd-hand-furniture-sale.png',
      partnership: null,
      highlights: ['USM Haller', 'Sideboards', 'Lounge', 'Vintage Seating'],
      brands: ['USM Haller', 'Vitra', 'Designklassiker'],
      description: 'Früherer fenyx.haus Pop-up mit kuratierter Auswahl an Second-Hand- und refurbished Möbeln.',
      searchText: '2nd hand vintage refurbished berlin',
    },
  ];

  var BRANDS = [
    { id: 'vitra', name: 'Vitra', logo: '../assets/fenyx.haus/brands/vitra.png' },
    { id: 'usm', name: 'USM Haller', logo: '../assets/fenyx.haus/brands/usm-haller.png' },
    { id: 'herman-miller', name: 'Herman Miller', logo: '../assets/fenyx.haus/brands/herman-miller.png' },
    { id: 'steelcase', name: 'Steelcase', logo: '../assets/fenyx.haus/brands/steelcase.png' },
    { id: 'brunner', name: 'Brunner', logo: '../assets/fenyx.haus/brands/brunner.png' },
    { id: 'haworth', name: 'Haworth', logo: '../assets/fenyx.haus/brands/haworth.png' },
    { id: 'sedus', name: 'Sedus', logo: '../assets/fenyx.haus/brands/sedus.png' },
    { id: 'artemide', name: 'Artemide', logo: '../assets/fenyx.haus/brands/artemide.png' },
  ];

  var PRODUCTS = [
    {
      name: 'Vitra EA 117',
      brand: 'Vitra',
      image: '../assets/fenyx.haus/products/vitra-ea-117.png',
      tag: 'Seating',
    },
    {
      name: 'Artemide Tolomeo',
      brand: 'Artemide',
      image: '../assets/fenyx.haus/products/artemide-tolomeo.png',
      tag: 'Lighting',
    },
    {
      name: 'Steelcase Desk',
      brand: 'Steelcase',
      image: '../assets/fenyx.haus/products/steelcase-desk.png',
      tag: 'Desks',
    },
    {
      name: 'USM Haller Sideboard',
      brand: 'USM Haller',
      image: '../assets/fenyx.haus/products/usm-haller-sideboard.png',
      tag: 'Storage',
    },
  ];

  var stack = document.getElementById('poster-stack');
  var stackScrollBound = false;
  var modal = document.getElementById('poster-modal');
  var modalImg = document.getElementById('poster-modal-img');
  var modalTitle = document.getElementById('poster-modal-title');
  var modalBody = document.getElementById('poster-modal-body');
  var modalClose = document.getElementById('poster-modal-close');
  var pastList = document.getElementById('past-sales-list');
  var searchInput = document.getElementById('sale-search');
  var searchEmpty = document.getElementById('search-empty');
  var searchQuery = '';

  function escHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function saleMatchesQuery(sale) {
    if (!searchQuery) return true;
    var haystack = (
      sale.title + ' ' + sale.subtitle + ' ' + sale.address + ' ' +
      sale.date + ' ' + (sale.partnership || '') + ' ' +
      sale.highlights.join(' ') + ' ' + sale.brands.join(' ') + ' ' +
      sale.searchText
    ).toLowerCase();
    return haystack.indexOf(searchQuery) !== -1;
  }

  function getVisibleSales() {
    return SALES.filter(saleMatchesQuery).sort(function (a, b) {
      if (a.status === 'current') return -1;
      if (b.status === 'current') return 1;
      return 0;
    });
  }

  function updateCenteredCard() {
    if (!stack) return;
    var cards = stack.querySelectorAll('.poster-card:not(.is-hidden)');
    if (!cards.length) return;

    var stackRect = stack.getBoundingClientRect();
    var centerX = stackRect.left + stackRect.width / 2;
    var closest = null;
    var closestDist = Infinity;

    cards.forEach(function (card) {
      var rect = card.getBoundingClientRect();
      var cardCenter = rect.left + rect.width / 2;
      var dist = Math.abs(centerX - cardCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = card;
      }
    });

    cards.forEach(function (card) {
      var rect = card.getBoundingClientRect();
      var cardCenter = rect.left + rect.width / 2;
      var offset = (cardCenter - centerX) / (rect.width * 0.95);
      var abs = Math.min(Math.abs(offset), 3.5);
      var isFront = card === closest;

      card.classList.toggle('is-centered', isFront);

      if (!isFront) {
        var scale = Math.max(0.78, 1.05 - abs * 0.09);
        var lift = abs * 16;
        card.style.transform = 'translateY(' + lift + 'px) scale(' + scale.toFixed(3) + ')';
        card.style.zIndex = String(Math.max(1, Math.round(24 - abs * 6)));
        card.style.opacity = String(Math.max(0.32, 0.92 - abs * 0.18));
      } else {
        card.style.transform = '';
        card.style.zIndex = '30';
        card.style.opacity = '1';
      }
    });
  }

  function renderPosterStack() {
    if (!stack) return;

    var sorted = SALES.slice().sort(function (a, b) {
      if (a.status === 'current') return -1;
      if (b.status === 'current') return 1;
      return 0;
    });

    stack.innerHTML = sorted.map(function (sale) {
      var hidden = !saleMatchesQuery(sale) ? ' is-hidden' : '';
      var partner = sale.partnership
        ? '<p class="text-[0.58rem] text-[#c94832] font-bold mt-0.5">Kooperation · ' + escHtml(sale.partnership) + '</p>'
        : '';

      return (
        '<article class="poster-card' + hidden + '" data-sale-id="' + sale.id + '" aria-label="' + escHtml(sale.title) + '">' +
          '<div class="poster-card-inner">' +
            '<img src="' + sale.poster + '" alt="' + escHtml(sale.title) + '" loading="lazy">' +
            '<div class="poster-card-meta">' +
              '<p>' + (sale.status === 'current' ? 'Aktuell' : 'Vergangen') + '</p>' +
              '<strong>' + escHtml(sale.title) + '</strong>' +
              partner +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    if (!stackScrollBound) {
      stack.addEventListener('scroll', updateCenteredCard, { passive: true });
      stackScrollBound = true;
    }

    updateCenteredCard();
  }

  function getSale(id) {
    return SALES.find(function (sale) { return sale.id === id; });
  }

  function openModal(id) {
    var sale = getSale(id);
    if (!sale || !modal) return;

    var partnerBlock = sale.partnership
      ? '<p class="inline-block mb-4 px-2.5 py-1 bg-[#c94832]/10 text-[#c94832] text-xs font-bold uppercase tracking-wider">Kooperation · ' + escHtml(sale.partnership) + '</p>'
      : '';

    modalImg.src = sale.poster;
    modalImg.alt = sale.title;
    modalTitle.textContent = sale.title;
    modalBody.innerHTML =
      partnerBlock +
      '<p class="text-sm uppercase tracking-[0.12em] text-black/50 mb-2">' + escHtml(sale.subtitle) + '</p>' +
      '<p class="haus-serif text-2xl mb-4">' + escHtml(sale.date) + ' · ' + escHtml(sale.time) + '</p>' +
      '<p class="text-sm mb-4"><strong>Ort:</strong> ' + escHtml(sale.address) + '</p>' +
      '<p class="text-sm leading-relaxed text-black/70 mb-5">' + escHtml(sale.description) + '</p>' +
      '<p class="text-xs uppercase tracking-[0.1em] text-black/45 mb-2">Highlights</p>' +
      '<div class="flex flex-wrap gap-2 mb-5">' +
        sale.highlights.map(function (item) {
          return '<span class="haus-pill">' + escHtml(item) + '</span>';
        }).join('') +
      '</div>' +
      '<p class="text-xs text-black/50">' + escHtml(sale.brands.join(' · ')) + '</p>';

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderPastSales() {
    if (!pastList) return;
    var past = SALES.filter(function (sale) {
      return sale.status === 'past' && saleMatchesQuery(sale);
    });

    if (!past.length) {
      pastList.innerHTML = '';
      return;
    }

    pastList.innerHTML = past.map(function (sale) {
      var partner = sale.partnership
        ? '<span class="text-[0.62rem] text-[#c94832] font-bold uppercase tracking-wider">Kooperation · ' + escHtml(sale.partnership) + '</span><br>'
        : '';

      return (
        '<button type="button" class="past-sale-item w-full text-left border border-black/10 bg-white/60 p-5 hover:border-black/25 transition-colors" data-sale-id="' + sale.id + '">' +
          '<span class="sale-status sale-status--past mb-3 inline-block">Vergangener Verkauf</span>' +
          partner +
          '<h3 class="haus-serif text-xl mb-1">' + escHtml(sale.title) + '</h3>' +
          '<p class="text-sm text-black/55">' + escHtml(sale.address) + ' · ' + escHtml(sale.date) + '</p>' +
        '</button>'
      );
    }).join('');

    pastList.querySelectorAll('.past-sale-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openModal(btn.getAttribute('data-sale-id'));
      });
    });
  }

  function initCurrentSale() {
    var current = SALES.find(function (sale) { return sale.status === 'current'; });
    if (!current) return;

    var highlights = document.getElementById('current-highlights');
    if (highlights) {
      highlights.innerHTML = current.highlights.map(function (item) {
        return '<span class="haus-pill">' + escHtml(item) + '</span>';
      }).join('');
    }

    var heroTitle = document.getElementById('current-sale-title');
    var heroDate = document.getElementById('current-sale-date');
    var heroAddress = document.getElementById('current-sale-address');
    if (heroTitle) heroTitle.textContent = current.title;
    if (heroDate) heroDate.textContent = current.date + ' · ' + current.time;
    if (heroAddress) heroAddress.textContent = current.address;
  }

  function renderProducts() {
    var grid = document.getElementById('highlight-products');
    if (!grid) return;

    grid.innerHTML = PRODUCTS.map(function (product) {
      return (
        '<article class="product-card">' +
          '<div class="product-card-img">' +
            '<img src="' + product.image + '" alt="' + escHtml(product.name) + '" loading="lazy">' +
          '</div>' +
          '<div class="p-4">' +
            '<p class="text-[0.62rem] uppercase tracking-[0.12em] text-black/45 mb-1">' + escHtml(product.tag) + '</p>' +
            '<h3 class="font-bold text-sm leading-snug">' + escHtml(product.name) + '</h3>' +
            '<p class="text-xs text-black/50 mt-1">' + escHtml(product.brand) + '</p>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  function renderBrands() {
    var grid = document.getElementById('brand-logos');
    if (!grid) return;

    grid.innerHTML = BRANDS.map(function (brand) {
      return (
        '<div class="brand-logo-item" title="' + escHtml(brand.name) + '">' +
          '<img src="' + brand.logo + '" alt="' + escHtml(brand.name) + '" ' +
            'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\'">' +
          '<span class="brand-logo-fallback" style="display:none">' + escHtml(brand.name) + '</span>' +
        '</div>'
      );
    }).join('');
  }

  function applySearch() {
    var visibleCount = 0;
    SALES.forEach(function (sale) {
      if (saleMatchesQuery(sale)) visibleCount++;
    });

    if (searchEmpty) {
      searchEmpty.classList.toggle('hidden', visibleCount > 0);
    }

    renderPosterStack();
    renderPastSales();
  }

  window.addEventListener('resize', updateCenteredCard);

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      searchQuery = searchInput.value.trim().toLowerCase();
      applySearch();
    });
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', function (event) {
      if (event.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeModal();
  });

  renderPosterStack();
  renderPastSales();
  initCurrentSale();
  renderProducts();
  renderBrands();
})();
