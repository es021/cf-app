CREATE TABLE `wp_career_fair`.`ref_yes_no` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_yes_no (val) VALUES ('Yes'); 
INSERT INTO wp_career_fair.ref_yes_no (val) VALUES ('No'); 
