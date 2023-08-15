'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

/* for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal); */

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//? Adding smooth scroll

btnScrollTo.addEventListener('click', function (e) {
  // e.preventDefault();
  // const s1cords = section1.getBoundingClientRect();

  // console.log(s1cords);
  // // console.log(e.target.getBoundingClientRect());
  // console.log('Scroll:x:', window.pageXOffset, 'y', window.pageYOffset);
  // // console.log(
  // //   'height',
  // //   document.documentElement.clientHeight,
  // //   'width',
  // //   document.documentElement.width
  // // );

  // //Scrool Window
  // // window.scrollTo({
  // //   left: s1cords.left,
  // //   top: s1cords.top + window.pageYOffset,
  // //   behavior: 'smooth',
  // // });
  section1.scrollIntoView({ behavior: 'smooth' });
  // console.log('Scroll:x:', window.pageXOffset, 'y', window.pageYOffset);
});

//* Page navigation
//! Dumb Approach
// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const section = document.querySelector(this.getAttribute('href'));
//     section.scrollIntoView({ behavior: 'smooth' });
//   });
// });
//! Smart Approach, all the child elements inherit the event listener and we can actually catch the event in the parent and perform anything
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const section = document.querySelector(e.target.getAttribute('href'));
    section.scrollIntoView({ behavior: 'smooth' });
  }
});

//! Tabbed content

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard Clause
  if (!clicked) return;

  //Removing active class from all the elements
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );
  //adding active class to the clicked element
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//! Hover animation on Navigation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(sibling => {
      if (sibling !== link) sibling.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//! Sticky Navigation

// console.log();
const header = document.querySelector('.header');
//const navHeight = nav.getBoundingClientRect().height;

const headerObs = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  entry.isIntersecting
    ? nav.classList.remove('sticky')
    : nav.classList.add('sticky');
};

const headerObserver = new IntersectionObserver(headerObs, {
  root: null,
  threshold: 0,
  rootMargin: `-${window.getComputedStyle(nav).height}`,

  //rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//! Fading animation on sections

const sections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  //? Can Also Use Guard Clause here
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

sections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//! Lazy Loading of the images

const imageTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imageTargets.forEach(img => imageObserver.observe(img));

//! Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  let currentSlide = 0;
  const maxSlide = slides.length;
  const dotsContainer = document.querySelector('.dots');

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class= "dots__dot" data-slide= '${i}'></button>`
      );
    });
  };
  const activateDot = function (slide) {
    const dots = document.querySelectorAll('.dots__dot');
    dots.forEach(dot => {
      dot.classList.remove('dots__dot--active');
      if (dot.dataset.slide == slide) {
        dot.classList.add('dots__dot--active');
      }
    });
  };

  const goToSlide = function (slide) {
    slides.forEach((s, index) => {
      s.style.transform = `translateX(${(index - slide) * 100}%)`;
    });
  };
  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const init = function () {
    createDots();
    goToSlide(0);
    activateDot(currentSlide);
  };
  init();
  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', prevSlide);

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();

///! Lectures
// const obsCallBack = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0.25, 0.5, 0.75, 1],
// };

// const observer = new IntersectionObserver(obsCallBack, obsOptions);
// observer.observe(section1);

/* const header = document.querySelector('.header');

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = `<p>We use cookies to improve your experience and functionality.</p><button class='btn btn--close-cookie'>Got it!</button>`;
header.after(message);

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function (e) {
    message.remove();
  });

message.style.backgroundColor = '#dddddd';
message.style.height =
  Number.parseInt(getComputedStyle(message).height) + 20 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'gray');

const logo = document.querySelector('.nav__logo');

console.log(logo.classList.contains('nav__logo')); */

//rgb(255,255,255)

/* const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// console.log(randomColor());
document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target);
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('Container', e.target);
});
document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target);
});
*/
/* document.addEventListener('DOMContentLoaded', function (e) {
  console.log('DOM content Loaded', e);
});

window.addEventListener('load', function (e) {
  console.log('Window is loaded, resources are downloaded', e);
});
window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
}); */
