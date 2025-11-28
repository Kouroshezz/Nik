import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/splide.min.css';
import '@splidejs/splide/css';
import wNumb from 'wnumb';
import { gsap } from "gsap"


import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css'

document.addEventListener('DOMContentLoaded', function () {


  let tl = gsap.timeline();
  let mm = gsap.matchMedia();  //gsap match media


  // ------------- MENU -------------
  const menu = document.querySelector('ul.menu-items');
  document.querySelector('.menu').addEventListener('click', function () {
    this.classList.toggle('active-menu-button');
    if (menu.classList.contains('show-menu')) {
      menu.classList.remove('show-menu')
    }
    else {
      menu.classList.add('show-menu')
    }
  })

  //---------------------------------
  var splide = new Splide('.splide', {
    type: 'loop',
    gap: '2rem',
    perPage: 1,
    focus: 'center',
    arrows: true,
    pagination: true,
    speed: 600,
    padding: {
      left: '19rem',
      right: '19rem',
    },
    direction: 'rtl',
    breakpoints: {
      480: {
        padding: '3rem',
        gap: '1rem',
      },
    },
  });

  splide.mount();
  // ---------------tab menu functions
  const tabmenu = document.querySelector('.tabmenu');
  const tabContents = document.querySelector('.tab-content');


  document.querySelectorAll('.tabmenu span').forEach(item => {
    item.addEventListener('click', function () {
      let datalink = this.dataset.tablink;
      console.log(datalink)

      tabmenu.querySelectorAll('span').forEach((item) => item.classList.remove(('active')));
      item.classList.add('active');

      // tabContents.querySelectorAll('div[data-tabcontent]').forEach(item => item.classList.remove('show-tabContent'));
      // tabContents.querySelector(`div[data-tabcontent="${datalink}"]`).classList.add('show-tabContent');

      tabContents.querySelectorAll('div[data-tabcontent]').forEach(contentItem => {
        contentItem.classList.remove('show-tabContent');
      });

      const targetContent = tabContents.querySelector(`div[data-tabcontent="${datalink}"]`);
      if (targetContent) {
        targetContent.classList.add('show-tabContent');
      }

    });
  });

  // -------------- RANGE SLIDER

  const rangeVal = document.querySelector('.rangeVal');

  var slider = document.getElementById('slider');
  noUiSlider.create(slider, {
    start: [20],
    connect: 'lower',
    step: 10,
    direction: 'rtl',
    range: {
      'min': 10,
      'max': 100
    },
    pips: {
      mode: 'steps',
      density: 10
    },
    format: wNumb({
      decimals: 0
    }),
    orientation: window.innerWidth <= 600 ? 'vertical' : 'horizontal'
  });

  slider.noUiSlider.on('update', function () {
    let val = slider.noUiSlider.get();
    rangeVal.innerText = slider.noUiSlider.get();
  });

  //---- Tooltip --------

  document.querySelector('.question-tip').addEventListener('focus', function (e) {
    document.querySelector('.tooltip-content').classList.add('showTooltip')
  });
  document.querySelector('.question-tip').addEventListener('blur', hideTooliip);

  document.querySelector('.close-tip').addEventListener('click', hideTooliip);

  function hideTooliip() {
    document.querySelector('.tooltip-content').classList.remove('showTooltip');
    document.querySelector('.question-tip').blur();
  }
  // ---------- FORM FUNCTIONS ---------- 

  document.querySelectorAll('.input-holder input').forEach(item =>
    item.addEventListener('blur', function (e) {

      let regexPattern = this.pattern || /^\d$/;
      let error = this.nextElementSibling || null;
      if (this.name !== 'password') {
        if (e.target.value !== '' && !e.target.value.match(regexPattern)) {
          this.parentElement.classList.add('invalid');
          error.classList.add('show-error');
        }
        else {
          this.parentElement.classList.remove('invalid');
          error.classList.remove('show-error')
        }
      }
    })
  )

  const pwd = document.querySelector('form input[type="password"]');
  pwd.addEventListener('input', function (e) {
    let hasMin = e.target.value.length >= 8;
    let hasNum = /\d/.test(e.target.value);
    let hasSpec = /[!@#$%^&*()_+]/.test(e.target.value);

    let isValid = hasMin && hasNum && hasSpec;
    e.target.parentElement.classList.toggle('invalid',
      e.target.value !== '' && !isValid);

    document.querySelector('.error_minlenght').classList.toggle('checked', hasMin);
    document.querySelector('.error_numbers').classList.toggle('checked', hasNum);
    document.querySelector('.error_special').classList.toggle('checked', hasSpec);

    let allOk = hasMin && hasNum && hasSpec;
    document.querySelectorAll('.password-errors span')
      .forEach(span => span.classList.toggle('valid-pass', allOk));

    // --------hide and show pass 
    let showEyeOpen = e.target.type === 'text';
    document.querySelector('img[data-pass="hide"]').style.display = showEyeOpen ? 'none' : 'block';
    document.querySelector('img[data-pass="show"]').style.display = showEyeOpen ? 'block' : 'none';

  });

  pwd.addEventListener('blur', function (e) {
    const hasMin = e.target.value.length >= 8;
    const hasNum = /\d/.test(e.target.value);
    const hasSpec = /[!@#$%^&*()_+]/.test(e.target.value);
    let isValid = hasMin && hasNum && hasSpec;
    // e.target.parentElement.classList.toggle('invalid',
    //   e.target.value !== '' && !isValid);
    if (isValid)
      document.querySelector('.password-holder').classList.remove('invalid')
  });


  document.querySelectorAll('img[data-pass]').forEach(img =>
    img.addEventListener('click', () => {
      pwd.type = pwd.type === 'password' ? 'text' : 'password';
      pwd.dispatchEvent(new Event('input'));
    })
  );


  const btn = document.querySelector('button[type="submit"]');

  function updateBtn() {
    let formIsValid = true;
    document.querySelectorAll('.input-holder input').forEach(inp => {
      if (inp.name === 'password') {
        let val = inp.value;
        let isPassOk = val.length >= 8 && /\d/.test(val) && /[!@#$%^&*()_+]/.test(val);
        if (!isPassOk) {
          formIsValid = false;
        }
      }
      else {
        let pattern = inp.getAttribute('pattern');
        let regex = new RegExp(pattern);
        if (inp.value.trim() === '' || !regex.test(inp.value)) {
          formIsValid = false;
        }
      }
    });

    btn.disabled = !formIsValid;
  }

  document.querySelectorAll('.input-holder input')
    .forEach(inp => inp.addEventListener('input', updateBtn));

  updateBtn();

  // -------- FORM ACTION ANIMATION


  // --- clear form inputs after actions
  const clearForm = () => {
    document.querySelectorAll('form input').forEach(item => item.value = '')
  }


  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  document.querySelector('form button[type="submit"]').addEventListener('click', function (e) {
    e.preventDefault();

    if (isMobile()) {
      // ---submit animation mobile
      tl.to('.smiley-img', {
        padding: '15px',
        x: '-10px',
        y: '50px',
        duration: 0.8,
      })
        .to('form', {
          y: 50,
          autoAlpha: 0,
          visibility: 'hidden',
          // display: 'none',
          duration: 0.5
        }, '-=0.5')
        .to('.english', {
          y: -50,
          autoAlpha: 0,
          // display: 'none',
          visibility: 'hidden',
          duration: 0.5
        }, '-=0.5')
        .to('.smiley-img', {
          backgroundColor: '#DFFCA1'
        }, '-=.5')
        .to('.success-msg', {
          y: 'auto',
          top: '40%',
          zIndex: 0,
          visibility: 'visible',
          duration: 0.5
        }, '-=0.5');

    } else {
      //  -- desktop animation
      tl.to('.smiley-img', {
        padding: '15px',
        x: '50%',
        y: '-100px',
        duration: 0.8,
      })
        .to('form, .english', {
          y: 50,
          autoAlpha: 0,
          display: 'none',
          duration: 0.5
        }, '-=0.5')
        .to('.smiley-img', {
          backgroundColor: '#DFFCA1'
        })
        .to('.success-msg', {
          y: '-50px',
          zIndex: 0,
          visibility: 'visible',
          duration: 0.5
        }, '-=0.5');
    }
  });

  // go back - success message
  document.querySelector('.goback-s').addEventListener('click', function (e) {


    tl.to('.success-msg', {
      y: '60%',
      zIndex: -1,
      visibility: 'hidden',
      duration: 0.4
    });

    if (isMobile()) {
      tl.to('.smiley-img', {
        padding: 0,
        backgroundColor: 'transparent',
        x: 'auto',
        y: 'auto',
        top: '29%',
        left: 'calc(50% - 17px)'
      });
    } else {

      tl.to('.smiley-img', {
        padding: 0,
        backgroundColor: 'transparent',
        left: 'calc(45% - 30px)',
        x: 0,
        top: '50%',
        y: 0,
      });
    }

    tl.to('form, .english', {
      y: 0,
      autoAlpha: 1,
      display: 'block',
    }, '-=0.5');

    clearForm();
  });

  // -- go back failed message
  document.querySelector('.goback-f').addEventListener('click', function (e) {


    tl.to('.fail-msg', {
      y: '60%',
      visibility: 'hidden',
      zIndex: -1,
      duration: 0.6
    });

    if (isMobile()) {
      // -- in mobile animation
      tl.to('.sad-img', {
        padding: 0,
        backgroundColor: 'transparent',
        x: 'auto',
        y: 'auto',
        top: '29%',
        left: 'calc(50% - 17px)'
      });
    } else {
      // desktop animations - go back 
      tl.to('.sad-img', {
        padding: 0,
        backgroundColor: 'transparent',
        left: 'calc(45% - 30px)',
        x: 0,
        top: '50%',
        y: 0,
      });
    }

    tl.to('form, .english', {
      y: 0,
      autoAlpha: 1,
      display: 'block',
    }, '-=0.5')
      .to('.sad-img', {
        opacity: 0
      })
      .to('.smiley-img', {
        opacity: 1
      }, '-=0.2');

    clearForm();
  });

  // --- cancel form
  document.querySelector('form .cancel').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('.smiley-img').style.opacity = 0;

    if (isMobile()) {
      // mobile cancel
      tl.to('.sad-img', {
        padding: '15px',
        opacity: 1,
        x: '-15px',
        y: '30px',
        duration: 0.8,
      })
        .to('form', {
          y: 50,
          autoAlpha: 0,
          // display: 'none',
          visibility: 'hidden',
          duration: 0.5
        }, '-=0.5')
        .to('.english', {
          y: -50,
          autoAlpha: 0,
          // display: 'none',
          visibility: 'hidden',
          duration: 0.5
        }, '-=0.5')
        .to('.sad-img', {
          backgroundColor: '#FFD4D4'
        }, '-= 0.5')
        .to('.fail-msg', {
          y: '-20px',
          zIndex: 0,
          visibility: 'visible',
          duration: 0.5
        }, '-=0.5');

    } else {
      // === desktop cancel
      tl.to('.sad-img', {
        padding: '15px',
        opacity: 1,
        x: '50%',
        y: '-100px',
        duration: 0.8,
      })
        .to('form, .english', {
          y: 50,
          autoAlpha: 0.5,
          display: 'none',
          duration: 0.5
        }, '-=0.5')
        .to('.sad-img', {
          backgroundColor: '#FFD4D4'
        })
        .to('.fail-msg', {
          y: '-50px',
          zIndex: 0,
          visibility: 'visible',
          duration: 0.5
        }, '-=0.5');
    }

  });
  // ----------- MODAL --------------

  document.querySelectorAll('.tab-content .play-icon').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelector('.modal-wrapper').classList.add('modal_active')
    })
  })

  document.querySelector('.modal-wrapper , .close-icon').addEventListener('click', function (e) {
    if (e.target.classList.contains('modal-wrapper') || e.target.classList.contains('close-icon')) {
      document.querySelector('.modal-wrapper').classList.remove('modal_active')
    }
  })

  // ---------- refresh page on resize = inspect (js code might broke)

  let lastWidth = window.innerWidth;

  window.addEventListener('resize', function () {
    let currentWidth = window.innerWidth;
    if (currentWidth !== lastWidth) {
      window.location.reload();
    }
    lastWidth = currentWidth;
  });
});

