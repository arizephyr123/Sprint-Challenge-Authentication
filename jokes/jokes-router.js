const axios = require('axios');

const router = require('express').Router();

router.get('/', (req, res, next) => {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      //console.log("res", res);
      res.status(200).json(response.data.results);
    })
    .catch(async err => {
      console.log("res", res);
       await res.status(500).json({ message: 'Error Fetching Jokes', error: err });
      
    });
});

module.exports = router;
