CREATE TABLE `wp_career_fair`.`multi_tarucjul21_purpose` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;

CREATE TABLE `wp_career_fair`.`ref_tarucjul21_purpose` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_tarucjul21_purpose (val) VALUES ('Full-Time'); 
INSERT INTO wp_career_fair.ref_tarucjul21_purpose (val) VALUES ('Internship'); 
INSERT INTO wp_career_fair.ref_tarucjul21_purpose (val) VALUES ('Networking'); 

-- ###########

CREATE TABLE `wp_career_fair`.`multi_tarucjul21_interested_intern_location` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;


-- #############

CREATE TABLE `wp_career_fair`.`ref_tarucjul21_current_year` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_tarucjul21_current_year (val) VALUES ('Year 1'); 
INSERT INTO wp_career_fair.ref_tarucjul21_current_year (val) VALUES ('Year 2'); 
INSERT INTO wp_career_fair.ref_tarucjul21_current_year (val) VALUES ('Year 3'); 
INSERT INTO wp_career_fair.ref_tarucjul21_current_year (val) VALUES ('Year 4'); 
INSERT INTO wp_career_fair.ref_tarucjul21_current_year (val) VALUES ('Not Applicable'); 

-- #############

CREATE TABLE `wp_career_fair`.`ref_tarucjul21_current_semester` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_tarucjul21_current_semester (val) VALUES ('Semester 1'); 
INSERT INTO wp_career_fair.ref_tarucjul21_current_semester (val) VALUES ('Semester 2'); 
INSERT INTO wp_career_fair.ref_tarucjul21_current_semester (val) VALUES ('Semester 3'); 
INSERT INTO wp_career_fair.ref_tarucjul21_current_semester (val) VALUES ('Not Applicable'); 





-- #############
CREATE TABLE `wp_career_fair`.`ref_tarucjul21_programme` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor in Public Relations (Honours) - Penang Branch Campus');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Accounting (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Arts (Honours) English with Drama');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Arts (Honours) English with Education');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Arts in English Studies (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Banking and Finance (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Business (Honours) Accounting and Finance');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Business (Honours) in Entrepreneurship');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Business (Honours) in Human Resource Management');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Business (Honours) in International Business');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Business (Honours) in Logistics and Supply Chain Management');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Business (Honours) in Marketing');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Business (Honours) International Business Management');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Business Administration (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Commerce (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Communication (Honours) in Advertising');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Communication (Honours) in Broadcasting');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Communication (Honours) in Journalism');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Communication (Honours) in Media Studies');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Communication Studies (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Computer Science (Honours) in Data Science');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Computer Science (Honours) in Interactive Software Technology');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Computer Science (Honours) in Software Engineering');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Construction Management and Economics (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Corporate Administration (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Creative Multimedia (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Design (Honours) in Fashion Design');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Design (Honours) in Graphic Design');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Early Childhood Education (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Economics (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Electrical and Electronics Engineering with Honours');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Finance (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Finance and Investment (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Hospitality and Catering Management (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor Of Hospitality Management (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Information Systems (Honours) in Enterprise Information Systems');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Information Technology (Honours) in Information Security');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Information Technology (Honours) in Internet Technology');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Information Technology (Honours) in Software Systems Development');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Interior Architecture (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Mechanical Engineering with Honours');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Mechatronics Engineering with Honours');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Public Relations (Honours) - Kuala Lumpur Main Campus');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Quantity Surveying (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Real Estate Management(Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Retail Management (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Science (Honours) in Management Mathematics with Computing');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Science (Hons) in Analytical Chemistry');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Science (Hons) in Applied Physics (Instrumentation)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Science (Hons) in Bioscience with Chemistry');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Science (Hons) in Food Science');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Science (Hons) in Sports and Exercise Science');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Science in Architecture (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Social Science (Honours) in Psychology');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Telecommunication Engineering with Honours');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Tourism Management (Honours)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Bachelor of Tourism Management (Honours) Event Management');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Accounting');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Advertising');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma In Aquaculture');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Banking and Finance');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Banking and Finance (Sabah campus)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Broadcast Communication');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Building');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Business Administration');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Business Economics');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Communication and Media Studies');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Computer Science');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Computer Science (Data Science)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Counselling');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Culinary Arts');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in E-Marketing');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Entrepreneurship');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Event Management');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Finance and Investment');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Food Science');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Hotel Management (DHM)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Hotel Management (DHT)');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Human Resource Management');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Information Systems');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Information Technology');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in International Business');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Journalism');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Logistics and Supply Chain Management');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Marketing');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Media Studies');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Public Relations');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Quantity Surveying');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Real Estate Management');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Retail Management');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Science');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Software Engineering');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Sport and Exercise Science');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma in Tourism Management');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma of Electronic Engineering');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma of Mechanical Engineering');
INSERT INTO ref_tarucjul21_programme (val) VALUES ('Diploma of Mechatronic Engineering');

-- #############

CREATE TABLE `wp_career_fair`.`ref_tarucjul21_faculty` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_tarucjul21_faculty (val) VALUES ('Faculty of Accountancy, Finance & Business'); 
INSERT INTO wp_career_fair.ref_tarucjul21_faculty (val) VALUES ('Faculty of Computing & IT'); 
INSERT INTO wp_career_fair.ref_tarucjul21_faculty (val) VALUES ('Faculty of Applied Sciences'); 
INSERT INTO wp_career_fair.ref_tarucjul21_faculty (val) VALUES ('Faculty of Built Environment'); 
INSERT INTO wp_career_fair.ref_tarucjul21_faculty (val) VALUES ('Faculty of Engineering & Technology'); 
INSERT INTO wp_career_fair.ref_tarucjul21_faculty (val) VALUES ('Faculty of Communication & Creative Industries'); 
INSERT INTO wp_career_fair.ref_tarucjul21_faculty (val) VALUES ('Faculty of Social Science & Humanities'); 

-- #############

CREATE TABLE `wp_career_fair`.`ref_tarucjul21_campus` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_tarucjul21_campus (val) VALUES ('Kuala Lumpur (Main Campus)'); 
INSERT INTO wp_career_fair.ref_tarucjul21_campus (val) VALUES ('Penang Branch Campus'); 
INSERT INTO wp_career_fair.ref_tarucjul21_campus (val) VALUES ('Perak Branch Campus'); 
INSERT INTO wp_career_fair.ref_tarucjul21_campus (val) VALUES ('Johor Branch Campus'); 
INSERT INTO wp_career_fair.ref_tarucjul21_campus (val) VALUES ('Pahang Branch'); 
INSERT INTO wp_career_fair.ref_tarucjul21_campus (val) VALUES ('Sabah Branch'); 
INSERT INTO wp_career_fair.ref_tarucjul21_campus (val) VALUES ('Not Applicable'); 









