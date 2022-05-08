const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("App is run");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@warehouseass11.rq0or.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const inventoryCollection = client.db("warehouse").collection("inventory");

    // -------------------- Inventory -------------------- //

    // Get all inventory item
    app.get("/inventory", async (req, res) => {
      const numberOfProduct = parseInt(req.query.numberOfProduct);
      const query = {};
      let cursor;
      if (numberOfProduct) {
        cursor = inventoryCollection.find(query).limit(numberOfProduct);
      } else {
        cursor = inventoryCollection.find(query);
      }
      const products = await cursor.toArray();
      res.send(products);
    });

    // Get specific user inventory items
    app.get("/myinventory", async (req, res) => {
      const email = req.query.email;
      const query = { adderEmail: email };
      const cursor = inventoryCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    // POST an inventory item
    app.post("/inventory", async (req, res) => {
      const product = req.body;
      const result = await inventoryCollection.insertOne(product);
      res.send(result);
    });

    // Get an inventory item
    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await inventoryCollection.findOne(query);
      res.send(product);
    });

    // Update stock quantity of inventory
    app.put("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const query = { _id: ObjectId(id) };
      const newProduct = { $set: { quantity: updatedProduct.quantity } };
      const product = await inventoryCollection.updateOne(query, newProduct);
      res.send(product);
    });

    // Delete a product of inventory
    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await inventoryCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("App is listening to port: ", port);
});
