import Feed from "../components/Feed";
import { useParams } from "react-router-dom";
import ProfileBar from "../components/ProfileBar";

const Profile: any = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="container profile">
            <ProfileBar id={id!} />
            <Feed id={id} />
        </div>
    );
};

export default Profile;
