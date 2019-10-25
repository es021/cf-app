CREATE TABLE `wp_career_fair`.`location_suggestion` 
( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`suggestion_name` VARCHAR(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`ref` VARCHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL  , 
`ref_val` VARCHAR(700) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
PRIMARY KEY (`ID`), UNIQUE (`suggestion_name`, `ref`, `ref_val`), INDEX(`suggestion_name`), INDEX(`ref`), INDEX(`ref_val`)) ENGINE = InnoDB;


-- ###############################################################################
-- interested_job_location

-- city
INSERT INTO `location_suggestion` 
(`suggestion_name`, `ref`, `ref_val`)  
(
  SELECT 'interested_job_location' , 'city' , c.val 
  from ref_city c
  where val IN ('Putrajaya', 'Cyberjaya')
);


-- state
INSERT INTO `location_suggestion` 
(`suggestion_name`, `ref`, `ref_val`)  
(
  SELECT 'interested_job_location' , 'state' , c.val 
  from ref_state c
  where val IN ('Kuala Lumpur')
);


-- country
INSERT INTO `location_suggestion` 
(`suggestion_name`, `ref`, `ref_val`)  
(
  SELECT 'interested_job_location' , 'country' , c.val 
  from ref_country c
  where val IN ('Singapore')
);


-- interested_job_location
-- ###############################################################################
