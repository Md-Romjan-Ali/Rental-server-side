const { setServers } = require("node:dns");
setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express')
const cors = require("cors")
const app = express()
require("dotenv").config()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");

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
const JWKS = createRemoteJWKSet(
    new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
)
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorizatoin
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const token = authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    try {
        const { payload } = await jwtVerify(token, JWKS)
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
}
const verifyTanant = (req, res, next) => {
    console.log(req, 'from verifyTanat');
    next()
}
async function run() {
    try {
        await client.connect();
        const db = client.db("Property-Rental");
        const userCollection = db.collection('user')
        const ownerCollection = db.collection('owner')
        const clientCollection = db.collection('client')
        const bookingCollection = db.collection('booking')
        const favouriteCollection = db.collection('favourite')

        // user start
        app.get('/api/user', async (req, res) => {
            const result = await userCollection.find().toArray()
            res.send(result)
        })
        app.get('/api/owner', async (req, res) => {
            const query = {}
            if (req.query.role) {
                query.role = req.query.role
            }
            const result = await userCollection.find(query).toArray()
            res.send(result)
        })
        // user end
        // owner data start
        app.post("/api/ownerpost", verifyToken, verifyTanant, async (req, res) => {
            const query = req.body;
            const result = await ownerCollection.insertOne(query)
            res.send(result)
        })
        app.get('/api/ownerpost', async (req, res) => {
            const result = await ownerCollection.find().toArray()
            res.send(result)
        })
        app.get('/api/ownerpost', async (req, res) => {
            const query = {}
            if (req.query.userId) {
                query.userId = req.query.userId
            }
            const result = await ownerCollection.find(query).toArray()
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

        // owner dta end
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

        // BOOKING COODE start
        app.post('/api/postbooking', async (req, res) => {
            // const isExistBooking = await bookingCollection.findOne({
            //     sessionId: bookings?.sessionId
            // })
            // if (isExistBooking) {
            //     return isExistBooking
            // }
            const cursor = req.body;
            const result = await bookingCollection.insertOne(cursor)
            res.send(result)
        })

        app.get('/api/postbooking', async (req, res) => {
            const query = {}
            if (req.query.email) {
                query.userEmail = req.query.email
            }
            if (req.query.ownerId) {
                query.ownerId = req.query.ownerId
            }
            const result = await bookingCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/api/postbooking', async (req, res) => {
            const result = await bookingCollection.find().toArray()
            res.send(result)
        })
        // BOOKING COODE end
        // add favourite start
        app.post('/api/favourite', async (req, res) => {
            const corsur = req.body
            const result = await favouriteCollection.insertOne(corsur)
            res.send(result)
        })
        app.get('/api/favourite', async (req, res) => {
            const query = {}
            if (req.query.userId) {
                query.userId = req.query.userId
            }
            const result = await favouriteCollection.find(query).toArray()
            res.send(result)
        })
        // add favourite end
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