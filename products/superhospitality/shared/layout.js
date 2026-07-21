(function () {
  // Derive the deployment base from this script's own URL so the shared layout
  // works both at the domain root (/) and when embedded under a sub-path
  // (e.g. /products/superhospitality/ on the corporate site).
  var BASE = (function () {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].getAttribute('src') || '';
      var idx = src.indexOf('shared/layout.js');
      if (idx !== -1) {
        var prefix = src.slice(0, idx);
        try { return new URL(prefix, window.location.href).pathname; } catch (e) { return prefix || '/'; }
      }
    }
    return '/';
  })();

  function link(href) {
    if (!href) return href;
    if (href.charAt(0) === '#' || /^https?:/i.test(href) || href.indexOf('mailto:') === 0) return href;
    var path = href.charAt(0) === '/' ? href.slice(1) : href;
    // On a sub-path deployment, target index.html for directory links so static
    // servers without directory indexing resolve them. Root keeps clean URLs.
    if (BASE !== '/' && (path === '' || path.charAt(path.length - 1) === '/')) {
      path += 'index.html';
    }
    return BASE + path;
  }

  var HEADER_NAV = [
    { href: '/', label: 'Home' },
    { href: '/product/', label: 'Product' },
    { href: '/the-problem/', label: 'Problem we solve' },
    { href: '/about/', label: 'About' }
  ];

  var FOOTER_NAV = [
    { href: '/', label: 'Home' },
    { href: '/product/', label: 'Product' },
    { href: '/the-problem/', label: 'Problem we solve' },
    { href: '/about/', label: 'About' },
    { href: '/privacy/', label: 'Privacy' }
  ];

  var HOMEPAGE_HEADER_NAV = [
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#platform', label: 'Platform' },
    { href: '/product/', label: 'Product' },
    { href: '/the-problem/', label: 'Problem we solve' },
    { href: '/about/', label: 'About' }
  ];

  var HOMEPAGE_FOOTER_NAV = [
    { href: '#how-it-works', label: 'How It Works' },
    { href: '/product/', label: 'Product' },
    { href: '/the-problem/', label: 'Problem we solve' },
    { href: '/about/', label: 'About' },
    { href: '/privacy/', label: 'Privacy' }
  ];

  function isHomepage() {
    var p = window.location.pathname;
    var baseNoSlash = BASE.replace(/\/$/, '');
    return p === BASE || p === baseNoSlash || p === BASE + 'index.html' ||
      p === '/' || p === '/index.html';
  }

  function rewriteBaseLinks() {
    var nodes = document.querySelectorAll('[data-base-link]');
    nodes.forEach(function (node) {
      var href = node.getAttribute('data-base-link');
      if (!href) return;
      node.setAttribute('href', link(href));
    });
  }

  function renderHeader() {
    var header = document.querySelector('[data-shared-header]');
    if (!header) return;

    var navItems = isHomepage() ? HOMEPAGE_HEADER_NAV : HEADER_NAV;
    var links = navItems.map(function (item) {
      return '<a href="' + link(item.href) + '" onclick="closeMobileNav()">' + item.label + '</a>';
    }).join('\n            ');

    header.innerHTML =
      '<div class="container nav-row">' +
      '  <a class="brand-lockup" href="' + link('/') + '" aria-label="SuperHospitality home">' +
      '    <span class="brand-mark"><span style="color:#fff">Super</span><span class="brand-mark-teal">Hospitality</span></span>' +
      '    <span class="brand-meta">A PRODUCT BY <span class="shuul-silver">SHUUL</span></span>' +
      '  </a>' +
      '  <button class="nav-hamburger" onclick="toggleMobileNav()" aria-label="Toggle navigation" aria-expanded="false">' +
      '    <span></span><span></span><span></span>' +
      '  </button>' +
      '  <nav class="nav-links" id="navLinks" aria-label="Primary navigation">' +
      '    ' + links +
      '    <button class="button button-primary nav-cta" onclick="openModal(); closeMobileNav()">Get in touch</button>' +
      '  </nav>' +
      '</div>';
  }

  function renderFooter() {
    var footer = document.querySelector('[data-shared-footer]');
    if (!footer) return;

    var navItems = isHomepage() ? HOMEPAGE_FOOTER_NAV : FOOTER_NAV;
    var links = navItems.map(function (item) {
      return '<a href="' + link(item.href) + '">' + item.label + '</a>';
    }).join('\n              ');

    footer.innerHTML =
      '<div class="container footer-inner">' +
      '  <div class="footer-brand">' +
      '    <a class="brand-lockup" href="' + link('/') + '" aria-label="SuperHospitality home">' +
      '      <span class="brand-mark"><span style="color:#fff">Super</span><span class="brand-mark-teal">Hospitality</span></span>' +
      '      <span class="brand-meta">A PRODUCT BY <span class="shuul-silver">SHUUL</span></span>' +
      '    </a>' +
      '    <p class="footer-brand-copy">AI-powered guest experience platform.<br>A product by <a href="https://shuul.io/" target="_blank" rel="noopener noreferrer"><span class="shuul-silver">SHUUL Technologies</span></a>.</p>' +
      '  </div>' +
      '  <div class="footer-right">' +
      '    <nav class="footer-links" aria-label="Footer navigation">' +
      '      ' + links +
      '      <a href="#" onclick="openModal(); return false;">Get in touch</a>' +
      '    </nav>' +
      '    <p class="footer-dpiit"><a href="#" onclick="openCertificateModal(); return false;">Startup recognition by DPIIT, Government of India</a></p>' +
      '  </div>' +
      '</div>' +
      '<p class="footer-copyright container">&copy; 2026 SHUUL Technologies LLP. All rights reserved.</p>';
  }

  function renderCertificateModal() {
    if (document.getElementById('certificateModal')) return;

    var modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'certificateModal';
    modal.onclick = function (e) { if (e.target === e.currentTarget) closeCertificateModal(); };
    modal.innerHTML =
      '<div class="modal-container certificate-modal-container">' +
      '  <div class="modal-header">' +
      '    <h3>DPIIT Startup India Recognition</h3>' +
      '    <button class="modal-close" onclick="closeCertificateModal()" aria-label="Close">&times;</button>' +
      '  </div>' +
      '  <div class="modal-body" style="padding:1.5rem; overflow:auto; background:var(--paper);">' +
      '    <img src="' + link('/images/dpiit-certificate.webp') + '" alt="DPIIT Startup India Recognition Certificate for SHUUL Technologies LLP" style="width:100%; height:auto; border-radius:0.5rem;">' +
      '  </div>' +
      '</div>';
    document.querySelector('.site-shell').appendChild(modal);
  }

  function renderRequestModal() {
    if (document.getElementById('betaModal')) return;

    var modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'betaModal';
    modal.onclick = function (e) { if (e.target === e.currentTarget) closeModal(); };
    modal.innerHTML =
      '<div class="modal-container">' +
      '  <div class="modal-header">' +
      '    <h3>Get in touch</h3>' +
      '    <button class="modal-close" onclick="closeModal()" aria-label="Close">&times;</button>' +
      '  </div>' +
      '  <div class="modal-body">' +
      '    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfdbThYwUDFjeIFg12fHmLmKu2P0tFGH8-NVrhgmLbLXEl8vw/viewform?embedded=true" width="100%" height="100%" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>' +
      '  </div>' +
      '</div>';
    document.querySelector('.site-shell').appendChild(modal);
  }

  function renderBackToSiteButton() {
    if (BASE === '/' || document.getElementById('siteReturnLink')) return;

    var linkEl = document.createElement('a');
    linkEl.className = 'site-return-link';
    linkEl.id = 'siteReturnLink';
    linkEl.href = '/products';
    linkEl.textContent = 'Back to Site';
    document.body.appendChild(linkEl);
  }

  // Global functions
  window.openModal = function () {
    document.getElementById('betaModal').classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  window.closeModal = function () {
    document.getElementById('betaModal').classList.remove('is-open');
    document.body.style.overflow = '';
  };
  window.openCertificateModal = function () {
    document.getElementById('certificateModal').classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  window.closeCertificateModal = function () {
    document.getElementById('certificateModal').classList.remove('is-open');
    document.body.style.overflow = '';
  };
  window.toggleMobileNav = function () {
    var nav = document.getElementById('navLinks');
    var btn = document.querySelector('.nav-hamburger');
    var open = nav.classList.toggle('is-open');
    btn.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open);
  };
  window.closeMobileNav = function () {
    var nav = document.getElementById('navLinks');
    var btn = document.querySelector('.nav-hamburger');
    nav.classList.remove('is-open');
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
      closeCertificateModal();
    }
  });

  // Initialize
  renderHeader();
  renderFooter();
  renderCertificateModal();
  renderRequestModal();
  renderBackToSiteButton();
  rewriteBaseLinks();
})();
