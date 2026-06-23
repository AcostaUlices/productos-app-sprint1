const API_URL = 'http://localhost:3000/productos';

async function obtenerProductos() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener productos');
  return res.json();
}

async function crearProducto(producto) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${obtenerToken()}`,
    },
    body: JSON.stringify(producto),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || data.error || 'Error al crear producto');
  return data;
}

async function editarProducto(id, producto) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${obtenerToken()}`,
    },
    body: JSON.stringify(producto),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || data.error || 'Error al editar producto');
  return data;
}

async function eliminarProducto(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${obtenerToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || data.error || 'Error al eliminar producto');
  return data;
}