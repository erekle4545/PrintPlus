import React from "react";
import "./css/App.css";
import "./css/media.css";
import "./css/nesttable.css";

import UseAuth from "./store/hooks/http/useAuth";
import UseGlobalRequestLang from "./store/hooks/global/useGlobalRequestLang";
import Router from "./routes/routes";

function App() {
    return (
        <>
            {/* Global startup effects */}
            <UseAuth />
            <UseGlobalRequestLang />

            {/* App Router (ProtectedRoute already inside) */}
            <Router />
        </>
    );
}

export default App;
