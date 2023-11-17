const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const crypto = require("crypto");

const db = require("../db");

const router = express.Router();
router.use(express.json());

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const query = `SELECT * FROM users WHERE username = '${username}'`;
            const response = await db.query(query);

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
            if (row.password == password) {
                return done(null, row);
            } else {
                return done(null, false, { message: "Incorrect Password" });
            }
            crypto.pbkdf2(
                password,
                row.username,
                310000,
                32,
                "sha256",
                function (err, hashedPassword) {
                    if (err) {
                        return cb(err);
                    }
                    if (!crypto.timingSafeEqual(row.password, password)) {
                        return done(null, false, {
                            message: "Incorrect username or password.",
                        });
                    }
                    return done(null, row);
                }
            );
        } catch (error) {
            console.log(error);
        }
    })
);

router.post(
    "/login/password",
    passport.authenticate("local", { failureMessage: true }),
    async (req, res) => {
        res.status(200).json({
            data: {
                success: true,
                message: "Sucessfully logged in",
                user: req.user,
            },
        });
    }
);

router.post("/register/password", async (req, res) => {
    const query = `INSERT INTO users (username, password) VALUES ('${req.body.username}', '${req.body.password}') ON CONFLICT (username) DO NOTHING`;
    const response = await db.query(query);

    if (response.rows) {
        res.json({
            data: { success: true, message: "User registered successfully" },
        });
    } else {
        res.json({ data: { success: false, message: "Failure" } });
    }
});

router.get("/protected", async (req, res) => {
    if (req.isAuthenticated()) {
        res.send("protected");
    } else {
        res.send("fuckoff");
    }
});

router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.send("logged out");
    });
});

router.get("/register", (req, res, next) => {
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

module.exports = router;
