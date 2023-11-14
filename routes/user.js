const express = require("express"),
    router = express.Router();

const db = require("../db");

router.use((req, res, next) => {
    next();
});

router.get("/", async (req, res) => {
    console.log("/");
});

router.get("/:id", async (req, res) => {
    const result = await db.query("SELECT * FROM users WHERE athlete_id = $1", [
        req.params.id,
    ]);

    console.log(result.rows[0]);
    res.send(JSON.stringify(result.rows[0]));
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

module.exports = router;
