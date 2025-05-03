const catalog = document.getElementById('catalog');
const carritoDiv = document.getElementById('carrito');
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const API = 'https://floreria-backend.onrender.com';

if (catalog) {
  fetch(`${API}/api/products`)
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        catalog.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No hay productos disponibles.</p>';
        return;
      }

      data.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
          <img src="${API}${p.imageUrl}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <strong>$${p.price}</strong>
          <button onclick='agregarAlCarrito(${JSON.stringify(p)})'>Agregar</button>
        `;
        catalog.appendChild(div);
      });
    })
    .catch(err => {
      catalog.innerHTML = '<p style="text-align:center; color:red;">Error al cargar productos.</p>';
    });
}

function agregarAlCarrito(producto) {
  carrito.push(producto);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  alert('Agregado al carrito');
}

if (carritoDiv) {
  if (carrito.length === 0) {
    carritoDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
  } else {
    carritoDiv.innerHTML = carrito.map(p => `
      <div>
        <strong>${p.name}</strong> - $${p.price}
      </div>
    `).join('');
  }

  const form = document.getElementById('pedido-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      formData.append('carrito', JSON.stringify(carrito));

      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        body: formData
      });

      const estado = document.getElementById('estado');
      if (res.ok) {
        estado.textContent = 'Pedido enviado con éxito 🎉';
        localStorage.removeItem('carrito');
        form.reset();
      } else {
        estado.textContent = 'Error al enviar el pedido';
      }
    });
  }
}
