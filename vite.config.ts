import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    server: {
        proxy: {
            "/api": {
                target: "http://3.39.237.218:8080",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
