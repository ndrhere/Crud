const express = require ('express');
const app = express();
var cors = require('cors')
app.use(express.json());
app.use(cors())
const multer = require('multer'); 
const path = require('path');
const fs = require('fs');
app.use('/uploads', express.static('uploads'));
const connectToMongo = require('./Db')
const Person = require ('./Schema/PersonSchema')
connectToMongo();
const PORT = 5000;



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  },
});

const upload = multer({ storage });

app.post('/createUser',upload.single('image') ,async (req, res) => {
    try {
     
      const newPerson = await Person.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename
      });
  
  
      res.status(201).json({newPerson});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to create a user' });
    }
  });


  // Get all people
app.get('/getUsers', async (req, res) => {
    try {
      const people = await Person.find();
      res.status(200).json(people);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to retrieve users' });
    }
  });


   //Get a people with specific Id 
  app.get('/getUser/:id', async (req, res) => {
    try {
      const person = await Person.findById(req.params.id);
      if (!person) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(person);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to retrieve the user' });
    }
  });


  // Update a person by ID
app.put('/updateUser/:id', upload.single('image'),async (req, res) => {
    try {
      const updatedPerson = await Person.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename, // Store the new image
      }, {
        new: true,
      });
  
      if (!updatedPerson) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(updatedPerson);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to update the user' });
    }
  });



  // Delete a person by ID
app.delete('/deleteUser/:id', async (req, res) => {
    try {
      const deletedPerson = await Person.findByIdAndRemove(req.params.id);
  
      if (!deletedPerson) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to delete the user' });
    }
  });



  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
