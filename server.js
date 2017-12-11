const express = require('express');
const expressGraphQL = require('express-graphql');
const app = express();
const PORT = 4000;
const path = require('path');
const axios = require('axios');
const formidable = require('formidable');
const fs = require('fs');
const {UploadUrl} = require('./config/app-config.js');

var root = "/cf";
//var root = "";

//Use Career Fair Schema
const schemaCF = require('./server/schema/_schema_cf.js');

// body parser used in post argument
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies


//allow CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});


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

// Auth Route
const {AuthAPI} = require('./server/api/auth-api');
app.post(root + '/auth/:action', function (req, res, next) {
    var action = req.params.action;
    var errStatus = 400;
    console.log(action);

    const resHandler = (response) => {
        console.log(response);
        if (typeof response !== "object") {
            res.status(400).send(response);
        } else {
            res.send(response);
        }
    };

    switch (action) {
        case 'login':
            AuthAPI.login(req.body.email, req.body.password).then(resHandler);
            break;
        case 'register':
            AuthAPI.register(req.body.user).then(resHandler);
            break;
        case 'activate-account':
            AuthAPI.activateAccount(req.body.key, req.body.user_id).then(resHandler);
            break;
    }

});


app.post(root + '/upload/:type/:name', function (req, res) {
    var type = req.params.type;
    var fileName = req.params.name;
    console.log("upload");
    console.log(type);
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        console.log(files);
        // `type` is the name of the <input> field of type `type`

        // get year and month
        // and create if not exist
        var uploadDir = path.join(process.env.PWD, `public/upload/${type}`);
        var d = new Date();
        var y = d.getYear() + 1900;
        uploadDir += `/${y}`;
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        var m = d.getMonth() + 1;
        uploadDir += `/${m}`;
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        //get file ext
        var fileExt = files[type].name.split('.').pop();

        // start create path
        // temp folder
        var old_path = files[type].path;
        // upload dir
        var subpath = `${type}/${y}/${m}/${fileName}_${d.getTime()}.${fileExt}`;
        var new_path = path.join(process.env.PWD, `public/upload/`, subpath);
        // public upload url
        var url = subpath;

        console.log(new_path);
        console.log(url);

        fs.readFile(old_path, function (err, data) {
            fs.writeFile(new_path, data, function (err) {


                fs.unlink(old_path, function (err) {
                    if (err) {
                        res.status(500);
                        res.json({'url': null});
                    } else {
                        res.status(200);
                        console.log(url);
                        res.json({'url': url});
                    }
                });
            });
        });


    });
});


app.get(root, function (req, res, next) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('*', function (req, res, next) {
    res.sendFile(__dirname + '/public/index.html');
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
