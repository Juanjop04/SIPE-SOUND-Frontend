import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEnfriamiento } from "@/shared/hooks/useEnfriamiento";
import { aplicarErroresServidor, esDemasiadasSolicitudes } from "@/shared/validacion";
import { registrar } from "../api/authApi";
import { esquemaRegistro, type DatosRegistroFormulario, type EntradaRegistro } from "../schemas";

// Campos que el backend puede señalar (confirmar es solo del frontend).
const CAMPOS = ["nombre", "email", "password", "acepta_terminos"] as const;

/** Estado y envío del registro: validación con Zod, errores del servidor y 429. */
export function useFormularioRegistro() {
  const { enfriando, iniciar: iniciarEnfriamiento } = useEnfriamiento();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [exito, setExito] = useState<{ mensaje: string; email: string } | null>(null);
  const formulario = useForm<EntradaRegistro, unknown, DatosRegistroFormulario>({
    resolver: zodResolver(esquemaRegistro),
    mode: "onTouched",
    defaultValues: { nombre: "", email: "", password: "", confirmar: "", acepta_terminos: false },
  });

  async function enviar(datos: DatosRegistroFormulario) {
    setErrorGeneral(null);
    try {
      // Solo los campos del esquema del backend: nunca `rol` ni `confirmar`.
      const { message } = await registrar({
        nombre: datos.nombre,
        email: datos.email,
        password: datos.password,
        acepta_terminos: true,
      });
      setExito({ mensaje: message, email: datos.email });
    } catch (error) {
      if (esDemasiadasSolicitudes(error)) iniciarEnfriamiento();
      setErrorGeneral(aplicarErroresServidor(error, formulario.setError, CAMPOS));
    }
  }

  return { formulario, enviar: formulario.handleSubmit(enviar), errorGeneral, exito, enfriando };
}
