

CREATE TABLE `wp_career_fair`.`ref_age_group` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_age_group (val) VALUES ('Below 20'); 
INSERT INTO wp_career_fair.ref_age_group (val) VALUES ('20 - 24'); 
INSERT INTO wp_career_fair.ref_age_group (val) VALUES ('25 - 29'); 
INSERT INTO wp_career_fair.ref_age_group (val) VALUES ('30 - 34'); 
INSERT INTO wp_career_fair.ref_age_group (val) VALUES ('35 - 39'); 
INSERT INTO wp_career_fair.ref_age_group (val) VALUES ('40 - 44'); 
INSERT INTO wp_career_fair.ref_age_group (val) VALUES ('45 - 49'); 
INSERT INTO wp_career_fair.ref_age_group (val) VALUES ('50 and above'); 

-- ################################################################################
-- ################################################################################
-- ################################################################################

CREATE TABLE `wp_career_fair`.`ref_wcc_iam` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_wcc_iam (val) VALUES ('A fresh graduate'); 
INSERT INTO wp_career_fair.ref_wcc_iam (val) VALUES ('Currently on a career break'); 
INSERT INTO wp_career_fair.ref_wcc_iam (val) VALUES ('A senior talent (50 and above)'); 
INSERT INTO wp_career_fair.ref_wcc_iam (val) VALUES ('A Malaysian diaspora (graduates)'); 
INSERT INTO wp_career_fair.ref_wcc_iam (val) VALUES ('A Malaysian diaspora (professionals)'); 
INSERT INTO wp_career_fair.ref_wcc_iam (val) VALUES ('Others (Please specify in field below)'); 

-- ################################################################################
-- ################################################################################
-- ################################################################################

CREATE TABLE `wp_career_fair`.`ref_wcc_graduate_year` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('Not Applicable');
INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('1981');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('1982');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('1983');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('1984');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('1985');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('1986');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('1987');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('1988');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('1989');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('1990');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('1991');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('1992');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('1993');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('1994');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('1995');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('1996');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('1997');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('1998');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('1999');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2000');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2001');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2002');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2003');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2004');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2005');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2006');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2007');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2008');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2009');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2010');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2011');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2012');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2013');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2014');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2015');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2016');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2017');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2018');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2019');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2020');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2021');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2022');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2023');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2024');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2025');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2026');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2027');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2028');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2029');

INSERT INTO wp_career_fair.ref_wcc_graduate_year (val) VALUES ('2030');
-- ################################################################################
-- ################################################################################
-- ################################################################################

