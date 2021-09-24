

CREATE TABLE `wp_career_fair`.`ref_faculty_utmiv21` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_faculty_utmiv21 (val) VALUES ('FSSH - School of Education'); 
INSERT INTO wp_career_fair.ref_faculty_utmiv21 (val) VALUES ('FSSH - School of HR Development and Psychology'); 
INSERT INTO wp_career_fair.ref_faculty_utmiv21 (val) VALUES ('FE - School of Computing'); 
INSERT INTO wp_career_fair.ref_faculty_utmiv21 (val) VALUES ('FE - School of Civil Engineering'); 
INSERT INTO wp_career_fair.ref_faculty_utmiv21 (val) VALUES ('FE - School of Electrical Engineering'); 
INSERT INTO wp_career_fair.ref_faculty_utmiv21 (val) VALUES ('FE - School of Mechanical Engineering'); 
INSERT INTO wp_career_fair.ref_faculty_utmiv21 (val) VALUES ('FE - School of Chemical and Energy Engineering'); 
INSERT INTO wp_career_fair.ref_faculty_utmiv21 (val) VALUES ('FE - School of Bioscience and Medical Engineering'); 
INSERT INTO wp_career_fair.ref_faculty_utmiv21 (val) VALUES ('Faculty of Science (FS)'); 
INSERT INTO wp_career_fair.ref_faculty_utmiv21 (val) VALUES ('Faculty of Build Environment and Surveying (FABU)'); 
INSERT INTO wp_career_fair.ref_faculty_utmiv21 (val) VALUES ('Azman Hashim International Business School  (AHIBS)'); 
INSERT INTO wp_career_fair.ref_faculty_utmiv21 (val) VALUES ('Razak Faculty of Technology and Informatics (FTIR)'); 
INSERT INTO wp_career_fair.ref_faculty_utmiv21 (val) VALUES ('Malaysia-Japan International Institute of Technology (MJIIT)'); 
INSERT INTO wp_career_fair.ref_faculty_utmiv21 (val) VALUES ('School of Profesional & Continuing Education (SPACE)'); 


CREATE TABLE `wp_career_fair`.`ref_level_of_study_utmiv21` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_level_of_study_utmiv21 (val) VALUES ('Diploma'); 
INSERT INTO wp_career_fair.ref_level_of_study_utmiv21 (val) VALUES ('Degree'); 
INSERT INTO wp_career_fair.ref_level_of_study_utmiv21 (val) VALUES ('PhD'); 

