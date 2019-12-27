CREATE TABLE `wp_career_fair`.`ref_extracurricular` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

-- ###############################################################################################
-- ###############################################################################################

truncate wp_career_fair.ref_extracurricular;

insert into wp_career_fair.ref_extracurricular (val) VALUES  
 ('Debate'),
 ('Student Council'),
 ('Academic Decathlon'),
 ('Student Government'),
 ('Volunteer');