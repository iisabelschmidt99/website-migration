(function () {
  'use strict';

  var ENDPOINT = '/.netlify/functions/hubspot-form';
  var MAX_FILE_BYTES = 10 * 1024 * 1024;

  function getHubspotCookie() {
    var match = document.cookie.match(/hubspotutk=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  function readFileAsBase64(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var result = reader.result || '';
        var base64 = String(result).split(',')[1] || '';
        resolve({
          name: file.name,
          type: file.type,
          data: base64,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function setStatus(form, message, type) {
    var status = form.querySelector('.form-status');
    if (!status) return;
    if (!message) {
      status.textContent = '';
      status.classList.add('hidden');
      return;
    }
    status.textContent = message;
    status.classList.remove('hidden', 'text-signal', 'text-red-400', 'text-mist');
    if (type === 'success') {
      status.classList.add('text-signal');
    } else if (type === 'error') {
      status.classList.add('text-red-400');
    } else {
      status.classList.add('text-mist');
    }
  }

  function updateFileLabel(input) {
    var label = input.closest('label');
    if (!label) return;
    var hint = label.querySelector('.file-selection');
    if (!hint) {
      hint = document.createElement('span');
      hint.className = 'file-selection text-mist text-xs normal-case tracking-normal font-normal';
      label.appendChild(hint);
    }
    if (!input.files || input.files.length === 0) {
      hint.textContent = '';
      return;
    }
    var names = Array.prototype.map.call(input.files, function (file) {
      return file.name;
    });
    hint.textContent = names.join(', ');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    var form = event.currentTarget;
    var submitBtn = form.querySelector('[type="submit"]');
    var defaultLabel = submitBtn.getAttribute('data-default-label') || submitBtn.textContent.trim();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird gesendet…';
    setStatus(form, '', 'neutral');

    var formData = new FormData(form);
    var payload = {
      name: formData.get('name'),
      firma: formData.get('firma'),
      email: formData.get('email'),
      telefon: formData.get('telefon') || '',
      nachricht: formData.get('nachricht') || '',
      pageUri: window.location.href,
      pageName: document.title,
      hutk: getHubspotCookie(),
      files: [],
    };

    var fileInput = form.querySelector('input[type="file"]');
    if (fileInput && fileInput.files && fileInput.files.length) {
      try {
        for (var i = 0; i < fileInput.files.length; i++) {
          var file = fileInput.files[i];
          if (file.size > MAX_FILE_BYTES) {
            throw new Error('DATEI_ZU_GROSS');
          }
          payload.files.push(await readFileAsBase64(file));
        }
      } catch (error) {
        submitBtn.disabled = false;
        submitBtn.textContent = defaultLabel;
        if (error && error.message === 'DATEI_ZU_GROSS') {
          setStatus(form, 'Die Datei ist zu groß (max. 10 MB).', 'error');
        } else {
          setStatus(form, 'Die Datei konnte nicht gelesen werden.', 'error');
        }
        return;
      }
    }

    try {
      var response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      var result = await response.json().catch(function () {
        return {};
      });

      if (!response.ok) {
        throw new Error(result.error || 'Senden fehlgeschlagen');
      }

      form.reset();
      if (fileInput) updateFileLabel(fileInput);
      setStatus(form, 'Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet.', 'success');
    } catch (error) {
      setStatus(
        form,
        'Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt per E-Mail.',
        'error'
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = defaultLabel;
    }
  }

  function init() {
    document.querySelectorAll('.contact-form').forEach(function (form) {
      form.addEventListener('submit', handleSubmit);

      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn && !submitBtn.getAttribute('data-default-label')) {
        submitBtn.setAttribute('data-default-label', submitBtn.textContent.trim());
      }

      var fileInput = form.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.addEventListener('change', function () {
          updateFileLabel(fileInput);
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
