import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../App";
import { useEffect } from "react";

const Root: any = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!user.id) navigate("../login");
    }, []);

    return (
        <>
            <NavBar />
            <div className="main">
                <Outlet />
            </div>
            <Footer />
        </>
    );
};

export default Root;
