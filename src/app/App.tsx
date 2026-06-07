import { QueryProvider } from "@/app/providers/QueryProvider";
import { AppRouterProvider } from "@/app/providers/RouterProvider";

export function App() {
  return (
    <QueryProvider>
      <AppRouterProvider />
    </QueryProvider>
  );
}
