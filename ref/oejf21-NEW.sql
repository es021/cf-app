-- ##################################

CREATE TABLE `ref_year_2020` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_year_2020 (val) VALUES ('Not Applicable'); 
INSERT INTO ref_year_2020 (val) VALUES ('2020'); 
INSERT INTO ref_year_2020 (val) VALUES ('2021'); 
INSERT INTO ref_year_2020 (val) VALUES ('2022'); 
INSERT INTO ref_year_2020 (val) VALUES ('2023'); 
INSERT INTO ref_year_2020 (val) VALUES ('2024'); 
INSERT INTO ref_year_2020 (val) VALUES ('2025'); 
INSERT INTO ref_year_2020 (val) VALUES ('2026'); 
INSERT INTO ref_year_2020 (val) VALUES ('2027'); 
INSERT INTO ref_year_2020 (val) VALUES ('2028'); 
INSERT INTO ref_year_2020 (val) VALUES ('2029'); 
INSERT INTO ref_year_2020 (val) VALUES ('2030'); 



CREATE TABLE `ref_oejf21_qualification` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO `ref_oejf21_qualification` (`ID`, `val`) VALUES
(NULL, 'Primary/Secondary School/SPM/O Level'),
(NULL, 'Higher Secondary/STPM/A Level/Pre-U'),
(NULL, 'Professional Certificate'),
(NULL, 'Diploma'),
(NULL, 'Advanced/Higher/Graduate Diploma'),
(NULL, 'Bachelor\' Degree'),
(NULL, 'Post Graduate Diploma'),
(NULL, 'Professional Degree'),
(NULL, 'Doctorate (PhD)'),
(NULL, 'Master\'s Degree'),
(NULL, 'Others (Please specify in field below)');




CREATE TABLE `ref_oejf21_interested_job` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Application');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Assembly Equipment');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Automation');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Automotive/Motorcycle');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('BIM');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('CAD');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Civil');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Component Mfg Test');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Construction');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Cyber Security & Network');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Debug');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Development');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Electrical');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Electronic');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Energy Project Survey');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Engineering and Maintenance');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Environmental');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Equipment');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Failure Analysis');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Field Technical Support');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Fire & Gas');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Helpdesk Support');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Instrument');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('IoT');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Lab');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Marine');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Marketing');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Material');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Mechanical');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Mechanical Design');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Mechatronic');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Metrology');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('NFVi System Integrator');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('NPI');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Oil & Gas');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Op Feature Enablement');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Planning');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('PLC');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('PM');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Power and Energy');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('PQA');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Process');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Product Marketing');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Product Reliabilty Test');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Production');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Project');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('QA');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('R&D');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Reliability');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Resident');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('RODI/WWTP');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Sales');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Service');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('SMT Process');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Software');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Spare Part');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('System');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Technical');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Test Development');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Vision');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Water Process');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Wire Bond');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Wireless/Microwave Network');
INSERT INTO ref_oejf21_interested_job (val) VALUES ('Others');


CREATE TABLE `multi_oejf21_interested_job` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;