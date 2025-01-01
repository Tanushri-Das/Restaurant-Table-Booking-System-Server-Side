const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tdjlbxg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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

    const bookingsCollection = client.db("tablebooking").collection("bookings");

    app.post("/create-booking", async (req, res) => {
      const newBooking = req.body;
      const result = await bookingsCollection.insertOne(newBooking);
      res.send(result);
    });

    app.get("/available-timeslots", async (req, res) => {
      const { date } = req.query; 
      const existingBookings = await bookingsCollection
        .find({ date }) 
        .toArray();

      const allTimes = [
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
      ];

      const bookedTimes = existingBookings.map((booking) => booking.time); 

      const availableTimes = allTimes.filter(
        (time) => !bookedTimes.includes(time)
      );

      res.send(availableTimes);
    });

    app.get("/bookings", async (req, res) => {
      const result = await bookingsCollection.find().toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Restaurant Table Booking System server side is running");
});
app.listen(port, () => {
  console.log(
    `Restaurant Table Booking System server side is running on port ${port}`
  );
});
