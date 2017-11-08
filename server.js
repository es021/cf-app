const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

// serve static assets normally
app.use(express.static(__dirname + '/public'));

// Handles all routes so you do not get a not found error
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(port);
console.log("server started on port " + port);

/*
const axios = require('axios');
axios.post("http://localhost:4000/graphql?", {
    query: `query{
                            users(role:"rec"){
                              ID
                              user_email
                              first_name
                              last_name
                              role
                              company {
                                ID
                                name
                                tagline
                              }
                            }
                    }`,
    variables: null
}).then(function(res){
    console.log(res.data.data.users);
});
*/