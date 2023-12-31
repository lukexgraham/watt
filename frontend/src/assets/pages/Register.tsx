import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "";

const Register: any = ({ getFeed }: any) => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [errorMessage, setErrorMessage] = useState<string>("");
    const navigate = useNavigate();

    const handleRegistration = async () => {
        try {
            const response = await fetch(API_URL + "/api/register/password", {
                method: "POST",
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
                navigate("../login");
            } else throw new Error(responseData.error);
        } catch (error) {
            setErrorMessage("Username already taken");
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
                            <h1>Register</h1>
                            <input
                                type="text"
                                name="username"
                                placeholder="username"
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <span className={"error " + (errorMessage ? "show" : "")}>{errorMessage}</span>
                        </div>
                        <button onClick={handleRegistration}>submit</button>
                        <Link to={"/login"}>login</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
