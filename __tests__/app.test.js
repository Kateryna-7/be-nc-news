const endpointsJson = require("../endpoints.json");
const request = require("supertest");

const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const { updateVotes } = require("../models/model.js");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects, each of which should have the following properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
  test("return 404 if topics are not found", () => {
    return request(app).get("/api/to").expect(404);
  });
});

describe("GET /api/articles/:article_id", () => {
  test("return an article by id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("return 404 if an article_id is not found", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article is not found");
      });
  });
  test("return 400 if an article_id is not valid", () => {
    return request(app)
      .get("/api/articles/id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("return an articles array of article objects, each of which should have all propeties except of body", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });
  test("articles should be sorted by created at descending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("return an comments array by given article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toEqual([
          {
            comment_id: 11,
            body: "Ambidextrous marsupial",
            votes: 0,
            author: "icellusedkars",
            article_id: 3,
            created_at: expect.any(String),
          },
          {
            comment_id: 10,
            body: "git push origin master",
            votes: 0,
            author: "icellusedkars",
            article_id: 3,
            created_at: expect.any(String),
          },
        ]);
      });
  });
  test("return 404 if an article_id is not found", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article is not found");
      });
  });
  test("return 400 if an article_id is not valid", () => {
    return request(app)
      .get("/api/articles/:article_id/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("comments should be sorted by created at descending", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("should return an empty array when an article exists and don't have comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("should post a new comment", () => {
    const newComment = {
      username: "icellusedkars",
      body: "body",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          comment: {
            comment_id: expect.any(Number),
            article_id: 1,
            body: "body",
            votes: 0,
            author: "icellusedkars",
            created_at: expect.any(String),
          },
        });
      });
  });
  test("return 400 is username doesn't exist", () => {
    const newComment = {
      username: "invalid",
      body: "body",
    };
    return request(app)
      .post("/api/articles/:article_id/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("return 400 if key is missing", () => {
    const newComment = {
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/:article_id/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("return 404 is an article doesn't exist", () => {
    const newComment = {
      username: "icellusedkars",
      body: "body",
    };
    return request(app)
      .post("/api/articles/1000/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article is not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("should return an updated article by inc votes", () => {
    const newVote = { inc_votes: -2 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          updatedVote: {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 98,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
        });
      });
  });
  test("return 404 if an article_id is not found", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article is not found");
      });
  });
  test("return 400 if an article_id is not valid", () => {
    return request(app)
      .get("/api/articles/:article_id/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("should return status 204 respond with no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("return 404 if comment_id is not found ", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment is not found");
      });
  });
  test("return 400 if a comment_id is not valid", () => {
    return request(app)
      .delete("/api/comments/comment")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of users objects, each of which should have the following properties: username, name avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((resp) => {
        const users = resp.body.users;
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
  test("return 404 if user is not found", () => {
    return request(app).get("/api/us").expect(404);
  });
});

describe.only("GET /api/articles (sorting queries)", () => {
  test("return articles sorted by any valid column (defaults to the created_at date) and order, which can be set to asc or desc for ascending or descending (defaults to descending)", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((resp) => {
        expect(resp.body.articles).toBeSorted("created_at", {
          descending: true,
        });
      });
  });
  test("return articles sorted by given statement and orderby given order", () => {
    const sortBy = "topic";
    const order = "ASC";
    return (
      request(app)
        .get("/api/articles?sort_by=topic&order=asc")
        //.send({ sortBy, order })
        .expect(200)
        .then((resp) => {
          expect(resp.body.articles).toBeSorted("topic", { ascending: true });
        })
    );
  });
});
