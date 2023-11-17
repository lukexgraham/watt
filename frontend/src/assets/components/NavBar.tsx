import { useAuth } from "../../App";
import { Link } from "react-router-dom";
import * as onClicks from "../utils/onClicks";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav id="navigation">
            <div className="navbar container">
                <Link to={`../athletes/${user.id}`}>{user.username}</Link>
                <a className="nav-link" href="https://github.com/lukexgraham">
                    github
                </a>
                <a
                    className="nav-link"
                    href="https://www.linkedin.com/in/lucas-graham-677228261/"
                >
                    linkedin
                </a>
                <Link to={"../users"}>
                    <button className="logout-button">Users</button>
                </Link>
                <p
                    className="logout-button"
                    onClick={() => onClicks.handleLogout(logout, navigate)}
                >
                    Logout
                </p>
            </div>
        </nav>
    );
};

export default NavBar;
