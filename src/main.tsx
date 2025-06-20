// SockJS 폴리필을 가장 먼저 가져옵니다
import './utils/sockjs-polyfill';
import { createRoot } from "react-dom/client";
import { ModalProvider } from "./contexts/ModalContext.tsx";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { OwnerScheduleProvider } from "./contexts/OwnerScheduleContext.tsx";
import { EmployeeScheduleProvider } from "./contexts/EmployeeScheduleContext.tsx";
import { WebSocketProvider } from "./contexts/WebSocketContext.tsx";

createRoot(document.getElementById("root")!).render(
    <EmployeeScheduleProvider>
        <OwnerScheduleProvider>
            <ModalProvider>
                <BrowserRouter>
                <WebSocketProvider>
                    <App />
                    </WebSocketProvider>
                </BrowserRouter>
            </ModalProvider>
        </OwnerScheduleProvider>
    </EmployeeScheduleProvider>
);