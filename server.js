const express = require('express');
const expressGraphQL = require('express-graphql');
const app = express();
const PORT = 4000;
const path = require('path');
const axios = require('axios');

//Use Career Fair Schema
const schemaCF = require('./server/schema/_schema_cf.js');

// body parser used in post argument
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

// Express Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));

//allow CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});

app.use('/graphql', expressGraphQL({
    schema: schemaCF,
    graphiql: true //set able to use the graphQL web IDE to true
}));

//app.get('/', function (req, res, next) {
//    res.sendFile(__dirname + '/www/index.html');
//});

const {AuthAPI} = require('./server/api/auth-api');
app.post('/login', function (req, res, next) {
    AuthAPI.login(req.body.email, req.body.password).then((response) => {
        console.log("/login");
        console.log(response);
        if (typeof response !== "object") {
            res.status(401).send(response);
        } else {
            res.send(response);
        }
    });
});

app.get('*', function (req, res, next) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
    console.log("React, Redux and GraphQL Server is now running on port " + PORT);
});

