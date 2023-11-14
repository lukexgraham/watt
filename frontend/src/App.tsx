import { useState, useEffect } from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Link,
    Routes,
    Route,
    BrowserRouter,
} from "react-router-dom";
import "./App.css";
import Login from "./assets/pages/Login";
import Home from "./assets/pages/Home";
import NotFound from "./assets/pages/NotFound";
import Profile from "./assets/pages/Profile";
import { act } from "react-dom/test-utils";

function App() {
    const [data, setData] = useState({ message: "lucas" });

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="login" element={<Login />} />
                    <Route path="home" element={<Home />} />
                    <Route path="athletes/:id" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
