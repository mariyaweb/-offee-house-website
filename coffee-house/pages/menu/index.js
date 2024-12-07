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

/*Menu*/
const menuTabs = document.querySelectorAll('.tab__item');
const refreshBtn = document.querySelector('.btn-refresh');
const menuCards = document.querySelector('.menu__cards');
let categoryArr = [];

menuTabs.forEach((item) => item.addEventListener("click", (e) => changeTab(e)));
refreshBtn.addEventListener("click", () => showAllCards());


showCards();


function changeTab(e) {
  removeShowAllCards();
  const cardsItems = document.querySelectorAll('.card__item');
  cardsItems.forEach(card => card.remove());
  menuTabs.forEach((item) => {
    item.classList.remove('tab__item-active');
    item.classList.remove('tab__item-disabled');
  })
  e.currentTarget.classList.add('tab__item-active');
  let tabCategory = e.currentTarget.getAttribute('data-category');
  showCards(tabCategory);
}

//Create the menu cards
class menuCard {
  constructor(img, title, description, price) {
    this.img = img;
    this.alt = title;
    this.title = title;
    this.description = description;
    this.price = price;
  }

  render() {
    const item = document.createElement('div');
    item.classList.add('card__item');
    item.dataset.name = this.title;
    item.addEventListener('click', (e) => { openModal(e) });
    item.innerHTML = `
    <div class="card__img"><img src=${this.img} alt=${this.alt}></div>
    <div class="card__description description__row">
      <div class="description__item">
        <h3 class="card__title">${this.title}</h3>
        <p class="card__subtitle">${this.description}</p>
      </div>
      <p class="card__price">$${this.price}</p>
    </div>
    `;
    document.querySelector('.menu__cards').append(item);
  }
}


async function getProductsList() {
  const res = await fetch('../../assets/products.json');
  return await res.json();
}

function showCards(tabCategory = "coffee") {
  getProductsList()
    .then(data => {
      categoryArr = [];
      data.products.forEach((item) => {
        if (item.category === tabCategory) {
          categoryArr.push(item);
        }
      });

      if (categoryArr.length <= 4) {
        refreshBtn.classList.add('btn-refresh-hidden');
      } else {
        refreshBtn.classList.remove('btn-refresh-hidden');
      }
      return categoryArr;
    })
    .then(data => {
      data.forEach(({ name, description, price }, index) => {
        new menuCard(`../../assets/img/${tabCategory}/${tabCategory}-${index + 1}.png`, name, description, price).render();
      })
    })
}


function showAllCards() {
  refreshBtn.classList.add('btn-refresh-hidden');
  menuCards.classList.add('menu__cards-visible');
}

function removeShowAllCards() {
  refreshBtn.classList.remove('btn-refresh-hidden');
  menuCards.classList.remove('menu__cards-visible');
}

window.addEventListener('resize', () => { removeShowAllCards() });


/*Modal*/
let itemArr = []
function openModal(e) {
  e.preventDefault();
  let productName = e.currentTarget.getAttribute('data-name');
  getProductsList()
    .then(data => {
      itemArr = [];
      data.products.forEach((item) => {
        if (item.name === productName) {
          itemArr.push(item);
        }
      });
      console.log(itemArr);
      return itemArr;
    })
    .then(data => {
      console.log(data[0].additives[0][`add-price`]);
      data.forEach(({ position, name, description, price, category, sizes, additives }) => {
        new createModal(`../../assets/img/${category}/${category}-${position}.png`, name, description, price, category, sizes, additives).render();
      })
    })

  document.querySelector('.modal').classList.remove('modal-hide');
  document.querySelector('.modal').classList.add('modal-show');
  document.body.style.overflow = "hidden";
  console.log(e);
  console.log(e.currentTarget.getAttribute('data-name'));
}

function closeModal(e) {
  e.preventDefault();
  document.querySelector('.modal').classList.remove('modal-show');
  document.querySelector('.modal').classList.add('modal-hide');
  document.body.style.overflow = "visible";
  const modalPrevInfo = document.querySelector('.modal__container').remove();
}

let modal = document.querySelector('.modal');

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal(e);
})



class createModal {
  constructor(img, name, description, price, category, sizes, additives) {
    this.img = img;
    this.alt = name;
    this.title = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.sizes = sizes;
    this.additives = additives;
  }


