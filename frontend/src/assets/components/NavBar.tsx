import { useAuth } from "../../App";
import * as onClicks from "../utils/onClicks";
import { useNavigate, Link } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";
import { useState, useEffect } from "react";

const NavBar = () => {
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    useEffect(() => {
        setShowDropdown(false);
    }, []);

    return (
        <nav id="navigation">
            <div className="navbar container">
                <span className="title">watt?</span>
                <div className="main-div-content">
                    <Link to={`../athletes/${user.id}`}>
                        <span className="nav-item">profile</span>
                    </Link>
                    <Link to={"../users"}>
                        <span className="nav-item">users</span>
                    </Link>
                    <Link to={"../upload"}>
                        <span className="nav-item">upload</span>
                    </Link>
                    {user.id ? (
                        <span className="nav-item" onClick={() => onClicks.handleLogout(logout, navigate)}>
                            logout
                        </span>
                    ) : null}
                </div>
                <div className="dropdown">
                    <button className="dropbtn" onClick={handleDropdown}>
                        <IoMdMenu />
                    </button>
                </div>
            </div>
            <div className={`dropdown-content ${showDropdown ? "show" : ""}`}>
                <Link to={`../athletes/${user.id}`} onClick={handleDropdown}>
                    <span className="nav-item">profile</span>
                </Link>
                <Link to={"../users"} onClick={handleDropdown}>
                    <span className="nav-item">users</span>
                </Link>
                <Link to={"../upload"} onClick={handleDropdown}>
                    <span className="nav-item">upload</span>
                </Link>
                {user.id ? (
                    <span className="nav-item" onClick={() => onClicks.handleLogout(logout, navigate)}>
                        logout
                    </span>
                ) : null}
            </div>
        </nav>
    );
};

export default NavBar;
