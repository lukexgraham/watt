import express from "express";
const app = express();
const port = 3000;
import passport from "passport";
import session from "express-session";

import auth from "./routes/auth.js";
import user from "./routes/user.js";
import activity from "./routes/activity.js";

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

app.use(passport.authenticate("session"));

app.use("/api/athlete", user);
app.use("/api/activity", activity);
app.use("/api/", auth);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
