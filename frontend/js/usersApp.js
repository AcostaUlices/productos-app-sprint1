const navbarUsuario = document.getElementById('navbar-usuario');
const linkLogin = document.getElementById('link-login');
const btnLogout = document.getElementById('btn-logout');
const tablaUsuariosBody = document.getElementById('tabla-usuarios-body');

const modalOverlay = document.getElementById('modal-overlay');
const modalBox = document.getElementById('modal-box');
const modalMensaje = document.getElementById('modal-mensaje');
const modalCerrar = document.getElementById('modal-cerrar');

function mostrarMensaje(texto, tipo) {
  modalMensaje.textContent = texto;
  modalBox.className = 'modal-box';
  modalBox.classList.add(tipo === 'exito' ? 'modal-exito' : 'modal-error');
  modalOverlay.style.display = 'flex';
}

modalCerrar.addEventListener('click', () => {
  modalOverlay.style.display = 'none';
});

function actualizarNavbar() {
  const usuario = obtenerUsuario();
  if (usuario) {
    navbarUsuario.textContent = `${usuario.nombre} (${usuario.rol})`;
    linkLogin.style.display = 'none';
    btnLogout.style.display = 'inline-block';
  } else {
    navbarUsuario.textContent = '';
    linkLogin.style.display = 'inline-block';
    btnLogout.style.display = 'none';
  }
}

btnLogout.addEventListener('click', () => {
  cerrarSesion();
  window.location.href = 'login.html';
});

// Protección de la página: solo SUPERADMIN puede entrar
const usuarioActual = obtenerUsuario();
if (!usuarioActual || usuarioActual.rol !== 'SUPERADMIN') {
  alert('No tenés permisos para acceder a esta sección');
  window.location.href = 'index.html';
}

actualizarNavbar();

async function cargarUsuarios() {
  try {
    const usuarios = await obtenerUsuarios();
    renderizarUsuarios(usuarios);
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  }
}

function renderizarUsuarios(usuarios) {
  tablaUsuariosBody.innerHTML = '';

  usuarios.forEach((u) => {
    const esSuperAdmin = u.rol === 'SUPERADMIN';
    const fila = document.createElement('tr');

    const celdaRol = esSuperAdmin
      ? `<span class="badge-superadmin">${u.rol}</span>`
      : `
        <select class="select-rol" data-id="${u.id}">
          <option value="USUARIO" ${u.rol === 'USUARIO' ? 'selected' : ''}>USUARIO</option>
          <option value="ADMIN" ${u.rol === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
        </select>
      `;

    fila.innerHTML = `
      <td>${u.nombre}</td>
      <td>${u.email}</td>
      <td>${celdaRol}</td>
      <td>
        ${esSuperAdmin
          ? '<span style="color: #999;">Protegido</span>'
          : `<button class="btn-eliminar" data-id="${u.id}">Eliminar</button>`}
      </td>
    `;
    tablaUsuariosBody.appendChild(fila);
  });
}

tablaUsuariosBody.addEventListener('change', async (e) => {
  if (e.target.classList.contains('select-rol')) {
    const id = e.target.dataset.id;
    const nuevoRol = e.target.value;

    try {
      await cambiarRolUsuario(id, nuevoRol);
      mostrarMensaje('Rol actualizado correctamente', 'exito');
    } catch (error) {
      mostrarMensaje(error.message, 'error');
      cargarUsuarios(); // Revertimos el select visualmente si falló
    }
  }
});

tablaUsuariosBody.addEventListener('click', async (e) => {
  if (e.target.classList.contains('btn-eliminar')) {
    const id = e.target.dataset.id;
    const confirmar = confirm('¿Seguro que querés eliminar este usuario?');
    if (!confirmar) return;

    try {
      await eliminarUsuario(id);
      mostrarMensaje('Usuario eliminado correctamente', 'exito');
      cargarUsuarios();
    } catch (error) {
      mostrarMensaje(error.message, 'error');
    }
  }
});

cargarUsuarios();