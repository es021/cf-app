
untuk semua search_by kena ada at least satu input

input_name         input_ref   input_category           search_by_ref     search_by_category 
==============================================================================================
interested_role    job_role    it                       major             computer-and-information-sciences
interested_role    job_role    it                       major             engineering
interested_role    job_role    business                 major             business


query(ref) - for suggestion
- input_name (multi_table_name/single_table_name)
- input_ref (table_name)
- search_by_ref ("hardcode")
- search_by_category (hantar value)


-> dapatkan input_category -> list of suggestion


-- ###########################################################################################################
-- ###########################################################################################################
-- ###########################################################################################################
-- ###########################################################################################################


CREATE TABLE `wp_career_fair`.`refmap_suggestion` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`input_name` VARCHAR(100) NOT NULL,
`input_ref` VARCHAR(100) NOT NULL, 
`input_category` VARCHAR(100) NOT NULL, 
`search_by_ref` VARCHAR(100) NOT NULL, 
`search_by_category` VARCHAR(100) NOT NULL, PRIMARY KEY (`ID`), 
UNIQUE (`input_name`, `input_ref`, `input_category`, `search_by_ref`, `search_by_category`)) ENGINE = InnoDB;


-- ###########################################################################################################
-- ###########################################################################################################
-- ###########################################################################################################
-- ###########################################################################################################

INSERT INTO `refmap_suggestion` 
(`input_name`, `input_ref`, `input_category`, `search_by_ref`, `search_by_category`) VALUES 
('interested_role', 'job_role', 'it', 'major', 'computer-and-information-sciences'),
('interested_role', 'job_role', 'it', 'major', 'engineering'),
('interested_role', 'job_role', 'business', 'major', 'business')