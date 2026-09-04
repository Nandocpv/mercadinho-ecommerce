const modal = document.querySelector('#modal');
const form = document.querySelector('#productForm');
const grid = document.querySelector('#productGrid');
const empty = document.querySelector('#empty');
const search = document.querySelector('#search');
const count = document.querySelector('#productCount');
const metric = document.querySelector('#metricProducts');
const allCount = document.querySelector('#allCount');
let products = JSON.parse(localStorage.getItem('mercadinho-products') || '[]');
let category = 'Todos';

const toggleModal = (open) => {
  modal.classList.toggle('open', open);
  modal.setAttribute('aria-hidden', String(!open));
  if (open) form.elements.name.focus();
};
const render = () => {
  const query = search.value.toLowerCase();
  const visible = products.filter((product) => (category === 'Todos' || product.category === category) && product.name.toLowerCase().includes(query));
  grid.innerHTML = visible.map((product) => `<article class="product-card"><div class="photo">${product.emoji || '📦'}</div><div class="info"><h3>${product.name}</h3><p>${product.category}</p><strong>R$ ${product.price.toFixed(2).replace('.', ',')}</strong><small>${product.stock} em estoque</small></div></article>`).join('');
  empty.style.display = visible.length ? 'none' : 'block';
  grid.style.display = visible.length ? 'grid' : 'none';
  count.textContent = products.length;
  metric.textContent = products.length;
  allCount.textContent = products.length;
};
document.querySelector('#openForm').addEventListener('click', () => toggleModal(true));
document.querySelector('#emptyButton').addEventListener('click', () => toggleModal(true));
document.querySelector('#close').addEventListener('click', () => toggleModal(false));
modal.addEventListener('click', (event) => { if (event.target === modal) toggleModal(false); });
search.addEventListener('input', render);
document.querySelectorAll('.category-tabs button').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.category-tabs button').forEach((item) => item.classList.remove('selected'));
  button.classList.add('selected');
  category = button.dataset.category;
  render();
}));
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const newProduct = { name: data.get('name').trim(), price: Number(data.get('price')), stock: Number(data.get('stock')), category: data.get('category'), emoji: data.get('emoji') };
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
    if (res.ok) {
      const saved = await res.json();
      products.unshift(saved);
    } else {
      products.unshift(newProduct);
    }
  } catch (e) {
    // If backend is not available, fallback to localStorage only
    products.unshift(newProduct);
  }
  localStorage.setItem('mercadinho-products', JSON.stringify(products));
  form.reset();
  toggleModal(false);
  render();
});
render();
