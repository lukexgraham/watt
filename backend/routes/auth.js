import express from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";

import * as db from "../db/index.js";

const router = express.Router();
router.use(express.json());

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const query = `SELECT * FROM users WHERE username = $1`;
            const response = await db.query(query, [username]);

            const error = response.error;
            const row = response.rows[0];

            if (error) {
                return done(error);
            }
            if (!row) {
                return done(null, false, {
                    message: "Incorrect username or password.",
                });
            }

            bcrypt.compare(password, row.password, function (err, result) {
                if (err) {
                    return done(err);
                } else if (result) {
                    return done(null, { username: row.username, id: row.athlete_id });
                } else {
                    return done(null, false, { message: "Incorrect Password" });
                }
            });
        } catch (error) {
            return done(error);
        }
    })
);

router.post("/login/password", passport.authenticate("local"), (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "Sucessfully logged in",
            data: req.user,
        });
    } else {
        res.json({
            success: false,
            error: "Login failed",
        });
    }
});

router.post("/register/password", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const query = "INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING";
        const response = await db.query(query, [req.body.username, hashedPassword]);

        if (response.rows) {
            res.json({
                success: true,
                error: "User registered successfully",
            });
        } else throw new Error("Error registering user.");
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
});

router.post("/logout", (req, res) => {
    req.logout(() => {
        res.send("logged out");
    });
});

router.get("/register", (req, res) => {
    res.render("register");
});

passport.serializeUser((user, cb) => {
    process.nextTick(() => {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, user);
    });
});

export default router;
