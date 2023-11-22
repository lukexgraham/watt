import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../App";
import Loading from "../components/Loading";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [temp, setTemp] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await fetch("/api/athlete/users", {
                    method: "GET",
                });
                if (response.ok) {
                    const responseData = await response.json();
                    if (responseData.data.success) {
                        setLoading(false);
                        setUsers(responseData.data.users);
                    } else {
                        console.log(responseData.data.message);
                    }
                } else {
                    console.log("Error fetching users...");
                }
            } catch (error) {
                console.log(error);
            }
        };
        getUsers();
    }, [temp]);

    const handleFollow = async (targetID: any) => {
        try {
            const response = await fetch(
                `/api/athlete/${user.id}/follow/${targetID}`,
                {
                    method: "POST",
                }
            );

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.data.success) {
                    console.log("followed user");
                    navigate("/users");
                    setTemp("followed");
                } else {
                    console.log("Failed to follow user...");
                }
            } else {
                console.log("Error making request...");
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleUnfollow = async (targetID: any) => {
        try {
            const response = await fetch(
                `/api/athlete/${user.id}/unfollow/${targetID}`,
                {
                    method: "POST",
                }
            );

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.data.success) {
                    console.log("Unfollowed user");
                    navigate("/users");
                    setTemp("unfollowed");
                } else {
                    console.log("Failed to unfollow user...");
                }
            } else {
                console.log("Error making request...");
            }
        } catch (error) {
            console.log(error);
        }
    };

    function userList(): any {
        return users.map((userA: any) => (
            <div className="user-row">
                <Link to={`/athletes/${userA.athlete_id}`}>
                    {user.id == userA.athlete_id ? (
                        <h3
                            key={userA.athlete_id}
                            style={{ color: "red", display: "inline" }}
                        >
                            {userA.username}
                        </h3>
                    ) : (
                        <h3
                            key={userA.athlete_id}
                            style={{ display: "inline" }}
                        >
                            {userA.username}
                        </h3>
                    )}
                </Link>

                {user.id == userA.athlete_id ? null : userA.followers?.includes(
                      user.id
                  ) ? (
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
        ));
    }
    return (
        <>
            <div className="container">
                {loading ? (
                    <Loading />
                ) : (
                    <div className="user-list">{userList()}</div>
                )}
            </div>
        </>
    );
};

export default UserList;
