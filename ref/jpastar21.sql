

CREATE TABLE `wp_career_fair`.`ref_jpastar_status` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_jpastar_status (val) VALUES ('Employed'); 
INSERT INTO wp_career_fair.ref_jpastar_status (val) VALUES ('Unemployed'); 
INSERT INTO wp_career_fair.ref_jpastar_status (val) VALUES ('Further Studies'); 



CREATE TABLE `wp_career_fair`.`ref_jpastar_looking_for` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_jpastar_looking_for (val) VALUES ('Full Time'); 
INSERT INTO wp_career_fair.ref_jpastar_looking_for (val) VALUES ('Internship'); 
INSERT INTO wp_career_fair.ref_jpastar_looking_for (val) VALUES ('Webinar'); 
INSERT INTO wp_career_fair.ref_jpastar_looking_for (val) VALUES ('Others'); 
