const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const closeCart = document.querySelector(".close");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const passwordInput = document.querySelector("#password");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
const buttonLogin = document.querySelector(".button-login");
const cardsRestaurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");

const restaurantTitle = document.querySelector(".restaurant-title");
const restaurantRating = document.querySelector(".rating");
const restaurantPrice = document.querySelector(".price");
const restaurantCategory = document.querySelector(".category");
const inputSearch = document.querySelector(".input-search");
const modalBody = document.querySelector(".modal-body");
const modalPrice = document.querySelector(".modal-pricetag");
const buttonClearCart = document.querySelector(".clear-cart");

const modalDialog = document.querySelector('.modal-dialog');
const swiperPagination = document.querySelector('.swiper-pagination');



let login = localStorage.getItem("gloDelivery");

const cart = JSON.parse(localStorage.getItem(`gloDelivery_${login}`)) || [];


function saveCart() {
  localStorage.setItem(`gloDelivery_${login}`, JSON.stringify(cart));
}

function downloadCart() {
  if (localStorage.getItem(`gloDelivery_${login}`)) {
      const data = JSON.parse(localStorage.getItem(`gloDelivery_${login}`));
      data.forEach(function (item) {
        cart.push(item)
      })
  }
}


const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, 
    статус: ${response.status}!`);
  }
  return await response.json();
};

getData("./db/partners.json");

function validName(str) {
  const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{3,20}$/;
  return regName.test(str);
}
 
function toggleModal() {
  modal.classList.toggle("is-open");
}

function renderCart() {
  modalBody.textContent = "";
  cart.forEach(function ({ id, title, cost, count }) {
    const itemCart = `
      <div class="food-row">
					<span class="food-name">${title}</span>
          <strong class="food-price">${cost}</strong>
					<strong class="food-price-ruble">₽</strong>
				<div class="food-counter">
					<button class="counter-button counter-minus" data-id=${id}>-</button>
					<span class="counter">${count}</span>
					<button class="counter-button counter-plus" data-id=${id}>+</button>
				</div>
      </div>
        `;
    modalBody.insertAdjacentHTML("afterbegin", itemCart);
  });

  const totalPrice = cart.reduce(function (result, item) {
    return result + parseFloat(item.cost) * item.count;
  }, 0);

  modalPrice.textContent = totalPrice + " ₽";
  saveCart();
}

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
  if (modalAuth.classList.contains("is-open")) {
    disableScroll();
  } else {
    enableScroll();
  }
  loginInput.style.borderColor = "";
  passwordInput.style.borderColor = "";
}

function toggleModalCart(){
  
  if (modal.classList.contains("is-open")) {
    disableScroll();
  } else {
    enableScroll();
  }
}

function returnMain() {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.remove('hide')
}

function authorized() {
  function logOut() {
    login = null;
    cart.length = 0;
    
    localStorage.removeItem("gloDelivery");
    buttonAuth.style.display = "";
    userName.style.display = "";
    buttonOut.style.display = "";
    cartButton.style.display = "";
    buttonOut.removeEventListener("click", logOut);
    checkAuth();
    location.href=location.href;
  }

  userName.textContent = login;

  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "flex";
  cartButton.style.display = "flex";
  buttonOut.addEventListener("click", logOut);
}

function notAuthorized() {
  function logIn(event) {
    event.preventDefault();

    if (validName(loginInput.value.trim())) {
      login = loginInput.value;
      localStorage.setItem("gloDelivery", login);
      toggleModalAuth();
      downloadCart();
      buttonAuth.removeEventListener("click", toggleModalAuth);
      closeAuth.removeEventListener("click", toggleModalAuth);
      closeCart.removeEventListener("click", toggleModalCart);
      logInForm.removeEventListener("submit", logIn);
      logInForm.reset();
      checkAuth();
    } else if (passwordInput.value.trim()) {
      passwordInput.style.borderColor = "red";
      passwordInput.value = "";
    } else {
      loginInput.style.borderColor = "red";
      loginInput.value = "";
    }
  }

  buttonAuth.addEventListener("click", toggleModalAuth);
  closeAuth.addEventListener("click", toggleModalAuth );
  logInForm.addEventListener("submit", logIn);
  modalAuth.addEventListener("click", function (event) {
    if (event.target.classList.contains("is-open")) {
      toggleModalAuth();
    }
  });
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurant(restaurant) {
  //Деструктуризация объекта
  const {
    image,
    kitchen,
    name,
    price,
    stars,
    products,
    time_of_delivery: timeOfDelivery, // переименование во время деструктуризации
  } = restaurant;

  const cardRestaurant = document.createElement("a");
  cardRestaurant.className = "card card-restaurant";
  cardRestaurant.products = products;
  cardRestaurant.info = { kitchen, name, price, stars };

  const card = `  
						<img src="${image}" alt="${name}" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">${name}</h3>
								<span class="card-tag tag">${timeOfDelivery} мин</span>
							</div>
							<div class="card-info">
								<div class="rating">
									${stars}
								</div>
								<div class="price">От ${price} ₽</div>
								<div class="category">${kitchen}</div>
							</div>
						</div>
        `;
  cardRestaurant.insertAdjacentHTML("beforeend", card);
  cardsRestaurants.insertAdjacentElement("beforeend", cardRestaurant);
}

function createCardGood({ description, id, image, name, price }) {
  const card = document.createElement("div");
  card.className = "card";

  card.insertAdjacentHTML(
    "beforeend",
    `
  <img src="${image}" alt="${name}" class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
				<h3 class="card-title card-title-reg">${name}</h3>
			</div>
			<div class="card-info">
				<div class="ingredients">${description}
			</div>
			</div>
		<div class="card-buttons">
		  <button class="button button-primary button-add-cart" id=${id}>
			  <span class="button-card-text">В корзину</span>
			  <span class="button-cart-svg"></span>
      </button>
      
      <strong class="card-price card-price-bold">${price}</strong> 
      <strong class="card-price-bold right">₽</strong> 
  </div>          
  `
  );

  cardsMenu.insertAdjacentElement("beforeend", card);
}

function openGoods(event) {
  const target = event.target;

  if (login) {
    const restaurant = target.closest(".card-restaurant");
    if (restaurant) {
      cardsMenu.textContent = "";
      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      swiperPagination.classList.add("hide");
      menu.classList.remove("hide");

      const { name, kitchen, price, stars } = restaurant.info;
      restaurantTitle.textContent = name;
      restaurantRating.textContent = stars;
      restaurantPrice.textContent = `От ${price} ₽`;
      restaurantCategory.textContent = kitchen;

      getData(`./db/${restaurant.products}`).then(function (data) {
        data.forEach(createCardGood);
      });
    }
  } else {
    toggleModalAuth();
  }
}

function addToCart(event) {
  const target = event.target;

  const buttonAddToCart = target.closest(".button-add-cart");

  if (buttonAddToCart) {
    const card = target.closest(".card");
    const title = card.querySelector(".card-title-reg").textContent;
    const cost = card.querySelector(".card-price").textContent;
    const id = buttonAddToCart.id;

    const food = cart.find(function (item) {
      return item.id === id;
    });

    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1,
      });
    }

    saveCart();
  }
}

function changeCount(event) {
  const target = event.target;

  if (target.classList.contains("counter-button")) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });

    if (target.classList.contains("counter-minus")) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1)
      }
    }

    if (target.classList.contains("counter-plus")) {
      food.count++;
    }
    renderCart();
  }
}

function init() {
  getData("./db/partners.json").then(function (data) {
    data.forEach(createCardRestaurant);
  });

  buttonClearCart.addEventListener('click', function() {
    cart.length = 0;
    renderCart();
    toggleModal();
    enableScroll();
  })

  cardsMenu.addEventListener("click", addToCart);

  modal.addEventListener("click", function (event) {
    if (event.target.classList.contains("is-open")) {
      toggleModal();
      enableScroll();
  }
})

  cartButton.addEventListener("click", function () {
    renderCart();
    toggleModal();
    toggleModalCart();
  });

  modalBody.addEventListener("click", changeCount);

  close.addEventListener("click", toggleModal);
  close.addEventListener('click', toggleModalCart);

  cardsRestaurants.addEventListener("click", openGoods);

  logo.addEventListener("click", function () {
    containerPromo.classList.remove("hide");
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
  });

  checkAuth();

  inputSearch.addEventListener("keypress", function (event) {
    const value = event.target.value.trim();

    if (!value) {
      event.target.style.backgroundColor = red;
      event.target.value = "";
      setTimeout(function () {
        event.target.style.backgroundColor = "";
      }, 1500);
      return;
    }

    if (event.charCode === 13) {
      const value = event.target.value;
      getData("./db/partners.json")
        .then(function (data) {
          return data.map(function (partner) {
            return partner.products;
          });
        })
        .then(function (linksProduct) {
          cardsMenu.textContent = "";

          linksProduct.forEach(function (link) {
            getData(`./db/${link}`).then(function (data) {
              const resultSearch = data.filter(function (item) {
                const name = item.name.toLowerCase();
                return name.includes(value.toLowerCase());
              });

              containerPromo.classList.add("hide");
              restaurants.classList.add("hide");
              menu.classList.remove("hide");

              restaurantTitle.textContent = "Результат поиска";
              restaurantRating.textContent = "";
              restaurantPrice.textContent = "";
              restaurantCategory.textContent = "разная кухня";
              resultSearch.forEach(createCardGood);
              inputSearch.value = "";
            });
          });
        });
    }
  });

  //Slider

  new Swiper(".swiper-container", {
    sliderPerView: 1,
    loop: true,
    autoplay: {
      delay: 4500,
    },
    effect: "cube",
    grabCursor: true,
    cubeEffect: {
      shadow: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}

init();