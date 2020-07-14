CREATE TABLE `wp_career_fair`.`ref_monash_school` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;


-- ###############################################################################################
-- ###############################################################################################

INSERT INTO wp_career_fair.ref_monash_school (val) VALUES ('Arts And Social Sciences'); 
INSERT INTO wp_career_fair.ref_monash_school (val) VALUES ('Business'); 
INSERT INTO wp_career_fair.ref_monash_school (val) VALUES ('Engineering'); 
INSERT INTO wp_career_fair.ref_monash_school (val) VALUES ('Medicine And Health Sciences'); 
INSERT INTO wp_career_fair.ref_monash_school (val) VALUES ('Pharmacy'); 
INSERT INTO wp_career_fair.ref_monash_school (val) VALUES ('Science'); 