//const base64 = require('base-64');
//const axios = require('axios');

const express = require("express");
const expressGraphQL = require("express-graphql");
const app = express();
const PORT = 4000;
const path = require("path");
const { Secret } = require("./server/secret/secret");

// for gruveo
const crypto = require("crypto");
const { Base64Encode } = require("base64-stream");

const { initializeAllRoute } = require("./server/api/_route.js");
const isProd = process.env.NODE_ENV === "production";

require("./helper/lib-helper");

var root = isProd ? "/cf" : "";

// ##################################################
// console config
// if (isProd) {
//   console.log = function (mes) {
//     return;
//   };
// }

// ##################################################
//Use Career Fair Schema
const schemaCF = require("./server/schema/_schema_cf.js");

// body parser used in post argument
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: true
  })
); // support encoded bodies


function allowCors(res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
}
app.use(function (req, res, next) {
  console.log("req.url", req.url);
  if (!isProd || req.url.indexOf("/external/check-iv-by-ic") >= 0) {
    allowCors(res, next);
  } else {
    next();
  }
});


// intercept to serve compress file
// this has to put before Express Middleware for serving static files
/* // deprecated -- in nginx, gzip serve tru nginx 
// no need for this
const publicRoot = (isProd) ? "" : "public";
const hasGz = [
    "/asset/js/main.bundle.js"
    //, "/asset/js/vendors.bundle.js"
    //, "/asset/css/main.bundle.css"
];

app.get(root + '/asset/*', function (req, res, next) {
    //strip version query
    if (req.url.indexOf("?v=") >= 0) {
        var urlArr = req.url.split("?v=");
        req.url = urlArr[0];
        var version = urlArr[1];
    }

    if (hasGz.indexOf(req.url) >= 0) {
        req.url = req.url + '.gz' + "?v=" + version;
        console.log(req.url);
        res.set('Content-Encoding', 'gzip');
    }
    next();
});
*/

// Express Middleware for serving static files
app.use(express.static(path.join(__dirname, "public")));

// Graphql route
app.use(
  root + "/graphql",
  expressGraphQL({
    schema: schemaCF,
    graphiql: process.env.NODE_ENV === "production" ? false : true //set able to use the graphQL web IDE to true
  })
);

initializeAllRoute(app, root);

const { template } = require("./server/html/template.js");

app.get(root, function (req, res, next) {
  //console.log("root");
  template("Test");

  res.sendFile(__dirname + "/public/index.html");
});

// ###################################
// FOR GRUVEO ************************
app.get(root + "/video-call", function (req, res, next) {
  var query = req.query;
  res.sendFile(__dirname + "/public/video-call.html");
});

app.post(root + "/video-call-auth", function (req, res, next) {
  req
    .pipe(crypto.createHmac("sha256", Secret.GRUVEO_SECRET))
    .pipe(new Base64Encode())
    .pipe(res.set("Content-Type", "text/plain"));
});

// FOR GRUVEO ************************
// ###################################

app.get("*", function (req, res, next) {
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
