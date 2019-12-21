const request = require("supertest");

const app = require("../api/server.js");
const db = require("../database/dbConfig.js");

describe("Dad Jokes App", function() {
  describe("environment", function() {
    it("should set environment to testing", function() {
      expect(process.env.DB_ENV).toBe("testing");
    });
  });

  describe("POST to /api/auth/register", function() {
    it("should return added user object", function() {
      resetDb();
      return request(app)
        .post("/api/auth/register")
        .send({
          username: "ari2",
          password: "pass"
        })
        .then(res => {
          // console.log(res.body);
          expect.objectContaining({
            username: "ari2",
            id: expect.any(Number),
            password: expect.any(String)
          });
        });
    });

    it("should add user to database", async function() {
      request(app)
        .post("/api/auth/register")
        .send({
          username: "ari2",
          password: "pass"
        });
      // check database directly using callback below
      await expect(findBy({ username: "ari2" })).resolves.toHaveLength(1);
    });
  });

  describe("POST to /api/auth/login", function() {
    it("invalid credentials receives 401 ", function() {return request(app)
        .post("/api/auth/login")
        .send({ username: "zzz", password: "pass" })
        .then(res => {
            expect(res.status).toBe(401);
        });});

    it("invalid credentials NOT receive welcome message", function() {
      return request(app)
        .post("/api/auth/login")
        .send({ username: "ari2", password: "pass" })
        .then(res => {
            expect(res.message).not.toBe(/welcome/i);
        });
    });
  });

  describe("GET to /jokes", function() {
    it("user WITHOUT auth token should return an error", async function() {
      // manually would:
      // 1.) spin up server
      // 2.) login
      // 3.) make GET request to /
      // 4.) look at the http status code for response
      // without async always passes so add return before request and makes it async

      await request(app)
        .post("/api/auth/login")
        .send({ })
        .then(res => {
          const token = res.body.token;
          console.log("res.body", res.body);
          return token;
        });

      await request(app)
        .get("/api/jokes")
        .set("accept", "application/json")
        .set("authorization", "token")
        .then(res => {
            expect(res.message).not.toBe(/welcome/i);
        });
    });

    it("user WITHOUT auth token should return a 400", function() {
      // manually would:
      // 1.) spin up server
      // 2.)  make GET request to /
      // 3.) look at the http status code for response
      // without async always passes so add return before request and makes it async

      return request(app)
        .get("/api/jokes")
        .then(res => {
          expect(res.status).toBe(400);
          expect(res.status).not.toBe(200);
          expect(res.status).not.toBe(500);
        });
    });
  });
});

//callback function
function getUsers() {
  return db("users");
}

function findBy(filter) {
  const results = db("users").where(filter);
  // console.log(results);
  return results;
}

async function resetDb() {
  await db("users").truncate();
}
