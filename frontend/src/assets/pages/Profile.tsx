import Feed from "../components/Feed";
import { useParams } from "react-router-dom";

const Profile: any = () => {
    const { id } = useParams();

    const syncStrava = () => {
        const response = fetch("/api/athlete/syncStrava");
    };

    return (
        <>
            <div className="profile"></div>
            <Feed id={id} />
        </>
    );
};

export default Profile;
