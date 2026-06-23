const formLogin = document.getElementById('form-login');
const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');

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

// Si ya está logueado, lo mandamos directo al catálogo
if (estaLogueado()) {
  window.location.href = 'index.html';
}

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = inputEmail.value.trim();
  const password = inputPassword.value;

  if (!email || !password) {
    mostrarMensaje('Completá email y contraseña', 'error');
    return;
  }

  try {
    const data = await login(email, password);
    guardarSesion(data.token, data.usuario);
    window.location.href = 'index.html'; // Redirige al módulo principal (HU2)
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  }
});