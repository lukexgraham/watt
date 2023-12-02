import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../App";
import Loading from "../components/Loading";

const API_URL = import.meta.env.VITE_API_URL || "";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [temp, setTemp] = useState("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await fetch(API_URL + "/api/athlete/users", {
                    method: "GET",
                });
                if (!response.ok) throw new Error();

                const responseData = await response.json();

                if (responseData.data.success) {
                    setLoading(false);
                    setUsers(responseData.data.users);
                } else throw new Error();
            } catch (error) {
                setErrorMessage("error");
            }
        };
        getUsers();
    }, [temp]);

    const handleFollow = async (targetID: any) => {
        try {
            const response = await fetch(API_URL + `/api/athlete/${user.id}/follow/${targetID}`, {
                method: "POST",
            });

            if (!response.ok) throw new Error();

            const responseData = await response.json();

            if (responseData.data.success) {
                navigate("/users");
                setTemp("followed");
            } else throw new Error();
        } catch (error) {
            setErrorMessage("error");
        }
    };

    const handleUnfollow = async (targetID: any) => {
        try {
            const response = await fetch(API_URL + `/api/athlete/${user.id}/unfollow/${targetID}`, {
                method: "POST",
            });

            if (!response.ok) throw new Error();

            const responseData = await response.json();

            if (responseData.data.success) {
                navigate("/users");
                setTemp("unfollowed");
            } else throw new Error();
        } catch (error) {
            setErrorMessage("error");
        }
    };

    const UserList = () => {
        return (
            <div className="user-list">
                {users.map((userA: any) => (
                    <div className="user-row">
                        <Link to={`/athletes/${userA.athlete_id}`}>
                            {user.id == userA.athlete_id ? (
                                <h3 key={userA.athlete_id} style={{ color: "red", display: "inline" }}>
                                    {userA.username}
                                </h3>
                            ) : (
                                <h3 key={userA.athlete_id} style={{ display: "inline" }}>
                                    {userA.username}
                                </h3>
                            )}
                        </Link>

                        {user.id == userA.athlete_id ? null : userA.followers?.includes(user.id) ? (
                            <button
                                onClick={() => {
                                    handleUnfollow(userA.athlete_id);
                                }}
                            >
                                unfollow
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    handleFollow(userA.athlete_id);
                                }}
                            >
                                follow
                            </button>
                        )}
                    </div>
                ))}
            </div>
        );
    };
    return (
        <>
            <div className="container">{loading ? <Loading size="40px" /> : <UserList />}</div>
        </>
    );
};

export default UserList;
