const express = require("express");
const endpoints = require("./endpoints.json");
const {
  getAllTopics,
  getArticleByID,
  getAllArticlesByOrder,
  getAllCommentsByArticleId,
  addComment,
  getUpdatedVotes,
  getDeleteCommentByID,
  getAllUsers,
} = require("./controllers/controller");

const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId);

app.get("/api/articles", getAllArticlesByOrder);

app.post("/api/articles/:article_id/comments", addComment);

app.patch("/api/articles/:article_id", getUpdatedVotes);

app.delete("/api/comments/:comment_id", getDeleteCommentByID);

app.get("/api/users", getAllUsers);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
