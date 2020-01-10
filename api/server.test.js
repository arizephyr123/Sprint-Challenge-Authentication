require("dotenv").config();

const request = require("supertest");

const server = require("./server.js");
const db = require("../database/dbConfig.js");
//const recipesDB = require('../recipes/recipes-model.js');
//const chefsDB = require('../chefs/chefs-model.js');

describe("Dad Jokes App", () => {
  describe("check environment", function() {
    it("should set environment to testing", function() {
      expect(process.env.DB_ENV).toBe("testing");
      expect(process.env.DB_ENV).not.toBe("development");
    });
  });

  describe("POST /api/auth/register", () => {
    reset();
    it("Should respond with status code of 201", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({
          username: "supertest",
          password: "pass"
        })
        .then(res => {
          expect(res.status).toBe(201);
          expect(res.status).not.toBe(200);
          expect(res.status).not.toBe(404);
        });
    });

    it("Should return 401 if no res.body", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({})
        .then(res => {
          expect(res.status).toBe(401);
          expect(res.status).not.toBe(200);
          expect(res.status).not.toBe(500);
        });
    });
  });

  describe("POST /api/auth/login", () => {
    it("Should respond with status code of 200", async () => {
      await request(server)
        .post("/api/auth/login")
        .send({ username: "supertest", password: "pass" })
        .then(res => {
          expect(res.status).toBe(200);
          expect(res.status).not.toBe(201);
          expect(res.status).not.toBe(404);
        });
    });
    it("Should return a json obj with token", async () => {
      await request(server)
        .post("/api/auth/login")
        .send({ username: "supertest", password: "pass" })
        .then(res => {
          //const token = res.body.token;
          expect(res.type).toEqual("application/json");
          expect(res).toHaveProperty("body.token");
        });
    });
  });

  describe("GET to /api/jokes", () => {
    it("WITH auth should return status code 200", () => {
      return request(server)
        .post("/api/auth/login")
        .send({ username: "supertest", password: "pass" })
        .then(res => {
          //console.log(res);
          const token = res.body.token;
          return request(server)
            .get("/api/jokes")
            .set("Authorization", token)
            .then(res => {
              expect(res.status).toBe(200);
              expect(res.status).not.toBe(500);
            });
        });
    });

    it("WITHOUT auth should return status code 403", () => {
      return request(server)
        .post("/api/auth/login")
        .send({ username: "supertest", password: "pass" })
        .then(res => {
          //console.log(res);
          //const token = res.body.token;
          return (
            request(server)
              .get("/api/jokes")
              //.set("Authorization", token)
              .then(res => {
                expect(res.status).toBe(400);
                expect(res.status).not.toBe(500);
                expect(res.status).not.toBe(200);
              })
          );
        });
    });
  });
});

//helper functions
async function reset() {
  // this function executes and clears out the table before each test
  await db("users").truncate();
}
