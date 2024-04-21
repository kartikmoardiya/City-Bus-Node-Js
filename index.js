const express = require('express')
const app = express();
const db = require('./Database/db');
const router = express.Router();
const addBus = require('./Routes/addbus')
const allStations = require('./Routes/allStations')
const user = require('./Routes/users')
const path = require('./Routes/path')
const bodyParser = require('body-parser'); 
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000; 

app.use('/bus',addBus);
app.use('/user',user);
app.use('/route',path);
app.use('/allstations',allStations);
app.get('/', async (req, res) => {
    res.json({ msg: "Hello world" })
})

app.listen(3000, ()=>{
    console.log("Listening on Port...")
});
