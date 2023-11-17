import { useState } from "react";
import { useNavigate } from "react-router";

const Register: any = ({ getFeed }: any) => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleRegistration = async () => {
        try {
            const response = await fetch("api/register/password", {
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
                    console.log(responseData.data.message);
                    navigate("../login");
                } else {
                    console.log(responseData.data.message);
                }
            } else {
                console.log("didnt reach");
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
                <h1>Register</h1>
                <div className="login-box">
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    <button onClick={handleRegistration}></button>
                </div>
            </div>
        </>
    );
};

export default Register;
