import { useState, useEffect, createContext, useContext } from "react";
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
import Home from "./assets/pages/Root";
import NotFound from "./assets/pages/NotFound";
import Profile from "./assets/pages/Profile";
import Root from "./assets/pages/Root";
import Register from "./assets/pages/Register";
import UserList from "./assets/pages/UserList";

const userContext = createContext({
    user: { username: null, id: null },
    login: (user: any) => {},
    logout: () => {},
});

function App() {
    const [user, setUser] = useState({ username: null, id: null });

    const login = (userData: any) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser({ username: null, id: null });
        localStorage.removeItem("user");
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <>
            <BrowserRouter>
                <userContext.Provider value={{ user, login, logout }}>
                    <Routes>
                        <Route path="login" element={<Login />} />
                        <Route path="/" element={<Root />}>
                            <Route path="register" element={<Register />} />
                            <Route path="home" element={<Home />} />
                            <Route path="athletes/:id" element={<Profile />} />
                            <Route path="users" element={<UserList />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </userContext.Provider>
            </BrowserRouter>
        </>
    );
}

export const useAuth = () => {
    return useContext(userContext);
};

export default App;
