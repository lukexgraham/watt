import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../App";

const API_URL = import.meta.env.VITE_API_URL || "";

const Login: any = () => {
    const [formData, setFormData] = useState<Record<string, string>>({ username: "", password: "" });
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [status, setStatus] = useState<string>("");

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            setStatus("submitting");
            const response = await fetch(API_URL + "/api/login/password", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            });

            if (!response.ok) throw new Error();
            const responseData = await response.json();

            if (responseData.success) {
                login({
                    username: responseData.data.username,
                    id: responseData.data.id,
                });
                navigate(`../athletes/${responseData.data.id}`);
            } else throw new Error(responseData.error);
        } catch (error) {
            setErrorMessage("Incorrect username or password");
            setStatus("");
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
        <div className="container">
            <div className="login">
                <div className="login-box">
                    <div className="login-inputs">
                        <h1>Login</h1>
                        <input type="text" name="username" value={formData.username} placeholder="username" onChange={handleInputChange} />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            placeholder="password"
                            onChange={handleInputChange}
                        />
                        <span className={"error " + (errorMessage ? "show" : "")}>{errorMessage}</span>
                    </div>
                    <button onClick={handleLogin} disabled={status === "submitting"}>
                        submit
                    </button>
                    <Link to={"/register"}>register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
