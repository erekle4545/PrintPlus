import React from "react";
import "./css/App.css";
import "./css/media.css";
import "./css/nesttable.css";

import useAuth from "./store/hooks/http/useAuth";
import useGlobalRequestLang from "./store/hooks/global/useGlobalRequestLang";
import Router from "./routes/routes";

function App() {
    useAuth();
    useGlobalRequestLang();

    return <Router />;
}

export default App;