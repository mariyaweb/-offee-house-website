console.log('COFFEE HOUSE (part 3)\nОтзыв по пунктам ТЗ (90 из 90)\n\n1. Implementation of the burger menu on both pages [22/22] \n\n2. Implementation of the carousel on the home page [24/24]\n\n3. Categories of products on the menu page [16/16]\n\n4. The Modal on the menu page [20/20]\n\n5. Video on the home page [8/8]\n\n');

/*Burger menu*/
const burger = document.querySelector('.header__burger');
const headerNav = document.querySelector('.header__nav');
const headerList = document.querySelector('.header__list');
const menuItems = document.querySelectorAll('.header__item');


function toggleMenu() {
  if (burger.classList.contains('active')) {
    burger.classList.remove('active');
    headerNav.classList.remove('active');
    headerList.classList.remove('active');
    document.body.style.overflow = "visible";
  } else {
    burger.classList.add('active');
    headerNav.classList.add('active');
    headerList.classList.add('active');
    document.body.style.overflow = "hidden";
  }
}

burger.addEventListener('click', toggleMenu);
menuItems.forEach((item) => item.addEventListener("click", toggleMenu));

document.addEventListener('click', (e) => {
  if (e.composedPath().includes(document.querySelector('.header__logo')) && burger.classList.contains('active')) {
    toggleMenu();
  }
})

/*Favorite Coffee slider*/

//Create cards using classes
class favoriteCoffee {
  constructor(img, alt, title, descr, price) {
    this.img = img;
    this.alt = alt;
    this.title = title;
    this.descr = descr;
    this.price = price;
    this.wrapper = document.querySelector('.slider__wrapper');
  }

  render() {
    const item = document.createElement('div');
    item.innerHTML = `
    <div class="slider__item">
    <img src=${this.img} alt=${this.alt} class="slider__img">
    <h3 class="slider__title">${this.title}</h3>
    <p class="slider__description">${this.descr}</p>
    <h3 class="slider__price">$${this.price}</h3>
  </div>
    `;
    document.querySelector('.slider__container').append(item);
  }

}

new favoriteCoffee(
  "../../assets/img/coffee-slider-1.png",
  "coffee",
  "S\’mores Frappuccino",
  "T'his new drink takes an espresso and mixes it with brown sugar and cinnamon before being topped with oat milk.",
  '5.50'
).render();

new favoriteCoffee(
  "../../assets/img/coffee-slider-2.png",
  "coffee",
  "Caramel Macchiato",
  "Fragrant and unique classic espresso with rich caramel-peanut syrup, with cream under whipped thick foam.",
  '5.00'
).render();

new favoriteCoffee(
  "../../assets/img/coffee-slider-3.png",
  "coffee",
  "Ice coffee",
  "A popular summer drink that tones and invigorates. Prepared from coffee, milk and ice.",
  '4.50'
).render();


//Create Carousel
const sliderWrapper = document.querySelector('.slider__wrapper');
const sliderContainer = document.querySelector('.slider__container');
const getWidthWrapper = window.getComputedStyle(sliderWrapper).width;
const widthWrapper = +getWidthWrapper.slice(0, getWidthWrapper.length - 2);
const totalSlides = document.querySelectorAll('.slider__item').length - 1;
const slide = document.querySelector('.slider__item');
const btnPrev = document.querySelector('.arrow__left');
const btnNext = document.querySelector('.arrow__right');
const controls = document.querySelectorAll('.controls__item');
const sliderFavorite = document.querySelector('.favorite__slider');
let status = true;

let currentSlide = 0;
let offset = 0;
let continuePoint;
let timer;


autoMoveSlide();

btnNext.addEventListener('click', () => { moveSlideNext() });
btnPrev.addEventListener('click', () => { moveSlidePrev() });
sliderWrapper.addEventListener('mouseenter', () => { stopMoveSlide() });
sliderWrapper.addEventListener('mouseleave', () => { autoMoveSlide(continuePoint, currentSlide) });


function stopMoveSlide() {

  controls.forEach(item => {
    if (item.value) {
      continuePoint = item.value;
      controls[currentSlide].value = item.value;
      currentSlide = item.getAttribute('data-controls');
    }
  })
  clearInterval(timer);
}


controls.forEach(item => {
  item.addEventListener('click', (e) => {
    clearInterval(timer);
    const slideNumber = e.target.getAttribute('data-controls');
    currentSlide = slideNumber;
    offset = widthWrapper * slideNumber;
    sliderContainer.style.transform = `translateX(-${offset}px)`;
    autoMoveSlide();
  })
});




function autoMoveSlide(start = 0, controlsValue = 0) {
  clearInterval(timer);


  controls.forEach(item => { item.value = 0 });

  timer = setInterval(function () {
    controls[currentSlide].value = start;
    if (start > 100) {
      clearInterval(timer);
      controls[currentSlide].value = controlsValue;
      moveSlideNext();
    } else {
      controls[currentSlide].value = start;
    }
    start++;
  }, 50);

}



function moveSlideNext() {

  clearInterval(timer);
  if (offset == widthWrapper * totalSlides) {
    offset = 0;
    currentSlide = 0;
  } else {
    offset += widthWrapper;
    currentSlide++;
  }
  sliderContainer.style.transform = `translateX(-${offset}px)`;
  autoMoveSlide();

}

function moveSlidePrev() {

  clearInterval(timer);
  if (offset == 0) {
    offset = widthWrapper * totalSlides;
    currentSlide = 2;
  } else {
    offset -= widthWrapper;
    currentSlide--;
  }
  sliderContainer.style.transform = `translateX(-${offset}px)`;
  autoMoveSlide();

}




//Swipe to slide
sliderWrapper.addEventListener("touchstart", getPointTouchStart);
sliderWrapper.addEventListener("touchmove", getPointTouchMove);
sliderWrapper.addEventListener('touchend', () => { autoMoveSlide(continuePoint, currentSlide) });
// sliderWrapper.addEventListener("mousedown", getPointTouchStart);
// sliderWrapper.addEventListener("mousemove", getPointTouchMove);




let pointTouchStart = 0;
let pointTouchMove = 0;


function getPointTouchStart(e) {
  e.preventDefault();
  if (e.type.includes('mouse')) {
    pointTouchStart = e.pageX;
  } else {
    pointTouchStart = e.touches[0].clientX;
  }

}

function getPointTouchMove(e) {
  if (e.type.includes('mouse')) {
    pointTouchMove = e.pageX;
  } else {
    pointTouchMove = e.touches[0].clientX;
  }

  moveTouchSlide();
}


function moveTouchSlide() {
  if (!pointTouchStart) {
    return false;
  }

  let pointsDiff = pointTouchMove - pointTouchStart;


  if (pointsDiff > 0) {
    moveSlidePrev();
  } else {
    moveSlideNext();
  }

  pointTouchStart = 0;
  pointTouchMove = 0;
}


