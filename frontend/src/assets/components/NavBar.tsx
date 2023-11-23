import { useAuth } from "../../App";
import { Link } from "react-router-dom";
import * as onClicks from "../utils/onClicks";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav id="navigation">
            <div className="navbar container">
                <span className="title">watt?</span>
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
        </nav>
    );
};

export default NavBar;
