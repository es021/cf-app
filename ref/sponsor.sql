CREATE TABLE `wp_career_fair`.`ref_sponsor` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;


-- ###############################################################################################
-- ###############################################################################################

INSERT INTO wp_career_fair.ref_sponsor (val) VALUES ('Jabatan Perkhidmatan Awam (JPA)'); 
INSERT INTO wp_career_fair.ref_sponsor (val) VALUES ('Majlis Amanah Rakyat (MARA)'); 
INSERT INTO wp_career_fair.ref_sponsor (val) VALUES ('Petronas'); 
INSERT INTO wp_career_fair.ref_sponsor (val) VALUES ('Maybank'); 
INSERT INTO wp_career_fair.ref_sponsor (val) VALUES ('Yayasan Peneraju'); 
INSERT INTO wp_career_fair.ref_sponsor (val) VALUES ('Tenaga Nasional Berhad (TNB)'); 
INSERT INTO wp_career_fair.ref_sponsor (val) VALUES ('Bank Negara'); 
INSERT INTO wp_career_fair.ref_sponsor (val) VALUES ('Khazanah National Berhad'); 
INSERT INTO wp_career_fair.ref_sponsor (val) VALUES ('Private'); 