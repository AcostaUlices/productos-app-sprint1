const formRegister = document.getElementById('form-register');
const inputNombreReg = document.getElementById('nombre');
const inputEmailReg = document.getElementById('email');
const inputPasswordReg = document.getElementById('password');

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

formRegister.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = inputNombreReg.value.trim();
  const email = inputEmailReg.value.trim();
  const password = inputPasswordReg.value;

  if (!nombre || !email || !password) {
    mostrarMensaje('Todos los campos son obligatorios', 'error');
    return;
  }

  if (password.length < 6) {
    mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
    return;
  }

  try {
    await registrar(nombre, email, password);
    mostrarMensaje('Cuenta creada correctamente. Ya podés iniciar sesión.', 'exito');
    formRegister.reset();
  } catch (error) {
    mostrarMensaje(error.message, 'error');
  }
});