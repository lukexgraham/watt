const express = require("express"),
    router = express.Router();

// "https://www.strava.com/api/v3/athlete" "Authorization: Bearer [[token]]"

router.get("/strava", async (req, res) => {
    const idk = "377d626b55b3068e7cf75d58d8dc04206211ea26";

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
        "https://www.strava.com/api/v3/athlete/activities?per_page=10";

    const data = await fetch(APIEndpoint, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${responseJson.access_token}`,
        },
    });

    if (data.ok) {
        const response = await data.json();
        res.json({
            data: response,
        });
    } else {
        console.log("nah");
    }
});

module.exports = router;
