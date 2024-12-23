const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.erzkh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const artCollection = client.db('artDB').collection('art')
        const userCollection = client.db('artDB').collection('user')

        app.get('/art', async (req, res) => {
            const cursor = artCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/art/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await artCollection.findOne(query);
            res.send(result);
        })

        app.post('/art', async (req, res) => {
            const newArt = req.body;
            const result = await artCollection.insertOne(newArt)
            res.send(result)
        })
        app.put('/art/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updatedArt = req.body;
            const art = {
                $set: {
                    itemName: updatedArt.itemName,
                    subcategoryName: updatedArt.subcategoryName,
                    description: updatedArt.description,
                    price: updatedArt.price,
                    rating: updatedArt.rating,
                    customization: updatedArt.customization,
                    time: updatedArt.time,
                    stock: updatedArt.stock,
                    photo: updatedArt.photo
                }
            }
            const result = await artCollection.updateOne(filter, art, option)
            res.send(result)
        })
        app.delete('/art/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await artCollection.deleteOne(query);
            res.send(result)
        })

        // user API
        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await userCollection.insertOne(user)
            res.send(result)
        })
        app.get('/user', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Art server is running')
})
app.listen(port, () => {
    console.log(`art server is running on port: ${port}`)
})