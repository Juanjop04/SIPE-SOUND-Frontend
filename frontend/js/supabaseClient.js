// =========================================================
// Cliente de Supabase para el FRONTEND
// Se usa para login/registro (auth) directo desde el navegador.
// Las consultas a datos (lecciones, acordes, etc.) las hace
// tu BACKEND en Python — el frontend le pide a Flask, no a Supabase.
// =========================================================

// 1. Ve a tu proyecto en Supabase → Settings → API
// 2. Copia la "Project URL" y la "anon public key"
// 3. Reemplaza los valores de abajo

const SUPABASE_URL = "https://lwqbmvqebnglntlvbedq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3cWJtdnFlYm5nbG50bHZiZWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMzc0NDUsImV4cCI6MjA5OTgxMzQ0NX0.ucusRTIM4xOm-xaHSf5WWtSOueEs6e3THlf9F2FAyWA";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Ejemplo de registro
async function registrarUsuario(email, password, nombre) {
  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
    options: {
      data: { nombre: nombre } // esto llega al trigger handle_new_user()
    }
  });
  if (error) throw error;
  return data;
}

// Ejemplo de login
async function iniciarSesion(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });
  if (error) throw error;
  return data;
}

// Ejemplo de logout
async function cerrarSesion() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
}
