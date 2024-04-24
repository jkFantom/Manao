const htmlEl = document.documentElement;
const form = document.getElementsByName('feedback-form')[0];
const inputs = form.querySelectorAll('.field__input');
const dialog = document.getElementById('success-validation-form');
const closeDialogButton = dialog.querySelector('.close-button');

const initHeader = () => {
  const header = document.querySelector('.header');
  const mobileLayer = document.querySelector('.mobile-layer');
  const mobileNavButton = document.querySelector('[data-mobile-nav]');
  const closeMobileNavButton = document.querySelector('[data-close-mobile-nav]');

  window.addEventListener('scroll', () => {
    window.scrollY > 0
      ? header.setAttribute('data-fixed', '')
      : header.removeAttribute('data-fixed');
  })

  mobileNavButton.addEventListener('click', () => {
    htmlEl.classList.add('no-scroll');
    mobileLayer.toggleAttribute('aria-hidden');
  });

  closeMobileNavButton.addEventListener('click', () => {
    htmlEl.classList.remove('no-scroll');
    mobileLayer.toggleAttribute('aria-hidden');
  });
}

const swiper = new Swiper('.swiper', {
  slidesPerView: 1,
  spaceBetween: 24,
  navigation: {
    nextEl: '.swiper-buttons__next',
    prevEl: '.swiper-buttons__prev',
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    enabled: true,
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
    1240: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
});

const feedbackFormValidation = () => {
  const showError = (input, message) => {
    const errorElement = input.closest('.field').querySelector('.field__error');

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  const clearError = input => {
    const errorElement = input.closest('.field').querySelector('.field__error');

    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

  const validateName = input => {
    const value = input.value.trim();
    const invalidCharactersRegex = /[!@#$%^&*()_+"0-9]/;
    const maxLength = 20;

    if (value === '') {
      showError(input, 'Ошибка! Введите ваше имя');
      return false;
    } else if (invalidCharactersRegex.test(value)) {
      showError(input, 'Ошибка! Введите корректное имя');
      return false;
    } else if (value.length > maxLength) {
      showError(input, `Ошибка! Имя не должно превышать ${maxLength} символов`);
      return false;
    } else {
      clearError(input);
      return true;
    }
  }

  const validateComment = input => {
    const value = input.value.trim();

    if (value === '') {
      showError(input, 'Ошибка! Введите описание задачи');
      return false;
    } else {
      clearError(input);
      return true;
    }
  }

  const validateWebsite = input => {
    const value = input.value.trim();
    const websiteRegex = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/;

    if (value === '') {
      showError(input, 'Ошибка! Введите название сайта');
      return false;
    } else if (!websiteRegex.test(value)) {
      showError(input, 'Ошибка! Введите корректное название сайта (например: www.domain.com)');
      return false;
    } else {
      clearError(input);
      return true;
    }
  }

  const createFormField = selector => document.getElementsByName(selector)[0];

  const addModifierForNotEmptyFields = () => {
    inputs.forEach(input => {
      input.addEventListener('change', () => {
        ( input.value.trim() !== '' )
          ? input.classList.add('field__input_filled')
          : input.classList.remove('field__input_filled');
      })
    });
  }

  const isFormValid = () => {
    const name = createFormField('name');
    const website = createFormField('website');
    const comment = createFormField('comment');

    const isValidName = validateName(name);
    const isValidWebsite = validateWebsite(website);
    const isValidComment = validateComment(comment);

    return (
      isValidName &&
      isValidWebsite &&
      isValidComment
    );
  }

  addModifierForNotEmptyFields();

  form.addEventListener('submit', e => {
    e.preventDefault();

    if (!isFormValid()) {
      return;
    }

    dialog.showModal();
    htmlEl.classList.add('no-scroll');
  });
}

const printFeeedbackFormDataOnConsole = () => {
  console.log( Object.fromEntries(new FormData(form).entries()) );
}

const closeSuccessDialog = () => {
  const handleCloseDialog = () => {
    dialog.close();
    htmlEl.classList.remove('no-scroll');
    printFeeedbackFormDataOnConsole();
    form.reset();
    inputs.forEach(input => input.classList.remove('field__input_filled'));
  }
  const closeOnBackDropClick = ({ currentTarget, target }) => target === currentTarget && handleCloseDialog();

  closeDialogButton.addEventListener('click', handleCloseDialog);

  dialog.addEventListener('click', closeOnBackDropClick);
}

initHeader();

feedbackFormValidation();

closeSuccessDialog();
