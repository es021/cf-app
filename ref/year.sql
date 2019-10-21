CREATE TABLE `wp_career_fair`.`ref_year` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;


-- ###############################################################################################
-- ###############################################################################################

INSERT INTO wp_career_fair.ref_year (val) VALUES ('2018'); 
INSERT INTO wp_career_fair.ref_year (val) VALUES ('2019'); 
INSERT INTO wp_career_fair.ref_year (val) VALUES ('2020'); 
INSERT INTO wp_career_fair.ref_year (val) VALUES ('2021'); 
INSERT INTO wp_career_fair.ref_year (val) VALUES ('2022'); 
INSERT INTO wp_career_fair.ref_year (val) VALUES ('2023'); 
INSERT INTO wp_career_fair.ref_year (val) VALUES ('2024'); 
INSERT INTO wp_career_fair.ref_year (val) VALUES ('2025'); 