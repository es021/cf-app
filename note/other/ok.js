a = `Bachelor in Public Relations (Honours) - Penang Branch Campus
Bachelor of Accounting (Honours)
Bachelor of Arts (Honours) English with Drama
Bachelor of Arts (Honours) English with Education
Bachelor of Arts in English Studies (Honours)
Bachelor of Banking and Finance (Honours)
Bachelor of Business (Honours) Accounting and Finance
Bachelor of Business (Honours) in Entrepreneurship
Bachelor of Business (Honours) in Human Resource Management
Bachelor of Business (Honours) in International Business
Bachelor of Business (Honours) in Logistics and Supply Chain Management
Bachelor of Business (Honours) in Marketing
Bachelor of Business (Honours) International Business Management
Bachelor of Business Administration (Honours)
Bachelor of Commerce (Honours)
Bachelor of Communication (Honours) in Advertising
Bachelor of Communication (Honours) in Broadcasting
Bachelor of Communication (Honours) in Journalism
Bachelor of Communication (Honours) in Media Studies
Bachelor of Communication Studies (Honours)
Bachelor of Computer Science (Honours) in Data Science
Bachelor of Computer Science (Honours) in Interactive Software Technology
Bachelor of Computer Science (Honours) in Software Engineering
Bachelor of Construction Management and Economics (Honours)
Bachelor of Corporate Administration (Honours)
Bachelor of Creative Multimedia (Honours)
Bachelor of Design (Honours) in Fashion Design
Bachelor of Design (Honours) in Graphic Design
Bachelor of Early Childhood Education (Honours)
Bachelor of Economics (Honours)
Bachelor of Electrical and Electronics Engineering with Honours
Bachelor of Finance (Honours)
Bachelor of Finance and Investment (Honours)
Bachelor of Hospitality and Catering Management (Honours)
Bachelor Of Hospitality Management (Honours)
Bachelor of Information Systems (Honours) in Enterprise Information Systems
Bachelor of Information Technology (Honours) in Information Security
Bachelor of Information Technology (Honours) in Internet Technology
Bachelor of Information Technology (Honours) in Software Systems Development
Bachelor of Interior Architecture (Honours)
Bachelor of Mechanical Engineering with Honours
Bachelor of Mechatronics Engineering with Honours
Bachelor of Public Relations (Honours) - Kuala Lumpur Main Campus
Bachelor of Quantity Surveying (Honours)
Bachelor of Real Estate Management(Honours)
Bachelor of Retail Management (Honours)
Bachelor of Science (Honours) in Management Mathematics with Computing
Bachelor of Science (Hons) in Analytical Chemistry
Bachelor of Science (Hons) in Applied Physics (Instrumentation)
Bachelor of Science (Hons) in Bioscience with Chemistry
Bachelor of Science (Hons) in Food Science
Bachelor of Science (Hons) in Sports and Exercise Science
Bachelor of Science in Architecture (Honours)
Bachelor of Social Science (Honours) in Psychology
Bachelor of Telecommunication Engineering with Honours
Bachelor of Tourism Management (Honours)
Bachelor of Tourism Management (Honours) Event Management
Diploma in Accounting
Diploma in Advertising
Diploma In Aquaculture
Diploma in Banking and Finance
Diploma in Banking and Finance (Sabah campus)
Diploma in Broadcast Communication
Diploma in Building
Diploma in Business Administration
Diploma in Business Economics
Diploma in Communication and Media Studies
Diploma in Computer Science
Diploma in Computer Science (Data Science)
Diploma in Counselling
Diploma in Culinary Arts
Diploma in E-Marketing
Diploma in Entrepreneurship
Diploma in Event Management
Diploma in Finance and Investment
Diploma in Food Science
Diploma in Hotel Management (DHM)
Diploma in Hotel Management (DHT)
Diploma in Human Resource Management
Diploma in Information Systems
Diploma in Information Technology
Diploma in International Business
Diploma in Journalism
Diploma in Logistics and Supply Chain Management
Diploma in Marketing
Diploma in Media Studies
Diploma in Public Relations
Diploma in Quantity Surveying
Diploma in Real Estate Management
Diploma in Retail Management
Diploma in Science
Diploma in Software Engineering
Diploma in Sport and Exercise Science
Diploma in Tourism Management
Diploma of Electronic Engineering
Diploma of Mechanical Engineering
Diploma of Mechatronic Engineering`

r = a.split("\n").map((d)=>{
  return `INSERT INTO ref_tarucjul21_programme (val) VALUES ('${d.trim()}');`
}).join("\n");

console.log(r)