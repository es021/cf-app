a = `The Complete Banker™ (TCB) Programme (Leadership Track)	Full Time	https://careers.cimb.com/fresh-graduates/the-complete-banker-programme	Kuala Lumpur, Malaysia	A programme to take your career forward in Banking and put your agility to the test	All degree disciplines and meet the criteria below:
i. Minimum CGPA of 3.00 OR Second Class (Upper) OR High Credit (65%); and 
ii. Not more than one ear working experience
****wzs21****
TCB Digital (Technical Track)	Full Time	https://careers.cimb.com/fresh-graduates/the-complete-banker-digital	Kuala Lumpur, Malaysia	Build code; Solve problems; Have funD! Be part of our digital transformation journey	All degree disciplines and meet the criteria below:
i. Minimum CGPA of 3.00 OR Second Class (Upper) OR High Credit (65%); and 
ii. Not more than one ear working experience
****wzs21****
TCB Fusion (Professional Track)	Full Time	https://careers.cimb.com/fresh-graduates/cimb-fusion	Kuala Lumpur, Malaysia	Two choices, 1 decision.
The programme that was conceived to remove the guesswork when making that all-important career decision.	Minimum Diploma in digital tech related courses with good CGPA and excellent grades in related subjects
****wzs21****
Internship	Intern	https://careers.cimb.com/students	Kuala Lumpur, Malaysia	A  first step to a real job. An internship with us will be an eye-opening experience.	All related degree / diploma and meet the criteria below:
i. Minimum CGPA of 3.00 OR Second Class (Upper) OR equivalent.`;


COMPANY_ID = 693;

INDEX = {
    TITLE : 0,
    TYPE : 1,
    LOCATION : 3,
    DESC : 4,
    REQ : 5,
    URL : 2,
}

a = a.split("\n****wzs21****\n");
sql = "";
for(var _a of a){
    _a = _a.split("\t");
    console.log(_a);

    let title = _a[INDEX.TITLE];
    let type = _a[INDEX.TYPE];
    let location = _a[INDEX.LOCATION];
    let desc = _a[INDEX.DESC];
    let req = _a[INDEX.REQ];
    let url = _a[INDEX.URL];

    sql += `INSERT INTO vacancies 
    (company_id, title, location, description, requirement, type, application_url,  created_by) 
    VALUES 
    ('${COMPANY_ID}', '${title}', '${location}', '${desc}', '${req}', '${type}', '${url}',  1); \n`;
}

console.log(sql)
