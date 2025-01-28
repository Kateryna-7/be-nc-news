const express = require("express");
const endpoints = require("./endpoints.json");
const { getAllTopics, getArticleByID } = require("./controllers/controller");

const app = express();

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleByID);

module.exports = app;
