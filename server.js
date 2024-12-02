const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const passport = require("passport");
const app = express();

const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-with, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});
app.use('/', require('./routes'));

app.get(
    "/github/callback",
    passport.authenticate("github", {
      failureRedirect: "/api-docs",
      session: false,
    }),
    (req, res) => {
      req.session.user = req.user;
      res.redirect("/");
    }
  );

mongodb.initDb((err) => {
    if(err) {
        console.log(err);
    }
    else {
        app.listen(port, () => {console.log(`Database is listening and node Running on port ${port}`)});
    }
});

