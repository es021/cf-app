const DB = require("../model/DB.js");
const { getAxiosGraphQLQuery, } = require('../../helper/api-helper');

class AdminAPI {
    Main(action, param) {
        switch (action) {
            case "create-iv-bundle":
                return this.createIvBundle(param);
        }
    }
    createIvBundle(param) {
        console.log("param", param)
        let data = param.data;
        data = JSON.parse(data);

        /*
            id: uniqueId,
            cf: getCF(),
            company_id: company_id,
            student_email: student_email,
            appointment_time: apt_time
        */

        let promises = [];
        for (let d of data) {
            let company_id = d["company_id"];
            let student_email = d["student_email"];
            let currentCf = d["cf"];
            let check = `
                query{ 
                    checkUser : user(user_email:"${student_email}", cf:"${currentCf}") {
                        ID first_name last_name
                    }

                    checkCompany : company(ID:${company_id}, cf:"${currentCf}"){
                        ID name
                    }
                }   
            `
            promises.push(getAxiosGraphQLQuery(check));
        }


        return Promise.all(promises).then(async res => {

            let toRet = {};
            for (let i in res) {
                let r = res[i].data.data;
                let d = data[i];


                console.log(r, d);
                console.log("--------------")

                let error = [];

                if (!r.checkCompany) {
                    error.push(`Company ID does not exist in event ${d.cf}`)
                }
                if (!r.checkUser) {
                    error.push(`Student Email does not exist in event ${d.cf}`)
                }

                if (error.length <= 0) {
                    let student_id = r.checkUser.ID;
                    let company_id = d.company_id;
                    let apt_time = d.appointment_time;
                    let updated_by = d.updated_by;
                    let q = `
                        mutation{
                            add_prescreen
                            (
                                special_type:"New",
                                student_id:${student_id},
                                status:"1_Waiting",
                                updated_by:${updated_by},
                                company_id:${company_id},
                                appointment_time:${apt_time}
                            )
                            {ID}
                        }
                        `
                    try {
                        let resCreate = await getAxiosGraphQLQuery(q);
                    } catch (errCreate) {
                        error.push(errCreate.toString());
                    }
                }
                toRet[d.id] = {
                    error: error,
                    success: error.length <= 0
                }
            }

            return toRet;
        });


    }
}

AdminAPI = new AdminAPI();
module.exports = { AdminAPI };
