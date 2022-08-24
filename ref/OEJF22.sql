DROP TABLE IF EXISTS `wp_career_fair`.`ref_oejf22_grad_month`;
CREATE TABLE `wp_career_fair`.`ref_oejf22_grad_month` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;
INSERT INTO ref_oejf22_grad_month (ID, val) SELECT ID, val FROM ref_month where val != 'Not Applicable';


DROP TABLE IF EXISTS `wp_career_fair`.`ref_oejf22_grad_year`;
CREATE TABLE `wp_career_fair`.`ref_oejf22_grad_year` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_oejf22_grad_year (ID, val) SELECT ID, val FROM ref_year where val != 'Not Applicable'; 
INSERT INTO ref_oejf22_grad_year (val) VALUES ('Others');


DELETE FROM `ref_oejf21_qualification` WHERE val = 'Others (Please specify in field below)';
INSERT INTO ref_oejf21_qualification (val) VALUES ('Others');

DELETE FROM `ref_oejf21_where_work` WHERE val = 'Singapore';

DROP TABLE IF EXISTS `wp_career_fair`.`ref_oejf22_work_availability_year`;
CREATE TABLE `wp_career_fair`.`ref_oejf22_work_availability_year` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_oejf22_work_availability_year (val) VALUES ('2022');
INSERT INTO ref_oejf22_work_availability_year (val) VALUES ('2023');
INSERT INTO ref_oejf22_work_availability_year (val) VALUES ('2024');
INSERT INTO ref_oejf22_work_availability_year (val) VALUES ('2025');
INSERT INTO ref_oejf22_work_availability_year (val) VALUES ('2026');
INSERT INTO ref_oejf22_work_availability_year (val) VALUES ('2027');
INSERT INTO ref_oejf22_work_availability_year (val) VALUES ('2028');
INSERT INTO ref_oejf22_work_availability_year (val) VALUES ('2029');
INSERT INTO ref_oejf22_work_availability_year (val) VALUES ('2030');
INSERT INTO ref_oejf22_work_availability_year (val) VALUES ('Others');


DROP TABLE IF EXISTS `wp_career_fair`.`ref_oejf21_where_work_oversea`;
CREATE TABLE `wp_career_fair`.`ref_oejf21_where_work_oversea` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_oejf21_where_work_oversea (val) VALUES ('Singapore');
INSERT INTO ref_oejf21_where_work_oversea (val) VALUES ('Taiwan');
INSERT INTO ref_oejf21_where_work_oversea (val) VALUES ('Thailand');
INSERT INTO ref_oejf21_where_work_oversea (val) VALUES ('Vietnam');
INSERT INTO ref_oejf21_where_work_oversea (val) VALUES ('Others');


CREATE TABLE `wp_career_fair`.`multi_oejf21_where_work_oversea` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;




