export const cargarLoginPage = () => import("./pages/LoginPage.jsx");
export const cargarRegistroPage = () => import("./pages/RegistroPage.jsx");
export { AuthProvider } from "./context/AuthProvider.jsx";
export { useSession } from "./hooks/useSession.js";
export { usePerfil } from "./hooks/usePerfil.js";
export { ROL, ROLES_ATRIL, puedeUsarAtril } from "./utils/roles.js";
