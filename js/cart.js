document.addEventListener("DOMContentLoaded", () => { 
    mostrarCarrito();
    actualizarTotales();

    document.getElementById("checkout-btn").disabled = true; 

    const vaciarBtn = document.getElementById("clear-cart-btn");
    if (vaciarBtn) {
        vaciarBtn.addEventListener("click", vaciarCarrito);
    }

    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.addEventListener("click", finalizarCompra);
    }
    
    const saveDataBtn = document.getElementById("save-data-btn");
    if (saveDataBtn) {
        saveDataBtn.addEventListener("click", guardarDatosCompletos);
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

    if (toStep2Btn) {
        toStep2Btn.addEventListener("click", () => {
            const shippingSelected = document.querySelector('input[name="shipping"]:checked');
            if (!shippingSelected) {
                alert("Por favor, seleccioná un método de envío para continuar.");
                return;
            }
            actualizarTotales();
            goToStep(step2Tab);
        });
    }

    if (backTo1Btn) {
        backTo1Btn.addEventListener("click", () => goToStep(step1Tab));
    }

    // ★ VALIDACIÓN DE DIRECCIÓN CON BOOTSTRAP ★
    if (toStep3Btn) {
        toStep3Btn.addEventListener("click", () => {
            const addressInputs = document.querySelectorAll('#step2 input[required]');
            let valid = true;

            addressInputs.forEach(input => {
                if (input.value.trim() === "") {
                    input.classList.remove("is-valid");
                    input.classList.add("is-invalid");
                    valid = false;
                } else {
                    input.classList.remove("is-invalid");
                    input.classList.add("is-valid");
                }
            });

            if (!valid) {
                alert("Por favor, completá todos los campos de dirección para continuar.");
                return;
            }

            goToStep(step3Tab);
        });
    }

    if (backTo2Btn) {
        backTo2Btn.addEventListener("click", () => goToStep(step2Tab));
    }
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
                        producto => `
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
                            onchange="actualizarCantidad(${producto.id}, this.value)">
                        <button class="btn btn-outline-danger btn-sm" onclick="eliminarDelCarrito(${producto.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    </div>
                </div>
                `
                    )
                    .join("")}
            </div>
            `}
        </div>
        </div>
    `;
    actualizarTotales();
}

function eliminarDelCarrito(id) {
    const carrito = JSON.parse(localStorage.getItem("cart")) || [];
    const nuevoCarrito = carrito.filter(producto => producto.id !== id);
    localStorage.setItem("cart", JSON.stringify(nuevoCarrito));
    mostrarCarrito();
}

function actualizarCantidad(id, nuevaCantidad) {
    const carrito = JSON.parse(localStorage.getItem("cart")) || [];
    const producto = carrito.find(p => p.id === id);
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

// ★ VALIDACIÓN DE DIRECCIÓN CON BOOTSTRAP ★
function guardarDatosCompletos() {
    const shippingSelected = document.querySelector("input[name='shipping']:checked");
    const paymentSelected = document.querySelector("input[name='payment']:checked");

    const campos = [
        document.getElementById("departamento"),
        document.getElementById("ciudad"),
        document.getElementById("calle"),
        document.getElementById("numero"),
        document.getElementById("esquina")
    ];

    let validAddress = true;

    campos.forEach(input => {
        if (input.value.trim() === "") {
            input.classList.remove("is-valid");
            input.classList.add("is-invalid");
            validAddress = false;
        } else {
            input.classList.remove("is-invalid");
            input.classList.add("is-valid");
        }
    });

    if (!shippingSelected) {
        alert("Debe seleccionar un método de envío.");
        return;
    }

    if (!validAddress) {
        alert("Debe completar todos los campos de dirección.");
        return;
    }

    if (!paymentSelected) {
        alert("Debe seleccionar un método de pago.");
        return;
    }

    alert("Datos guardados correctamente.");
    localStorage.setItem("datosCompletos", "true");

    const checkoutBtn = document.getElementById("checkout-btn");
    checkoutBtn.disabled = false;
}

document.getElementById("save-data-btn").addEventListener("click", guardarDatosCompletos);

const checkoutBtn = document.getElementById("checkout-btn");
checkoutBtn.disabled = true;
