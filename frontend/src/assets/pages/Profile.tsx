import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Feed from "../components/Feed";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as utils from "../utils/dataFormatting";
import { useAuth } from "../../App";

const Profile: any = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const { user, login, logout } = useAuth();

    useEffect(() => {
        const getFeedActivities = async () => {
            try {
                const response = await fetch(`/api/athlete/${id}/activities`, {
                    method: "GET",
                });
                if (response.ok) {
                    const responseData = await response.json();
                    if (responseData.error) {
                        window.location.href = responseData.redirect;
                    }
                    if (responseData.data) {
                        setActivities(responseData.data);
                    }
                }
            } catch (error: any) {
                console.error("Error:", error.message);
            }
        };

        getFeedActivities();
    }, []);

    return (
        <>
            <div className="profile-banner container">
                <h1>{user.username ? user.username : null}</h1>
            </div>
            <Feed activities={activities} />
        </>
    );
};

export default Profile;
