CREATE TABLE `wp_career_fair`.`ref_gender` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;


-- ###############################################################################################
-- ###############################################################################################

INSERT INTO wp_career_fair.ref_gender (val) VALUES ('Male'); 
INSERT INTO wp_career_fair.ref_gender (val) VALUES ('Female'); 
INSERT INTO wp_career_fair.ref_gender (val) VALUES ('Preferred not to disclosed'); 