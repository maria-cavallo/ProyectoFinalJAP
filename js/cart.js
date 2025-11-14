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

    const saveDataBtn = document.getElementById("save-data-btn");
    if (saveDataBtn) {
        saveDataBtn.addEventListener("click", () => {
            alert("Datos de envío guardados correctamente.");
            saveShippingData();
        });
    }

    const radiosEnvio = document.querySelectorAll('input[name="shipping"]');
    radiosEnvio.forEach(radio => {
        radio.addEventListener("change", () => {
            let porcentaje = 0;
            if (radio.id === "premium") porcentaje = 0.15;
            else if (radio.id === "express") porcentaje = 0.07;
            else if (radio.id === "standard") porcentaje = 0.05;

            localStorage.setItem("shippingRate", porcentaje);
            actualizarTotales();
        });
    });

    const step1Tab = document.getElementById("step1-tab");
    const step2Tab = document.getElementById("step2-tab");
    const step3Tab = document.getElementById("step3-tab");

    const toStep2Btn = document.getElementById("toStep2");
    const toStep3Btn = document.getElementById("toStep3");

    const backTo1Btn = document.getElementById("backTo1");
    const backTo2Btn = document.getElementById("backTo2");

    function goToStep(stepTab) {
        const tab = new bootstrap.Tab(stepTab);
        tab.show();
    }
    if (toStep2Btn)
        toStep2Btn.addEventListener("click", () => {
            const shippingSelected = document.querySelector('input[name="shipping"]:checked');
            if (!shippingSelected) {
                alert("Por favor, seleccioná un método de envío para continuar.");
                return;
            }
            actualizarTotales();
            goToStep(step2Tab)
        }); 

    if (backTo1Btn) {
        backTo1Btn.addEventListener("click", () => goToStep(step1Tab))
    };

    if (toStep3Btn) {
        toStep3Btn.addEventListener("click", () => {
            const address = document.querySelectorAll('#step2 input[required]');
            let valid = Array.from(address).every((input) => input.value.trim());
            if (!valid) {
                alert("Por favor, completá todos los campos de dirección para continuar.");
                return;
            }
            goToStep(step3Tab)
        });
    };

    if (backTo2Btn) {
        backTo2Btn.addEventListener("click", () => goToStep(step2Tab))
        }

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", finalizarCompra)
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
    const porcentaje = parseFloat(localStorage.getItem("shippingRate")) || 0;
    const envio = subtotal * porcentaje;
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
    const orderData = JSON.parse(localStorage.getItem("orderData")) || {};
    orderData.date = new Date().toLocaleString();
    localStorage.setItem("lastOrder", JSON.stringify(orderData));
    const modal = new bootstrap.Modal(document.getElementById("purchaseModal"));
    modal.show();
    localStorage.removeItem("cart");
    mostrarCarrito();
    actualizarTotales();
}
function saveShippingData() {
    const carrito = JSON.parse(localStorage.getItem("cart")) || [];
    const shipping = localStorage.getItem("shippingRate") || 0;
    const departamento = document.getElementById("departamento").value;
    const ciudad = document.getElementById("ciudad").value;
    const calle = document.getElementById("calle").value;
    const numero = document.getElementById("numero").value;
    const esquina = document.getElementById("esquina").value;
    const tarjeta = document.getElementById("credit").checked;
    const transferencia = document.getElementById("transfer").checked;
    const orderData = {
        cart: carrito,
        address: {
            departamento,
            ciudad,
            calle,
            numero,
            esquina
        },
        shippingRate: shipping,
        pay: tarjeta ? "Tarjeta de crédito" : transferencia ? "Transferencia bancaria" : "No especificado",
        date: new Date().toLocaleString()
    };
    localStorage.setItem("orderData", JSON.stringify(orderData));
}