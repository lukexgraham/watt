const express = require("express");
const db = require("../../db");
const xml2js = require("xml2js");
const fs = require("fs");
require("dotenv").config();

const router = express.Router();
router.use(express.json({ limit: "10mb" }));

router.get("/:id/getDataStream", async (req, res) => {
    const auth_url = "https://www.strava.com/api/v3/oauth/token";
    const activites_url = "https://www.strava.com/api/v3/athlete/activities";
    const activityID = req.params.id;

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

    const APIEndpoint = `https://www.strava.com/api/v3/activities/${activityID}/streams?keys=latlng&key_by_type=true`;

    const data = await fetch(APIEndpoint, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${responseJson.access_token}`,
        },
    });

    if (data.ok) {
        const response = await data.json();
        res.send({ data: response });
    } else {
        console.log(data.json());
    }
});

router.get("/:id", async (req, res) => {
    try {
        const postID = req.params.id;
        const query =
            "SELECT posts.*, users.username FROM posts JOIN users ON posts.athlete_id = users.athlete_id WHERE posts.post_id = $1";
        const values = [postID];
        const result = await db.query(query, values);
        res.status(200).json({ data: result.rows[0], success: true });
    } catch (error) {
        console.log(error);
    }
});

router.post("/gpxupload", async (req, res) => {
    try {
        const json = await xml2js.parseStringPromise(req.body.file);

        if (json) {
            res.json({
                success: true,
                data: json,
                message: "Uploaded successfully...",
            });
        } else {
            res.json({ success: false, message: "Upload failed..." });
        }
    } catch (error) {
        console.log("error");
    }
});

module.exports = router;
