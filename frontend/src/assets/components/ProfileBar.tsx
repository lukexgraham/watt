import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as utils from "../utils/dataFormatting";
import defaultProfileImage from "../images/default_user.jpg";

const API_URL = import.meta.env.VITE_API_URL || "";

interface userStats {
    username: string;
    following_count: number;
    follower_count: number;
    post_count: number;
    total_distance: number;
    total_duration: number;
    latest_activity_name: string;
    latest_activity_start_date: string;
}

const ProfileBar = ({ id }: { id: string }) => {
    const [status, setStatus] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [userStats, setUserStats] = useState<userStats>({
        username: "",
        following_count: 0,
        follower_count: 0,
        post_count: 0,
        total_distance: 0,
        total_duration: 0,
        latest_activity_name: "",
        latest_activity_start_date: "",
    });

    useEffect(() => {
        async function getUserStats() {
            try {
                const response = await fetch(API_URL + `/api/athlete/${id}/stats`, { method: "GET" });

                if (!response.ok) throw new Error("Failed to fetch user stats.");

                const responseData = await response.json();

                if (responseData.success) {
                    setUserStats(responseData.data);
                } else throw new Error(responseData.error);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        getUserStats();
    }, [id]);

    return (
        <div className="profile-bar">
            <div className="profile-bar-head">
                <img src={defaultProfileImage} alt="" />
                <h2>{userStats.username}</h2>
            </div>
            <div className="profile-bar-body">
                <div>
                    <p>Following</p>
                    <span>{userStats.following_count}</span>
                </div>
                <div>
                    <p>Followers</p>
                    <span>{userStats.follower_count}</span>
                </div>
                <div>
                    <p>Activities</p>
                    <span>{userStats.post_count}</span>
                </div>
            </div>
            <div className="profile-bar-stats">
                <p>Latest Activity</p>
                <h3>{userStats.latest_activity_name}</h3>
                <p>{utils.ISOtoDate(userStats.latest_activity_start_date)}</p>
            </div>
            <div className="profile-bar-stats">
                <p>{`Total all time duration: ${utils.secondsToDuration(userStats.total_duration)}`}</p>
                <p>{`Total all time distance: ${utils.metresToKM(userStats.total_distance)}km`}</p>
            </div>
        </div>
    );
};

export default ProfileBar;
