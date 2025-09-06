let productosGlobal = []; //Variable para la lista 

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".products-list");
    const categoryTitle = document.querySelector(".category-selected");
    const paragraph = document.querySelector(".paragraph");

    // Obtener catID desde localStorage
    const catID = localStorage.getItem("catID");

    if (!catID) {
        container.innerHTML = `<div class="alert alert-warning">No se ha seleccionado una categoría.</div>`;
        return;
    }

    // URL del JSON según categoría
    const PRODUCTS_URL = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

    // Mostrar productos en HTML
    function mostrarProductos(productos) {
        let html = "";
        if (!productos || productos.length === 0) {
            container.innerHTML = `<div class="alert alert-warning">No se encontraron productos.</div>`;
            paragraph.textContent = "";
            return;
        }

        productos.forEach(producto => {
            html += `
                <div class="card m-3 shadow-sm">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${producto.image}" class="img-fluid rounded-start" alt="${producto.name}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body d-flex flex-column h-100 justify-content-between">
                                <h5 class="card-title">${producto.name} - <small class="text-muted">${producto.currency} ${producto.cost}</small></h5>
                                <p class="card-text">${producto.description}</p>
                                <p class="card-text"><small class="text-muted">Vendidos: ${producto.soldCount}</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // Traer datos desde JSON
    fetch(PRODUCTS_URL)
        .then(response => response.json())
        .then(data => {
            // Poner nombre de la categoría
            categoryTitle.textContent = data.catName || `Categoría ${catID}`;
            productosGlobal = data.products; // <-- aquí guardamos los productos globalmente
            mostrarProductos(data.products);
        })
        .catch(error => {
            console.error("Error al cargar los productos:", error);
            container.innerHTML = `<div class="alert alert-danger">No se pudieron cargar los productos.</div>`;
        });

    //Obtener los elementos del HTML
let preciominimo= document.getElementById("precioMin");
let preciomaximo= document.getElementById ("precioMax");
const botonfiltrar= document.getElementById ("btnFiltrar"); 
const botonlimpiar= document.getElementById ("btnLimpiar");

//Funcionalidad botón
botonfiltrar.addEventListener("click", () => {
    filtrarProductos();
});

//Función para filtrar por precio
function filtrarProductos() {
    const min = Number(preciominimo.value) || 0;
    const max = Number(preciomaximo.value) || Infinity;

    const productosFiltrados = productosGlobal.filter(producto => producto.cost >= min && producto.cost <= max);
    
    productosFiltrados.sort((a, b) => a.cost - b.cost);
   
    mostrarProductos(productosFiltrados);
}
botonlimpiar.addEventListener ("click", () => {
    limpiarfiltro();
})

function limpiarfiltro() {
    preciominimo.value = "";
    preciomaximo.value = "";
    mostrarProductos(productosGlobal);
}

});





