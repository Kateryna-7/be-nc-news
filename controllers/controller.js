const { response } = require("../app");
const topics = require("../db/data/test-data/topics");
const {
  selectAllTopics,
  selectArticleByID,
  fetchAllArticlesByOrder,
  fetchAllComentsByArticleId,
  insertComment,
  updateVotes,
  deleteCommentByID,
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
      next(err);
    });
};

const addComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  selectArticleByID(article_id)
    .then(() => {
      return insertComment(article_id, username, body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

const getUpdatedVotes = (req, res, next) => {
  console.log(req.body, ">>>> body");
  const { article_id } = req.params;
  const newVote = req.body.inc_votes;
  updateVotes(article_id, newVote)
    .then((updatedVote) => {
      res.status(200).send({ updatedVote });
    })
    .catch((err) => {
      next(err);
    });
};

const getDeleteCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentByID(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getAllTopics,
  getArticleByID,
  getAllArticlesByOrder,
  getAllCommentsByArticleId,
  addComment,
  getUpdatedVotes,
  getDeleteCommentByID,
};
