import { useEffect, useState } from "react";
import { MdOutlineUnfoldLessDouble } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../App";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const { user, login, logout } = useAuth();
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
    }, []);

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

    function userList(): any {
        return users.map((userA: any) => (
            <Link to={`/athletes/${userA.athlete_id}`}>
                <h3 key={userA.athlete_id} style={{ display: "inline" }}>
                    {userA.username}
                </h3>{" "}
                {user.id == userA.athlete_id ? (
                    <span style={{ color: "red" }}>current user</span>
                ) : null}
                {userA.followers?.includes(user.id) ||
                user.id == userA.athlete_id ? null : (
                    <button
                        onClick={() => {
                            handleFollow(userA.athlete_id);
                        }}
                    >
                        follow
                    </button>
                )}
            </Link>
        ));
    }
    return (
        <>
            <div className="container">{userList()}</div>
        </>
    );
};

export default UserList;
