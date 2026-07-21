import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import { AuthProvider } from "./app/AuthContext";
import { queryClient } from "./app/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
