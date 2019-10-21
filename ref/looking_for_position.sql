CREATE TABLE `wp_career_fair`.`ref_looking_for_position` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;


-- ###############################################################################################
-- ###############################################################################################

INSERT INTO ref_looking_for_position (val) VALUES ('Full Time'); 
INSERT INTO ref_looking_for_position (val) VALUES ('Part Time'); 
INSERT INTO ref_looking_for_position (val) VALUES ('Internship'); 
