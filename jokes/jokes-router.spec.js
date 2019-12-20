const test = require("supertest");

const jokes = require("./jokes-router.js");

describe("jokes-router.js", function() {
  describe("GET to /", function() {
    it("should return a 200 OK", function() {
      // manually would:
      // 1.) spin up server
      // 2.) make GET request to /
      // 3.) look at the http status code for response
      // without async always passes so add return before request and makes it async
      return test(jokes)
        .get("/")
        .then(res => {
          expect(res.status).toBe(200);
          expect(res.status).notToBe(500);
        });
    });
  });
});
