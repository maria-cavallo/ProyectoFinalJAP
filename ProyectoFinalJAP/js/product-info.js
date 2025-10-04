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

            /* PRODUCTOS RELACIONADOS */
            const relatedContainer = document.getElementById('productos-relacionados');

            if (Array.isArray(product.relatedProducts) && product.relatedProducts.length > 0) {
                relatedContainer.innerHTML = "";
                product.relatedProducts.forEach(rel => {
                    const col = document.createElement('div');
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
                    relatedContainer.appendChild(col);
                });
            }

            /* COMENTARIOS */
            const comentariosIniciales = [];
            const commentsContainer = document.getElementById("comentarios");
            const form = document.getElementById("comentario-form");
            function agregarComentario(user, description, score) {
                const div = document.createElement("div");
                const fecha = new Date().toLocaleString();
                div.classList.add("card", "my-2", "shadow-sm");
                div.innerHTML = `
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <h6 class="fw-bold mb-1">${user}</h6>
                            <p class="mb-1 text-warning fs-4">${"★".repeat(score)}${"☆".repeat(5 - score)}</p>
                        </div>    
                        <p class="mb-2">${description}</p>
                        <small class="text-muted fs-8">${fecha}</small>
                    </div>
                `;
                commentsContainer.appendChild(div);
            }

            comentariosIniciales.forEach(c => agregarComentario(c.user, c.description, c.score));
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const user = getCookie('user');
                const description = document.getElementById("comentario").value;
                const ratingInput = document.querySelector('input[name="rating"]:checked');
                const score = ratingInput ? parseInt(ratingInput.value) : 0;

                if (!description.trim() || score === 0) return;
                agregarComentario(user, description, score);
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
  const counts = [0, 0, 0, 0, 0]; // [1,2,3,4,5]
  comentarios.forEach(c => {
    counts[c.score - 1]++;
  });

  const totalReviews = comentarios.length || 1;
  const average = comentarios.reduce((sum,c)=>sum+c.score,0) / totalReviews;

  document.getElementById('average-rating').textContent = average.toFixed(1);
  document.getElementById('total-reviews').textContent = totalReviews;
  counts.forEach((cant, idx)=>{
    const bar = document.getElementById('bar-' + (5-idx));
    const countLabel = document.getElementById('count-' + (5-idx));
    const percent = totalReviews === 0 ? 0 : (cant/totalReviews)*100;
    bar.style.width = percent + '%';
    countLabel.textContent = cant;
  });
}
