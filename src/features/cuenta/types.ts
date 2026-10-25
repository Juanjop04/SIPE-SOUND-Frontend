import type { usePerfil } from "@/features/auth";

/** GET /me (HU-B-304, HU-B-404 y HU-B-407), tal como lo entrega usePerfil. */
export type PerfilCuenta = NonNullable<ReturnType<typeof usePerfil>["perfil"]>;
