CREATE TABLE `wp_career_fair`.`ref_empty` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(1)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
   `category` varchar(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;