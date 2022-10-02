const DB = require("../model/DB.js");
const { UserQuery } = require("../model/user-query.js");
const { graphql } = require("../../helper/api-helper");
const { Time } = require("../../app/lib/time.js");
var QRCode = require('qrcode')
const fs = require("fs");
const path = require("path");
const { AppConfig } = require("../../config/app-config.js");
const { url } = require("inspector");
const pwd = process.env.PWD ? process.env.PWD : process.env.INIT_CWD;

class QrAPI {
    Main(action, param) {

        switch (action) {
            case "create-for-check-in":
                return this.create({ ...param, type: "check-in" });
            case "do-check-in":
                return this.doCheckIn(param);
            case "get-qr-detail":
                return this.getQrDetail(param);
        }
    }
    generateFileName() {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    getQrDetail(param) {
        let code = param.code;

        return new Promise(async (resolve, reject) => {
            let sqlCheck = `
                SELECT 
                i.ID as qr_id, i.user_id, c.name as cf, m.meta_value as cf_title
                FROM qr_img i, cfs c LEFT OUTER JOIN cfs_meta m ON m.cf_name = c.name AND m.meta_key = "title"
                WHERE 1=1
                AND code = ? 
                AND i.cf = c.name
            `;
            sqlCheck = DB.prepare(sqlCheck, [code]);
            let sqlRes = await DB.query(sqlCheck).then(res => {
                try {
                    return res[0]
                } catch (err) {
                    return null;
                }
            })

            if (!sqlRes) {
                reject("Invalid qr code");
            }

            // let user_id = 46416;
            let user = await graphql(`query{
                user(ID :${sqlRes["user_id"]}){
                    ID first_name last_name img_url img_pos img_size user_email phone_number
                }
            }`).then(res => {
                let user = res.data.data.user;
                return {
                    user: user,
                    cf: {
                        title: sqlRes["cf_title"],
                        cf: sqlRes["cf"],
                    },
                    qr_id: sqlRes["qr_id"],
                };
            }).catch(err => {
                reject("Error fetching user info");
            })

            resolve(user);
        });
    }
    async doCheckIn(param) {
        let qr_id = param.qr_id;
        let user_id = param.user_id;
        let cf = param.cf;

        let insertParam = {
            qr_id: qr_id,
        };
        if (user_id) {
            insertParam["logged_in_user_id"] = user_id
        }
        if (cf) {
            insertParam["logged_in_cf"] = cf
        }

        return DB.insert("qr_check_in", insertParam)
    }
    async create(param) {
        let user_id = param.user_id;
        let type = param.type;
        let cf = param.cf;

        let code = this.generateFileName();
        let file_name = `${code}.png`;
        let scan_url = AppConfig.WebAuthUrl + `/qr-check-in/${code}`;
        let img_url = `qr/${file_name}`
        var uploadDir = path.join(pwd, `public/upload/qr`);

        return new Promise(async (resolve, reject) => {

            let sqlCheck = `SELECT url FROM qr_img WHERE user_id = ? AND type = ? AND cf = ?`;
            sqlCheck = DB.prepare(sqlCheck, [user_id, type, cf]);
            let res = await DB.query(sqlCheck)

            if (res.length > 0) {
                resolve({ url: res[0]["url"] });
                return;
            }

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }

            QRCode.toDataURL(scan_url, {
                quality: 1,
                color: {
                    dark: "#242424",
                    light: "#fcfbfc"
                }
            }, (err, base64) => {
                base64 = base64.replace(/^data:image\/png;base64,/, "");

                fs.writeFile(`${uploadDir}/${file_name}`, base64, 'base64', (err) => {
                    if (err) {
                        reject({ err: err.toString() });
                    }
                    DB.insert("qr_img", {
                        code: code,
                        url: img_url,
                        type: type,
                        user_id: user_id,
                        cf: cf,
                    })
                    resolve({ url: img_url, });
                });
            })
        });


    }

}

QrAPI = new QrAPI();
module.exports = { QrAPI };
