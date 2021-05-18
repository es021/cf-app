CREATE TABLE ref_oejf21_field_study
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_oejf21_field_study (val) VALUES ('Engineering (Aviation/Aeronautics/Astronautics)');
INSERT INTO ref_oejf21_field_study (val) VALUES ('Engineering (Bioengineering/Biomedical)');
INSERT INTO ref_oejf21_field_study (val) VALUES ('Engineering (Chemical)');
INSERT INTO ref_oejf21_field_study (val) VALUES ('Engineering (Civil)');
INSERT INTO ref_oejf21_field_study (val) VALUES ('Engineering (Computer/Telecommunication)');
INSERT INTO ref_oejf21_field_study (val) VALUES ('Engineering (Electrical/Electronic)');
INSERT INTO ref_oejf21_field_study (val) VALUES ('Engineering (Environmental/Health/Safety)');
INSERT INTO ref_oejf21_field_study (val) VALUES ('Engineering (Industrial)');
INSERT INTO ref_oejf21_field_study (val) VALUES ('Engineering (Marine)');
INSERT INTO ref_oejf21_field_study (val) VALUES ('Engineering (Material Science)');
INSERT INTO ref_oejf21_field_study (val) VALUES ('Engineering (Mechanical)');
INSERT INTO ref_oejf21_field_study (val) VALUES ('Engineering (Mechatronic/Electromechanical)');
INSERT INTO ref_oejf21_field_study (val) VALUES ('Engineering (Metal Fabrication/Tool & Die/Welding)');
INSERT INTO ref_oejf21_field_study (val) VALUES ('Engineering (Mining/Mineral)');
INSERT INTO ref_oejf21_field_study (val) VALUES ('Engineering (Petroleum/Oil/Gas)');
INSERT INTO ref_oejf21_field_study (val) VALUES ('Engineering (Others)');





CREATE TABLE `multi_oejf21_where_work` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;

CREATE TABLE `ref_oejf21_where_work` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_oejf21_where_work (val) VALUES ('Johor');
INSERT INTO ref_oejf21_where_work (val) VALUES ('Kedah');
INSERT INTO ref_oejf21_where_work (val) VALUES ('Kelantan');
INSERT INTO ref_oejf21_where_work (val) VALUES ('Melaka');
INSERT INTO ref_oejf21_where_work (val) VALUES ('Negeri Sembilan');
INSERT INTO ref_oejf21_where_work (val) VALUES ('Pahang');
INSERT INTO ref_oejf21_where_work (val) VALUES ('Pulau Pinang');
INSERT INTO ref_oejf21_where_work (val) VALUES ('Perak');
INSERT INTO ref_oejf21_where_work (val) VALUES ('Perlis');
INSERT INTO ref_oejf21_where_work (val) VALUES ('Sabah');
INSERT INTO ref_oejf21_where_work (val) VALUES ('Selangor');
INSERT INTO ref_oejf21_where_work (val) VALUES ('Terengganu');
INSERT INTO ref_oejf21_where_work (val) VALUES ('Kuala Lumpur');
INSERT INTO ref_oejf21_where_work (val) VALUES ('Labuan');
INSERT INTO ref_oejf21_where_work (val) VALUES ('Putrajaya');
INSERT INTO ref_oejf21_where_work (val) VALUES ('Singapore');




CREATE TABLE ref_oejf21_years_working
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;
INSERT INTO ref_oejf21_years_working (val) VALUES ('0-2 years');
INSERT INTO ref_oejf21_years_working (val) VALUES ('3-5 years');
INSERT INTO ref_oejf21_years_working (val) VALUES ('6-10 years');
INSERT INTO ref_oejf21_years_working (val) VALUES ('11-15 years');
INSERT INTO ref_oejf21_years_working (val) VALUES ('More than 15 years');






