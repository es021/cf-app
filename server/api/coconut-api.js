const coconut = require("coconutjs");
const { Secret } = require("../secret/secret");
const { graphql } = require("../../helper/api-helper");
const { AppConfig } = require("../../config/app-config");

class CoconutAPI {
  test(param) {
    console.log("param", param);
    // let fileUrl =
    //   "https://www.dropbox.com/s/jbfcwxq4g9n899p/user_225_resume_1573395547011.mp4?raw=1";
    let fileUrl =
      "https://seedsjobfairapp.com/public/upload/video/2019/11/user_136_resume_1573300333975.MOV";
    this.compress({
      fileUrl: fileUrl,
      entity: "user",
      entity_id: "136",
      meta_key: "resume"
    });
  }
  insertDb({ entity, entity_id, meta_key, url }) {
    let q = `mutation{
      add_video(entity :"${entity}", entity_id:${entity_id}, meta_key :"${meta_key}" , url :"${url}") {
        ID
        entity
        entity_id
        meta_key
        url
        created_at
        updated_at
      }
    }`;

    graphql(q)
      .then(res => {
        console.log("finish insert db", res.data.data);
      })
      .catch(err => {
        console.log("err insert db", err);
      });
  }
  webhook(getParam, postParam) {
    console.log("webhook webhook webhook webhook");
    console.log("getParam", getParam);
    console.log("postParam", postParam);

    if (postParam.event == "job.completed" && postParam.output_urls.mp4) {
      console.log("insertDb");
      this.insertDb({
        entity: getParam.entity,
        entity_id: getParam.entity_id,
        meta_key: getParam.meta_key,
        url: postParam.output_urls.mp4
      });
    }
  }
  getS3(ext) {
    return `s3://${Secret.DO_SPACES_ACCESS_KEY}:${Secret.DO_SPACES_SECRET}@dir.${ext}?host=${Secret.DO_SPACES_URL}`;
  }
  compress({ fileUrl, entity, entity_id, meta_key }) {

    let proxyToLocalhost = "d9e0516f.ngrok.io";
    let hostApi = AppConfig.Api.replaceAll("localhost:4000", proxyToLocalhost);
    fileUrl = fileUrl.replaceAll("localhost:4000", proxyToLocalhost);
    console.log("fileUrl", fileUrl);

    coconut.createJob(
      {
        api_key: Secret.COCONUT_API_KEY,
        source: fileUrl,
        webhook: `${hostApi}/coconut-webhook/${entity}/${entity_id}/${meta_key}`,
        outputs: {
          mp4: this.getS3("mp4") + "/coconut"
          //webm: this.getS3("webm") + "/coconut"
        }
      },
      function(job) {
        console.log("job", job);
      }
    );
  }
}

CoconutAPI = new CoconutAPI();
module.exports = { CoconutAPI };

/*
      // ####################################
      // getParam
      { entity: 'user', entity_id: '136', meta_key: 'resume' }

      // ####################################
      // postParam
      { id: 22344603,
        errors: {},
        output_urls:
        { 
          webm: 'https://sgp1.digitaloceanspaces.com/coconut/user_136_resume_1573300333975.webm/seedsjobfair/user_136_resume_1573300333975.webm',
          mp4: 'https://sgp1.digitaloceanspaces.com/coconut/user_136_resume_1573300333975.mp4/seedsjobfair/user_136_resume_1573300333975.mp4' 
        },
        event: 'job.completed' 
      }
*/

/**
# Variable declarations
var post = $vid
var num = 3
var filename = demo

# AWS S3 bucket where the media will be uploaded
var access_key = accesskey
var secret_key = secretkey
var bucket = mybucket
var s3 = s3://$access_key:$secret_key@$bucket/$post

# Setting the source video and the webhook URL
set webhook = http://373d9c4e.ngrok.io/coconut/webhook

# Encoding for web and mobile devices
-> mp4 = $s3/videos/web/$filename.mp4
-> webm = $s3/videos/web/$filename.webm
-> mp4:360p = $s3/videos/mobile/$filename.mp4
-> httpstream = $s3, hls=$s3/videos/hls/, playlist_name=$filename

# Creating video previews
-> jpg:200x = $s3/thumbnails/small/$filename_#num#.jpg, number=$num
-> jpg:640x = $s3/thumbnails/large/$filename_#num#.jpg, number=$num
-> gif:300x = $s3/gif/$filename.gif
-> storyboard:640x = $s3/storyboard/$filename.png

 */
