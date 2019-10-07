
-- select count(*) c, val , 
-- GROUP_CONCAT(category SEPARATOR ', '), GROUP_CONCAT(ID SEPARATOR ', ') from 
-- wp_career_fair.ref_course
-- group by val having c > 1

CREATE TABLE `wp_career_fair`.`ref_course` 
( `ID` INT NOT NULL AUTO_INCREMENT , 
 `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
 `category` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
PRIMARY KEY (`ID`), UNIQUE(`val`,`category`), INDEX (`val`), INDEX (`category`)) ENGINE = InnoDB;

-- ################################################################################################################
-- ################################################################################################################
-- ################################################################################################################
-- ################################################################################################################

insert into wp_career_fair.ref_course (val, category) VALUES  
('Computer Programming','computer_science'), 
 ('Program Design','computer_science'), 
 ('Computer Systems Analysis','computer_science'), 
 ('Fundamentals Of Hardware','computer_science'), 
 ('Networking','computer_science'), 
 ('Computer Architecture','computer_science'), 
 ('Professional Awareness','computer_science'), 
 ('Mathematics For Computing','computer_science'), 
 ('Introduction To Databases','computer_science'), 
 ('Academic Skills For Computing','computer_science'), 
 ('Introduction To Software Engineering','computer_science'), 
 ('Software Requirements & Modeling','computer_science'), 
 ('Software Design & Construction','computer_science'), 
 ('Software Testing, Verification, And Validation','computer_science'), 
 ('Software Quality Assurance','computer_science'), 
 ('Software Project Management','computer_science'), 
 ('Software Configuration Management','computer_science'), 
 ('Fundamentals Of Programming','computer_science'), 
 ('Data Structures','computer_science'), 
 ('Introduction To Algorithms','computer_science'), 
 ('Operating Systems','computer_science'), 
 ('Programming Languages','computer_science'), 
 ('Human - Computer Interaction','computer_science'), 
 ('Discrete Mathematics','computer_science'), 
 ('Database Designing','computer_science'), 
 ('Probability & Statistics','computer_science'), 
 ('Calculus I','computer_science'), 
 ('Calculus II','computer_science'), 
 ('Calculus III','computer_science'), 
 ('Linear Algebra','computer_science'), 
 ('Boolean Algebra','computer_science')


