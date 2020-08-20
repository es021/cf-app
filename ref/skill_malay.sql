CREATE TABLE `wp_career_fair`.`ref_skill_malay` 
( `ID` INT NOT NULL AUTO_INCREMENT , 
 `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
 `category` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
PRIMARY KEY (`ID`), UNIQUE(`val`,`category`), INDEX (`val`), INDEX (`category`)) ENGINE = InnoDB;

-- ###############################################################################################
-- ###############################################################################################


insert into wp_career_fair.ref_skill_malay (val, category) VALUES  
 ('Microsoft Word','technical_skill'), 
 ('Microsoft Excel','technical_skill'), 
 ('Pengaturcara','technical_skill'), 
 ('Kepimpinan','soft_skill'), 
 ('Kreativiti','soft_skill'), 
 ('Komunikasi','soft_skill'), 
 ('C++','technical_skill');


