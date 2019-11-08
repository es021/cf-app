// only for action that need server side validation

const formidable = require("formidable");
const fs = require("fs");
const { UploadUrl } = require("../../config/app-config.js");
const path = require("path");

const initializeAllRoute = function(app, root) {
  // server error in node server no need to be return to client
  // we will just log the error in intercepter

  // only custom legitemate error will be returned in form of string (not object)
  const routeResHandler = (res, response) => {
    if (typeof response !== "object") {
      res.status(400).send(response);
    } else {
      res.send(response);
    }
  };

  // Facebook Route ----------------------------------------------------------------
  /*
    const {FBApi} = require('./fb-api');
    app.post(root + '/fb/:action', function (req, res, next) {
        var action = req.params.action;

        switch (action) {
            case 'get-feed':
                FBApi.getFeed().then((response) => {
                    console.log("from __route");
                    console.log(response);
                    routeResHandler(res, response);
                });

                break;
        }


    });
    */

  // Activity Route ----------------------------------------------------------------
  // const { ZoomAPI } = require('./zoom-api');
  // app.post(root + '/zoom/:action', function (req, res, next) {
  //     var action = req.params.action;
  //     console.log(action);

  //     switch (action) {
  //         case 'test':
  //             ZoomAPI.test()
  //                 .then((response) => {
  //                     routeResHandler(res, response);
  //                 });
  //             break;
  //     }
  // });

  // Route For Test Stuff -------------------------------------------------------------------
  const { TestAPI } = require("./test-api");
  app.post(root + "/test/:action", function(req, res, next) {
    var action = req.params.action;
    switch (action) {
      case "new-db":
        TestAPI.newDB(req.body).then(response => {
          routeResHandler(res, response);
        });
        break;
      default:
        routeResHandler(res, "Action Not Valid");
        break;
    }
  });

  // Route For Daily Co -------------------------------------------------------------------
  const { DailyCoApi } = require("./daily-co-api");

  app.post(root + "/daily-co/:action", function(req, res, next) {
    var action = req.params.action;
    switch (action) {
      case "create-room":
        DailyCoApi.createNewRoom()
          .then(response => {
            routeResHandler(res, response);
          })
          .catch(error => {
            routeResHandler(res, error);
          });
        break;
      case "delete-room":
        var name = req.body.name;
        DailyCoApi.deleteRoom(name)
          .then(response => {
            routeResHandler(res, response);
          })
          .catch(error => {
            routeResHandler(res, error);
          });
        break;
      default:
        routeResHandler(res, "Action Not Valid");
        break;
    }
  });

  // Route To Store in Meta -------------------------------------------------------------------

  const { MetaAPI } = require("./other-api");
  app.post(root + "/add-meta", function(req, res, next) {
    MetaAPI.add(req.body.key, req.body.value, req.body.source).then(
      response => {
        routeResHandler(res, response);
      }
    );
  });

  const { LogApi } = require("./other-api");
  app.post(root + "/add-log", function(req, res, next) {
    LogApi.add(req.body.event, req.body.data, req.body.user_id).then(
      response => {
        routeResHandler(res, response);
      }
    );
  });

  const { CfsApi } = require("./other-api");
  app.post(root + "/get-all-cf", function(req, res, next) {
    // active only
    CfsApi.getAllCf().then(response => {
      routeResHandler(res, response);
    });
  });

  // Activity Route ----------------------------------------------------------------
  const { DropboxAPI } = require("./dropbox-api");
  app.post(root + "/dropbox/:action", function(req, res, next) {
    var action = req.params.action;
    console.log("action", action);
    console.log(" req.body", req.body);

    switch (action) {
      case "upload":
        DropboxAPI.upload({
          dropboxPath: "/_upload/video.mp4",
          localPath: "note/note-test/video.mp4",
          finish: (err, result) => {
            console.log("err", err);
            console.log("result", result);
            if (err) {
              res.send(err);
            } else {
              res.send(result);
            }
          }
        });
        break;
      default:
        res.send("Action Invalid : " + action);
        break;
    }
  });

  // Activity Route ----------------------------------------------------------------
  const { ActivityAPI } = require("./activity-api");
  app.post(root + "/activity/:action", function(req, res, next) {
    var action = req.params.action;
    console.log(action);

    switch (action) {
      case "create-session":
        ActivityAPI.createSession(
          req.body.host_id,
          req.body.participant_id,
          req.body.entity,
          req.body.entity_id
        ).then(response => {
          routeResHandler(res, response);
        });
        break;
      /*
                 case 'start-queue':
                 ActivityAPI.startQueue(req.body.student_id, req.body.company_id)
                 .then((response) => {
                 routeResHandler(res, response);
                 });
                 break;
                 case 'cancel-queue':
                 ActivityAPI.cancelQueue(req.body.id)
                 .then((response) => {
                 routeResHandler(res, response);
                 });
                 break;
                 */
    }
  });

  // Auth Route ----------------------------------------------------------------
  const { AuthAPI } = require("./auth-api");
  app.post(root + "/auth/:action", function(req, res, next) {
    var action = req.params.action;
    switch (action) {
      case "login":
        AuthAPI.login(req.body.email, req.body.password, req.body.cf, req).then(
          response => {
            routeResHandler(res, response);
          }
        );
        break;
      case "password-reset-request":
        AuthAPI.password_reset_request(req.body.user_email).then(response => {
          routeResHandler(res, response);
        });
        break;
      case "password-reset-old":
        AuthAPI.password_reset_old(
          req.body.new_password,
          req.body.old_password,
          req.body.user_id
        ).then(response => {
          routeResHandler(res, response);
        });
        break;
      case "password-reset-token":
        AuthAPI.password_reset_token(
          req.body.new_password,
          req.body.token,
          req.body.user_id
        ).then(response => {
          routeResHandler(res, response);
        });
        break;
      case "register":
        AuthAPI.register(req.body.user).then(response => {
          routeResHandler(res, response);
        });
        break;
      case "activate-account":
        AuthAPI.activateAccount(req.body.key, req.body.user_id).then(
          response => {
            routeResHandler(res, response);
          }
        );
        break;
    }
  });

  //XLS Route ----------------------------------------------------------------
  // when login will get password without slash in local storage,
  // use that password lah.
  const { XLSApi } = require("./xls-api");
  app.get(root + "/xls/:action/:filter/:password/:user_id", function(
    req,
    res,
    next
  ) {
    var password = req.params.password;
    var user_id = req.params.user_id;
    var action = req.params.action;
    var filter = req.params.filter;

    AuthAPI.checkPasswordWithoutSlash(
      password,
      user_id,
      () => {
        XLSApi.export(action, filter).then(
          response => {
            res.header(
              "Content-Type",
              "application/vnd.ms-excel; charset=utf-8"
            );
            res.header(
              "Content-Disposition",
              `attachement; filename="${response.filename} - SeedsJobFair.xls"`
            );
            res.send(response.content);
          },
          err => {
            res.send(err);
          }
        );
      },
      err => {
        res.send(err);
      }
    );
  });

  //upload route ----------------------------------------------------------------
  var UPLOAD_PROGRESS = {
    // fileName : {bytesReceived, bytesExpected, parseCompleted, uploadCompleted}
  };
  function progressDelete(fileName, timeout) {
    setTimeout(function() {
      console.info(
        new Date().toString(),
        `[${fileName}]`,
        `progressDelete (${timeout})`
      );
      delete UPLOAD_PROGRESS[fileName];
    }, timeout);
  }
  function progressUpdate(fileName, bytesReceived, bytesExpected) {
    if (!UPLOAD_PROGRESS[fileName]) {
      UPLOAD_PROGRESS[fileName] = {};
      console.info(
        new Date().toString(),
        `[${fileName}]`,
        "progressUpdate 1st Time"
      );
    }
    UPLOAD_PROGRESS[fileName] = {
      bytesReceived: bytesReceived,
      bytesExpected: bytesExpected
    };
    progressDelete(fileName, 24 * 60 * 60 * 1000);
  }
  function progessParseCompleted(fileName) {
    console.info(
      new Date().toString(),
      `[${fileName}]`,
      "progessParseCompleted"
    );
    if (!UPLOAD_PROGRESS[fileName]) {
      UPLOAD_PROGRESS[fileName] = {};
    }
    UPLOAD_PROGRESS[fileName].parseCompleted = true;
    progressDelete(fileName, 60 * 60 * 1000);
  }
  function progessUploadCompleted(fileName) {
    console.info(
      new Date().toString(),
      `[${fileName}]`,
      "progessUploadCompleted"
    );
    if (!UPLOAD_PROGRESS[fileName]) {
      UPLOAD_PROGRESS[fileName] = {};
    }
    UPLOAD_PROGRESS[fileName].uploadCompleted = true;
    progressDelete(fileName, 60 * 1000);
  }

  app.post(root + "/upload-progress/:name", function(req, res) {
    var fileName = req.params.name;
    res.send(UPLOAD_PROGRESS[fileName]);
  });

  app.post(root + "/upload/:type/:name", function(req, res) {
    const uploadTimeout = 60 * 1000;
    req.setTimeout(uploadTimeout);

    var type = req.params.type;
    var fileName = req.params.name;

    console.info(new Date().toString(), `[${fileName}]`, "start upload");

    //console.log("upload");
    //console.log(type);
    var form = new formidable.IncomingForm();
    form.on("progress", function(bytesReceived, bytesExpected) {
      progressUpdate(fileName, bytesReceived, bytesExpected);
    });

    form.parse(req, function(err, fields, files) {
      progessParseCompleted(fileName);
      // get file ext
      var fileExt = files[type].name.split(".").pop();

      // get temp path
      var old_path = files[type].path;

      if (type == "video") {
        let dropboxPath = `/_upload/${fileName}.${fileExt}`;
        DropboxAPI.upload({
          dropboxPath: dropboxPath,
          localPath: old_path,
          param: fields,
          finish: (err, result) => {
            progessUploadCompleted(fileName);
            if (err) {
              res.send(err);
            } else {
              res.send(result);
            }
          }
        });
        return;
      }

      //console.log(files);
      // `type` is the name of the <input> field of type `type`
      var pwd = process.env.PWD ? process.env.PWD : process.env.INIT_CWD;

      console.log(pwd);
      // get year and month
      // and create if not exist
      var uploadDir = path.join(pwd, `public/upload/${type}`);
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

      //   //get file ext
      //   var fileExt = files[type].name.split(".").pop();

      //   // start create path
      //   // temp folder
      //   var old_path = files[type].path;

      // upload dir
      var subpath = `${type}/${y}/${m}/${fileName}_${d.getTime()}.${fileExt}`;
      var new_path = path.join(pwd, `public/upload/`, subpath);
      // public upload url
      var url = subpath;

      //console.log(new_path);
      //console.log(url);

      fs.readFile(old_path, function(err, data) {
        fs.writeFile(new_path, data, function(err) {
          fs.unlink(old_path, function(err) {
            if (err) {
              res.status(500);
              res.json({
                url: null
              });
            } else {
              res.status(200);
              //console.log(url);
              res.json({
                url: url
              });
            }
          });
        });
      });
    });
  });
};

module.exports = {
  initializeAllRoute
};
