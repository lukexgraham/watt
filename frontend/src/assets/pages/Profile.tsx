import Feed from "../components/Feed";
import { useParams } from "react-router-dom";
import ProfileBar from "../components/ProfileBar";
import { useState } from "react";
import { useAuth } from "../../App";
import Loading from "../components/Loading";

const Profile: any = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [feedType, setFeedType] = id == user.id ? useState<string>("following") : useState<string>("myActivities");

    const handleInputChange = (event: any) => {
        const value = event.target.value;
        setFeedType(value);
    };

    return (
        <div className="container">
            <div className="feed-selector">
                {id == user.id ? (
                    <select name="feedType" id="feedType" onChange={handleInputChange}>
                        <option value="following">Following</option>
                        <option value="myActvities">My Activities</option>
                    </select>
                ) : null}
            </div>

            <div className="profile">
                <ProfileBar id={id!} />
                <Feed id={id} myActivities={feedType === "following" ? false : true} />
            </div>
        </div>
    );
};

export default Profile;
