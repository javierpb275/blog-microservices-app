const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const COMMENTS_BY_POST_ID = {};

app.get("/posts/:id/comments", (req, res) => {
  res.status(200).send(COMMENTS_BY_POST_ID[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = COMMENTS_BY_POST_ID[req.params.id] || [];
  comments.push({ id, content });
  COMMENTS_BY_POST_ID[req.params.id] = comments;
  res.status(201).send({ id, content });
});

app.listen(4001, () => {
  console.log("Listening on port 4001");
});
