const express = require("express");
const endpoints = require("./endpoints.json");
const {
  getAllTopics,
  getArticleByID,
  getAllArticlesByOrder,
  getAllCommentsByArticleId,
} = require("./controllers/controller");

const app = express();

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId);

app.get("/api/articles", getAllArticlesByOrder);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
