const header = document.getElementById('site-header');
const navToggle = document.getElementById('nav-toggle');

navToggle.addEventListener('click', () => {
  const isOpen = header.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    header.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Fade sections in as they scroll into view; without IntersectionObserver everything stays visible
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Items already scrolled past (e.g. after an anchor jump) are revealed too
      if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // Show the small header logo only once the big hero logo has scrolled out of view
  const heroLogo = document.querySelector('.hero-logo');
  if (heroLogo) {
    new IntersectionObserver(([entry]) => {
      header.classList.toggle('show-brand', !entry.isIntersecting && entry.boundingClientRect.top < 0);
    }, { rootMargin: `-${header.offsetHeight}px 0px 0px 0px` }).observe(heroLogo);
  }
}

// Contact form: check the fields inline, then send the message to the Worker endpoint
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  const status = document.getElementById('cf-status');
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const requiredFields = [...contactForm.querySelectorAll('[required]')];
  const errorText = {
    name: 'Please enter your name.',
    email: 'Please enter a valid email address.',
    message: 'Please write a message of at least 10 characters.',
    consent: 'Please tick the box so we can reply to you.',
  };
  const thanks = 'Thank you. Your message has been sent and we will reply as soon as we can.';
  const notConnected = 'This form is not connected to an inbox yet, so your message was not sent.';

  const setError = (field, text) => {
    const error = document.getElementById(`${field.id}-error`);
    error.textContent = text;
    error.hidden = !text;
    field.setAttribute('aria-invalid', text ? 'true' : 'false');
  };

  const validate = (field) => {
    const valid = field.checkValidity();
    setError(field, valid ? '' : errorText[field.name]);
    return valid;
  };

  requiredFields.forEach((field) => {
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validate(field);
    });
  });

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.classList.remove('is-error');
    status.textContent = '';

    const invalid = requiredFields.filter((field) => !validate(field));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    const data = Object.fromEntries(new FormData(contactForm));

    // The hidden "website" field is a spam trap: people never see it, bots fill it in
    if (data.website) {
      contactForm.reset();
      status.textContent = thanks;
      return;
    }

    submitButton.disabled = true;
    status.textContent = 'Sending…';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const failure = new Error(`Request failed with status ${response.status}`);
        // The Worker has no /api/contact yet: say so, instead of a vague "try again"
        failure.notConnected = [404, 405, 501].includes(response.status);
        throw failure;
      }
      contactForm.reset();
      status.textContent = thanks;
    } catch (error) {
      status.classList.add('is-error');
      status.textContent = error.notConnected
        ? notConnected
        : 'Sorry, your message could not be sent. Please try again in a moment.';
    } finally {
      submitButton.disabled = false;
    }
  });
}
