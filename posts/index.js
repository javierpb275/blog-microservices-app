const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const POSTS = {};

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  POSTS[id] = { id, title };
  await axios.post("http://event-bus-srv:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });
  res.status(201).send(POSTS[id]);
});

app.post("/events", (req, res) => {
  console.log("Event Received", req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log("v55");
  console.log("Listening on port 4000");
});
