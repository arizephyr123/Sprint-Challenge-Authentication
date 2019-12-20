const test = require("supertest");

//const jokes = require("./jokes-router.js");
const server = require('../api/server.js')
//const auth = require("../auth/auth-router.js");
const db = require("../database/dbConfig.js");

describe("jokes-router.js", function() {
  beforeEach(async () => {
    await db("users").truncate();
  });

  describe("environment", function() {
    it("should set environment to testing", function() {
      expect(process.env.DB_ENV).toBe("testing");
    });
  });

  describe("GET to /", function() {
    it("user WITHOUT auth token should return a 400", function() {
      // manually would:
      // 1.) spin up server
      // 2.)  make GET request to /
      // 3.) look at the http status code for response
      // without async always passes so add return before request and makes it async

      return test(server)
        .get("/api/jokes")
        .then(res => {
          expect(res.status).toBe(400);
          expect(res.status).not.toBe(200);
          expect(res.status).not.toBe(500);
        });
    });
  });

  describe("GET to /", function() {
    it("user with auth token should return a 200 OK", function() {
      // manually would:
      // 1.) spin up server
      // 2.) login
      // 3.) make GET request to /
      // 4.) look at the http status code for response
      // without async always passes so add return before request and makes it async

      return test(server)
        .post("/api/auth/login")
        .send({ username: "ari", password: "pass" })
        .then(res => {
          const token = res.body.token;
          console.log("res.body", res.body)
          return test(server)
            .get("/api/jokes")
            .set("Authorization", token)
            .then(res => {
              expect(res.status).toBe(200);
              expect(res.status).notToBe(500);
            });
        });
    });
  });
});
