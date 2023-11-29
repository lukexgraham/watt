import Feed from "../components/Feed";
import { useParams } from "react-router-dom";
import ProfileBar from "../components/ProfileBar";
import { useState } from "react";

const Profile: any = () => {
    const { id } = useParams<{ id: string }>();
    const [feedType, setFeedType] = useState<string>("following");

    const handleInputChange = (event: any) => {
        const value = event.target.value;
        setFeedType(value);
    };

    return (
        <div className="container">
            <div className="feed-selector">
                <select name="feedType" id="feedType" onChange={handleInputChange}>
                    <option value="following">Following</option>
                    <option value="myActvities">My Activities</option>
                </select>
            </div>

            <div className="profile">
                <ProfileBar id={id!} />
                <Feed id={id} myActivities={feedType === "following" ? false : true} />
            </div>
        </div>
    );
};

export default Profile;
