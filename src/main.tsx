import { createRoot } from "react-dom/client";
import { ModalProvider } from "./contexts/ModalContext.tsx";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { OwnerScheduleProvider } from "./contexts/OwnerScheduleContext.tsx";
import { EmployeeScheduleProvider } from "./contexts/EmployeeScheduleContext.tsx";

createRoot(document.getElementById("root")!).render(
    <EmployeeScheduleProvider>
        <OwnerScheduleProvider>
            <ModalProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ModalProvider>
        </OwnerScheduleProvider>
    </EmployeeScheduleProvider>
);
