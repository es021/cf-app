CREATE TABLE `wp_career_fair`.`ref_month` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;


-- ###############################################################################################
-- ###############################################################################################

INSERT INTO wp_career_fair.ref_month (val) VALUES ('January'); 
INSERT INTO wp_career_fair.ref_month (val) VALUES ('February'); 
INSERT INTO wp_career_fair.ref_month (val) VALUES ('March'); 
INSERT INTO wp_career_fair.ref_month (val) VALUES ('April'); 
INSERT INTO wp_career_fair.ref_month (val) VALUES ('May'); 
INSERT INTO wp_career_fair.ref_month (val) VALUES ('June'); 
INSERT INTO wp_career_fair.ref_month (val) VALUES ('July'); 
INSERT INTO wp_career_fair.ref_month (val) VALUES ('August'); 
INSERT INTO wp_career_fair.ref_month (val) VALUES ('September'); 
INSERT INTO wp_career_fair.ref_month (val) VALUES ('October'); 
INSERT INTO wp_career_fair.ref_month (val) VALUES ('November'); 
INSERT INTO wp_career_fair.ref_month (val) VALUES ('December'); 