CREATE TABLE `wp_career_fair`.`ref_wcc_field_study` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_wcc_field_study (val) VALUES ('Advertising/Media');
INSERT INTO ref_wcc_field_study (val) VALUES ('Agriculture/Aquaculture/Forestry');
INSERT INTO ref_wcc_field_study (val) VALUES ('Architecture');
INSERT INTO ref_wcc_field_study (val) VALUES ('Art/Design/Creative Multimedia');
INSERT INTO ref_wcc_field_study (val) VALUES ('Biology');
INSERT INTO ref_wcc_field_study (val) VALUES ('Biotechnology');
INSERT INTO ref_wcc_field_study (val) VALUES ('Business Studies/Administration/Management');
INSERT INTO ref_wcc_field_study (val) VALUES ('Chemistry');
INSERT INTO ref_wcc_field_study (val) VALUES ('Commerce');
INSERT INTO ref_wcc_field_study (val) VALUES ('Computer Science/Information Technology');
INSERT INTO ref_wcc_field_study (val) VALUES ('Dentistry');
INSERT INTO ref_wcc_field_study (val) VALUES ('Economics');
INSERT INTO ref_wcc_field_study (val) VALUES ('Education/Teaching/Training');
INSERT INTO ref_wcc_field_study (val) VALUES ('Engineering (Aviation/Aeronautics/Astronautics)');
INSERT INTO ref_wcc_field_study (val) VALUES ('Engineering (Bioengineering/Biomedical)');
INSERT INTO ref_wcc_field_study (val) VALUES ('Engineering (Chemical)');
INSERT INTO ref_wcc_field_study (val) VALUES ('Engineering (Civil)');
INSERT INTO ref_wcc_field_study (val) VALUES ('Engineering (Computer/Telecommunication)');
INSERT INTO ref_wcc_field_study (val) VALUES ('Engineering (Electrical/Electronic)');
INSERT INTO ref_wcc_field_study (val) VALUES ('Engineering (Environmental/Health/Safety)');
INSERT INTO ref_wcc_field_study (val) VALUES ('Engineering (Industrial)');
INSERT INTO ref_wcc_field_study (val) VALUES ('Engineering (Marine)');
INSERT INTO ref_wcc_field_study (val) VALUES ('Engineering (Material Science)');
INSERT INTO ref_wcc_field_study (val) VALUES ('Engineering (Mechanical)');
INSERT INTO ref_wcc_field_study (val) VALUES ('Engineering (Mechatronic/Electromechanical)');
INSERT INTO ref_wcc_field_study (val) VALUES ('Engineering (Metal Fabrication/Tool & Die/Welding)');
INSERT INTO ref_wcc_field_study (val) VALUES ('Engineering (Mining/Mineral)');
INSERT INTO ref_wcc_field_study (val) VALUES ('Engineering (Petroleum/Oil/Gas)');
INSERT INTO ref_wcc_field_study (val) VALUES ('Engineering (Others)');
INSERT INTO ref_wcc_field_study (val) VALUES ('Finance/Accountancy/Banking');
INSERT INTO ref_wcc_field_study (val) VALUES ('Food & Beverages Services Management');
INSERT INTO ref_wcc_field_study (val) VALUES ('Food Technology/Nutrition/Dietetics');
INSERT INTO ref_wcc_field_study (val) VALUES ('Geographical Science');
INSERT INTO ref_wcc_field_study (val) VALUES ('Geology/Geophysics');
INSERT INTO ref_wcc_field_study (val) VALUES ('History');
INSERT INTO ref_wcc_field_study (val) VALUES ('Hospitality/Tourism/Hotel Management');
INSERT INTO ref_wcc_field_study (val) VALUES ('Human Resource Management');
INSERT INTO ref_wcc_field_study (val) VALUES ('Humanities/Liberal Arts');
INSERT INTO ref_wcc_field_study (val) VALUES ('Journalism');
INSERT INTO ref_wcc_field_study (val) VALUES ('Law');
INSERT INTO ref_wcc_field_study (val) VALUES ('Library Management');
INSERT INTO ref_wcc_field_study (val) VALUES ('Linguistic/Languages');
INSERT INTO ref_wcc_field_study (val) VALUES ('Maritime Studies');
INSERT INTO ref_wcc_field_study (val) VALUES ('Marketing');
INSERT INTO ref_wcc_field_study (val) VALUES ('Mass Communication');
INSERT INTO ref_wcc_field_study (val) VALUES ('Mathematics');
INSERT INTO ref_wcc_field_study (val) VALUES ('Medical Science');
INSERT INTO ref_wcc_field_study (val) VALUES ('Medicine');
INSERT INTO ref_wcc_field_study (val) VALUES ('Music/Performing Arts Studies');
INSERT INTO ref_wcc_field_study (val) VALUES ('Nursing');
INSERT INTO ref_wcc_field_study (val) VALUES ('Optometry');
INSERT INTO ref_wcc_field_study (val) VALUES ('Others');
INSERT INTO ref_wcc_field_study (val) VALUES ('Personal Services');
INSERT INTO ref_wcc_field_study (val) VALUES ('Pharmacy/Pharmacology');
INSERT INTO ref_wcc_field_study (val) VALUES ('Philosophy');
INSERT INTO ref_wcc_field_study (val) VALUES ('Physical Therapy/Physiotherapy');
INSERT INTO ref_wcc_field_study (val) VALUES ('Physics');
INSERT INTO ref_wcc_field_study (val) VALUES ('Political Science');
INSERT INTO ref_wcc_field_study (val) VALUES ('Property Development/Real Estate Management');
INSERT INTO ref_wcc_field_study (val) VALUES ('Protective Services & Management');
INSERT INTO ref_wcc_field_study (val) VALUES ('Psychology');
INSERT INTO ref_wcc_field_study (val) VALUES ('Quantity Survey');
INSERT INTO ref_wcc_field_study (val) VALUES ('Science & Technology');
INSERT INTO ref_wcc_field_study (val) VALUES ('Secretarial');
INSERT INTO ref_wcc_field_study (val) VALUES ('Social Science/Sociology');
INSERT INTO ref_wcc_field_study (val) VALUES ('Sports Science & Management');
INSERT INTO ref_wcc_field_study (val) VALUES ('Textile/Fashion Design');
INSERT INTO ref_wcc_field_study (val) VALUES ('Urban Studies/Town Planning');
INSERT INTO ref_wcc_field_study (val) VALUES ('Veterinary');

-- ################################################################################
-- ################################################################################
-- ################################################################################

CREATE TABLE `wp_career_fair`.`ref_wcc_looking_for` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_wcc_looking_for (val) VALUES ('Full time employment (contract)'); 
INSERT INTO wp_career_fair.ref_wcc_looking_for (val) VALUES ('Full time employment (permanent)'); 
INSERT INTO wp_career_fair.ref_wcc_looking_for (val) VALUES ('Part time employment'); 
INSERT INTO wp_career_fair.ref_wcc_looking_for (val) VALUES ('Project-based employment'); 
INSERT INTO wp_career_fair.ref_wcc_looking_for (val) VALUES ('Webinar Learning experience (webinar)'); 

-- ################################################################################
-- ################################################################################
-- ################################################################################

CREATE TABLE `wp_career_fair`.`ref_wcc_job_level` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_wcc_job_level (val) VALUES ('Support staff (entry level)'); 
INSERT INTO wp_career_fair.ref_wcc_job_level (val) VALUES ('Support staff (experienced)'); 
INSERT INTO wp_career_fair.ref_wcc_job_level (val) VALUES ('Executive (entry level)'); 
INSERT INTO wp_career_fair.ref_wcc_job_level (val) VALUES ('Executive (experienced)'); 
INSERT INTO wp_career_fair.ref_wcc_job_level (val) VALUES ('Middle managerial'); 
INSERT INTO wp_career_fair.ref_wcc_job_level (val) VALUES ('Top managerial'); 


-- ################################################################################
-- ################################################################################
-- ################################################################################


CREATE TABLE `wp_career_fair`.`ref_wcc_work_experience` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_wcc_work_experience (val) VALUES ('Less than 1 year'); 
INSERT INTO wp_career_fair.ref_wcc_work_experience (val) VALUES ('1-3 years'); 
INSERT INTO wp_career_fair.ref_wcc_work_experience (val) VALUES ('4-6 years'); 
INSERT INTO wp_career_fair.ref_wcc_work_experience (val) VALUES ('7-9 years'); 
INSERT INTO wp_career_fair.ref_wcc_work_experience (val) VALUES ('More than 10 years'); 

-- #######################
-- OTHER

INSERT INTO `ref_year_2020` (`ID`, `val`) VALUES ('2', '2020')
