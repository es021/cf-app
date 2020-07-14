CREATE TABLE `wp_career_fair`.`ref_sunway_faculty` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;


-- ###############################################################################################
-- ###############################################################################################

INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Degree - School of Hospitality'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Degree - Sunway University Business School'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Degree - Victoria University Bachelor of Business'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Degree - School of Mathematical Sciences'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Degree - Department of Film & Performing Arts'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Degree - Department of Art & Design'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Degree - Department of Psychology'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Degree - Department of Communication'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Degree - Department of BioSciences'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Degree - Department of Computing and Information Systems'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Degree - American Degree Transfer Program (ADTP)'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Diploma - Information Technology and Computer Science'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Diploma - Nursing'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Diploma - Art, Design and Performing Arts'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Diploma - Business Administration'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Diploma - Accounting and Finance'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Diploma - Communication and Interactive New Media'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Diploma - Hotel, Culinary and Events'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Postgraduate Studies'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Professional Accounting Programmes - CFAB/ICAEW'); 
INSERT INTO wp_career_fair.ref_sunway_faculty (val) VALUES ('Professional Accounting Programmes - CAT/ACCA'); 