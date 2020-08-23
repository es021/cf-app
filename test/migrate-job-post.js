a = `1020	RentGuard Sdn Bhd	MDCW	Full Stack Engineer (.Net / Angular)	Permanent / Full-time					*******WZS********
1020	RentGuard Sdn Bhd	MDCW	Project Coordinator 	Permanent / Full-time					*******WZS********
1021	ZeptoExpress	MDCW	Business Development	Permanent / Full-time					*******WZS********
1021	ZeptoExpress	MDCW	Account	Permanent / Full-time					*******WZS********
1021	ZeptoExpress	MDCW	Fleet Operation	Permanent / Full-time					*******WZS********
1021	ZeptoExpress	MDCW	Admin Assistant	Permanent / Full-time					*******WZS********
1022	Mobi Asia Sdn Bhd	MDCW	Sales Consultant	Permanent / Full-time					*******WZS********
1022	Mobi Asia Sdn Bhd	MDCW	Sales Consultant	Internship					*******WZS********
1022	Mobi Asia Sdn Bhd	MDCW	Finance Executive	Internship					*******WZS********
1022	Mobi Asia Sdn Bhd	MDCW	Finance Executive 	Permanent / Full-time					*******WZS********`;

BULLET = "wzs21bullet"
DELIMITER = "	*******WZS********"
//wzs21bullet

// DELIMITER = "\n"
// COMPANY_ID = 750;

TEST_COMPANY_KAT_LOCAL = "23";
// login guna
// test.rec.4B@gmail.com

TEST_COMPANY_KAT_PHP_API = "44";
// test kat
// https://seedsjobfairapp.com/php-api/admin/export_sql.php

INDEX = {
    // COMPANY_ID: TEST_COMPANY_KAT_LOCAL,
    // COMPANY_ID: TEST_COMPANY_KAT_PHP_API,
    COMPANY_ID : 0,
    TITLE: 3,
    TYPE: 4,
    // TYPE: "Full Time",
    LOCATION: 5,
    DESC: 6,
    REQ: 7,
    URL: 8,
}

String.prototype.replaceAll = function (search, replacement, ignoreCase = false) {
    var i = (ignoreCase) ? "i" : "";
    var target = this;
    return target.replace(new RegExp(search, `${i}g`), replacement);
};

function fixType(type) {
    const ALTERNATE = {
        TYPE_FULL_TIME: ["Full Time Position", "Full time position", "Full time", "Full-Time", "Permanent"],
        TYPE_FULL_TIME_AND_INTERN: ["INTERNSHIP AND FULL TIME", "Both"],
        TYPE_INTERN: ["Internship"],
        TYPE_PART_TIME: [""],
        TYPE_GRADUATE_INTERN: [""],
    }
    const VALID = {
        TYPE_FULL_TIME: "Full Time",
        TYPE_FULL_TIME_AND_INTERN: "Full Time & Intern",
        TYPE_INTERN: "Intern",
        TYPE_PART_TIME: "Part Time",
        TYPE_GRADUATE_INTERN: "Graduate Trainee / Internships",
    };

    if (type && typeof type === "string") {
        type = type.trim();
        if (ALTERNATE.TYPE_FULL_TIME.indexOf(type) >= 0) {
            return VALID.TYPE_FULL_TIME;
        }
        if (ALTERNATE.TYPE_FULL_TIME_AND_INTERN.indexOf(type) >= 0) {
            return VALID.TYPE_FULL_TIME_AND_INTERN;
        }
        if (ALTERNATE.TYPE_INTERN.indexOf(type) >= 0) {
            return VALID.TYPE_INTERN;
        }
        if (ALTERNATE.TYPE_PART_TIME.indexOf(type) >= 0) {
            return VALID.TYPE_PART_TIME;
        }
        if (ALTERNATE.TYPE_GRADUATE_INTERN.indexOf(type) >= 0) {
            return VALID.TYPE_GRADUATE_INTERN;
        }
    }

    return type;
}

function reformatTitleAndLocation(str) {
    if (!str) {
        return str;
    }
    try {
        str = str.replaceAll(`\n`, " ");
        str = str.replaceAll(`"`, "");
        return str;
    } catch (err) {

    }
    return str;
}

function reformat(str) {
    if (!str) {
        return str
    }
    const DUH = "DUHjdfknsadjvkqervqer";

    str = str.replaceAll(`"`, "");
    str = str.replaceAll(`'`, "\\'");

    if (str.indexOf("1.") >= 0 || str.indexOf(BULLET) >= 0) {
        // console.log(str);
        for (var i = 1; i <= 50; i++) {
            str = str.replace(`0${i}. `, DUH);
            str = str.replace(`${i}. `, DUH);
        }



        str = str.replaceAll(BULLET, DUH);


        let arr = str.split(DUH);
        str = "";
        for (var a of arr) {
            a = a.replaceAll("\n", " ");
            if (a == "") {
                continue;
            }
            str += `<li>${a}</li>`;
        }
        let toRet = `<ul style="list-style:circle; padding-left: 25px;">${str}</ul>`;

        toRet = toRet.replace("Responsibilities and Tasks:", "</li><li><h4>Responsibilities and Tasks:</h4>")
        toRet = toRet.replace("JOB RESPONSIBILITIES", "</li><li><h4>JOB RESPONSIBILITIES:</h4>")
        // console.log(toRet);

        return toRet;
    }

    return str;
}

a = a.split(DELIMITER);
//     console.log(a);

sql = "";
for (var _a of a) {
    _a = _a.split("\t");

    let title = _a[INDEX.TITLE];
    let location = typeof INDEX.LOCATION !== "number" ? INDEX.LOCATION : _a[INDEX.LOCATION];
    let desc = typeof INDEX.DESC !== "number" ? INDEX.DESC : _a[INDEX.DESC];
    let req = typeof INDEX.REQ !== "number" ? INDEX.REQ : _a[INDEX.REQ];
    let type = typeof INDEX.TYPE !== "number" ? INDEX.TYPE : _a[INDEX.TYPE];
    console.log(type, fixType(type));
    type = fixType(type);
    let url = typeof INDEX.URL !== "number" ? INDEX.URL : _a[INDEX.URL];
    let company_id = typeof INDEX.COMPANY_ID !== "number" ? INDEX.COMPANY_ID : _a[INDEX.COMPANY_ID];

    url = url ? url : "";
    company_id = company_id ? company_id.trim() : company_id;
    if (!company_id) {
        continue;
    }

    title = reformatTitleAndLocation(title);
    location = reformatTitleAndLocation(location);
    type = reformat(type);
    desc = reformat(desc);
    req = reformat(req);

    // console.log(title)
    // console.log(location)
    // console.log(desc)
    // console.log(req)
    // console.log(type)
    // console.log(url)
    // console.log(company_id)
    // console.log("_______________________________________________________")

    if (!company_id || !title) {
        continue
    }
    // reformat desc and req

    sql += `INSERT INTO vacancies 
    (company_id, title, location, description, requirement, type, application_url,  created_by) 
    VALUES 
    ('${company_id}', '${title}', '${location}', '${desc}', '${req}', '${type}', '${url}',  21); \n\n\n`;
}
// console.log("total", a.length);
console.log(sql)


