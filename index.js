const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

// name: persist-systemic-job-task
// pass: WmRfZJvICPes61VX

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mp1yd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // work

    const eventCalection = client
      .db("persist-systemic-job-task")
      .collection("all-Event");
    // get all data
    app.get("/allData", async (req, res) => {
      const search = req?.query?.search;
      if (search) {
        const filter = {
          Category: { $regex: search, $options: "i" },
        };
        const results = await eventCalection.find(filter).toArray();
        return res.send(results);
      }
      const data = eventCalection.find();
      const result = await data.toArray();
      res.send(result);
    });

    app.post("/eventData", async (req, res) => {
      const data = req.body;
      //   console.log(data);
      const result = await eventCalection.insertOne(data);
      res.send(result);
    });
    // work
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//
app.get("/", (req, res) => {
  res.send("job-task-server is running for now");
});
app.listen(port, () => {
  console.log(`job-task is at: ${port}`);
});
