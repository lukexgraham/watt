import express from "express";
import * as db from "../db/index.js";
import xml2js from "xml2js";
import dotenv from "dotenv";
import * as utils from "../utils/gpsHandling.js";

dotenv.config();

const router = express.Router();
router.use(express.json({ limit: "10mb" }));

async function getStravaAccessToken() {
    try {
        const auth_url = "https://www.strava.com/api/v3/oauth/token";
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

        if (response.ok) {
            const responseJson = await response.json();
            return responseJson.access_token;
        } else throw new Error("Failed to retrieve access token.");
    } catch (error) {
        return error;
    }
}

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

router.get("/:id/getStravaDataStream", async (req, res) => {
    try {
        const activityID = req.params.id;
        const APIEndpoint = `https://www.strava.com/api/v3/activities/${activityID}/streams?keys=latlng&key_by_type=true`;

        const data = await fetch(APIEndpoint, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${await getStravaAccessToken()}`,
            },
        });

        if (data.ok) {
            const response = await data.json();
            res.json({ success: true, data: response });
        } else throw new Error("Failed to retrieve activity.");
    } catch (error) {
        res.json({ success: false, error: error });
    }
});

router.get("/:id/getDataStream", async (req, res) => {
    try {
        const activityId = req.params.id;
        const response = await db.query("SELECT coords FROM streams WHERE post_id = $1", [activityId]);
        if (response.rows) {
            const json = response.rows[0].coords.map((str) => JSON.parse(str));
            res.json({ success: true, data: response.rows[0].coords });
        } else throw new Error("No streams for this activity.");
    } catch (error) {
        res.json({ success: false, error: error });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const postId = req.params.id;
        const query =
            "SELECT posts.*, users.username FROM posts JOIN users ON posts.athlete_id = users.athlete_id WHERE posts.post_id = $1";
        const values = [postId];
        const result = await db.query(query, values);

        if (result.rowCount) res.status(200).json({ data: result.rows[0], success: true });
        else throw new Error("No posts for this user.");
    } catch (error) {
        res.json({ success: false, error: error });
    }
});

router.post("/:id/gpxupload", async (req, res) => {
    try {
        const json = await xml2js.parseStringPromise(req.body.file, { explicitArray: false, explicitRoot: false });

        if (json && json.trk) {
            const track = json.trk.trkseg.trkpt;

            const coords = [];
            const hr = [];
            const elevation = [];
            const power = [];
            const time = [];

            track.forEach((point) => {
                if (point.$ !== undefined) {
                    coords.push(point.$);
                }

                if (point.ele !== undefined) {
                    elevation.push(Math.round(point.ele));
                }

                if (point.time !== undefined) {
                    time.push(new Date(point.time));
                }
            });

            const points = coords.map((coord, index) => {
                return { lon: coord.lon, lat: coord.lat, elevation: elevation[index], time: time[index] };
            });

            const distance = Math.round(utils.calculateOverallDistance(points));
            const movingTime = Math.round(utils.calculateTotalMovingTime(points, 0.2));
            const type = json.trk.type | null;
            const title = req.body.title;
            const date = time[0];
            location = "United Kingdom";

            const query =
                "INSERT INTO posts (athlete_id, activity_name, location_country, distance, duration, sport_type, start_date) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING post_id";
            const values = [req.params.id, title, location, distance, movingTime, type, date];
            const response = await db.query(query, values);
            if (response.rowCount && coords) {
                const streamsQuery =
                    "INSERT INTO streams (post_id, coords, time, elevation) VALUES ($1,$2::varchar(50)[],$3::varchar(30)[],$4::int[]) RETURNING stream_id";
                const streamValues = [response.rows[0].post_id, coords, time, elevation.map(Number)];
                const streamsResponse = await db.query(streamsQuery, streamValues);

                if (streamsResponse.rowCount) {
                    res.status(200).json({
                        success: true,
                        message: "Uploaded successfully...",
                    });
                }
            } else throw new Error("Failed to upload to database...");
        } else throw new Error("Invalid GPX file...");
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to process GPX file..." });
    }
});

router.post("/manualupload", async (req, res) => {
    try {
        const { distance, duration, title, type, location, date } = req.body;
        const query =
            "INSERT INTO posts (athlete_id, activity_name, location_country, distance, duration, sport_type, start_date) VALUES ($1,$2,$3,$4,$5,$6,$7)";
        const values = [req.params.id, title, location, distance, duration, type, date];
        const response = await db.query(query, values);

        if (response.rowCount) {
            res.json({ success: true, message: "Uploaded successfully..." });
        } else throw new Error("Upload failed...");
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
});

export default router;
