import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import { queryClient } from "./app/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthGate } from "./app/AuthGate";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate>
        <RouterProvider router={router} />
      </AuthGate>
    </QueryClientProvider>
  );
}

export default App;
