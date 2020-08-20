a = `Accounting and Finance
Advertising and Branding
Business Analytics
Actuarial Studies
American Degree Transfer Program
Biology with Psychology
Biomedicine
Business Management
Business Studies
Communication
Computer Science
Contemporary Music (Audio Technology)
Conventions and Events Management
Culinary Arts
Culinary Management
Design Communication
Digital Film Production
Entrepreneurship
Events Management
Financial Analysis
Financial Economics
Financial Risk Management
Graphic & Multimedia Design
Global Supply Chain Management
Hotel Management
Industrial Statistics
Information Systems (Data Analytics)
Information Technology
Information Technology (Computer Networking and Security)
Interior Architecture
International Business
Interior Design
International Hospitality Management
International Trade
Management & Innovation
Marketing
Medical Biotechnology
Mobile Computing with Entrepreneurship
Music Performance
Nursing
Performing Arts
Psychology
Software Engineering
Supply Chain & Logistics Management
ACCA
ICAEW
Other`
a = a.split("\n");


r = "";
for(var _a of a){
    r += `INSERT INTO wp_career_fair.ref_sunway_program (val) VALUES ('${_a}'); \n`;  
}

console.log(r);