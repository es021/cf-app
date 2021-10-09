a = `Internship - Computing/IT/Software Engineering
Internship - Data Analytics/Data Science
Internship - Web Developer
Internship - Hospitality Management
Internship - Culinary Arts Management
Internship - Tourism/Event
Internship - Accounting
Internship – Finance
Internship – Audit
Internship – Sales and Marketing
Internship – Digital Marketing
Internship – Business Development
Internship – Business Administration
Internship – Human Resource
Internship – E-Commerce
Internship – Mechanical/Chemical/Electrical & Electronic Engineering
Software Developer Intern
Computer Science Intern
Mobile Apps Developer Intern
Frontend Development Intern
Backend Development Intern`

r = a.split("\n").map((d)=>{
  return `INSERT INTO ref_job_role (ID, val, category) VALUES (null, '${d.trim()}', 'other');`
}).join("\n");

console.log(r)
