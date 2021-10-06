a = `Advertising/Media
Agriculture/Aquaculture/Forestry
Architecture
Art/Design/Creative Multimedia
Biology
Biotechnology
Business Studies/Administration/Management
Chemistry
Commerce
Computer Science/Information Technology
Dentistry
Economics
Education/Teaching/Training
Engineering (Aviation/Aeronautics/Astronautics)
Engineering (Bioengineering/Biomedical)
Engineering (Chemical)
Engineering (Civil)
Engineering (Computer/Telecommunication)
Engineering (Electrical/Electronic)
Engineering (Environmental/Health/Safety)
Engineering (Industrial)
Engineering (Marine)
Engineering (Material Science)
Engineering (Mechanical)
Engineering (Mechatronic/Electromechanical)
Engineering (Metal Fabrication/Tool & Die/Welding)
Engineering (Mining/Mineral)
Engineering (Petroleum/Oil/Gas)
Engineering (Others)
Finance/Accountancy/Banking
Food & Beverages Services Management
Food Technology/Nutrition/Dietetics
Geographical Science
Geology/Geophysics
History
Hospitality/Tourism/Hotel Management
Human Resource Management
Humanities/Liberal Arts
Journalism
Law
Library Management
Linguistic/Languages
Maritime Studies
Marketing
Mass Communication
Mathematics
Medical Science
Medicine
Music/Performing Arts Studies
Nursing
Optometry
Others
Personal Services
Pharmacy/Pharmacology
Philosophy
Physical Therapy/Physiotherapy
Physics
Political Science
Property Development/Real Estate Management
Protective Services & Management
Psychology
Quantity Survey
Science & Technology
Secretarial
Social Science/Sociology
Sports Science & Management
Textile/Fashion Design
Urban Studies/Town Planning
Veterinary`

r = a.split("\n").map((d)=>{
  return `INSERT INTO ref_wcc_field_study (val) VALUES ('${d.trim()}');`
}).join("\n");

console.log(r)