
CREATE TABLE `wp_career_fair`.`multi_sunway_purpose` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;

CREATE TABLE `wp_career_fair`.`ref_sunway_purpose` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_sunway_purpose (val) VALUES ('Full-Time Job'); 
INSERT INTO wp_career_fair.ref_sunway_purpose (val) VALUES ('Part-Time Job'); 
INSERT INTO wp_career_fair.ref_sunway_purpose (val) VALUES ('Webinar'); 
INSERT INTO wp_career_fair.ref_sunway_purpose (val) VALUES ('Others'); 



TRUNCATE TABLE wp_career_fair.ref_sunway_faculty
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('American Degree Transfer Program (ADTP)');
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('School of Arts');
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('School of Engineering & Technology');
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('School of Hospitality & Services Management');
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('School of Mathematical Sciences');
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('School of Medical Life Sciences');
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Sunway Diploma Studies');
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Sunway TES Centre For Accountancy Excellence');
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Sunway University Business School');
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Victoria University Bachelor of Business Programme');