CREATE TABLE ref_age
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_age (val) VALUES ('18 years old and below');
INSERT INTO ref_age (val) VALUES ('19');
INSERT INTO ref_age (val) VALUES ('20');
INSERT INTO ref_age (val) VALUES ('21');
INSERT INTO ref_age (val) VALUES ('22');
INSERT INTO ref_age (val) VALUES ('23');
INSERT INTO ref_age (val) VALUES ('24');
INSERT INTO ref_age (val) VALUES ('25');
INSERT INTO ref_age (val) VALUES ('26');
INSERT INTO ref_age (val) VALUES ('27');
INSERT INTO ref_age (val) VALUES ('28');
INSERT INTO ref_age (val) VALUES ('29');
INSERT INTO ref_age (val) VALUES ('30');
INSERT INTO ref_age (val) VALUES ('31');
INSERT INTO ref_age (val) VALUES ('32');
INSERT INTO ref_age (val) VALUES ('33');
INSERT INTO ref_age (val) VALUES ('34');
INSERT INTO ref_age (val) VALUES ('35');
INSERT INTO ref_age (val) VALUES ('36');
INSERT INTO ref_age (val) VALUES ('37');
INSERT INTO ref_age (val) VALUES ('38');
INSERT INTO ref_age (val) VALUES ('39');
INSERT INTO ref_age (val) VALUES ('40');
INSERT INTO ref_age (val) VALUES ('41');
INSERT INTO ref_age (val) VALUES ('42');
INSERT INTO ref_age (val) VALUES ('43');
INSERT INTO ref_age (val) VALUES ('44');
INSERT INTO ref_age (val) VALUES ('45');
INSERT INTO ref_age (val) VALUES ('46');
INSERT INTO ref_age (val) VALUES ('47');
INSERT INTO ref_age (val) VALUES ('48');
INSERT INTO ref_age (val) VALUES ('49');
INSERT INTO ref_age (val) VALUES ('50');
INSERT INTO ref_age (val) VALUES ('51');
INSERT INTO ref_age (val) VALUES ('52');
INSERT INTO ref_age (val) VALUES ('53');
INSERT INTO ref_age (val) VALUES ('54');
INSERT INTO ref_age (val) VALUES ('55');
INSERT INTO ref_age (val) VALUES ('56');
INSERT INTO ref_age (val) VALUES ('57');
INSERT INTO ref_age (val) VALUES ('58');
INSERT INTO ref_age (val) VALUES ('59');
INSERT INTO ref_age (val) VALUES ('60');
INSERT INTO ref_age (val) VALUES ('61');
INSERT INTO ref_age (val) VALUES ('62');
INSERT INTO ref_age (val) VALUES ('63');
INSERT INTO ref_age (val) VALUES ('64');
INSERT INTO ref_age (val) VALUES ('65');







CREATE TABLE `multi_oejf21_reference` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;

CREATE TABLE `ref_oejf21_reference` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;
INSERT INTO ref_oejf21_reference (val) VALUES ('Facebook');
INSERT INTO ref_oejf21_reference (val) VALUES ('Instagram');
INSERT INTO ref_oejf21_reference (val) VALUES ('LinkedIn');
INSERT INTO ref_oejf21_reference (val) VALUES ('Radio');
INSERT INTO ref_oejf21_reference (val) VALUES ('TV');
INSERT INTO ref_oejf21_reference (val) VALUES ('Poster');
INSERT INTO ref_oejf21_reference (val) VALUES ('Event');
INSERT INTO ref_oejf21_reference (val) VALUES ('Roadshow');
INSERT INTO ref_oejf21_reference (val) VALUES ('Others');



CREATE TABLE ref_race
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_race (val) VALUES ('Malay');
INSERT INTO ref_race (val) VALUES ('Chinese');
INSERT INTO ref_race (val) VALUES ('Indian');
INSERT INTO ref_race (val) VALUES ('Others');



