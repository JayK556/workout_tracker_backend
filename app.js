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

//Mongoose Model Exercise
// const exerciseSchema = new mongoose.Schema({
//     date: Date,
//     exerciseName: String,
//     exerciseType: String,
//     aerobic: {
//         distance: Number,
//         timeDone: Number
//     },
//     anaerobic: {
//         numOfReps: Number,
//         numOfSets: Number
//     }
// });
// const Exercise = mongoose.model('Exercise', exerciseSchema);

const exerciseSchema = new mongoose.Schema({
    //exerciseId: mongoose.Schema.Types.ObjectId,
    //userId: mongoose.Schema.Types.ObjectId,
    date: Date,
    timeDone: Number,
    exerciseList: [{
        exerciseId: mongoose.Schema.Types.ObjectId,
        fields: [{field: String,
        value: String}]
    }]
});
const Exercise = mongoose.model('Exercise', exerciseSchema);

//Mongoose Model Exercise Type
const exerciseTypeSchema = new mongoose.Schema({
    name: String,
    type: String,
    description: String,
    fields: [String]
});
const ExerciseType = mongoose.model('ExerciseType', exerciseTypeSchema);

//Mongoose Model User
const useSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
});


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

app.get("/api/workout", async (req, res) => {
    const results = await ExerciseType.find();
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

app.post("/api/workout", async (req, res) => {
    //console.log(req.body);

    
    let tempExerciseList = [];

    for (const exercise of req.body.exerciseList) {
        if(exercise.isNew) {
            const fields = exercise.fields.map((field) => field.field);
            const newEntry = new ExerciseType({
                name: exercise.name,
                type: exercise.type,
                description: exercise.description,
                fields: fields
            });
            const savedDoc = await newEntry.save();
        
            tempExerciseList.push({
                exerciseId: savedDoc._id,
                fields: exercise.fields
            });

        } else {
            await ExerciseType.findOne({name: exercise.name});           
            tempExerciseList.push({
                exerciseId: exercise._id,
                fields: exercise.fields
            });
        }
    }

    console.log(tempExerciseList);
    
    const newEntry = new Exercise({
        //exerciseId: mongoose.Schema.Types.ObjectId,
        //userId: mongoose.Schema.Types.ObjectId,
        date: req.body.date,
        timeDone: req.body.timeDone,
        exerciseList: tempExerciseList
    });

    await newEntry.save();


    res.json({message: "Success"});
});

app.listen(PORT, () => {
    console.log(`Workout Tracker listening on port ${PORT}`);
})