a = `American Degree Transfer Program (ADTP)
School of Arts
School of Engineering & Technology
School of Hospitality & Services Management
School of Mathematical Sciences
School of Medical Life Sciences
Sunway Diploma Studies
Sunway TES Centre For Accountancy Excellence
Sunway University Business School
Victoria University Bachelor of Business Programme`


a.split("\n").map((d) => {
    return `INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('${d.trim()}');`
}).join("\n");