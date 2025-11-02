document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();
    actualizarTotales();

    const vaciarBtn = document.getElementById("clear-cart-btn");
    if (vaciarBtn) {
        vaciarBtn.addEventListener("click", vaciarCarrito);
    }

    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn && (JSON.parse(localStorage.getItem("cart")) || []).length === 0) {
        checkoutBtn.disabled = true;
    } else {
        if (checkoutBtn) checkoutBtn.addEventListener("click", finalizarCompra);
    };
});

function mostrarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("cart")) || [];
    const carritoContainer = document.getElementById("divCarga");

    carritoContainer.innerHTML = `
        <div class="card shadow-sm">
        <div class="card-header dark-bg">
            <h3 class="h6 mb-0"><i class="fas fa-shopping-cart me-2"></i>Mi Carrito</h3>
        </div>
        <div class="card-body p-0">
            ${carrito.length === 0
            ? `<div class="text-center p-4 text-muted dark-bg">
                        <i class="fas fa-cart-arrow-down fa-2x mb-2"></i>
                        <p class="inverse-text">¡Tu carrito está vacío!</p>
                        <small>Explorá nuestras <a href="categories.html">categorías</a> y elegí tus productos favoritos.</small>
                    </div>`
            : `
            <div class="list-group list-group-flush">
                ${carrito
                .map(
                    (producto) => `
                <div class="list-group-item dark-bg">
                    <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0 me-3">
                            <img src="${producto.image}" 
                                alt="${producto.name}"
                                class="rounded"
                                style="width: 200px; height: auto; object-fit: cover;">
                        </div>
                        <div>
                            <h4 class="mb-1">${producto.name}</h4>
                            <p class="mb-1 text-muted">${producto.description}</p>
                            <strong class="text-muted">${producto.currency} ${producto.cost.toLocaleString()}</strong>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <input type="number" 
                            class="form-control form-control-sm me-2" 
                            style="width: 80px;" 
                            value="${producto.count}" 
                            min="1" 
                            onchange="actualizarCantidad(${producto.id
                        }, this.value)">
                        <button class="btn btn-outline-danger btn-sm" 
                                onclick="eliminarDelCarrito(${producto.id})">
                        <i class="fas fa-times"></i>
                        </button>
                    </div>
                    </div>
                </div>
                `
                )
                .join("")}
            </div>
            `
        }
        </div>
        
        ${carrito.length > 0
            ? `
            <div class="card-footer dark-bg">
            <div class="d-flex justify-content-between align-items-center">
                <strong>
                ${carrito.map((producto) =>
                `Total: ${producto.currency}`
            )}
                        <strong> 
                            ${carrito.reduce((sum, p) => sum + p.cost * p.count, 0).toLocaleString()}
                        </strong>
                </strong>
            </div>
            </div>
        `
            : ""
        }
        </div>
    `;
    actualizarTotales();
}
function eliminarDelCarrito(id) {
    const carrito = JSON.parse(localStorage.getItem("cart")) || [];
    const nuevoCarrito = carrito.filter((producto) => producto.id !== id);
    localStorage.setItem("cart", JSON.stringify(nuevoCarrito));
    mostrarCarrito();
}
function actualizarCantidad(id, nuevaCantidad) {
    const carrito = JSON.parse(localStorage.getItem("cart")) || [];
    const producto = carrito.find((p) => p.id === id);
    if (producto) {
        producto.count = nuevaCantidad;
        localStorage.setItem("cart", JSON.stringify(carrito));
        mostrarCarrito();
    }
}
function actualizarTotales() {
    const carrito = JSON.parse(localStorage.getItem("cart")) || [];
    const subtotal = carrito.reduce((sum, p) => sum + p.cost * p.count, 0);
    const moneda = carrito.length > 0 ? carrito[0].currency : "$";
    const envio = subtotal * 0.01;
    const total = subtotal + envio;
    document.getElementById("cart-subtotal").innerHTML = `<small>${moneda} ${subtotal.toLocaleString()}</small>`;
    document.getElementById("cart-shipping").innerHTML = `<small>${moneda} ${envio.toLocaleString()}</small>`;
    document.getElementById("cart-total").innerText = `${moneda} ${total.toLocaleString()}`;

}
function vaciarCarrito() {
    localStorage.removeItem("cart");
    mostrarCarrito();
    document.getElementById("cart-subtotal").innerText = "-";
    document.getElementById("cart-shipping").innerText = "-";
    document.getElementById("cart-total").innerText = "-";
}
function finalizarCompra() {
    const carrito = JSON.parse(localStorage.getItem("cart")) || [];
    if (carrito.length === 0) return;
    const modal = new bootstrap.Modal(document.getElementById("purchaseModal"));
    modal.show();
    localStorage.removeItem("cart");
    mostrarCarrito();
    actualizarTotales();
}
