const express = require("express"),
    router = express.Router();

const db = require("../db");

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.json({
            error: "Unauthorized",
            error_message: "You cannot access this page without logging in.",
            redirect: "/login",
        });
    }
});

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.json({
            error: "Unauthorized",
            error_message: "You cannot access this page without logging in.",
            redirect: "/login",
        });
    }
}

router.get("/", async (req, res) => {
    console.log("/");
});

async function getStravaActivities() {
    auth_url = "https://www.strava.com/api/v3/oauth/token";
    activites_url = "https://www.strava.com/api/v3/athlete/activities";

    const payload = {
        client_id: "43024",
        client_secret: "485c35ac7f9fc990dcacf16e9d211d7b84bd9098",
        refresh_token: "93188f732327181f209f63ad660a5b146819b34e",
        grant_type: "refresh_token",
    };

    const response = await fetch(auth_url, {
        method: "POST",
        body: new URLSearchParams(payload),
    });

    const responseJson = await response.json();

    const APIEndpoint =
        "https://www.strava.com/api/v3/athlete/activities?per_page=20";

    const data = await fetch(APIEndpoint, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${responseJson.access_token}`,
        },
    });

    if (data.ok) {
        const response = await data.json();
        return {
            data: response,
        };
    } else {
        console.log("error fetching data...");
    }
}

router.get("/users", async (req, res) => {
    try {
        const response = await db.query(
            "SELECT athlete_id, username, following, followers FROM users"
        );

        if (response.rows) {
            res.status(200).json({
                data: {
                    success: true,
                    message: "Retrieved users.",
                    users: response.rows,
                },
            });
        } else {
            res.json({ success: false, message: "Failed to retrieve users." });
        }
    } catch (error) {
        console.log(error);
    }
});

router.get("/:id/syncStrava", async (req, res) => {
    try {
        const athlete_id = req.params.id;
        const response = await getStravaActivities();
        const values = `${response.data.map((data) => {
            return `(${data.id}, ${athlete_id}, '${data.name}', '${data.location_country}', '${data.start_date}', ${data.distance}, ${data.moving_time}, '${data.type}')`;
        })}`;
        const query = `INSERT INTO posts (strava_id, athlete_id, activity_name, location_country, start_date, distance, duration, sport_type) VALUES ${values}  ON CONFLICT (strava_id) DO NOTHING RETURNING post_id`;
        console.log(query);
        const result = await db.query(query);
    } catch (error) {
        console.log(error);
    }
});

router.get("/:id/activities", async (req, res) => {
    try {
        const athleteID = req.params.id;
        const query = `SELECT * FROM posts WHERE athlete_id = ${athleteID}`;
        const result = await db.query(query);
        res.status(200).json({ data: result.rows });
    } catch (error) {
        console.log(error);
    }
});

router.get("/:id/feed", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM posts WHERE athlete_id = $1",
            [req.params.id]
        );
        res.status(200).json({
            success: true,
            message: "Feed generated successfully.",
            data: {
                activities: result.rows,
            },
        });
    } catch (err) {
        console.log(err);
    }
});

router.post("/:id/follow/:targetID", async (req, res) => {
    try {
        const query1 =
            "UPDATE users SET following = array_append(following, $2) WHERE athlete_id = $1 AND (following IS NULL OR NOT ($2 = ANY(following)))";
        const query2 =
            "UPDATE users SET followers = array_append(followers, $1) WHERE athlete_id = $2 AND (followers IS NULL OR NOT ($1 = ANY(followers)))";

        const values = [parseInt(req.params.id), parseInt(req.params.targetID)];

        const response1 = await db.query(query1, values);
        const response2 = await db.query(query2, values);

        console.log(response1.rowCount && response2.rowCount);

        if (response1.rowCount && response2.rowCount) {
            res.status(200).json({
                data: {
                    success: true,
                    message: "User succesfully followed...",
                },
            });
        } else {
            res.json({
                data: {
                    success: false,
                    message: "User follow request failed...",
                },
            });
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
