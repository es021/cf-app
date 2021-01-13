
CREATE TABLE `wp_career_fair`.`ref_id_utm21` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(50)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_id_utm21 (val) VALUES ('UTM21'); 

-- ###############################################################################################
-- ###############################################################################################


CREATE TABLE `wp_career_fair`.`ref_level_study_utm21` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_level_study_utm21 (val) VALUES ('Diploma'); 
INSERT INTO wp_career_fair.ref_level_study_utm21 (val) VALUES ('Degree'); 
INSERT INTO wp_career_fair.ref_level_study_utm21 (val) VALUES ('Master'); 
INSERT INTO wp_career_fair.ref_level_study_utm21 (val) VALUES ('Doctor of Philosophy (PhD)'); 

-- ###############################################################################################
-- ###############################################################################################
CREATE TABLE `wp_career_fair`.`multi_webinar_utm21` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;

CREATE TABLE `wp_career_fair`.`ref_webinar_utm21` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_webinar_utm21 (val) VALUES ('Am I Ready - 31 Jan 2021'); 
INSERT INTO wp_career_fair.ref_webinar_utm21 (val) VALUES ('Career Preparedness for Interview - 31 Jan 2021'); 
INSERT INTO wp_career_fair.ref_webinar_utm21 (val) VALUES ('Microsoft Excel Skills for Employment - 31 Jan 2021 - 2 Feb 2021'); 
INSERT INTO wp_career_fair.ref_webinar_utm21 (val) VALUES ('Freehand Visualization Skills - 1 Feb 2021'); 
INSERT INTO wp_career_fair.ref_webinar_utm21 (val) VALUES ('Kemahiran Penyelesaian Masalah Kompleks dan Kecemerlangan Kerjaya - 1 Feb 2021'); 
INSERT INTO wp_career_fair.ref_webinar_utm21 (val) VALUES ('Strategi Pengurusan Kerjaya Cemerlang dan Pemerkasaan Minda Keusahawanan - 2 Feb 2021'); 
INSERT INTO wp_career_fair.ref_webinar_utm21 (val) VALUES ('HR Analytics Tools: Utilizing MS Excel in HRM - 1 - 3 Feb 2021'); 
INSERT INTO wp_career_fair.ref_webinar_utm21 (val) VALUES ('Walk in Interview - 3 - 6 Feb 2021'); 


-- ###############################################################################################
-- ###############################################################################################

CREATE TABLE `wp_career_fair`.`ref_faculty_utm21` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_faculty_utm21 (val) VALUES ('Faculty of Science (FS)'); 
INSERT INTO wp_career_fair.ref_faculty_utm21 (val) VALUES ('Faculty of Built Environment and Surveying (FAB)'); 
INSERT INTO wp_career_fair.ref_faculty_utm21 (val) VALUES ('Razak Faculty of Technology and Informatics (FTIR)'); 
INSERT INTO wp_career_fair.ref_faculty_utm21 (val) VALUES ('Azman Hashim International Business School (AHIBS)'); 
INSERT INTO wp_career_fair.ref_faculty_utm21 (val) VALUES ('Malaysia-Japan International Institute of Technology (MJIIT)'); 
INSERT INTO wp_career_fair.ref_faculty_utm21 (val) VALUES ('School of Profesional & Continuing Education (SPACE)'); 
INSERT INTO wp_career_fair.ref_faculty_utm21 (val) VALUES ('School of Computing (SOC)'); 
INSERT INTO wp_career_fair.ref_faculty_utm21 (val) VALUES ('School of Civil Engineering (SKA)'); 
INSERT INTO wp_career_fair.ref_faculty_utm21 (val) VALUES ('School of Electrical Engineering (SKE)'); 
INSERT INTO wp_career_fair.ref_faculty_utm21 (val) VALUES ('School of Mechanical Engineering (SKM)'); 
INSERT INTO wp_career_fair.ref_faculty_utm21 (val) VALUES ('School of Chemical and Energy (SKT)'); 
INSERT INTO wp_career_fair.ref_faculty_utm21 (val) VALUES ('School of Bioscience and Medical Engineering (SKBSK)'); 
INSERT INTO wp_career_fair.ref_faculty_utm21 (val) VALUES ('School of Education (SOE)'); 
INSERT INTO wp_career_fair.ref_faculty_utm21 (val) VALUES ('School of HR Development & Psychology (SHARPS)'); 



-- ###############################################################################################
-- ###############################################################################################

CREATE TABLE `wp_career_fair`.`ref_graduation_utm21` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_graduation_utm21 (val) VALUES ('Semester 2 2018/2019'); 
INSERT INTO wp_career_fair.ref_graduation_utm21 (val) VALUES ('Semester 1 2019/2020'); 
INSERT INTO wp_career_fair.ref_graduation_utm21 (val) VALUES ('Semester 2 2019/2020'); 


-- ###############################################################################################
-- ###############################################################################################

CREATE TABLE `wp_career_fair`.`ref_field_study_utm21` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
  `category` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`), INDEX (`category`)) ENGINE = InnoDB;

INSERT IGNORE INTO wp_career_fair.ref_field_study_utm21 (val, category) VALUES ('Chemical Engineering', 'Engineering'); 
INSERT IGNORE INTO wp_career_fair.ref_field_study_utm21 (val, category) VALUES ('Bioscience and Medical Engineering', 'Engineering'); 
INSERT IGNORE INTO wp_career_fair.ref_field_study_utm21 (val, category) VALUES ('Computing Engineering', 'Engineering'); 
INSERT IGNORE INTO wp_career_fair.ref_field_study_utm21 (val, category) VALUES ('Electrical Engineering', 'Engineering'); 
INSERT IGNORE INTO wp_career_fair.ref_field_study_utm21 (val, category) VALUES ('Mechanical Engineering', 'Engineering'); 
INSERT IGNORE INTO wp_career_fair.ref_field_study_utm21 (val, category) VALUES ('Accounting/Finance/Marketing', 'Non Engineering'); 
INSERT IGNORE INTO wp_career_fair.ref_field_study_utm21 (val, category) VALUES ('Admin/Human Resources', 'Non Engineering'); 
INSERT IGNORE INTO wp_career_fair.ref_field_study_utm21 (val, category) VALUES ('Education', 'Non Engineering'); 
INSERT IGNORE INTO wp_career_fair.ref_field_study_utm21 (val, category) VALUES ('Sciences', 'Non Engineering'); 
INSERT IGNORE INTO wp_career_fair.ref_field_study_utm21 (val, category) VALUES ('Others (Please specify in field below)', 'Non Engineering'); 
