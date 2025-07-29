
const anteojos = [
  {
    id: 1,
    nombre: "Estilo Moderno",
    precio: 12000,
    imagen: "img/gafa1.webp"
  },
  {
    id: 2,
    nombre: "Modelo Clásico",
    precio: 14500,
    imagen: "img/gafa2.webp"
  },
  {
    id: 3,
    nombre: "Elegante Oscuro",
    precio: 15800,
    imagen: "img/gafa3.webp"
  }
];


const contenedor = document.querySelector("#productos");
const cartCount = document.querySelector("#cart-count");
const buscador = document.querySelector("#buscador");
const btnLimpiar = document.querySelector("#btn-limpiar");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


function renderProductos(filtro = "") {
  contenedor.innerHTML = "";

  const productosFiltrados = anteojos.filter(prod =>
    prod.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  productosFiltrados.forEach((prod) => {
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


  const botones = document.querySelectorAll("button[data-id]");
  botones.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      agregarAlCarrito(id);
    });
  });
}


function agregarAlCarrito(id) {
  const producto = anteojos.find((item) => item.id === id);
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}


function actualizarContador() {
  cartCount.textContent = carrito.length;
}


buscador.addEventListener("input", () => {
  renderProductos(buscador.value);
});


btnLimpiar.addEventListener("click", () => {
  buscador.value = "";
  renderProductos();
});

renderProductos();
actualizarContador();



