document.addEventListener('DOMContentLoaded', () => {
    mostrarCarrito();
});
function mostrarCarrito() {
      const carrito = JSON.parse(localStorage.getItem('cart')) || [];
  const carritoContainer = document.getElementById('divCarga');
  
  carritoContainer.innerHTML = `
    <div class="card shadow-sm">
      <div class="card-header bg-light">
        <h3 class="h6 mb-0"><i class="fas fa-shopping-cart me-2"></i>Mi Carrito</h3>
      </div>
      <div class="card-body p-0">
        ${carrito.length === 0 ? 
          '<div class="text-center p-4 text-muted"><i class="fas fa-cart-arrow-down fa-2x mb-2"></i><p>Tu carrito está vacío</p></div>' : 
          `
          <div class="list-group list-group-flush">
            ${carrito.map(producto => `
              <div class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <div class="flex-shrink-0 me-3">
                    <img src="${producto.image || 'https://via.placeholder.com/60x60?text=No+img'}" 
                         alt="${producto.name}"
                         class="rounded"
                         style="width: 60px; height: 60px; object-fit: cover;"
                         onerror="this.src='https://via.placeholder.com/60x60?text=Error'">
                  </div>
                    <h6 class="mb-1">${producto.name}</h6>
                    <small class="text-muted">$${producto.cost.toLocaleString()} ${producto.currency}</small>
                  </div>
                  <div class="d-flex align-items-center">
                    <input type="number" 
                           class="form-control form-control-sm me-2" 
                           style="width: 80px;" 
                           value="${producto.count}" 
                           min="1" 
                           onchange="actualizarCantidad(${producto.id}, this.value)">
                    <button class="btn btn-outline-danger btn-sm" 
                            onclick="eliminarDelCarrito(${producto.id})">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          `
        }
      </div>
      
      ${carrito.length > 0 ? `
        <div class="card-footer">
          <div class="d-flex justify-content-between align-items-center">
            <strong>Total: $${carrito.reduce((sum, p) => sum + (p.cost * p.count), 0).toLocaleString()} USD</strong>
            <div>
              <button class="btn btn-outline-secondary btn-sm me-2" onclick="vaciarCarrito()">
                Vaciar
              </button>
              <button class="btn btn-primary btn-sm" onclick="procesarCompra()">
                Comprar
              </button>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}
function eliminarDelCarrito(id) {
    const carrito = JSON.parse(localStorage.getItem('cart')) || [];
    const nuevoCarrito = carrito.filter(producto => producto.id !== id);
    localStorage.setItem('cart', JSON.stringify(nuevoCarrito));
    mostrarCarrito();
}
function actualizarCantidad(id, nuevaCantidad) {
  const carrito = JSON.parse(localStorage.getItem('cart')) || [];
  const producto = carrito.find(p => p.id === id);
  if (producto) {
    producto.count = nuevaCantidad;
    localStorage.setItem('cart', JSON.stringify(carrito));
    mostrarCarrito();
  }
}

function vaciarCarrito() {
  localStorage.removeItem('cart');
  mostrarCarrito();
}
function procesarCompra() {
  alert('¡Gracias por tu compra! Redirigiendo al pago...');
}