  render() {
    const item = document.createElement('div');
    item.classList.add('modal__container');
    item.classList.add('products');
    item.innerHTML = `
    <div class="products__img"><img src=${this.img} alt=${this.alt}></div>
    <div class="products__descr">
      <div class="products__name">
        <h3 class="products__title">${this.title}</h3>
        <p class="products__subtitle">${this.description}</p>
      </div>
      <div class="products__size options">
        <div class="options__title">Size</div>
        <div class="options__btns btns-size">
          <div class="option__btn option__btn-active btn-size" data-price=${this.sizes.s[`add-price`]}>
            <div class="option__ico">S</div>
            <p class="option__btn-text">${this.sizes.s.size}</p>
          </div>
          <div class="option__btn option__btn-disabled btn-size" data-price=${this.sizes.m[`add-price`]}>
            <div class="option__ico">M</div>
            <p class="option__btn-text">${this.sizes.m.size}</p>
          </div>
          <div class="option__btn option__btn-disabled btn-size" data-price=${this.sizes.l[`add-price`]}>
            <div class="option__ico">L</div>
            <p class="option__btn-text">${this.sizes.l.size}</p>
          </div>
        </div>
      </div>
      <div class="products__additives options">
        <div class="options__title">Additives</div>
        <div class="options__btns btns-additives">
          <div class="option__btn option__btn-disabled btn-additives" data-price=${this.additives[0][`add-price`]}>
            <div class="option__ico">1</div>
            <p class="option__btn-text">${this.additives[0].name}</p>
          </div>
          <div class="option__btn option__btn-disabled btn-additives" data-price=${this.additives[0][`add-price`]}>
            <div class="option__ico">2</div>
            <p class="option__btn-text">${this.additives[1].name}</p>
          </div>
          <div class="option__btn option__btn-disabled btn-additives" data-price=${this.additives[0][`add-price`]}>
            <div class="option__ico">3</div>
            <p class="option__btn-text">${this.additives[2].name}</p>
          </div>
        </div>
      </div>
      <div class="products__costs">
        <h3 class="products__title">Total:</h3>
        <h3 class="products__price" data-price=${this.price}>$${this.price}</h3>
      </div>

      <div class="products__alert">
        <div class="products__info"><img src="../../assets/img/info-empty.svg" alt="info"></div>
        <p class="products__infotxt">The cost is not final. Download our mobile app to see the final price and place
          your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</p>
      </div>
      <a href="#" class="products__btn">Close</a>
    </div>
   `;

    document.querySelector('.modal__wrapper').append(item);
    document.querySelector('.products__btn').addEventListener('click', (e) => closeModal(e));
    document.querySelectorAll('.btn-size').forEach(item => item.addEventListener('click', (e) => chooseSize(e)));
    document.querySelectorAll('.btn-additives').forEach(item => item.addEventListener('click', (e) => chooseAdditives(e)));
  }
}

function chooseSize(e) {
  document.querySelectorAll('.btn-size').forEach(item => {
    item.classList.remove('option__btn-active');
  });
  e.currentTarget.classList.remove('option__btn-disabled');
  e.currentTarget.classList.add('option__btn-active');
  return calcPrice();
}
function chooseAdditives(e) {
  if (e.currentTarget.classList.contains('option__btn-active')) {
    e.currentTarget.classList.remove('option__btn-active');
  } else {
    e.currentTarget.classList.remove('option__btn-disabled');
    e.currentTarget.classList.add('option__btn-active');
  }
  return calcPrice();
}


function calcPrice() {
  const prevPrice = document.querySelector('.products__price').getAttribute('data-price');
  let sizePrice = 0;
  let additivesPrice = 0;



  document.querySelectorAll('.btn-size').forEach(item => {
    if (item.classList.contains('option__btn-active')) {
      sizePrice = +item.getAttribute('data-price');
    }
  });

  document.querySelectorAll('.btn-additives').forEach(item => {
    if (item.classList.contains('option__btn-active')) {
      additivesPrice += +item.getAttribute('data-price');
    }
  });


  const sumPrice = (+prevPrice + +sizePrice + +additivesPrice).toFixed(2);
  console.log(sumPrice);

  document.querySelector('.products__price').innerHTML = `
  $${sumPrice}`
}