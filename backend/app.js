const express = require("express");
const app = express();
const port = 3000;
const passport = require("passport");
const session = require("express-session");
const db = require("../db");

const auth = require("./routes/auth");
const user = require("./routes/user");
const activity = require("./routes/activity");

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
