const contenedor = document.querySelector("#productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");
const btnLimpiarCarrito = document.getElementById("btn-limpiar-carrito");
const btnFinalizarCompra = document.getElementById("btn-finalizar-compra");

let anteojos = [];
let carrito = cargarCarrito();

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}

function cargarCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function actualizarContador() {
  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.textContent = carrito.length;
}

async function cargarProductos() {
  try {
    const response = await fetch("anteojos.json");
    anteojos = await response.json();
    renderProductos();
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

function renderProductos() {
  if (!contenedor) return;
  contenedor.innerHTML = "";

  anteojos.forEach(prod => {
    const div = document.createElement("div");
    div.className = "col-md-4";
    div.innerHTML = `
      <div class="card shadow-sm">
        <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
        <div class="card-body">
          <h5 class="card-title">${prod.nombre}</h5>
          <p class="card-text">$${prod.precio}</p>
          <button class="btn btn-primary w-100" data-id="${prod.id}">Agregar al carrito</button>
        </div>
      </div>
    `;
    contenedor.appendChild(div);
  });
}

function agregarAlCarrito(id) {
  const producto = anteojos.find(item => item.id === id);
  if (!producto) return;

  carrito.push(producto);
  guardarCarrito();
  renderCarrito();

  Swal.fire({
    title: "Producto agregado",
    text: `${producto.nombre} se agregó al carrito`,
    icon: "success",
    showConfirmButton: false,
    timer: 1500
  });
}

function renderCarrito() {
  if (!listaCarrito) return;

  listaCarrito.innerHTML = "";
  let totalCompra = 0;

  if (carrito.length === 0) {
    const li = document.createElement("li");
    li.className = "list-group-item text-center";
    li.textContent = "El carrito está vacío.";
    listaCarrito.appendChild(li);
    if (totalCarrito) totalCarrito.textContent = "Total: $0";
    return;
  }

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      ${item.nombre} <span>$${item.precio}</span>
      <button class="btn btn-sm btn-outline-danger btn-eliminar" data-index="${index}">Eliminar</button>
    `;
    listaCarrito.appendChild(li);
    totalCompra += item.precio;
  });

  if (totalCarrito) totalCarrito.textContent = "Total: $" + totalCompra;
}

if (contenedor) {
  contenedor.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.dataset.id) {
      agregarAlCarrito(parseInt(e.target.dataset.id));
    }
  });
}

if (listaCarrito) {
  listaCarrito.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-eliminar")) {
      const index = parseInt(e.target.dataset.index);
      carrito.splice(index, 1);
      guardarCarrito();
      renderCarrito();
    }
  });
}

if (btnLimpiarCarrito) {
  btnLimpiarCarrito.addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    renderCarrito();
  });
}

if (btnFinalizarCompra) {
  btnFinalizarCompra.addEventListener("click", () => {
    if (carrito.length === 0) {
      Swal.fire({
        title: "Carrito vacío",
        text: "Agregá productos antes de finalizar la compra.",
        icon: "warning",
        confirmButtonText: "Ok"
      });
      return;
    }

    carrito = [];
    guardarCarrito();
    renderCarrito();

    Swal.fire({
      title: "Compra realizada",
      text: "Muchas gracias por tu compra 😎",
      icon: "success",
      confirmButtonText: "Genial"
    });
  });
}

cargarProductos();
renderCarrito();
actualizarContador();