CREATE TABLE ref_oejf21_industry
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;
INSERT INTO ref_oejf21_industry (val) VALUES ('Accounting / Tax Services');
INSERT INTO ref_oejf21_industry (val) VALUES ('Advertising / Marketing / PR');
INSERT INTO ref_oejf21_industry (val) VALUES ('Agriculture / Poultry / Fisheries');
INSERT INTO ref_oejf21_industry (val) VALUES ('Apparel');
INSERT INTO ref_oejf21_industry (val) VALUES ('Architecture / Interior Design');
INSERT INTO ref_oejf21_industry (val) VALUES ('Arts / Design / Fashion');
INSERT INTO ref_oejf21_industry (val) VALUES ('Automobile / Automotive');
INSERT INTO ref_oejf21_industry (val) VALUES ('Aviation / Airline');
INSERT INTO ref_oejf21_industry (val) VALUES ('Banking / Finance');
INSERT INTO ref_oejf21_industry (val) VALUES ('Beauty / Fitness');
INSERT INTO ref_oejf21_industry (val) VALUES ('BioTech / Pharmaceutical');
INSERT INTO ref_oejf21_industry (val) VALUES ('Business / Mgmt Consulting');
INSERT INTO ref_oejf21_industry (val) VALUES ('Call Center / BPO');
INSERT INTO ref_oejf21_industry (val) VALUES ('Chemical / Fertilizers');
INSERT INTO ref_oejf21_industry (val) VALUES ('Construction / Building');
INSERT INTO ref_oejf21_industry (val) VALUES ('Consumer Products / FMCG');
INSERT INTO ref_oejf21_industry (val) VALUES ('Education');
INSERT INTO ref_oejf21_industry (val) VALUES ('Electrical & Electronics');
INSERT INTO ref_oejf21_industry (val) VALUES ('Engineering / Technical Consulting');
INSERT INTO ref_oejf21_industry (val) VALUES ('Entertainment / Media');
INSERT INTO ref_oejf21_industry (val) VALUES ('Environment / Health / Safety');
INSERT INTO ref_oejf21_industry (val) VALUES ('Exhibitions / Event Mgmt');
INSERT INTO ref_oejf21_industry (val) VALUES ('Food & Beverage');
INSERT INTO ref_oejf21_industry (val) VALUES ('Gems / Jewellery');
INSERT INTO ref_oejf21_industry (val) VALUES ('General & Wholesale Trading');
INSERT INTO ref_oejf21_industry (val) VALUES ('Government / Defence');
INSERT INTO ref_oejf21_industry (val) VALUES ('Healthcare / Medical');
INSERT INTO ref_oejf21_industry (val) VALUES ('Heavy Industrial / Machinery');
INSERT INTO ref_oejf21_industry (val) VALUES ('Hotel / Hospitality');
INSERT INTO ref_oejf21_industry (val) VALUES ('HR Mgmt / Consulting');
INSERT INTO ref_oejf21_industry (val) VALUES ('Insurance');
INSERT INTO ref_oejf21_industry (val) VALUES ('IT / Hardware');
INSERT INTO ref_oejf21_industry (val) VALUES ('IT / Software');
INSERT INTO ref_oejf21_industry (val) VALUES ('Journalism');
INSERT INTO ref_oejf21_industry (val) VALUES ('Law / Legal');
INSERT INTO ref_oejf21_industry (val) VALUES ('Manufacturing / Production');
INSERT INTO ref_oejf21_industry (val) VALUES ('Marine / Aquaculture');
INSERT INTO ref_oejf21_industry (val) VALUES ('Mining');
INSERT INTO ref_oejf21_industry (val) VALUES ('Oil / Gas / Petroleum');
INSERT INTO ref_oejf21_industry (val) VALUES ('Polymer / Rubber');
INSERT INTO ref_oejf21_industry (val) VALUES ('Printing / Publishing');
INSERT INTO ref_oejf21_industry (val) VALUES ('Property / Real Estate');
INSERT INTO ref_oejf21_industry (val) VALUES ('R&D');
INSERT INTO ref_oejf21_industry (val) VALUES ('Repair / Maintenance');
INSERT INTO ref_oejf21_industry (val) VALUES ('Retail / Merchandise');
INSERT INTO ref_oejf21_industry (val) VALUES ('Science & Technology');
INSERT INTO ref_oejf21_industry (val) VALUES ('Security / Law Enforcement');
INSERT INTO ref_oejf21_industry (val) VALUES ('Semiconductor');
INSERT INTO ref_oejf21_industry (val) VALUES ('Social Services / NGO');
INSERT INTO ref_oejf21_industry (val) VALUES ('Sports');
INSERT INTO ref_oejf21_industry (val) VALUES ('Stockbroking / Securities');
INSERT INTO ref_oejf21_industry (val) VALUES ('Telecommunication');
INSERT INTO ref_oejf21_industry (val) VALUES ('Textiles / Garment');
INSERT INTO ref_oejf21_industry (val) VALUES ('Tobacco');
INSERT INTO ref_oejf21_industry (val) VALUES ('Transportation / Logistics');
INSERT INTO ref_oejf21_industry (val) VALUES ('Travel / Tourism');
INSERT INTO ref_oejf21_industry (val) VALUES ('Utilities / Power');
INSERT INTO ref_oejf21_industry (val) VALUES ('Wood / Fibre / Paper');
INSERT INTO ref_oejf21_industry (val) VALUES ('Others');
