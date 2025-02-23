import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { OwnerScheduleProvider } from "./contexts/OwnerScheduleContext.tsx";

createRoot(document.getElementById("root")!).render(
    <OwnerScheduleProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </OwnerScheduleProvider>
);
