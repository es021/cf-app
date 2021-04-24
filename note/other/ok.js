a = `Social Media
Newspaper
Ads
Emails
Friends
University`


a.split("\n").map((d) => {
    return `INSERT INTO wp_career_fair.ref_d2w21_reference (val) VALUES ('${d.trim()}');`
}).join("\n");