CREATE TABLE `wp_career_fair`.`ref_work_experience_year` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;


-- ###############################################################################################
-- ###############################################################################################

INSERT INTO wp_career_fair.ref_work_experience_year (val) VALUES ('0 to 2 years'); 
INSERT INTO wp_career_fair.ref_work_experience_year (val) VALUES ('2 to 5 years'); 
INSERT INTO wp_career_fair.ref_work_experience_year (val) VALUES ('5 to 7 years'); 
INSERT INTO wp_career_fair.ref_work_experience_year (val) VALUES ('7 to 10 years'); 
INSERT INTO wp_career_fair.ref_work_experience_year (val) VALUES ('10 years and above'); 