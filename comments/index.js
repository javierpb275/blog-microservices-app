const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const COMMENTS_BY_POST_ID = {};

app.get("/posts/:id/comments", (req, res) => {
  res.status(200).send(COMMENTS_BY_POST_ID[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = COMMENTS_BY_POST_ID[req.params.id] || [];
  comments.push({ id, content, status: "pending" });
  COMMENTS_BY_POST_ID[req.params.id] = comments;
  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id,
      content,
      postId: req.params.id,
      status: "pending",
    },
  });
  res.status(201).send({ id, content });
});

app.post("/events", async (req, res) => {
  console.log("Event Received", req.body.type);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { id, postId, status, content } = data;
    const comments = COMMENTS_BY_POST_ID[postId];
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;

    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: {
        id,
        postId,
        status,
        content,
      },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on port 4001");
});
