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

function addLocalStorage() {
  const catchCart = document.querySelector('ol').innerHTML;
  localStorage.setItem('cartItems', catchCart);
}

function loadLocalStorage() {
  const catchCart = document.querySelector('ol');
  catchCart.innerHTML = localStorage.getItem('cartItems');
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

const cartItemClickListener = (event) => event.target.remove();

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.value = parseFloat(salePrice).toFixed(2);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function listItems(item) {
  return {
    sku: item.id,
    name: item.title,
    image: item.thumbnail,
  };
}

function loadComputers(computers) {
  const listComputers = document.querySelector('.items');
  computers.forEach((computer) => listComputers.appendChild(createProductItemElement(computer)));
}

function getDataApi() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((items) => items.results.map((item) => listItems(item)))
  .then((computers) => loadComputers(computers));
}

function renderCart(items) {
  const listOfProducts = document.querySelector('.cart__items');
  return listOfProducts.appendChild(createCartItemElement(items));
}

function addProduct(event) {
  const itemID = getSkuFromProductItem(event.target.parentNode);
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((response) => response.json())
    .then((json) => {
      const product = {
        sku: json.id,
        name: json.title,
        salePrice: json.price,
      };
      renderCart(product);
    })
    .then(() => addLocalStorage());
}

const load = async (computer) => { 
  const api = await
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computer}`);
  const data = await api.json();
  document.querySelector('.loading').remove();
  data.appendChild('li');
};

window.onload = function onload() {
  getDataApi();
  loadLocalStorage();
  document.querySelector('.items').addEventListener('click', addProduct);
  const clearButton = document.getElementsByClassName('empty-cart')[0];
  clearButton.addEventListener('click', () => {
    const products = document.getElementsByClassName('cart__item');
    const cartLength = products.length;
    for (let index = cartLength - 1; index >= 0; index -= 1) {
      products[index].remove();
    }
  });
  load();
};
