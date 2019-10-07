obj = [
  {
    "id": "computer_science",
    "label": "Computer Science",
    "children": [
      "Computer Programming",
      "Program design",
      "Computer Systems analysis",
      "Fundamentals of Hardware",
      "Networking",
      "Computer Architecture",
      "Professional Awareness",
      "Mathematics for Computing",
      "Introduction to Databases",
      "Academic skills for computing",
      "Introduction to Software Engineering",
      "Software Requirements & Modeling",
      "Software Design & Construction",
      "Software Testing, Verification, and Validation",
      "Software Quality Assurance",
      "Software Project Management",
      "Software Configuration Management",
      "Fundamentals of Programming",
      "Data Structures",
      "Introduction to Algorithms",
      "Operating Systems",
      "Programming Languages",
      "Human - Computer Interaction",
      "Discrete Mathematics",
      "Database Designing",
      "Probability & Statistics",
      "Calculus I",
      "Calculus II",
      "Calculus III",
      "Linear Algebra",
      "Boolean Algebra"
    ]
  }
]

String.prototype.capitalizeAll = function() {
	let arr = this.split(" ");

	let toRet = "";
	for (var i in arr) {
		if (i > 0) {
			toRet += " ";
		}
		toRet += arr[i].capitalize();
	}
	return toRet;
};

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

sql = "insert into wp_career_fair.ref_relevant_course (val, category) VALUES ";
for (var i in obj) {
	let o = obj[i];
	let id = o.id;
	let label = o.label;
  let children = o.children;
  let inserted = [];
	for (var k in children) {
    let c = children[k];
    if(inserted.indexOf(c)>=0){
      continue;
    }
    sql += ` ('${c.capitalizeAll()}','${id}'), \n` ;
    inserted.push(c);
  }
}

console.log(sql);