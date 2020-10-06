const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const cors = require('cors')


//Setup CORS
app.use(cors())

//Import Routes
const authRoute = require("./routes/auth");

//DB connection to Mongo Atlas
dotenv.config();
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => console.log("Connected to IWP-Cluster"))

//BodyParser Middleware
app.use(express.json());

//Router Middlware
app.use("/api", authRoute);

app.get("/", (req, res) => {
    res.send("working")
})

app.listen(3001, () => {
    console.log("Server up and running!");
})