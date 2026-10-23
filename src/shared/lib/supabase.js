import { createClient } from "@supabase/supabase-js";

// En Vite, las variables de entorno del cliente deben empezar
// con VITE_ y se leen desde import.meta.env (no process.env).
// Se definen en el archivo .env en la raíz del proyecto (ver .env.example).
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
