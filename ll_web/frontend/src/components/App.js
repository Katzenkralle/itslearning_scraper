import React from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter as Router,  Route, Routes} from "react-router-dom";

import HomePage from './Home';
import Login from './Login'
function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<HomePage />} />
                <Route exact path="/login" element={<Login />}/>
            </Routes>
        </Router>
    );
}

const appDiv = document.getElementById('app');
createRoot(appDiv).render(<App />);
