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
Engineering (Environmental/Health/Safety
Engineering (Industrial)
Engineering (Marine)
Engineering (Material Science)
Engineering (Mechanical)
Engineering (Mechatronic/Electromechanical)
Engineering (Metal Fabrication/Tool & Die/Welding)
Engineering (Mining/Mineral)
Engineering (Others)
Engineering (Petroleum/Oil/Gas)
Finance/Accountancy/Banking
Food & Beverage Services Management
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
Logistic/Transportation
Maritime Studies
Marketing
Mass Communications
Mathematics
Medical Science
Medicine
Music/Performing Arts Studies
Nursing
Optometry
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
Veterinary
Others`;

String.prototype.replaceAll = function(
  search,
  replacement,
  ignoreCase = false
) {
  var i = ignoreCase ? "i" : "";
  var target = this;
  return target.replace(new RegExp(search, `${i}g`), replacement);
};

function toDashFormat(str) {
    str = str.replaceAll("&", "");

  let arr = str.toLowerCase().split(" ");
  let r = "";
  for (var i in arr) {
    if (i > 0) {
      r += "-";
    }
    r += arr[i];
  }

  r = r.replaceAll("/", "-");
  r = r.replaceAll(",", "-");
  r = r.replace("(", "");
  r = r.replace(")", "");
  r = r.replaceAll("--", "-");

  return r;
}

sql = "insert into wp_career_fair.ref_field_study (val, category) VALUES ";
arr = a.split("\n");
for (var i in arr) {
  let label = arr[i];
  let category = toDashFormat(label);
  sql += ` ('${label}','${category}'), \n`;
}

console.log(sql);
