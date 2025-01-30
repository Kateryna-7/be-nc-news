const topics = require("../db/data/test-data/topics");
const {
  selectAllTopics,
  selectArticleByID,
  fetchAllArticlesByOrder,
  fetchAllComentsByArticleId,
} = require("../models/model");

const getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
const getAllArticlesByOrder = (req, res, next) => {
  fetchAllArticlesByOrder()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const getAllCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchAllComentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      console.log(err, "err");
      next(err);
    });
};

module.exports = {
  getAllTopics,
  getArticleByID,
  getAllArticlesByOrder,
  getAllCommentsByArticleId,
};
