import { paths } from "@/shared/config/paths.js";

// Roles de profiles (HU-B-304). El rol SIEMPRE sale de GET /me, nunca del token.
export const ROL = Object.freeze({
  estudiante: "estudiante",
  docente: "docente",
  admin: "admin",
});

/** Quién administra (/admin/*). */
export const ROLES_ADMIN = Object.freeze([ROL.admin]);

/** Quién puede entrar al atril (/docente/*). */
export const ROLES_ATRIL = Object.freeze([ROL.docente, ROL.admin]);

/** @param {string | null | undefined} rol */
export function puedeUsarAtril(rol) {
  return ROLES_ATRIL.includes(rol);
}

/** A dónde llega cada rol tras iniciar sesión (si no hay ?volver= válido). */
/** @param {string | null | undefined} rol */
export function inicioPorRol(rol) {
  return puedeUsarAtril(rol) ? paths.docente.inicio : paths.inicio;
}
