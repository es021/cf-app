const dropboxV2Api = require("dropbox-v2-api");
const dropbox = dropboxV2Api.authenticate({
  token: "H6PJA3e1IJMAAAAAAAD_b1BKW4AIZ5hRm9dGCvqz-Ibz3l-VAXbv782EqaSxWPzQ"
});
const { graphql } = require("../../helper/api-helper");
const fs = require("fs");
class DropboxAPI {
  upload({ dropboxPath, localPath, finish, param }) {
    const uploadStream = dropbox(
      {
        resource: "files/upload",
        parameters: {
          path: dropboxPath
        }
      },
      (err, result) => {
        if (err) {
          finish(err, result);
        } else {
          this.getShareLink({
            dropboxPath: dropboxPath,
            finish: finish,
            param: param
          });
        }
      }
    );

    //use nodejs stream
    fs.createReadStream(localPath).pipe(uploadStream);
  }
  insertDb({ result, param, finish }) {
    let entity = param.entity;
    let entity_id = param.entity_id;
    let meta_key = param.meta_key;
    // console.log("result", result);

    let url = result.url;
    url = url.replace("dl=0","raw=1")

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
        finish(null, res.data.data.add_video);
      })
      .catch(err => {
        finish(err, null);
      });
  }
  getShareLink({ dropboxPath, finish, param }) {
    dropbox(
      {
        resource: "sharing/create_shared_link_with_settings",
        parameters: {
          path: dropboxPath,
          settings: {
            requested_visibility: "public",
            audience: "public"
          }
        }
      },
      (err, result) => {
        if (err) {
          finish(err, result);
        } else {
          this.insertDb({
            result: result,
            param: param,
            finish: finish
          });
        }
      }
    );
  }
}

DropboxAPI = new DropboxAPI();
module.exports = { DropboxAPI };
