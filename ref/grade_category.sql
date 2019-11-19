CREATE TABLE `wp_career_fair`.`ref_grade_category` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
  `end_val` DECIMAL(5,3) NOT NULL ,
  `start_val` DECIMAL(5,3) NOT NULL ,
  `keyword` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;


-- ###############################################################################################
-- ###############################################################################################

INSERT INTO wp_career_fair.ref_grade_category 
(val, end_val, start_val, keyword) VALUES 
('4.00 - 3.50', 4.001 , 3.5, 'first class'), 
('3.49 - 3.00', 3.5 , 3.0, NULL), 
('2.99 - 2.50', 3.0 , 2.5, NULL), 
('2.49 - 2.00', 2.5 , 2.0, NULL), 
('Less than 2.00', 2.0 , 0.0, NULL);