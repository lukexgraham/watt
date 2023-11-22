import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../App";

const Login: any = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const { user, login, logout } = useAuth();

    const handleLogin = async () => {
        try {
            const response = await fetch("api/login/password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            });
            if (response.ok) {
                const responseData = await response.json();
                if (responseData.data.success) {
                    login({
                        username: responseData.data.user.username,
                        id: responseData.data.user.athlete_id,
                    });
                    navigate(
                        `../athletes/${responseData.data.user.athlete_id}`
                    );
                } else {
                    setErrorMessage(responseData.data.message);
                }
            } else {
                setErrorMessage("Error with login");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <>
            <div className="container">
                <div className="login">
                    <div className="login-box">
                        <div className="login-inputs">
                            <h2>Login</h2>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                placeholder="username"
                                onChange={handleInputChange}
                            />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                placeholder="password"
                                onChange={handleInputChange}
                            />
                            {errorMessage ? <span>{errorMessage}</span> : null}
                        </div>
                        <button onClick={handleLogin}>submit</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
