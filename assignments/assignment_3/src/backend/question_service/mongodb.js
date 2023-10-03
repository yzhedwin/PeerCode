const express = require("express")
const mongoose = require("mongoose")

const mdb = express()
const cors = require("cors");
const Question = require('./models/questionModel')

const dotenv = require("dotenv")
dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

mdb.use(cors());
mdb.use(express.json())

const questionSchema = mongoose.Schema(
  {
    id: {
      type: Number
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    categories: {
      type: Array
    },
    complexity: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

mdb.get('/all', async(req, res) => {
  try {
    const questions = await Question.find({}).sort({id: 1});
    res.status(200).json(questions);
  } catch (error) {
      res.status(500).json({message: error.message})
  }
})

mdb.post('/add', async(req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(200).json(question);
      
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: error.message})
  }
})

mdb.delete('/delete/:id', async(req, res) =>{
  try {
      const id = req.params.id;
      const question = await Question.deleteOne({ id: id });
      if(!question){
          return res.status(404).json({message: `cannot find any question with ID ${id}`})
      }
      res.status(200).json(question);
      
  } catch (error) {
      res.status(500).json({message: error.message})
  }
})

mdb.put('/update/:id', async(req, res) => {
  try {
      const id = req.params.id;
      const question = await Question.updateOne({id: id}, req.body);
      if(!question){
          return res.status(404).json({message: `cannot find any product with ID ${id}`})
      }
      const updatedQuestion = await Question.findOne({id: id});
      res.status(200).json(updatedQuestion);
      
  } catch (error) {
      res.status(500).json({message: error.message})
  }
})

mdb.listen(3002, () => {
    console.log("Listening at port 3002")
})

mongoose.connect(process.env.REACT_APP_MONGODB_CONNECTION)
.then(() => {
    console.log("connected to MongoDB")
})
.catch ((e) => {
    console.log(e)
})