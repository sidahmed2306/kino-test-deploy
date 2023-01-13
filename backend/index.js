const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { uid } = require("uid");
const { readfile, writefile, sendMail, getDB } = require("./utils");
const { ObjectId } = require("mongodb");

const dataFilePfad = __dirname + "/app-data/data.json";
const app = express();
const PORT = 9000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/kino/platz/all", (_, res) => {
  getDB()
    .then((db) => db.collection("movies").find().toArray())
    .then((movies) => {
      console.log(movies);
      res.json(movies);
    });
});
app.post("/kino/platz/add", (req, res) => {
  const newPlatz = {
    platztype: req.body.platz,
    status: "frei",
    price: req.body.price,
  };

  getDB()
    .then((db) => db.collection(movies).inserOne(newPlatz))
    .then(() => getDB())
    .then((db) => db.collection("movies").find().toArray())
    .then((movies) => res.json(movies));
});

app.put("/kino/platz/update", (req, res) => {
  const newStatus = req.body.status;
  const platzId = req.body.platzId;
  getDB()
    .then((db) =>
      db
        .collection("movies")
        .updateOne({ _id: ObjectId(platzId) }, { $set: { status: newStatus } })
    )
    .then(() => getDB())
    .then((db) => db.collection("movies").find().toArray())
    .then((movies) => res.json(movies));
});

app.put("/kino/platz/reset", (_, res) => {
  getDB()
    .then((db) =>
      db.collection("movies").updateMany({}, { $set: { status: "frei" } })
    )
    .then(() => getDB())
    .then((db) => db.collection("movies").find().toArray())
    .then((movies) => res.json(movies));
});

app.listen(PORT, () => console.log("port ready at:", PORT));
