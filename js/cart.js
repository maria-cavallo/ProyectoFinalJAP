document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();
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
                ? '<div class="text-center p-4 text-muted"><i class="fas fa-cart-arrow-down fa-2x mb-2"></i><p>Tu carrito está vacío</p></div>'
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
