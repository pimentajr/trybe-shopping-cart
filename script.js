const itemsCart = document.querySelector('.cart__items');
const total = document.querySelector('.total-price');
const list = document.querySelector('.items');

// Task 5
const totalPrice = (prices) => {
  total.innerText = (parseFloat(prices.innerText) + parseFloat(prices));
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
   return item.querySelector('span.item__sku').innerText;
}

// Task 3
function cartItemClickListener(event) {
  totalPrice(-event.target.innerText.split('$')[1]);
  event.target.remove();
  localStorage.setItem('cart', itemsCart.innerHTML);
  localStorage.setItem('price', total.innerText);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// References:
// Rest API Header: https://stackoverflow.com/questions/43209924/rest-api-use-the-accept-application-json-http-header
// Fetch: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// Introduction to Fetch: https://developers.google.com/web/updates/2015/03/introduction-to-fetch
// The Coding Train - Fetch(): https://youtu.be/tc8DU14qX6I

// Task 7
const nowLoading = () => {
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerText = 'Loading... Please wait...';
  list.appendChild(loading);
};

const endLoading = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

// Task 1
const mercadoLivreAPI = () => {
  nowLoading();
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const method = { method: 'GET', headers: { Accept: 'application/json' } };
  
  return fetch(url, method)
    .then((response) => response.json())
    .then((json) => json.results
      .forEach((items) => list.appendChild(createProductItemElement(
        { sku: items.id, name: items.title, image: items.thumbnail },
      ))))
      .then(endLoading);
};

// Task 2
const sendToCart = () => {
  const method = { method: 'GET', headers: { Accept: 'application/json' } };
  const addToCart = document.querySelectorAll('.item__add'); // according to line 22
  const itemsInCart = document.querySelector('.cart__items');

  addToCart.forEach((items) => 
    items.addEventListener('click', () => 
      fetch(`https://api.mercadolibre.com/items/${items.parentNode.children[0].innerText}`, method)
        .then((response) => response.json())
        .then((product) => {
          itemsInCart.appendChild(createCartItemElement(
              { sku: product.id, name: product.title, salePrice: product.price },
            ));
        totalPrice(product.price);
        })
        .then(() => localStorage.setItem('itemsCart', itemsCart.innerHTML))
        .then(() => localStorage.setItem('price', total.innerText))));
};

// Task 4
const getCart = () => {
  if (localStorage.itemsCart) {
    itemsCart.innerHTML = localStorage.getItem('itemsCart');
    itemsCart.addEventListener('click', cartItemClickListener);
    total.innerText = localStorage.getItem('actualPrice');
  }
};

// Task 6
const emptyCart = () => {
  localStorage.clear();
  itemsCart.innerHTML = '';
};

document.querySelector('.empty-cart').addEventListener('click', emptyCart);

const asyncStart = async () => {
  await mercadoLivreAPI();
  await sendToCart();
  await getCart();
};

window.onload = function onload() {
  asyncStart();
};