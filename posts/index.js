const express = require("express");
const { randomBytes } = require("crypto");

const app = express();
app.use(express.json());

const POSTS = {};

app.get("/posts", (req, res) => {
  res.status(200).send(POSTS);
});

app.post("/posts", (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  POSTS[id] = { id, title };
  res.status(201).send(POSTS[id]);
});

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
