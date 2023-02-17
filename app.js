require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
//const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

//Database Connection
const uri = `mongodb+srv://${process.env.MONGODBUSER}:${process.env.MONGODBPASS}@cluster0.mnwlqj5.mongodb.net/workouttracker?retryWrites=true&w=majority`;
mongoose.set('strictQuery', false);

async function dbConnect() {
    await mongoose.connect(uri);
}

dbConnect();

//Mongoose Model
const exerciseSchema = new mongoose.Schema({
    date: Date,
    exerciseName: String,
    exerciseType: String,
    aerobic: {
        distance: Number,
        timeDone: Number
    },
    anaerobic: {
        numOfReps: Number,
        numOfSets: Number
    }
});
const Exercise = mongoose.model('Exercise', exerciseSchema);




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '../client/public'));

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.get("/api/tracker", async (req, res) => {
    const results = await Exercise.find();
    res.json(results);
});

app.post("/api/tracker", (req, res) => {
    console.log(req.body);
    const newEntry = new Exercise({
        date: req.body.date,
        exerciseName: req.body.exerciseName,
        exerciseType: req.body.exerciseType,
            aerobic: {
                distance: req.body.aerobic.distance,
                timeDone: req.body.aerobic.timeDone
            },
            anaerobic: {
                numOfReps: req.body.anaerobic.numOfReps,
                numOfSets: req.body.anaerobic.numOfSets
            }
    });
    newEntry.save(err => {
        if (err) {
            console.log(err);
        }
    });
    res.json({message: "Success"});
});

app.listen(PORT, () => {
    console.log(`Workout Tracker listening on port ${PORT}`);
})