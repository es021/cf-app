CREATE TABLE `wp_career_fair`.`ref_qualification` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;


-- ###############################################################################################
-- ###############################################################################################

INSERT INTO wp_career_fair.ref_qualification (val) VALUES ('Primary/Secondary School/SPM/"O" Level'); 
INSERT INTO wp_career_fair.ref_qualification (val) VALUES ('Higher Secondary/STPM/"A" Level/Pre-U'); 
INSERT INTO wp_career_fair.ref_qualification (val) VALUES ('Professional Certificate'); 
INSERT INTO wp_career_fair.ref_qualification (val) VALUES ('Diploma'); 
INSERT INTO wp_career_fair.ref_qualification (val) VALUES ('Advanced/Higher/Graduate Diploma'); 
INSERT INTO wp_career_fair.ref_qualification (val) VALUES ('Bachelor'' Degree'); 
INSERT INTO wp_career_fair.ref_qualification (val) VALUES ('Post Graduate Diploma'); 
INSERT INTO wp_career_fair.ref_qualification (val) VALUES ('Professional Degree'); 
INSERT INTO wp_career_fair.ref_qualification (val) VALUES ('Master''s Degree'); 
INSERT INTO wp_career_fair.ref_qualification (val) VALUES ('Doctorate (PhD)'); 

