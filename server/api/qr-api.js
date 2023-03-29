const DB = require("../model/DB.js");
const { UserQuery } = require("../model/user-query.js");
const { graphql } = require("../../helper/api-helper");
const { Time } = require("../../app/lib/time.js");
var QRCode = require('qrcode')
const fs = require("fs");
const path = require("path");
const { AppConfig } = require("../../config/app-config.js");
// const { url } = require("inspector");
const IP = require('ip');

const pwd = process.env.PWD ? process.env.PWD : process.env.INIT_CWD;
class QrAPI {
    Main(action, param) {

        switch (action) {
            case "create-for-user":
                return this.create({ ...param, type: "user" });
            case "create-for-company":
                return this.create({ ...param, type: "company" });
            case "create-for-event":
                return this.create({ ...param, type: "event" });
            // case "create-for-check-in":
            //     return this.create({ ...param, type: "check-in" });
            case "scan":
                return this.scan(param);
            case "get-qr-detail":
                return this.getQrDetail(param);
            case "do-check-in":
                return this.doCheckIn(param);
        }
    }
    generateCode() {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 15; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    doCheckIn(param) {
        let cf = param.cf;
        let user_id = param.user_id;
        let checked_in_by = param.checked_in_by;

        return DB.insert("qr_check_in", {
            cf: cf,
            user_id: user_id,
            checked_in_by: checked_in_by,
        });
    }
    getQrDetail(param) {
        let code = param.code;

        return new Promise(async (resolve, reject) => {
            let sql = `
                SELECT 
                i.ID as qr_id, 
                i.url as img_url,
                i.cf,
                i.user_id, 
                i.event_id, 
                i.company_id,
                i.type as qr_type,
                ${DB.selectTimestampToUnix('c.created_at')} as checked_in_at
                 
                FROM qr_img i LEFT OUTER JOIN qr_check_in c ON c.cf = i.cf AND c.user_id = i.user_id
                WHERE 1=1
                AND i.code = ? 
            `;
            sql = DB.prepare(sql, [code]);
            let sqlRes = await DB.query(sql).then(res => {
                try {
                    return res[0]
                } catch (err) {
                    return null;
                }
            })

            if (!sqlRes) {
                reject("No record found for the scanned QR code");
            }

            let user_id = sqlRes["user_id"];
            let company_id = sqlRes["company_id"];
            let event_id = sqlRes["event_id"];

            let toReturn = {
                cf: sqlRes["cf"],
                qr_id: sqlRes["qr_id"],
                qr_type: sqlRes["qr_type"],
                qr_img_url: sqlRes["img_url"],
            }
            if (event_id) {
                toReturn["qr_event_id"] = event_id;
            }
            if (company_id) {
                toReturn["qr_company_id"] = company_id;
            }
            if (user_id) {
                toReturn["checked_in_at"] = sqlRes["checked_in_at"];

                let res = await graphql(`query{
                    user:user(ID :${user_id}){
                        ID first_name last_name img_url img_pos img_size user_email phone_number
                    }
                }`)
                let user = res.data.data.user;
                if (!user.ID) {
                    reject("Error fetching user information for this QR code");
                }

                toReturn["user"] = user;
            }
            resolve(toReturn);
        });
    }
    async scan(param) {
        let qr_id = param.qr_id;
        let user_id = param.user_id;
        let cf = param.cf;

        const ipAddress = IP.address();
        let insertParam = {
            qr_id: qr_id,
            ip_address: ipAddress,
        };
        if (user_id) {
            insertParam["logged_in_user_id"] = user_id
        }
        if (cf) {
            insertParam["logged_in_cf"] = cf
        }

        return DB.insert("qr_scan", insertParam)
    }
    async create(param) {
        let user_id = param.user_id;
        let company_id = param.company_id;
        let event_id = param.event_id;
        let type = param.type;
        let cf = param.cf;

        let code = this.generateCode();
        let file_name = `${code}.png`;
        // let scan_url = AppConfig.WebAuthUrl + `/qr-check-in/${code}`;
        let scan_url = AppConfig.WebAppUrl + `/qr-scan/${code}`;
        let img_url = `qr/${file_name}`
        var uploadDir = path.join(pwd, `public/upload/qr`);

        return new Promise(async (resolve, reject) => {

            let wherePartial = "";
            let whereParam = [];
            if (user_id) {
                wherePartial += "AND user_id = ?"
                whereParam.push(user_id);
            }
            if (company_id) {
                wherePartial += "AND company_id = ?"
                whereParam.push(company_id);
            }
            if (event_id) {
                wherePartial += "AND event_id = ?"
                whereParam.push(event_id);
            }

            let sqlCheck = `SELECT url, scan_url FROM qr_img WHERE 1=1 ${wherePartial} AND type = ? AND cf = ?`;
            sqlCheck = DB.prepare(sqlCheck, [...whereParam, type, cf]);
            let res = await DB.query(sqlCheck)

            if (res.length > 0) {
                resolve({ url: res[0]["url"], scan_url: res[0]["scan_url"] });
                return;
            }

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }

            QRCode.toDataURL(scan_url, {
                quality: 0.3,
                width: 500,
                color: {
                    dark: '#011012FF',  // foreground
                    light: '#fcfcfcFF' // background
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
                        scan_url: scan_url,
                        type: type,
                        user_id: user_id,
                        company_id: company_id,
                        event_id: event_id,
                        cf: cf,
                    })
                    resolve({ url: img_url, scan_url: scan_url });
                });
            })
        });


    }

}

QrAPI = new QrAPI();
module.exports = { QrAPI };
