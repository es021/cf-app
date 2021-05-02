
CREATE TABLE `wp_career_fair`.`multi_sunway_purpose` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;

CREATE TABLE `wp_career_fair`.`ref_sunway_purpose` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_sunway_purpose (val) VALUES ('Full-Time Job'); 
INSERT INTO wp_career_fair.ref_sunway_purpose (val) VALUES ('Part-Time Job'); 
INSERT INTO wp_career_fair.ref_sunway_purpose (val) VALUES ('Webinar'); 
INSERT INTO wp_career_fair.ref_sunway_purpose (val) VALUES ('Others'); 



TRUNCATE TABLE wp_career_fair.ref_sunway_faculty
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('American Degree Transfer Program (ADTP)');
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('School of Arts');
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('School of Engineering & Technology');
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('School of Hospitality & Services Management');
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('School of Mathematical Sciences');
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('School of Medical Life Sciences');
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Sunway Diploma Studies');
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Sunway TES Centre For Accountancy Excellence');
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Sunway University Business School');
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Victoria University Bachelor of Business Programme');


-- ###############################################################
CREATE TABLE `wp_career_fair`.`ref_sunwaygrd21_program` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Accounting and Finance');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Advertising and Branding');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Business Analytics');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Actuarial Studies');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('American Degree Transfer Program');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Biology with Psychology');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Biomedicine');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Business Management');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Business Studies');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Communication');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Computer Science');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Contemporary Music (Audio Technology)');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Conventions and Events Management');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Culinary Arts');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Culinary Management');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Design Communication');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Digital Film Production');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Entrepreneurship');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Events Management');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Finance');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Financial Analysis');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Financial Economics');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Financial Risk Management');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Graphic & Multimedia Design');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Global Supply Chain Management');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Hotel Management');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Industrial Statistics');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Information Systems (Data Analytics)');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Information Technology');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Information Technology (Computer Networking and Security)');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Interior Architecture');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('International Business');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Interior Design');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('International Hospitality Management');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('International Trade');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Management & Innovation');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Marketing');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Medical Biotechnology');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Mobile Computing with Entrepreneurship');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Music Performance');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Nursing');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Performing Arts');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Psychology');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Software Engineering');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Supply Chain & Logistics Management');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('ACCA');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('ICAEW');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('CPA Australia');
INSERT INTO wp_career_fair.ref_sunwaygrd21_program (val) VALUES ('Other');