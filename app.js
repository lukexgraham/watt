const express = require("express");
const app = express();
const port = 3000;

const user = require("./routes/user");

app.use("/api/athlete", user);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/api/login", (req, res) => {
    let message = "/home";
    res.json({
        success: true,
        message: "Form submitted successfully",
        redirect: message,
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
