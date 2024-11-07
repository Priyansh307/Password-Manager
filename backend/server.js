const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb'); 
const bodyparser = require('body-parser')
const cors = require('cors')

dotenv.config()


// Connecting to the MongoDB Client
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
client.connect();

// App & Database
const dbName = process.env.DB_NAME 
const app = express()
const port = 3000 

// Middleware
app.use(bodyparser.json())
app.use(cors())


// Get all the passwords
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})

// Save a password
app.post('/', async (req, res) => { 
    const password = req.body
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({success: true, result: findResult})
})

// Delete a password by id
app.delete('/:id', async (req, res) => { 
    const { id } = req.params; // Get the ID from the URL params
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const result = await collection.deleteOne({ id: id }); // Use the ID to find the document
    if (result.deletedCount === 0) {
        return res.status(404).send({ success: false, message: 'Password not found' });
    }
    res.send({ success: true, message: 'Password deleted successfully' });
});



app.listen(port, () => {
    console.log(`Example app listening on  http://localhost:${port}`)
})