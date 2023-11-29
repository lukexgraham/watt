import express from "express";
const router = express.Router();

import * as db from "../db/index.js";
router.use(express.json());

import dotenv from "dotenv";
dotenv.config();

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.json({
            error: "Unauthorized",
            success: false,
            redirect: "/login",
        });
    }
});

async function getStravaActivities(num) {
    const auth_url = "https://www.strava.com/api/v3/oauth/token";
    const activites_url = "https://www.strava.com/api/v3/athlete/activities";

    const payload = {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        refresh_token: process.env.STRAVA_REFRESH_TOKEN,
        grant_type: "refresh_token",
    };

    const response = await fetch(auth_url, {
        method: "POST",
        body: new URLSearchParams(payload),
    });

    const responseJson = await response.json();

    const APIEndpoint = `https://www.strava.com/api/v3/athlete/activities?per_page=${num}`;

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

router.get("/:id/stats", async (req, res) => {
    try {
        const athlete_id = req.params.id;
        const query = `SELECT u.username, u.athlete_id, COALESCE(array_length(u.followers, 1), 0) AS follower_count, COALESCE(array_length(u.following, 1), 0) AS following_count, COUNT(p.*) AS post_count, COALESCE(SUM(p.distance), 0) AS total_distance, COALESCE(SUM(p.duration), 0) AS total_duration, MAX(p.start_date) AS latest_activity_start_date, MAX(p.activity_name) AS latest_activity_name FROM users u LEFT JOIN posts p ON u.athlete_id = p.athlete_id WHERE u.athlete_id = $1 GROUP BY u.username, u.athlete_id, u.followers, u.following ORDER BY latest_activity_start_date DESC;`;
        const params = [athlete_id];
        const response = await db.query(query, params);

        if (response.rowCount) res.status(200).json({ success: true, data: response.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
});

router.get("/users", async (req, res) => {
    try {
        const response = await db.query("SELECT athlete_id, username, following, followers FROM users ORDER BY username DESC");

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

router.get("/:id/syncStrava/:num", async (req, res) => {
    try {
        const athlete_id = req.params.id;
        const response = await getStravaActivities(req.params.num);
        const values = `${response.data.map((data) => {
            return `(${data.id}, ${athlete_id}, '${data.name}', '${data.location_country}', '${data.start_date}', ${data.distance}, ${data.moving_time}, '${data.type}')`;
        })}`;
        const query = `INSERT INTO posts (strava_id, athlete_id, activity_name, location_country, start_date, distance, duration, sport_type) VALUES ${values}  ON CONFLICT (strava_id) DO NOTHING RETURNING post_id`;
        console.log(query);
    } catch (error) {
        console.log(error);
    }
});

router.get("/:id/activities", async (req, res) => {
    try {
        const athleteID = req.params.id;
        const query =
            "SELECT posts.*, users.username FROM posts JOIN users ON posts.athlete_id = users.athlete_id WHERE posts.athlete_id = $1 ORDER BY start_date DESC";
        const values = [athleteID];
        const response = await db.query(query, values);

        if (response.rows) {
            res.status(200).json({ success: true, data: response.rows });
        } else throw new Error(`Failed to retrieve posts for this user: ${athleteID}`);
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
});

router.get("/:id/feed", async (req, res) => {
    try {
        const response = await db.query(
            "SELECT p.*, u.username AS username FROM posts p JOIN users u ON p.athlete_id = u.athlete_id WHERE u.athlete_id IN (SELECT unnest(following) FROM users WHERE athlete_id = $1) ORDER BY p.start_date DESC;",
            [req.params.id]
        );
        if (response.rows) {
            res.status(200).json({ success: true, data: response.rows });
        } else throw new Error("Error fetching activities");
    } catch (error) {
        res.json({ success: false, error: error });
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

        if (response1.rowCount && response2.rowCount) {
            res.status(200).json({
                data: {
                    success: true,
                    message: "User succesfully unfollowed...",
                },
            });
        } else {
            res.json({
                data: {
                    success: false,
                    message: "User unfollow request failed...",
                },
            });
        }
    } catch (error) {
        console.log(error);
    }
});

router.post("/:id/unfollow/:targetID", async (req, res) => {
    try {
        const query1 =
            "UPDATE users SET following = array_remove(following, $2) WHERE athlete_id = $1 AND (following IS NOT NULL OR ($2 = ANY(following)))";
        const query2 =
            "UPDATE users SET followers = array_remove(followers, $1) WHERE athlete_id = $2 AND (followers IS NOT NULL OR ($1 = ANY(followers)))";

        const values = [parseInt(req.params.id), parseInt(req.params.targetID)];

        const response1 = await db.query(query1, values);
        const response2 = await db.query(query2, values);

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

export default router;
