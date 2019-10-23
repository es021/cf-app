
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

-- ###########################################################################################################
-- ###########################################################################################################
-- ###########################################################################################################
-- ###########################################################################################################

animals
artist
business
business_owner
company
construction
cool_titles
cosmetology
counseling
customer_service
c_level
driving
engineering
finance
food_service
healthcare
hospitality
it
leadership
marketing
on_the_phone
operations
other
physical
research



agriculture-and-related-sciences
architecture-and-planning
area-ethnic-cultural-and-gender-studies
arts-visual-and-performing
biological-and-biomedical-sciences
business
communication-and-journalism
communications-technologies
computer-and-information-sciences
construction-trades
education
engineering
engineering-technologies
english-language-and-literature
family-and-consumer-sciences
health-professions-and-related-clinical-sciences
history
languages-literatures-and-linguistics
law-and-legal-studies
liberal-arts-and-sciences-general-studies-and-humanities
library-science
math-and-statistics
mechanic-and-repair-technologies
military
multi-interdisciplinary-studies
natural-resources-and-conservation
parks-recreation-and-fitness
personal-and-culinary-services
philosophy-and-religion
physical-sciences
precision-production-trades
psychology
public-administration-and-social-services
science-technologies
security-and-protective-services
social-sciences
theological-studies-and-religious-vocations
transportation-and-materials-moving