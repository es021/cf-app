CREATE TABLE `wp_career_fair`.`ref_yes_no` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_yes_no (val) VALUES ('Yes'); 
INSERT INTO wp_career_fair.ref_yes_no (val) VALUES ('No'); 








CREATE TABLE `wp_career_fair`.`ref_intel_reference` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;
INSERT INTO wp_career_fair.ref_intel_reference (val) VALUES ('Social Media');
INSERT INTO wp_career_fair.ref_intel_reference (val) VALUES ('Email');
INSERT INTO wp_career_fair.ref_intel_reference (val) VALUES ('Intel Employees');
INSERT INTO wp_career_fair.ref_intel_reference (val) VALUES ('Others');


CREATE TABLE `wp_career_fair`.`multi_intel_reference` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;
