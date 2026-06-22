const form = document.getElementById('form-producto');
const formTitulo = document.getElementById('form-titulo');
const btnSubmit = document.getElementById('btn-submit');
const btnCancelar = document.getElementById('btn-cancelar');
const tablaBody = document.getElementById('tabla-body');
const mensajeForm = document.getElementById('mensaje-form');
const mensajeGlobal = document.getElementById('mensaje-global');

const inputId = document.getElementById('producto-id');
const inputNombre = document.getElementById('nombre');
const inputCategoria = document.getElementById('categoria');
const inputPrecio = document.getElementById('precio');
const inputStock = document.getElementById('stock');
const inputDescripcion = document.getElementById('descripcion');

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', cargarProductos);

async function cargarProductos() {
  try {
    const productos = await obtenerProductos();
    renderizarTabla(productos);
  } catch (error) {
    mostrarMensaje(mensajeGlobal, error.message, 'error');
  }
}

function renderizarTabla(productos) {
  tablaBody.innerHTML = '';

  if (productos.length === 0) {
    tablaBody.innerHTML = '<tr><td colspan="5">No hay productos cargados.</td></tr>';
    return;
  }

  productos.forEach((p) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>$${p.precio.toLocaleString('es-AR')}</td>
      <td>${p.stock}</td>
      <td>
        <button class="btn-editar" data-id="${p.id}">Editar</button>
        <button class="btn-eliminar" data-id="${p.id}">Eliminar</button>
      </td>
    `;
    tablaBody.appendChild(fila);
  });
}

// Validación básica en el frontend
function validarFormulario() {
  const nombre = inputNombre.value.trim();
  const categoria = inputCategoria.value;
  const precio = inputPrecio.value;
  const stock = inputStock.value;

  if (!nombre) {
    return 'El nombre es obligatorio';
  }

  if (!categoria) {
    return 'Seleccioná una categoría';
  }

  if (precio === '') {
    return 'El precio es obligatorio';
  }

  if (isNaN(Number(precio)) || Number(precio) <= 0) {
    return 'El precio debe ser un número mayor a 0';
  }

  if (stock === '') {
    return 'El stock es obligatorio';
  }

  if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
    return 'El stock debe ser un número entero positivo';
  }

  return null;
}

// Submit del formulario (crear o editar)
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const errorValidacion = validarFormulario();
  if (errorValidacion) {
    mostrarMensaje(mensajeForm, errorValidacion, 'error');
    return;
  }

  const producto = {
    nombre: inputNombre.value.trim(),
    categoria: inputCategoria.value,
    precio: Number(inputPrecio.value),
    stock: Number(inputStock.value),
    descripcion: inputDescripcion.value.trim(),
  };

  try {
    if (inputId.value) {
      await editarProducto(inputId.value, producto);
      mostrarMensaje(mensajeGlobal, 'Producto actualizado correctamente', 'exito');
    } else {
      await crearProducto(producto);
      mostrarMensaje(mensajeGlobal, 'Producto creado correctamente', 'exito');
    }

    resetearFormulario();
    cargarProductos();
  } catch (error) {
    mostrarMensaje(mensajeForm, error.message, 'error');
  }
});

// Click en botones de la tabla (Editar / Eliminar)
tablaBody.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains('btn-eliminar')) {
    const confirmar = confirm('¿Seguro que querés eliminar este producto?');
    if (!confirmar) return;

    try {
      await eliminarProducto(id);
      mostrarMensaje(mensajeGlobal, 'Producto eliminado correctamente', 'exito');
      cargarProductos();
    } catch (error) {
      mostrarMensaje(mensajeGlobal, error.message, 'error');
    }
  }

  if (e.target.classList.contains('btn-editar')) {
    cargarProductoEnFormulario(id);
  }
});

async function cargarProductoEnFormulario(id) {
  try {
    const productos = await obtenerProductos();
    const producto = productos.find((p) => p.id === Number(id));
    if (!producto) return;

    inputId.value = producto.id;
    inputNombre.value = producto.nombre;
    inputCategoria.value = producto.categoria;
    inputPrecio.value = producto.precio;
    inputStock.value = producto.stock;
    inputDescripcion.value = producto.descripcion || '';

    formTitulo.textContent = 'Editar Producto';
    btnSubmit.textContent = 'Guardar Cambios';
    btnCancelar.style.display = 'inline-block';
  } catch (error) {
    mostrarMensaje(mensajeGlobal, error.message, 'error');
  }
}

btnCancelar.addEventListener('click', resetearFormulario);

function resetearFormulario() {
  form.reset();
  inputId.value = '';
  formTitulo.textContent = 'Nuevo Producto';
  btnSubmit.textContent = 'Crear Producto';
  btnCancelar.style.display = 'none';
}


const modalOverlay = document.getElementById('modal-overlay');
const modalBox = document.getElementById('modal-box');
const modalMensaje = document.getElementById('modal-mensaje');
const modalCerrar = document.getElementById('modal-cerrar');

function mostrarMensaje(elemento, texto, tipo) {
  modalMensaje.textContent = texto;
  modalBox.className = 'modal-box';
  modalBox.classList.add(tipo === 'exito' ? 'modal-exito' : 'modal-error');
  modalOverlay.style.display = 'flex';
}

modalCerrar.addEventListener('click', () => {
  modalOverlay.style.display = 'none';
});