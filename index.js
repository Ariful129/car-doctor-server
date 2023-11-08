const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s8or9pd.mongodb.net/?retryWrites=true&w=majority`;

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
        //////////////////////////////////////////

        const serviceCollection = client.db('CarDoctor').collection('services');
        const bookingCollection = client.db('CarDoctor').collection('bookings');
        const addprodutcCollection = client.db('CarDoctor').collection('product')
       


        // services related api
        app.post('/addservice', async (req, res) => {
            const service = req.body;
            console.log(service);
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        });
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { title: 1, price: 1, service_id: 1, img: 1, description: 1 },
            };

            const result = await serviceCollection.findOne(query, options);
            res.send(result);
        })

        //Booking 
        app.get('/bookings', async (req, res) => {
            console.log(req.query.email);
            //console.log('token owner info', req.user)
            // if(req.user.email !== req.query.email){
            //     return res.status(403).send({message: 'forbidden access'})
            // }
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log(booking);
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        });

        app.patch('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedBooking = req.body;
            console.log(updatedBooking);
            const updateDoc = {
                $set: {
                    status: updatedBooking.status
                },
            };
            const result = await bookingCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        })


        //Add producted releted
        app.post('/addprodutcs', async (req, res) => {
            const product = req.body;
            console.log(product);
            const result = await addprodutcCollection.insertOne(product);
            res.send(result);
        });

        // app.get('/autcsddprod', async (req, res) => {  //Amr iccha moto '/users...' banabo
        //     const result = await addprodutcCollection.find().toArray()
        //     //const result = await cursor.toArray();
        //     res.send(result);
        // })


        app.get('/addprodutcs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { price: 1 },
            };

            const result = await addprodutcCollection.findOne(query, options);
            res.send(result);
        })

        //delete data from database(Mongo)-> id Find from client side
        app.delete('/addprodutcs/:id', async (req, res) => {
            const id = req.params.id;
            console.log('pls delete from database', id)
            //For Mongo Delete
            const query = { _id: new ObjectId(id) }
            const result = await addprodutcCollection.deleteOne(query)
            //send result to client side()( ai result asbe mongo theke)
            res.send(result)

        })

        app.get('/addprodutcs', async (req, res) => {
            console.log(req.query);
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await addprodutcCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/buyproduct', async (req, res) => {
            console.log(req.query);
            let query = {};
            if (req.query?.email) {
                query = {
                    email: req.query.email,
                    status: req.query.status
                }
            }
            const result = await addprodutcCollection.find(query).toArray();
            res.send(result);
        })

        app.put('/addprodutcs/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedBooking = req.body;
            const options = { upsert: true }
            console.log(updatedBooking);
            const updateDoc = {
                $set: {
                    bkashTraID: updatedBooking.bkashTra,
                    customarname: updatedBooking.name
                },
            };
            const result = await addprodutcCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.patch('/addprodutcs/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedBooking = req.body;
            console.log('AddProduct Con',updatedBooking);
            const updateDoc = {
                $set: {
                    status: updatedBooking.status
                },
            };
            const result = await addprodutcCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

       



        //////////////////////////////////////////////
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('doctor is running')
})

app.listen(port, () => {
    console.log(`Car Doctor Server is running on port ${port}`)
})