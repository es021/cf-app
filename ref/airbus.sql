CREATE TABLE `wp_career_fair`.`ref_airbus_looking_for` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT IGNORE INTO wp_career_fair.ref_airbus_looking_for (val) VALUES ('Full Time');
INSERT IGNORE INTO wp_career_fair.ref_airbus_looking_for (val) VALUES ('Internship');
INSERT IGNORE INTO wp_career_fair.ref_airbus_looking_for (val) VALUES ('Fixed Term Contract');




CREATE TABLE `wp_career_fair`.`ref_vcfee_first_job_improvement` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_vcfee_first_job_improvement (val) VALUES ('Aviation Engineering'); 
INSERT INTO wp_career_fair.ref_vcfee_first_job_improvement (val) VALUES ('Customer Services'); 
INSERT INTO wp_career_fair.ref_vcfee_first_job_improvement (val) VALUES ('Supply Chain'); 
INSERT INTO wp_career_fair.ref_vcfee_first_job_improvement (val) VALUES ('Logistics'); 
INSERT INTO wp_career_fair.ref_vcfee_first_job_improvement (val) VALUES ('Supplier Management'); 
INSERT INTO wp_career_fair.ref_vcfee_first_job_improvement (val) VALUES ('Commercial'); 
INSERT INTO wp_career_fair.ref_vcfee_first_job_improvement (val) VALUES ('Technical Customer Services'); 
INSERT INTO wp_career_fair.ref_vcfee_first_job_improvement (val) VALUES ('Part 145 Experience'); 
INSERT INTO wp_career_fair.ref_vcfee_first_job_improvement (val) VALUES ('Airline Structure'); 
INSERT INTO wp_career_fair.ref_vcfee_first_job_improvement (val) VALUES ('Other: Please Specify'); 

CREATE TABLE `wp_career_fair`.`multi_vcfee_first_job_improvement` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;


