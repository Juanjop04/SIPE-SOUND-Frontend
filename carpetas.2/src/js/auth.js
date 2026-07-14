localStorage
// js/auth.js

function registrar(nombre, password) {
  localStorage.setItem('usuario', JSON.stringify({ nombre, password }));
  alert('Registro exitoso');
}

function login(nombre, password) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (usuario && usuario.nombre === nombre && usuario.password === password) {
    localStorage.setItem('sesion', 'activa');
    window.location.href = 'index.html';
  } else {
    alert('Usuario o contraseña incorrectos');
  }
}

function protegerPagina() {
  if (localStorage.getItem('sesion') !== 'activa') {
    window.location.href = 'login.html';
  }
}