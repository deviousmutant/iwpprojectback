const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const dotenv = require('dotenv')
const cors = require('cors')


//Setup CORS
app.use(cors())

//Import Routes
const usersRoute = require("./routes/users");
const tasksRoute = require("./routes/tasks");
const troupeRoute = require("./routes/troupes");
const ideaRoute = require("./routes/ideas");
const reminderRoute = require("./routes/reminders");

//DB connection to Mongo Database

// dotenv.config();

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
}, () => console.log("Connected to Mongo Database (Local)"))


//BodyParser Middleware
app.use(express.json());

//Router Middleware
app.use("/users", usersRoute);
app.use("/troupes", troupeRoute);
app.use("/", tasksRoute);
app.use("/ideas", ideaRoute);
app.use("/reminders",reminderRoute);



app.listen(3001, () => {
    console.log("Server up and running!");
})