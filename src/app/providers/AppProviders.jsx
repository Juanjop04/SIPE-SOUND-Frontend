import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/features/auth";
import { queryClient } from "@/shared/api/queryClient.js";
import { AvisosProvider } from "@/shared/ui";

// AuthProvider va dentro de QueryClientProvider: limpia la caché al cerrar sesión.
export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AvisosProvider>{children}</AvisosProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
