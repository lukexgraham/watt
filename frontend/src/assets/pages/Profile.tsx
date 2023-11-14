import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";

const Profile: any = () => {
    const [activities, setActivities] = useState([]);
    useEffect(() => {
        const getFeedActivities = async () => {
            try {
                const response = await fetch("/api/athlete/1/feed", {
                    method: "GET",
                });

                if (response.ok) {
                    const responseData = await response.json();
                    if (responseData.data) {
                        setActivities(responseData.data.activities);
                    }
                } else {
                    // Handle errors
                    console.error("Error getting API.", response.status);
                }
            } catch (error: any) {
                console.error("Error:", error.message);
            }
        };

        getFeedActivities();
    }, []);

    const listActivities = activities.map((activity: any) => (
        <li key={activity.post_id}>
            {activity.activity_name}
            <br />
            {activity.distance}
        </li>
    ));

    return (
        <>
            <NavBar />
            <ul>{listActivities}</ul>
            <Footer />
        </>
    );
};

export default Profile;
