CREATE TABLE `wp_career_fair`.`ref_local_or_oversea` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;


-- ###############################################################################################
-- ###############################################################################################

INSERT INTO wp_career_fair.ref_local_or_oversea (val) VALUES ('In Malaysia'); 
INSERT INTO wp_career_fair.ref_local_or_oversea (val) VALUES ('Oversea'); 