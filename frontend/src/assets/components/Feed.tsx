import ActivityThumbnail from "./ActivityThumbnail";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";

const Feed = ({ id }: any) => {
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState([]);

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
                        setLoading(false);
                        setActivities(responseData.data);
                    }
                }
            } catch (error: any) {
                console.error("Error:", error.message);
            }
        };

        getFeedActivities();
    }, [id]);
    return (
        <div className="feed">
            {loading ? (
                <Loading />
            ) : (
                activities.map((activity: any) => (
                    <ActivityThumbnail
                        key={activity.post_id}
                        activity={activity}
                    />
                ))
            )}
        </div>
    );
};

export default Feed;
