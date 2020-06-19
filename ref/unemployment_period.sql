CREATE TABLE `wp_career_fair`.`ref_unemployment_period` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;


-- ###############################################################################################
-- ###############################################################################################

INSERT INTO wp_career_fair.ref_unemployment_period (val) VALUES ('Currently Employed'); 
INSERT INTO wp_career_fair.ref_unemployment_period (val) VALUES ('0 - 3 months'); 
INSERT INTO wp_career_fair.ref_unemployment_period (val) VALUES ('4 - 6 months'); 
INSERT INTO wp_career_fair.ref_unemployment_period (val) VALUES ('6 - 12 months'); 
INSERT INTO wp_career_fair.ref_unemployment_period (val) VALUES ('1 - 2 years'); 
INSERT INTO wp_career_fair.ref_unemployment_period (val) VALUES ('More than 2 years'); 
