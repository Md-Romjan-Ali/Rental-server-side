const { setServers } = require("node:dns");
setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express')
const cors = require("cors")
const app = express()
require("dotenv").config()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())

const uri = process.env.MONGODB_URI

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        await client.connect();
        const db = client.db("Property-Rental");
        const ownerCollection = db.collection('owner')
        const clientCollection = db.collection('client')
        const bookingCollection = db.collection('booking')

        app.post("/api/ownerpost", async (req, res) => {
            const query = req.body;
            const result = await ownerCollection.insertOne(query)
            res.send(result)
        })
        app.get('/api/ownerpost', async (req, res) => {
            const result = await ownerCollection.find().toArray()
            res.send(result)
        })
        app.get('/api/ownerpost/:id', async (req, res) => {
            const { id } = req.params
            const query = { _id: new ObjectId(id) }
            const result = await ownerCollection.findOne(query)
            res.send(result)
        })
        // client says start
        app.post('/api/clientsays', async (req, res) => {
            const corsor = req.body
            const reuslt = await clientCollection.insertOne(corsor)
            res.send(reuslt)
        })
        app.get('/api/clientsays', async (req, res) => {
            const result = await clientCollection.find().toArray()
            res.send(result)
        })
        // client says end
        // BOOKING COODE
        app.post('/api/postbooking', async (req, res) => {
            const isExistBooking = await bookingCollection.findOne({
                sessionId: bookings?.sessionId
            })
            if (isExistBooking) {
                return isExistBooking
            }
            const cursor = req.body;
            const result = await bookingCollection.insertOne(cursor)
            res.send(result)
        })
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})