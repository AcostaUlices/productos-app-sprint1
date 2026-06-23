const USUARIOS_API_URL = 'http://localhost:3000/usuarios';

async function obtenerUsuarios() {
  const res = await fetch(USUARIOS_API_URL, {
    headers: {
      'Authorization': `Bearer ${obtenerToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || 'Error al obtener usuarios');
  return data;
}

async function cambiarRolUsuario(id, rol) {
  const res = await fetch(`${USUARIOS_API_URL}/${id}/rol`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${obtenerToken()}`,
    },
    body: JSON.stringify({ rol }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || 'Error al cambiar el rol');
  return data;
}

async function eliminarUsuario(id) {
  const res = await fetch(`${USUARIOS_API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${obtenerToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || 'Error al eliminar usuario');
  return data;
}