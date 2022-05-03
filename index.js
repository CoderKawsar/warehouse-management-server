const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

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
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("App is listening to port: ", port);
});
