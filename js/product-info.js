document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("product-info");
    const productID = localStorage.getItem("productID");
    const commentsContainer = document.getElementById("comentarios");
    const form = document.getElementById("comentario-form");

    if (!productID) {
        container.innerHTML = `
            <div class="alert alert-warning text-center my-4">
                No se seleccionó ningún producto.
            </div>`;
        return;
    }

    const PRODUCT_INFO_URL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;
    const PRODUCTS_COMMENTS_URL = `https://japceibal.github.io/emercado-api/products_comments/${productID}.json`;
    // === COMENTARIOS ===


    function agregarComentario(user, description, score, dateTime) {
        const div = document.createElement("div");
        div.classList.add("card", "my-2", "shadow-sm");
        div.innerHTML = `
                <div class="dark-bg card-body">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                    <h6 class="fw-bold mb-1">${user}</h6>
                    <p class="mb-1 text-warning fs-4">${"★".repeat(score)}${"☆".repeat(5 - score)}</p>
                    </div>    
                    <p class="mb-2">${description}</p>
                    <small class="text-muted fs-8">${dateTime}</small>
                </div>`;
        commentsContainer.appendChild(div);
    }

    // === COMENTARIOS DE LA API ===
    fetch(PRODUCTS_COMMENTS_URL)
        .then(res => res.json())
        .then(comentarios => {
            commentsContainer.innerHTML = "";
            comentarios.forEach(c => agregarComentario(c.user, c.description, c.score, c.dateTime));
            actualizarResumenCalificaciones(comentarios);
        })
        .catch(err => {
            console.error("Error al cargar comentarios:", err);
            commentsContainer.innerHTML = `<div class="alert alert-secondary text-center my-4">No hay comentarios disponibles.</div>`;
        });

    // === INFO PRODUCTO ===
    fetch(PRODUCT_INFO_URL)
        .then(res => res.json())
        .then(product => {
            const imgs = Array.isArray(product.images) ? product.images : [];
            const imagesHtml = imgs.length
                ? `
                <div id="carouselExampleAutoplaying" class="carousel slide mb-4 w-100 shadow-sm rounded" data-bs-ride="carousel">
                    <div class="carousel-inner rounded">
                        ${imgs.map((src, i) => `
                        <div class="carousel-item ${i === 0 ? "active" : ""}">
                            <img src="${src}" class="d-block w-100 rounded img-fluid" alt="${product.name}">
                        </div>`).join("")}
                    </div>
                    ${imgs.length > 1 ? `
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon"></span>
                        <span class="visually-hidden">Anterior</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                        <span class="carousel-control-next-icon"></span>
                        <span class="visually-hidden">Siguiente</span>
                    </button>` : ""}
                </div>`
                :
                `<div class="alert alert-secondary text-center my-4">No hay imágenes disponibles.</div>`;

            container.innerHTML = `
                <div class="container py-4">
                    <div class="d-flex align-items-center mb-4">
                        <button class="btn btn-outline-secondary me-3 d-flex align-items-center gap-1" onclick="window.history.back()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                            </svg> Volver
                        </button>
                        <h2 class="mb-0 fw-bold text-center flex-grow-1">${product.name}</h2>
                    </div>
                    <div class="row justify-content-center align-items-start g-4">
                        <div class="col-12 col-md-6 d-flex justify-content-center">
                        <div style="max-width: 500px; width:100%">
                            ${imagesHtml}
                        </div>
                        </div>
                        <div class="col-12 col-md-6 text-center text-md-start">
                        <p class="text-muted mb-1"><strong>Categoría:</strong> ${product.category}</p>
                        <p class="lead mb-2">${product.description}</p>
                        <p class="text-muted mb-3"><small>Vendidos: ${product.soldCount}</small></p>
                        <h4 class="text-default fw-bold mt-2 mb-4">${product.currency} ${product.cost}</h4>
                        <button class="btn btn-primary px-4 shadow-sm" id=btn>Comprar</button>
                        </div>
                    </div>
                </div>`;
            //Tomamos el botón que se generá dinamicamente. 
            const comprarBoton = document.getElementById("btn");

            //Creamos el evento que permite agregarle funcionalidad

            comprarBoton.addEventListener("click", () => {
                const agregoProducto = { //Guardamos los datos del producto
                    id: product.id,
                    name: product.name,
                    cost: product.cost,
                    currency: product.currency,
                    image:product.image,
                    count: 1
                };

                let carrito = JSON.parse(localStorage.getItem("cart")) || []; //Defino el espacio para los productos

                const index = carrito.findIndex(item => item.id === agregoProducto.id);
                if (index !== -1) {
                    carrito[index].count += 1;
                } else {
                    carrito.push(agregoProducto);
                }
                localStorage.setItem("cart", JSON.stringify(carrito)); //Guardar la información a nivel local 
                alert("Producto agregado al carrito");

                // Redirigir a la página del carrito
                window.location.href = "cart.html";
            });

            // === PRODUCTOS RELACIONADOS ===
            const relatedContainer = document.getElementById("productos-relacionados");
            if (Array.isArray(product.relatedProducts) && product.relatedProducts.length > 0) {
                relatedContainer.innerHTML = "";
                product.relatedProducts.forEach(rel => {
                    const col = document.createElement("div");
                    col.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3");
                    col.innerHTML = `
                        <div class="dark-bg card shadow-sm h-100 text-center">
                            <img src="${rel.image}" class="card-img-top img-fluid" alt="${rel.name}">
                            <div class="card-body d-flex flex-column">
                                <h6 class="card-title fw-bold mb-3">${rel.name}</h6>
                                <button class="btn btn-outline-primary mt-auto" onclick="verProducto(${rel.id})">Ver producto</button>
                            </div>
                        </div>`;
                    relatedContainer.appendChild(col);
                });
            }



            // === AGREGAR COMENTARIO ===
            form.addEventListener("submit", e => {
                e.preventDefault();
                const user = getCookie("user") || "Usuario anónimo";
                const description = document.getElementById("comentario").value;
                const ratingInput = document.querySelector('input[name="rating"]:checked');
                const score = ratingInput ? parseInt(ratingInput.value) : 0;
                if (!description.trim() || score === 0) return;
                const nuevoComentario = {
                    user,
                    description,
                    score,
                    dateTime: new Date().toLocaleString()
                };

                agregarComentario(nuevoComentario.user, nuevoComentario.description, nuevoComentario.score, nuevoComentario.dateTime);
                const cards = commentsContainer.querySelectorAll(".card");
                const comentariosActuales = Array.from(cards).map(card => {
                    const estrellas = card.querySelector(".text-warning").textContent;
                    return { score: estrellas.replace(/☆/g, "").length };
                });
                actualizarResumenCalificaciones(comentariosActuales);
                form.reset();
            });
        })
        .catch(err => {
            console.error("Error al cargar producto:", err);
            container.innerHTML = `
                <div class="alert alert-danger text-center my-4">
                No se pudo cargar la información del producto.
                </div>`;
        });
});

function verProducto(id) {
    localStorage.setItem("productID", id);
    window.location = "product-info.html";
}

function actualizarResumenCalificaciones(comentarios) {
    const counts = [0, 0, 0, 0, 0];
    comentarios.forEach(c => {
        if (c.score >= 1 && c.score <= 5) counts[c.score - 1]++;
    });
    const totalReviews = comentarios.length || 1;
    const average = comentarios.reduce((sum, c) => sum + c.score, 0) / totalReviews;
    document.getElementById("average-rating").textContent = average.toFixed(1);
    document.getElementById("total-reviews").textContent = comentarios.length;
    for (let stars = 1; stars <= 5; stars++) {
        const bar = document.getElementById(`bar-${stars}`);
        const countLabel = document.getElementById(`count-${stars}`);
        const percent = (counts[stars - 1] / totalReviews) * 100;
        bar.style.width = `${percent}%`;
        countLabel.textContent = counts[stars - 1];
    }
}
