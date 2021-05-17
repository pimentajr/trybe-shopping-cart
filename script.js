
function handleRequestQuery(itemQuery) {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${itemQuery}`;

  return new Promise((resolve, reject) => {
    fetch(url)
    .then((response) => response.json())
    .then((json) => {
      resolve(json.results);
    })
    .catch((e) => reject(e));
  })
}

function handleRequestItemById(id) {
  const url = `https://api.mercadolibre.com/items/${id}`;

  return new Promise((resolve, reject) => {
    fetch(url)
    .then((response) => response.json())
    .then((json) => resolve(json))
    .catch((e) => reject(e));
  })
}

function getStorage() {
  const savedStorage = localStorage.getItem('shoppingCart');
  const newStorage = savedStorage ? JSON.parse(savedStorage) : [];

  return newStorage;
}


function saveStorage(newStorage) {
  localStorage.setItem('shoppingCart', JSON.stringify(newStorage));
}

function addItemToLocalStorage(newItem) {
  const curStorage = getStorage();
  
  curStorage.push(newItem);

  saveStorage(curStorage);
}

function removeItemLocalStorage(id) {
  const curStorage = getStorage();

  const newArray = curStorage.filter((item) => item.sku !== id);
  
  saveStorage(newArray);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function handleAddItemCart(e) {
  const id = getSkuFromProductItem(e.target.parentElement);
  handleRequestItemById(id)
  .then(({id, title, price}) => {
    addItemToLocalStorage({sku: id, name: title, salePrice: price});
    return createCartItemElement({sku: id, name: title, salePrice: price});
  })
  .then((cartElement) => document.querySelector('.cart__items').appendChild(cartElement));
}

function cartItemClickListener(e) {
  e.target.remove();
  removeItemLocalStorage(e.target.id);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.dataset.price = salePrice;
  console.log(li.id);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCustomElement(element, className, innerText, eventListener) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  if (eventListener) {
    e.addEventListener('click', eventListener)
  }
  return e;
}


function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', handleAddItemCart));
  return section;
  
}

function loadStorage() {
  const cartArray = getStorage();
  console.log(cartArray);

  cartArray.forEach(({sku, name, salePrice}) => document.querySelector('.cart__items')
  .appendChild(createCartItemElement({sku, name, salePrice})));
}

window.onload = async function onload() {
  const listItems = await handleRequestQuery('computador')
  listItems.forEach(({ id, title, thumbnail }) => {
    document.querySelector('.items')
    .appendChild(createProductItemElement({sku: id, name: title, image: thumbnail }));
  })
  loadStorage();
}
