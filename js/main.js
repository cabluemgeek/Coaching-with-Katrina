document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('pagesNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  window.observeReveal = function (el) {
    revealObserver.observe(el);
  };

  // ---------- Language toggle via Google Translate widget ----------
  var STORAGE_KEY = 'siteLang';
  var langToggle = document.getElementById('lang-toggle');

  function setGoogleLang(lang) {
  if (lang === 'en') {
    // Supprime le cookie de traduction Google et recharge la page en anglais d'origine
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
    location.reload();
    return;
  }

  var combo = document.querySelector('.goog-te-combo');
  if (!combo) {
    setTimeout(function () { setGoogleLang(lang); }, 300);
    return;
  }
  combo.value = 'fr';
  combo.dispatchEvent(new Event('change'));
}

  function updateButtons(lang) {
    if (!langToggle) return;
    langToggle.querySelectorAll('button').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  if (langToggle) {
    langToggle.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        localStorage.setItem(STORAGE_KEY, lang);
        updateButtons(lang);
        setGoogleLang(lang);
      });
    });
  }

  var savedLang = localStorage.getItem(STORAGE_KEY);
  if (savedLang === 'fr') {
    updateButtons('fr');
    setTimeout(function () { setGoogleLang('fr'); }, 800);
  }  
});

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function loadTestimonials(scriptUrl, containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;

  fetch(scriptUrl)
    .then(function (res) {
      if (!res.ok) {
        throw new Error('HTTP error ' + res.status);
      }

      return res.json();
    })
    .then(function (rows) {

      var colors = ['cream', 'brown', 'olive'];
      var shown = 0;

      rows.forEach(function (row) {

        // Code.gs already returns approved testimonials
        var name = row.name || 'Anonymous';
        var text = row.testimonial || '';

        if (!text) return;

        var card = document.createElement('div');

        card.className =
          'tcard ' +
          colors[shown % colors.length];

        card.innerHTML =
          '<span class="mark">"</span>' +
          '<p class="quote">' +
          escapeHtml(text) +
          '</p>' +
          '<span class="who">— ' +
          escapeHtml(name) +
          '</span>';

        container.appendChild(card);

        shown++;
      });

    })
    .catch(function (err) {
      console.error('Could not load testimonials:', err);
    });
}