let productosGlobal = []; //Variable para la lista 

let productosFiltrados = []; //Lista activa 

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

    const PRODUCTS_URL = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

    function mostrarProductos(productos) {
        if (!productos || productos.length === 0) {
            container.innerHTML = `<div class="alert alert-warning">No se encontraron productos.</div>`;
            paragraph.textContent = "";
            return;
        }

    const html = productos.map(producto => `
        <div class="card m-3 shadow-sm producto-item" data-id="${producto.id}" style="cursor:pointer;">
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
    `).join("");

        container.innerHTML = html;
    }

    fetch(PRODUCTS_URL)
        .then(response => response.json())
        .then(data => {
            categoryTitle.textContent = data.catName || `Categoría ${catID}`;
            productosGlobal = data.products; // guardamos original para filtros
            mostrarProductos(productosGlobal);
        })
        .catch(error => {
            console.error("Error al cargar los productos:", error);
            container.innerHTML = `<div class="alert alert-danger">No se pudieron cargar los productos.</div>`;
        });

    // Delegación de evento para clic en card (funciona aunque cambies innerHTML)
    container.addEventListener("click", (e) => {
        const card = e.target.closest(".producto-item");
        if (!card) return;
        const productID = card.dataset.id;
        console.log("Producto clickeado:", productID);
        if (!productID) {
            console.warn("El producto no tiene id");
            return;
        }
        localStorage.setItem("productID", productID);
        // <- Ajustá el nombre del HTML si tu archivo se llama products-info.html
        window.location.href = "product-info.html";
    });

    // FILTROS
    const preciominimo = document.getElementById("precioMin");
    const preciomaximo = document.getElementById("precioMax");
    const botonfiltrar = document.getElementById("btnFiltrar");
    const botonlimpiar = document.getElementById("btnLimpiar");

    botonfiltrar.addEventListener("click", () => {
        const min = Number(preciominimo.value) || 0;
        const max = Number(preciomaximo.value) || Infinity;
        productosFiltrados = productosGlobal.filter(producto => producto.cost >= min && producto.cost <= max);
        mostrarProductos(productosFiltrados);
    });

    botonlimpiar.addEventListener("click", () => {
        preciominimo.value = "";
        preciomaximo.value = "";
        productosFiltrados = []; 
        mostrarProductos(productosGlobal);
    });

    //Obtener los elementos del HTML para botones de orden 
    const botonascedente= document.getElementById ("sortAsc");
    const botondescendente= document.getElementById ("sortDesc");
    const botonrelevancia= document.getElementById ("sortRel");

//Evento de hacer clic aplicar el método sort para ordener de menor a mayor precio 
  botonascedente.addEventListener ("click", () => {
  let lista = productosFiltrados.length > 0 ? productosFiltrados : productosGlobal;
  lista.sort((a, b) => a.cost - b.cost);
  mostrarProductos(lista);
  })

//Evento de hacer clic aplicar el método sort para ordener de mayor a menor precio 
  botondescendente.addEventListener ("click", () => {
  let lista = productosFiltrados.length > 0 ? productosFiltrados : productosGlobal;
  lista.sort ((a,b) => b.cost - a.cost);
  mostrarProductos(lista);
  })

//Evento de hacer clic para filtrar por cantidad de vendidos
  botonrelevancia.addEventListener ("click", () => {
  let lista = productosFiltrados.length > 0 ? productosFiltrados : productosGlobal;
  lista.sort ((a,b) => b.soldCount - a.soldCount); //se saca de la API de las propiedades del objeto
  mostrarProductos(lista);
  })

  const buscador = document.getElementById("buscador");
  buscador.addEventListener("input",()=>{
    const text=buscador.value.toLowerCase();

    if(text.trim()===""){
        mostrarProductos(productosGlobal);
        return;
    }
    const lista=productosFiltrados.length>0?productosFiltrados:productosGlobal;
    const resultados=lista.filter(producto=>producto.name.toLowerCase().includes(text) || producto.description.toLowerCase().includes(text));
    mostrarProductos(resultados);


  });


});
