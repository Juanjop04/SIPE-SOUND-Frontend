import { createClient } from "@supabase/supabase-js";

// En Vite, las variables de entorno del cliente deben empezar
// con VITE_ y se leen desde import.meta.env (no process.env).
// Se definen en el archivo .env en la raíz del proyecto (ver .env.example).
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function registrarUsuario(email, password, nombre) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nombre } }, // llega al trigger handle_new_user()
  });
  if (error) throw error;
  return data;
}

export async function iniciarSesion(identifier, password) {
  let emailFinal = identifier

  // Si NO es email → busca el email por nombre de usuario
  if (!identifier.includes('@')) {
    const res = await fetch('http://localhost:5000/api/buscar-usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: identifier })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Usuario no encontrado')
    emailFinal = data.email
  }

  // Login con Supabase usando el email final
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailFinal,
    password
  })
  if (error) throw error
  return data
}

export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
