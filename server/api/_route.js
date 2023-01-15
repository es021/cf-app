// only for action that need server side validation

const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const { UploadUrl } = require("../../config/app-config");
const { FileJSONProgress } = require("../../helper/file-helper");
const { graphql } = require("../../helper/api-helper");
const contentDisposition = require('content-disposition');

const initializeAllRoute = function (app, root) {
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
  // const routeResHandler = (res, error) => {
  //   res.status(400).send(error);
  // };

  // -------------------------------------------------------------------
  const { TimePickerAPI } = require("./time-picker-api");
  app.post(root + "/time-picker/:action", function (req, res, next) {
    var action = req.params.action;
    var param = req.body;
    TimePickerAPI.Main(action, param)
      .then(response => {
        routeResHandler(res, response);
      })
      .catch(error => {
        routeResHandler(res, error);
      });
  });


  // -------------------------------------------------------------------
  const { CfQueryAPI } = require("./cf-query-api");
  app.post(root + "/cf-query/:action", function (req, res, next) {
    var action = req.params.action;
    var param = req.body;
    CfQueryAPI.Main(action, param)
      .then(response => {
        routeResHandler(res, response);
      })
      .catch(error => {
        routeResHandler(res, error);
      });
  });

  // -------------------------------------------------------------------
  const { AdminAPI } = require("./admin-api");
  app.post(root + "/admin/:action", function (req, res, next) {
    var action = req.params.action;
    var param = req.body;
    AdminAPI.Main(action, param)
      .then(response => {
        routeResHandler(res, response);
      })
      .catch(error => {
        routeResHandler(res, error);
      });
  });

  // -------------------------------------------------------------------
  const { OrganizerAPI } = require("./organizer-api");
  app.post(root + "/organizer/:action", function (req, res, next) {
    var action = req.params.action;
    var param = req.body;
    OrganizerAPI.Main(action, param)
      .then(response => {
        routeResHandler(res, response);
      })
      .catch(error => {
        routeResHandler(res, error);
      });
  });

  // Route For User -------------------------------------------------------------------
  const { UserAPI } = require("./user-api");
  app.post(root + "/user/:action", function (req, res, next) {
    var action = req.params.action;
    var param = req.body;
    UserAPI.Main(action, param)
      .then(response => {
        routeResHandler(res, response);
      })
      .catch(error => {
        routeResHandler(res, error);
      });
  });

  // Route For Daily Co -------------------------------------------------------------------
  const { QrAPI } = require("./qr-api");
  app.post(root + "/qr/:action", function (req, res, next) {
    var action = req.params.action;
    var param = req.body;
    QrAPI.Main(action, param)
      .then(response => {
        routeResHandler(res, response);
      })
      .catch(error => {
        routeResHandler(res, error);
      });
  });

  // Route For Daily Co -------------------------------------------------------------------
  const { DatasetDatapointApi } = require("./dataset-datapoint-api");
  app.post(root + "/dataset-datapoint/:action", function (req, res, next) {
    var action = req.params.action;
    var param = req.body;
    DatasetDatapointApi.Main(action, param)
      .then(response => {
        routeResHandler(res, response);
      })
      .catch(error => {
        routeResHandler(res, error);
      });
  });

  // Route For Daily Co -------------------------------------------------------------------
  const { StatisticAPI } = require("./statistic-api");
  app.post(root + "/statistic/:action", function (req, res, next) {
    var action = req.params.action;
    var param = req.body;
    StatisticAPI.Main(action, param)
      .then(response => {
        routeResHandler(res, response);
      })
      .catch(error => {
        routeResHandler(res, error);
      });
  });

  // Activity Route ----------------------------------------------------------------
  const { CfsApi } = require("./other-api");
  app.post(root + '/cf/:action', function (req, res, next) {
    var action = req.params.action;
    switch (action) {
      case 'create':
        CfsApi.create(req.body)
          .then((response) => {
            routeResHandler(res, response);
          });
        break;
    }
  });
  app.post(root + "/get-all-cf", function (req, res, next) {
    // active only
    CfsApi.getAllCf().then(response => {
      routeResHandler(res, response);
    });
  });

  // Activity Route ----------------------------------------------------------------
  const { ExternalApi } = require('./external-api');
  app.post(root + '/external/:action', function (req, res, next) {
    var action = req.params.action;
    switch (action) {
      case 'check-iv-by-ic':
        ExternalApi.checkIvByIc(req.body)
          .then((response) => {
            routeResHandler(res, response);
          });
        break;
    }
  });

  // Activity Route ----------------------------------------------------------------
  const { ZoomApi } = require('./zoom-api');
  app.post(root + '/zoom/:action', function (req, res, next) {
    var action = req.params.action;
    switch (action) {
      case 'create-meeting':
        ZoomApi.createMeeting(req.body)
          .then((response) => {
            routeResHandler(res, response);
          });
        break;
      case 'is-expired':
        ZoomApi.isExpired(req.body)
          .then((response) => {
            routeResHandler(res, response);
          });
        break;
    }
  });

  // Route For Test Stuff -------------------------------------------------------------------
  const { TestAPI } = require("./test-api");
  app.post(root + "/test/:action", function (req, res, next) {
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

  app.post(root + "/daily-co/:action", function (req, res, next) {
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
  app.post(root + "/add-meta", function (req, res, next) {
    MetaAPI.add(req.body.key, req.body.value, req.body.source).then(
      response => {
        routeResHandler(res, response);
      }
    );
  });

  const { LogApi } = require("./other-api");
  app.post(root + "/add-log", function (req, res, next) {
    LogApi.add(req.body.event, req.body.data, req.body.user_id).then(
      response => {
        routeResHandler(res, response);
      }
    );
  });
  app.post(root + "/add-event-log", function (req, res, next) {
    console.log(req.body)

    LogApi.addEventLog(req.body).then(
      response => {
        routeResHandler(res, response);
      }
    );
  });


  // NexmoAPI Route ----------------------------------------------------------------
  const { NexmoAPI } = require("./nexmo-api");
  app.post(root + "/nexmo/:action", function (req, res, next) {
    var action = req.params.action;
    console.log("#########################################");
    switch (action) {
      case "send-sms":
        NexmoAPI.sendSms(
          req.body.user_id,
          req.body.to_number,
          req.body.type,
          req.body.param,
          (data) => {
            routeResHandler(res, {
              data: data
            });
          }
        );
        break;
    }
  });

  // Activity Route ----------------------------------------------------------------
  const { ActivityAPI } = require("./activity-api");
  app.post(root + "/activity/:action", function (req, res, next) {
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
  app.post(root + "/auth/:action", function (req, res, next) {
    var action = req.params.action;
    switch (action) {
      case "login":
        // req.body.email, req.body.password, req.body.cf, req.body.kpt, req
        AuthAPI.login({ ...req.body, request: req }).then(
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
      case "create-recruiter":
        AuthAPI.createRecruiter(req.body.rec).then(response => {
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
  app.get(root + "/xls/:action/:filter/:password/:user_id", function (
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
        XLSApi.export({ action, filter }).then(
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

  app.post(root + "/xls/:action/:password/:user_id", function (
    req,
    res,
    next
  ) {
    var password = req.params.password;
    var user_id = req.params.user_id;
    var action = req.params.action;
    var filter = req.body.filter;
    var cf = req.body.cf;
    var is_admin = req.body.is_admin;


    var cf_title = req.body.cf_title;
    if (!cf_title) {
      cf_title = "SeedsJobFair";
    }

    // console.log('password', password)
    // console.log('action', action)
    // console.log('user_id', user_id)
    // console.log('filter', filter)
    // console.log('cf', cf)
    // console.log('is_admin', is_admin)

    AuthAPI.checkPasswordWithoutSlash(
      password,
      user_id,
      () => {
        XLSApi.export({ action, filter, cf, is_admin }).then(
          response => {
            res.header(
              "Content-Type",
              "application/vnd.ms-excel; charset=utf-8"
            );
            res.header(
              "Content-Disposition",
              contentDisposition(`${response.filename} - ${cf_title}.xls`)
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

  // var UPLOAD_PROGRESS = {
  // 	// fileName : {bytesReceived, bytesExpected, parseCompleted, uploadCompleted}
  // };
  // function progressDelete(fileName, timeout) {
  // 	setTimeout(() => {
  // 		console.log(
  // 			new Date().toString(),
  // 			`[${fileName}]`,
  // 			`progressDelete (${timeout})`
  // 		);
  // 		FileJSONProgress.delete(fileName);
  // 	}, timeout);
  // }
  // function progressUpdate(fileName, bytesReceived, bytesExpected) {
  // 	FileJSONProgress.write(fileName, {
  // 		bytesReceived: bytesReceived,
  // 		bytesExpected: bytesExpected
  // 	});
  // }

  // function progessParseCompleted(fileName) {
  // 	FileJSONProgress.write(fileName, {
  // 		parseCompleted: true
  // 	});
  // 	progressDelete(fileName, 60 * 60 * 1000);
  // }

  // function progessUploadCompleted(fileName) {
  // 	FileJSONProgress.write(fileName, {
  // 		uploadCompleted: true
  // 	});
  // 	console.log(
  // 		new Date().toString(),
  // 		`[${fileName}]`,
  // 		"progessUploadCompleted"
  // 	);
  // 	progressDelete(fileName, 60 * 1000);
  // }
  const { CoconutAPI } = require("./coconut-api");
  app.post(root + "/coconut-webhook/:entity/:entity_id/:meta_key", function (
    req,
    res,
    next
  ) {
    CoconutAPI.webhook(req.params, req.body);
    res.send("Okay");
  });



  //   app.post(root + "/coconut/:action", function(req, res, next) {
  //     var action = req.params.action;
  //     console.log("coconut action", action);
  //     switch (action) {
  //       case "test":
  //         CoconutAPI.test(req.body);
  //         break;
  //       case "compress":
  //         CoconutAPI.compress(req.body);
  //         break;
  //       case "webhook":
  //         CoconutAPI.webhook(req.body);
  //         break;
  //     }
  //     res.send("Okay");
  //   });

  //   const { DropboxAPI } = require("./dropbox-api");
  //   function uploadToDropbox({ fileName, localPath, param }) {
  //     let dropboxPath = `/_upload/${fileName}`;
  //     DropboxAPI.upload({
  //       dropboxPath: dropboxPath,
  //       localPath: localPath,
  //       param: param,
  //       finish: (err, result) => {
  //         console.log("finish upload dropbox");
  //         // progessUploadCompleted(fileName);
  //         // if (err) {
  //         // 	res.send(err);
  //         // } else {
  //         // 	res.send(result);
  //         // }
  //       }
  //     });
  //     return;
  //   }

  function insertVideoDb({ url, param, finish }) {
    let entity = param.entity;
    let entity_id = param.entity_id;
    let meta_key = param.meta_key;
    // console.log("result", result);

    url = `${UploadUrl}/${url}`;
    // let url = result.url;
    // url = url.replace("dl=0", "raw=1");

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

  app.post(root + "/upload/:type/:name", function (req, res) {
    console.log("post upload");
    // const uploadTimeout = 60 * 1000;
    // req.setTimeout(uploadTimeout);

    var type = req.params.type;
    var fileName = req.params.name;

    console.log(new Date().toString(), `[${fileName}]`, "start upload");

    //console.log("upload");
    //console.log(type);
    var form = new formidable.IncomingForm();

    // if (type == "video") {
    // 	form.on("progress", function(bytesReceived, bytesExpected) {
    // 		progressUpdate(fileName, bytesReceived, bytesExpected);
    // 	});
    // }

    form.parse(req, function (err, fields, files) {
      //progessParseCompleted(fileName);
      // get file ext
      var fileExt = files[type].name.split(".").pop();

      // get temp path
      var old_path = files[type].path;

      //console.log(files);
      // `type` is the name of the <input> field of type `type`
      var pwd = process.env.PWD ? process.env.PWD : process.env.INIT_CWD;

      console.log(pwd);
      // get year and month
      // and create if not exist
      var uploadDir = path.join(pwd, `public/upload/${type}`);

      // create type dir
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      // create year dir
      var d = new Date();
      var y = d.getYear() + 1900;
      uploadDir += `/${y}`;
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      // create month dir
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
      fileName = `${fileName}_${d.getTime()}.${fileExt}`;
      var subpath = `${type}/${y}/${m}/${fileName}`;
      var new_path = path.join(pwd, `public/upload/`, subpath);
      // public upload url
      var url = subpath;

      //console.log(new_path);
      //console.log(url);

      fs.readFile(old_path, function (err, data) {
        fs.writeFile(new_path, data, function (err) {
          fs.unlink(old_path, function (err) {
            if (err) {
              res.status(500);
              res.json({
                url: null
              });
            } else {
              if (type == "video") {
                //progessUploadCompleted(fileName);
                insertVideoDb({
                  url: url,
                  param: fields,
                  finish: (_err, _res) => {
                    // uploadToDropbox({
                    //   fileName: fileName,
                    //   localPath: new_path,
                    //   param: fields
                    // });

                    CoconutAPI.compress({
                      fileUrl: `${UploadUrl}/${url}`,
                      entity: fields.entity,
                      entity_id: fields.entity_id,
                      meta_key: fields.meta_key
                    });

                    res.status(200);
                    res.json({
                      url: url
                    });
                  }
                });
              } else {
                console.log("url", url);
                res.status(200);
                res.json({
                  url: url
                });
              }
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
