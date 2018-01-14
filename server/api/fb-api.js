const {FB, FacebookApiException} = require('fb');
const Promise = require('promise');

class FBApi {
    getFeed() {

        return new Promise(function (resolve, reject) {


            FB.api(
                    "/1400113583365638/feed", // innovaseeds page
                    {
                        fields: "message, created_time, story, attachments{url,subattachments}",
                        access_token: '315194262317447|dcdf9d449a5ccb7daca934bede4a433f' // app id | app secret
                    },
                    function (response) {
                        console.log(response.data);
                        console.log("----------------------------------------------------");
                        console.log("----------------------------------------------------");
                        console.log("----------------------------------------------------");
                        console.log("----------------------------------------------------");

                        response.data.map((d, i) => {

                            var photos = (!d.attachments) ? [] : d.attachments.data.map((d2, i2) => {
                                if (d2.subattachments) {
                                    return d2.subattachments.data[0].url;
                                }
                            });

                            console.log("photos", i);
                            console.log(photos);

                        });


                        //return response.data[0];
                        console.log("detail");
                        console.log("detail");
                        console.log(response.data[0].attachments.data);

                        //post image
                        console.log(response.data[0].attachments.data[0].subattachments.data[0].url);

                        if (response && !response.error) {
                            resolve(response.data[0]);
                        } else {
                            reject(response.error);
                        }
                    }
            );



//            get('http://www.google.com', function (err, res) {
//                if (err)
//                    reject(err);
//                else
//                    resolve(res);
//            });
        });


    }
}


FBApi = new FBApi();
module.exports = {FBApi};