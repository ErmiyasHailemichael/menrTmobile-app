 require('dotenv').config()

 const {PORT, DATABASE_URL} = process.env;
 const express = require('express')
 const app = express();
 const mongoose = require('mongoose');

 const morgan = require('morgan')
 const cors = require('cors')

 mongoose.connect(DATABASE_URL);

 mongoose.connection
  .on("open", () => console.log("You are connected to MongoDB"))
  .on("close", () => console.log("You are disconnected from MongoDB"))
  .on("error", (error) => console.log(error));


  const TmobileSchema = new mongoose.Schema({
    satisfaction: Number,
    task: String,
    share: String,
  });

  const Tmobile = mongoose.model('Tmobile', TmobileSchema);

  // MIDDLEWARE
app.use(cors()) // prevents cross origin resource sharing errors, allows access to server from all origins i.e. react frontend
app.use(morgan("dev")) // loggs details of all server hits to terminal
app.use(express.json()) // parse json bodies from request
app.use(express.urlencoded({extended: false})) // to use url encoded

// Routes ---- IDUC
app.get("/", (req, res) => {
    res.send("Welcome to Tmobile Survy");
  });

  //index
app.get('/survey', async(req, res)=>{
    try {
        res.status(200).json(await Tmobile.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

//create
app.post('/survey', async(req, res)=>{
    try {
        await Tmobile.create(req.body)
        res.status(200).json(await Tmobile.create(req.body))
    } catch(error){
        res.status(400).json(error)
    }
})

//delete
app.delete('survey/:id', async (req, res)=>{
    try {
        res.status(200).json (await Tmobile.findOneAndDelete(req.param.id))
    } catch (error) {
        res.status(400).json(error)
    }
})


//update
app.put('/survey/:id', async (req, res)=> {
    try {
        res.status(200).json( await Tmobile.findOneAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
})


app.listen(PORT, () => console.log(`Listen to port ${PORT}`));