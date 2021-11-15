CREATE TABLE `wp_career_fair`.`ref_interested_job_location_my_sg` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;


INSERT INTO ref_interested_job_location_my_sg (val) VALUES ('Johor'); 
INSERT INTO ref_interested_job_location_my_sg (val) VALUES ('Kedah'); 
INSERT INTO ref_interested_job_location_my_sg (val) VALUES ('Kelantan'); 
INSERT INTO ref_interested_job_location_my_sg (val) VALUES ('Melaka'); 
INSERT INTO ref_interested_job_location_my_sg (val) VALUES ('Negeri Sembilan'); 
INSERT INTO ref_interested_job_location_my_sg (val) VALUES ('Pahang'); 
INSERT INTO ref_interested_job_location_my_sg (val) VALUES ('Pulau Pinang'); 
INSERT INTO ref_interested_job_location_my_sg (val) VALUES ('Perak'); 
INSERT INTO ref_interested_job_location_my_sg (val) VALUES ('Perlis'); 
INSERT INTO ref_interested_job_location_my_sg (val) VALUES ('Selangor'); 
INSERT INTO ref_interested_job_location_my_sg (val) VALUES ('Terengganu'); 
INSERT INTO ref_interested_job_location_my_sg (val) VALUES ('Sabah'); 
INSERT INTO ref_interested_job_location_my_sg (val) VALUES ('Sarawak'); 
INSERT INTO ref_interested_job_location_my_sg (val) VALUES ('Kuala Lumpur'); 
INSERT INTO ref_interested_job_location_my_sg (val) VALUES ('Labuan'); 
INSERT INTO ref_interested_job_location_my_sg (val) VALUES ('Putrajaya'); 
INSERT INTO ref_interested_job_location_my_sg (val) VALUES ('Singapore'); 


-- ###############################################################################################
-- ###############################################################################################
 

CREATE TABLE `wp_career_fair`.`ref_ocpe_graduation` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_ocpe_graduation (val) VALUES ('2016-2021'); 
INSERT INTO wp_career_fair.ref_ocpe_graduation (val) VALUES ('2010-2015'); 
INSERT INTO wp_career_fair.ref_ocpe_graduation (val) VALUES ('2009-2014'); 
INSERT INTO wp_career_fair.ref_ocpe_graduation (val) VALUES ('2003-2008'); 
INSERT INTO wp_career_fair.ref_ocpe_graduation (val) VALUES ('1997-2002'); 
INSERT INTO wp_career_fair.ref_ocpe_graduation (val) VALUES ('1991-1996'); 
INSERT INTO wp_career_fair.ref_ocpe_graduation (val) VALUES ('1979-1984'); 
INSERT INTO wp_career_fair.ref_ocpe_graduation (val) VALUES ('Other'); 

-- ###############################################################################################
-- ###############################################################################################

CREATE TABLE `wp_career_fair`.`ref_ocpe_work_availability` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_ocpe_work_availability (val) VALUES ('Dec/21'); 
INSERT INTO wp_career_fair.ref_ocpe_work_availability (val) VALUES ('Jan/22'); 
INSERT INTO wp_career_fair.ref_ocpe_work_availability (val) VALUES ('Feb/22'); 
INSERT INTO wp_career_fair.ref_ocpe_work_availability (val) VALUES ('Mar/22'); 
INSERT INTO wp_career_fair.ref_ocpe_work_availability (val) VALUES ('Apr/22'); 
INSERT INTO wp_career_fair.ref_ocpe_work_availability (val) VALUES ('May/22'); 
INSERT INTO wp_career_fair.ref_ocpe_work_availability (val) VALUES ('Jun/22'); 
INSERT INTO wp_career_fair.ref_ocpe_work_availability (val) VALUES ('Jul/22'); 
INSERT INTO wp_career_fair.ref_ocpe_work_availability (val) VALUES ('Aug/22'); 
INSERT INTO wp_career_fair.ref_ocpe_work_availability (val) VALUES ('Sep/22'); 
INSERT INTO wp_career_fair.ref_ocpe_work_availability (val) VALUES ('Oct/22'); 
INSERT INTO wp_career_fair.ref_ocpe_work_availability (val) VALUES ('Nov/22'); 
INSERT INTO wp_career_fair.ref_ocpe_work_availability (val) VALUES ('Dec/22'); 


-- ###############################################################################################
-- ###############################################################################################

CREATE TABLE `wp_career_fair`.`ref_ocpe_work_experience` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_ocpe_work_experience (val) VALUES ('0-2 years'); 
INSERT INTO wp_career_fair.ref_ocpe_work_experience (val) VALUES ('3-5 years'); 
INSERT INTO wp_career_fair.ref_ocpe_work_experience (val) VALUES ('6-10 years'); 
INSERT INTO wp_career_fair.ref_ocpe_work_experience (val) VALUES ('11-15 years'); 
INSERT INTO wp_career_fair.ref_ocpe_work_experience (val) VALUES ('More than 16 years'); 


-- ###############################################################################################
-- ###############################################################################################

CREATE TABLE `wp_career_fair`.`ref_ocpe_reference` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_ocpe_reference (val) VALUES ('Event'); 
INSERT INTO wp_career_fair.ref_ocpe_reference (val) VALUES ('e-Poster'); 
INSERT INTO wp_career_fair.ref_ocpe_reference (val) VALUES ('Email'); 
INSERT INTO wp_career_fair.ref_ocpe_reference (val) VALUES ('Facebook'); 
INSERT INTO wp_career_fair.ref_ocpe_reference (val) VALUES ('Friend'); 
INSERT INTO wp_career_fair.ref_ocpe_reference (val) VALUES ('Instagram'); 
INSERT INTO wp_career_fair.ref_ocpe_reference (val) VALUES ('LinkedIn'); 
INSERT INTO wp_career_fair.ref_ocpe_reference (val) VALUES ('Radio'); 
INSERT INTO wp_career_fair.ref_ocpe_reference (val) VALUES ('WhatsApp'); 
INSERT INTO wp_career_fair.ref_ocpe_reference (val) VALUES ('Phone Call'); 
INSERT INTO wp_career_fair.ref_ocpe_reference (val) VALUES ('Others'); 



CREATE TABLE `wp_career_fair`.`multi_interested_job_location_my_sg` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;


