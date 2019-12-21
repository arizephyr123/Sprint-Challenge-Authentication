const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = require("express").Router();
const db = require("./auth-model.js");

router.post("/register", (req, res) => {
  let user = req.body;
  if (user && user.password) {
    const hash = bcrypt.hashSync(user.password, 8);
    // replace password with hash instead of plain-text
     user.password = hash;
  } else {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  return db.add(user)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(err => {
      console.log("Register error:", err);
      res.status(500).json({
        message: "Error accessing database. Please try registering again.",
        err
      });
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

   db.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // create token and send to user
        const token = signToken(user);
        console.log(token);
        return res.status(200).json({ token, message: `Welcome ${user.username}!` }).token(token);
      } else {
        return res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(err => {
      console.log("User login error:", err);
      res.status(500).json({
        message: "Error accessing database. Please try login again.",
        err
      });
    });
});

//custom middleware
// creates the token for given user
function signToken(user) {
  const payload = {
    username: user.username
  };

  const secret = process.env.JWT_SECRET;

  const options = {
    expiresIn: "1h"
  };

  return jwt.sign(payload, secret, options); // notice the return
}

module.exports = router;
