const express = require("express");
const endpoints = require("./endpoints.json");
const {
  getAllTopics,
  getArticleByID,
  getAllArticlesByOrder,
} = require("./controllers/controller");

const app = express();

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleByID);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err, ">>> err");
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else res.status(500).send({ msg: "Internal Server Error" });
});

app.get("/api/articles", getAllArticlesByOrder);

module.exports = app;
