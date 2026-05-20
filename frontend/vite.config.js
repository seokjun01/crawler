import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        cookieDomainRewrite: {
          "127.0.0.1": "localhost",
          "*": "localhost",
        },
        secure: false,
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes, req, res) => {
            const cookies = proxyRes.headers["set-cookie"];
            if (cookies) {
              proxyRes.headers["set-cookie"] = cookies.map((cookie) =>
                cookie
                  .replace(/Domain=[^;]+;?\s*/gi, "")
                  .replace(/SameSite=None/gi, "SameSite=Lax")
                  .replace(/Secure;?\s*/gi, ""),
              );
            }
          });
        },
      },
    },
  },
});
