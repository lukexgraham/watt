import ActivityThumbnail from "./ActivityThumbnail";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";

interface activities {
    post_id: string;
    strava_id: number | null;
    athlete_id: number | null;
    activity_name: string;
    location_country: string;
    start_date: any;
    distance: number;
    duration: number;
    sport_type: string;
}

const Feed = ({ id, myActivities }: any) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [activities, setActivities] = useState<[activities]>([
        {
            post_id: "",
            strava_id: null,
            athlete_id: null,
            activity_name: "",
            location_country: "",
            start_date: "",
            distance: 0,
            duration: 0,
            sport_type: "",
        },
    ]);

    useEffect(() => {
        const getFeedActivities = async () => {
            try {
                const response = myActivities
                    ? await fetch(`/api/athlete/${id}/activities`, {
                          method: "GET",
                      })
                    : await fetch(`/api/athlete/${id}/feed`, {
                          method: "GET",
                      });

                if (!response.ok) throw new Error("Failed to fetch user feed.");

                const responseData = await response.json();

                if (responseData.success) {
                    setActivities(responseData.data);
                } else throw new Error(responseData.error);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getFeedActivities();
    }, [id, myActivities]);

    return (
        <div className={`feed ${loading ? "" : "open"}`}>
            {loading && <Loading size="40px" />}
            {activities.map((activity: any) => (
                <ActivityThumbnail key={activity.post_id} activity={activity} />
            ))}
        </div>
    );
};

export default Feed;
