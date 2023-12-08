import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import auth from "./routes/auth.js";
import user from "./routes/user.js";
import activity from "./routes/activity.js";

const app = express();
dotenv.config();

const port = process.env.SERVER_PORT || 3000;

app.use(cors({ credentials: true }));

app.use(
    session({
        secret: "secret",
        saveUninitialized: true,
        resave: true,
        cookie: {
            sameSite: true,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/athlete", user);
app.use("/api/activity", activity);
app.use("/api/", auth);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
