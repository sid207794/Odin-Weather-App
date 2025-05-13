import './style.css';

let count = 1;

const imageNavigation = (function () {
  const footerNavigation = (function () {
    const slider = document.querySelector('.footer .slider');
    const images = document.querySelectorAll('.content .images img');
    const body = document.querySelector('body');
    const imagesLength = images.length;

    for (let i = 0; i < imagesLength; i++) {
      const button = document.createElement('button');
      button.classList.add('quickNavButton');
      button.classList.add('hidden');
      slider.appendChild(button);

      button.addEventListener('click', () => {
        if (!button.classList.contains('visible')) {
          const buttonIndex = Array.from(sliderChildren).findIndex(
            (item) => item === button
          );
          images.forEach((image) => {
            if (image.classList.contains('visible')) {
              image.classList.remove('visible');
              image.classList.add('hidden');
            }
          });

          sliderChildren.forEach((item) => {
            if (item.classList.contains('visible')) {
              item.classList.remove('visible');
              item.classList.add('hidden');
            }
          });

          images[buttonIndex].classList.remove('hidden');
          images[buttonIndex].classList.add('visible');
          sliderChildren[buttonIndex].classList.remove('hidden');
          sliderChildren[buttonIndex].classList.add('visible');
          body.style.backgroundImage = `url("${images[buttonIndex].src}")`;

          if (buttonIndex === 5) {
            count = 0;
          } else {
            count = buttonIndex + 1;
          }
        }
      });
    }

    const sliderChildren = document.querySelectorAll(
      '.footer .slider .quickNavButton'
    );
    sliderChildren[0].classList.remove('hidden');
    sliderChildren[0].classList.add('visible');
  })();

  const arrowNavigation = (function () {
    const nextButton = document.querySelector('.rightButton .next');
    const previousButton = document.querySelector('.leftButton .previous');
    const body = document.querySelector('body');

    nextButton.addEventListener('click', () => {
      const images = document.querySelectorAll('.content .images img');
      const sliderChildren = document.querySelectorAll(
        '.footer .slider .quickNavButton'
      );
      const imagesLength = images.length;

      if (count - 1 >= 0) {
        images[count - 1].classList.remove('visible');
        images[count - 1].classList.add('hidden');
        sliderChildren[count - 1].classList.remove('visible');
        sliderChildren[count - 1].classList.add('hidden');
      } else {
        images[imagesLength - 1].classList.remove('visible');
        images[imagesLength - 1].classList.add('hidden');
        sliderChildren[imagesLength - 1].classList.remove('visible');
        sliderChildren[imagesLength - 1].classList.add('hidden');
      }

      images[count].classList.remove('hidden');
      images[count].classList.add('visible');
      sliderChildren[count].classList.remove('hidden');
      sliderChildren[count].classList.add('visible');
      body.style.backgroundImage = `url("${images[count].src}")`;

      if (count === imagesLength - 1) {
        count = 0;
      } else {
        count++;
      }
    });

    previousButton.addEventListener('click', () => {
      const images = document.querySelectorAll('.content .images img');
      const sliderChildren = document.querySelectorAll(
        '.footer .slider .quickNavButton'
      );
      const imagesLength = images.length;

      if (count - 1 >= 0) {
        images[count - 1].classList.remove('visible');
        images[count - 1].classList.add('hidden');
        sliderChildren[count - 1].classList.remove('visible');
        sliderChildren[count - 1].classList.add('hidden');
      } else {
        images[imagesLength - 1].classList.remove('visible');
        images[imagesLength - 1].classList.add('hidden');
        sliderChildren[imagesLength - 1].classList.remove('visible');
        sliderChildren[imagesLength - 1].classList.add('hidden');
      }

      if (count - 2 >= 0) {
        images[count - 2].classList.remove('hidden');
        images[count - 2].classList.add('visible');
        sliderChildren[count - 2].classList.remove('hidden');
        sliderChildren[count - 2].classList.add('visible');
        body.style.backgroundImage = `url("${images[count - 2].src}")`;
      } else if (count === 1) {
        images[imagesLength - 1].classList.remove('hidden');
        images[imagesLength - 1].classList.add('visible');
        sliderChildren[imagesLength - 1].classList.remove('hidden');
        sliderChildren[imagesLength - 1].classList.add('visible');
        body.style.backgroundImage = `url("${images[imagesLength - 1].src}")`;
      } else if (count === 0) {
        images[imagesLength - 2].classList.remove('hidden');
        images[imagesLength - 2].classList.add('visible');
        sliderChildren[imagesLength - 2].classList.remove('hidden');
        sliderChildren[imagesLength - 2].classList.add('visible');
        body.style.backgroundImage = `url("${images[imagesLength - 2].src}")`;
      }

      if (count === 0) {
        count = imagesLength - 1;
      } else {
        count--;
      }
    });
  })();
})();

const addImage = (function () {
  const menu = document.querySelector('.menuKebab');
  const menuBox = document.querySelector('.menuBox');

  menu.addEventListener('click', () => {
    if (menuBox.classList.contains('visible')) {
      menuBox.classList.remove('visible');
      menuBox.classList.add('hidden');
    } else {
      menuBox.classList.add('visible');
      menuBox.classList.remove('hidden');
    }
  });
})();

const slideshow = (function () {
  const frame = document.querySelector('.frame');
  const blurWall = document.querySelector('.blurWall');
  const nextButton = document.querySelector('.rightButton .next');
  const headerText = document.querySelector('.header .text');
  const images = document.querySelectorAll('.content .images img');

  headerText.classList.add('glow');
  setInterval(() => {
    nextButton.click();
  }, 5000);

  images.forEach((image) => {
    image.addEventListener('click', () => {
      frame.classList.toggle('fullscreen');
      blurWall.classList.toggle('unblur');
    });
  });
})();
