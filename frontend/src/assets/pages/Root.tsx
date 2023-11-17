import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";

const Root: any = () => {
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
