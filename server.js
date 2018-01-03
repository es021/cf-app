const express = require('express');
const expressGraphQL = require('express-graphql');
const app = express();
const PORT = 4000;
const path = require('path');
const axios = require('axios');
const {initializeAllRoute} = require('./server/api/_route.js');
const isProd = (process.env.NODE_ENV === "production");

var root = (isProd) ? "/cf" : "";
//var root = "";

//Use Career Fair Schema
const schemaCF = require('./server/schema/_schema_cf.js');

// body parser used in post argument
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies


//allow CORS
if (!isProd) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
}

// intercept to serve compress file
// this has to put before Express Middleware for serving static files 
const hasGz = [
    "/asset/js/main.bundle.js"
            //        , "/asset/js/vendors.bundle.js"
            //, "/asset/css/main.bundle.css"
];

app.get(root + '/asset/*', function (req, res, next) {
    if (hasGz.indexOf(req.url) >= 0) {
        req.url = req.url + '.gz';
        res.set('Content-Encoding', 'gzip');
        console.log("serve gzip", req.url);
    }
    next();
});


// Express Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Graphql route
app.use(root + '/graphql', expressGraphQL({
    schema: schemaCF,
    graphiql: (process.env.NODE_ENV === "production") ? false : true //set able to use the graphQL web IDE to true
}));

initializeAllRoute(app, root);

const {template} = require('./server/html/template.js');

app.get(root, function (req, res, next) {
    console.log("root");
    template("Test");

    res.sendFile(__dirname + '/public/index.html');
});

app.get('*', function (req, res, next) {
    res.send(template(req.url));
    //res.sendFile(__dirname + '/public/index.html');
});


app.listen(PORT, () => {
    console.log("React, Redux and GraphQL Server is now running on port " + PORT);
});

/*
 
 var user = {
 user_email: "zul2@gmail.com",
 user_pass: "1234",
 first_name: "John",
 major: "AAA"
 };
 
 AuthAPI.register(user).then((response) => {
 console.log("/register");
 console.log(response);
 if (typeof response !== "object") {
 res.status(400).send(response);
 } else {
 res.send(response);
 }
 
 });
 */
