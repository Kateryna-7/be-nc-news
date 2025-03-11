const { response } = require("../app");
const db = require("../db/connection");

const selectAllTopics = () => {
  return db.query("SELECT * FROM topics;").then((response) => {
    return response.rows;
  });
};

const selectArticleByID = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article is not found",
        });
      } else {
        return response.rows[0];
      }
    });
};

const fetchAllArticlesByOrder = () => {
  return db
    .query(
      "SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC ;"
    )
    .then((response) => {
      return response.rows;
    });
};

const fetchAllComentsByArticleId = (article_id) => {
  return selectArticleByID(article_id)
    .then(() => {
      return db.query(
        "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
        [article_id]
      );
    })
    .then((response) => {
      return response.rows;
    });
};

const insertComment = (article_id, username, body) => {
  return db
    .query(
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;",
      [username, body, article_id]
    )
    .then((response) => {
      return response.rows[0];
    });
};

const updateVotes = (article_id, newVote) => {
  return selectArticleByID(article_id)
    .then(() => {
      return db.query(
        "UPDATE articles SET votes=votes+$1 WHERE article_id=$2 RETURNING *;",
        [newVote, article_id]
      );
    })
    .then((response) => {
      return response.rows[0];
    });
};

const deleteCommentByID = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id=$1;", [comment_id])
    .then((response) => {
      if (response.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment is not found",
        });
      }
    });
};

const selectAllUsers = () => {
  return db.query("SELECT * FROM users;").then((response) => {
    return response.rows;
  });
};

const selectArticlesSortBy = (sortBy = "created_at", order = "DESC") => {
  console.log(sortBy, order, ">>>");
  return db
    .query(`SELECT * FROM users ORDER BY ${sortBy} ${order};`)
    .then((response) => {
      return response.rows;
    });
};

module.exports = {
  selectAllTopics,
  selectArticleByID,
  fetchAllArticlesByOrder,
  fetchAllComentsByArticleId,
  insertComment,
  updateVotes,
  deleteCommentByID,
  selectAllUsers,
  selectArticlesSortBy,
};
