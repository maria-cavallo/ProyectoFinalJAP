document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("product-info");
    const productID = localStorage.getItem("productID");

    if (!productID) {
        container.innerHTML = `
        <div class="alert alert-warning text-center my-4">
            No se seleccionó ningún producto.
        </div>`;
        return;
    }

    const PRODUCT_INFO_URL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;
    console.log("Cargando info de producto:", PRODUCT_INFO_URL);

    fetch(PRODUCT_INFO_URL)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(product => {
            // --- Producto principal ---
            const imgs = Array.isArray(product.images) ? product.images : [];
            let imagesHtml = "";

            if (imgs.length > 0) {
                imagesHtml = `
                    <div id="carouselExampleAutoplaying" class="carousel slide mb-4 w-100 shadow-sm rounded" data-bs-ride="carousel">
                        <div class="carousel-inner rounded">
                            ${imgs.map((src, i) => `
                            <div class="carousel-item ${i === 0 ? 'active' : ''}">
                                <img src="${src}" class="d-block w-100 rounded img-fluid" alt="${product.name}">
                            </div>`).join("")}
                        </div>
                        ${imgs.length > 1 ? `
                            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Anterior</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Siguiente</span>
                            </button>` : ""}
                    </div>`;
            } else {
                imagesHtml = `
                    <div class="alert alert-secondary text-center my-4">
                        No hay imágenes disponibles.
                    </div>`;
            }

            container.innerHTML = `
                <div class="container py-4">
                    <div class="d-flex align-items-center mb-4">
                        <button class="btn btn-outline-secondary me-3" onclick="window.history.back()">
                            &lt; Volver
                        </button>
                        <h2 class="mb-0 fw-bold text-center flex-grow-1">${product.name}</h2>
                    </div>
                    <div class="row justify-content-center align-items-start g-4">
                        <div class="col-12 col-md-6 d-flex justify-content-center">
                            <div style="max-width: 500px; width:100%">
                                ${imagesHtml}
                            </div>
                        </div>
                        <div class="col-12 col-md-6 d-flex flex-column justify-content-center text-center text-md-start">
                            <p class="text-muted mb-1"><strong>Categoría:</strong> ${product.category}</p>
                            <p class="lead mb-2">${product.description}</p>
                            <p class="text-muted mb-3"><small>Vendidos: ${product.soldCount}</small></p>
                            <h4 class="text-default fw-bold mt-2 mb-4">${product.currency} ${product.cost}</h4>
                            <div class="d-flex flex-column flex-md-row gap-3">
                                <button class="btn btn-primary px-4 shadow-sm" onclick="alert('Funcionalidad no implementada 🙃')">
                                    Comprar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;

            // Tomar el div de productos relacionados 
            const relatedContainer = document.getElementById('productos-relacionados');

            if (Array.isArray(product.relatedProducts) && product.relatedProducts.length > 0) {
                relatedContainer.innerHTML = ""; // vaciar el contenedor
                product.relatedProducts.forEach(rel => {
                    const col = document.createElement('div'); //crear las columnas con los objetos
                    col.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3");
                    col.innerHTML = `
                        <div class="card shadow-sm h-100 text-center">
                            <img src="${rel.image}" class="card-img-top img-fluid" alt="${rel.name}">
                            <div class="card-body d-flex flex-column">
                                <h6 class="card-title fw-bold mb-3">${rel.name}</h6>
                                <button class="btn btn-outline-primary mt-auto" onclick="verProducto(${rel.id})">
                                    Ver producto
                                </button>
                            </div>
                        </div>`;
                    relatedContainer.appendChild(col); //agregar elementos dentro del contendor 
                });
            }
        })
        .catch(err => {
            console.error("Error al cargar producto:", err);
            container.innerHTML = `
            <div class="alert alert-danger text-center my-4">
                No se pudo cargar la información del producto.
            </div>`;
        });
});

// Funcionalidad para ver el producto al redirigir 
function verProducto(id) {
    localStorage.setItem("productID", id);
    window.location = "product-info.html";
}