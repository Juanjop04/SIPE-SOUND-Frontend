import { supabase } from "@/shared/lib/supabase.js";

// Temporal hasta HU-F-203 (lo reemplaza httpClient).
export async function obtenerToken() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error("No has iniciado sesion");
  return data.session.access_token;
}
