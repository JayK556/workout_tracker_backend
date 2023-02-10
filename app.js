const express = require("express");


const app = express();
const port = 8000;

app.use(express.static('/client/public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/public/index.html" , (err) => {
        if (err) {
            console.log(err);
        }
    });
});

app.listen(port, () => {
    console.log(`Workout Tracker listening on port ${port}`);
})