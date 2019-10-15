CREATE TABLE `wp_career_fair`.`ref_state` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
  `country_id` INT NOT NULL DEFAULT '0', 
PRIMARY KEY (`ID`), UNIQUE(`val`, `country_id`), INDEX (`val`), INDEX (`country_id`)) ENGINE = InnoDB;


-- ###############################################################################################
-- ###############################################################################################

INSERT INTO ref_state (val) VALUES ('Johor'); 
INSERT INTO ref_state (val) VALUES ('Kedah'); 
INSERT INTO ref_state (val) VALUES ('Kelantan'); 
INSERT INTO ref_state (val) VALUES ('Melaka'); 
INSERT INTO ref_state (val) VALUES ('Negeri Sembilan'); 
INSERT INTO ref_state (val) VALUES ('Pahang'); 
INSERT INTO ref_state (val) VALUES ('Pulau Pinang'); 
INSERT INTO ref_state (val) VALUES ('Perak'); 
INSERT INTO ref_state (val) VALUES ('Perlis'); 
INSERT INTO ref_state (val) VALUES ('Selangor'); 
INSERT INTO ref_state (val) VALUES ('Terengganu'); 
INSERT INTO ref_state (val) VALUES ('Sabah'); 
INSERT INTO ref_state (val) VALUES ('Sarawak'); 
INSERT INTO ref_state (val) VALUES ('Kuala Lumpur'); 
INSERT INTO ref_state (val) VALUES ('Labuan'); 
INSERT INTO ref_state (val) VALUES ('Putrajaya'); 
UPDATE ref_state SET country_id = 1 WHERE country_id = 0;

