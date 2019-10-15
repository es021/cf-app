CREATE TABLE `wp_career_fair`.`location_suggestion` 
( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`suggestion_name` VARCHAR(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`ref` VARCHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL  , 
`ref_id` BIGINT(20) NOT NULL , 
PRIMARY KEY (`ID`), UNIQUE (`suggestion_name`, `ref`, `ref_id`), INDEX(`suggestion_name`)) ENGINE = InnoDB;

INSERT INTO `location_suggestion` 
(`suggestion_name`, `ref`, `ref_id`)  
(
  SELECT 'interested_job_location' , 'city' , c.ID 
  from ref_city c
  where val IN ('Kuala Lumpur', 'Putrajaya', 'Cyberjaya')
)
