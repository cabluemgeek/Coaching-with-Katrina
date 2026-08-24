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
    .then(function (res) { return res.json(); })
    .then(function (rows) {
      var colors = ['cream', 'brown', 'olive'];
      var shown = 0;

      rows.forEach(function (row) {
        var approved = row['Approved'] === true || row['Approved'] === 'TRUE';
        if (!approved) return;

        var name = row['Your name'] || row['Name'] || 'Anonymous';
        var text = row['Your testimonial'] || row['Testimonial'] || '';
        if (!text) return;

        var card = document.createElement('div');
        card.className = 'tcard ' + colors[shown % colors.length] + ' reveal';
        card.style.transitionDelay = ((shown % 3) * 0.1) + 's';
        card.innerHTML =
          '<span class="mark">"</span>' +
          '<p class="quote">' + escapeHtml(text) + '</p>' +
          '<span class="who">— ' + escapeHtml(name) + '</span>';

        container.appendChild(card);
        if (window.observeReveal) window.observeReveal(card);
        shown++;
      });
    })
    .catch(function (err) {
      console.error('Could not load testimonials:', err);
    });
}