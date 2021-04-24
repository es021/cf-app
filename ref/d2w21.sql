CREATE TABLE `wp_career_fair`.`ref_state_other` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT IGNORE INTO wp_career_fair.ref_state_other (val) VALUES ('Johor');
INSERT IGNORE INTO wp_career_fair.ref_state_other (val) VALUES ('Kedah');
INSERT IGNORE INTO wp_career_fair.ref_state_other (val) VALUES ('Kelantan');
INSERT IGNORE INTO wp_career_fair.ref_state_other (val) VALUES ('Melaka');
INSERT IGNORE INTO wp_career_fair.ref_state_other (val) VALUES ('Negeri Sembilan');
INSERT IGNORE INTO wp_career_fair.ref_state_other (val) VALUES ('Pahang');
INSERT IGNORE INTO wp_career_fair.ref_state_other (val) VALUES ('Pulau');
INSERT IGNORE INTO wp_career_fair.ref_state_other (val) VALUES ('Perak');
INSERT IGNORE INTO wp_career_fair.ref_state_other (val) VALUES ('Perlis');
INSERT IGNORE INTO wp_career_fair.ref_state_other (val) VALUES ('Sabah');
INSERT IGNORE INTO wp_career_fair.ref_state_other (val) VALUES ('Selangor');
INSERT IGNORE INTO wp_career_fair.ref_state_other (val) VALUES ('Terengganu');
INSERT IGNORE INTO wp_career_fair.ref_state_other (val) VALUES ('Kuala');
INSERT IGNORE INTO wp_career_fair.ref_state_other (val) VALUES ('Labuan');
INSERT IGNORE INTO wp_career_fair.ref_state_other (val) VALUES ('Putrajaya');
INSERT IGNORE INTO wp_career_fair.ref_state_other (val) VALUES ('Others (Please specify in field below)');

CREATE TABLE `wp_career_fair`.`multi_d2w21_interested_job_location` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;

-- #########################################################################################
-- #########################################################################################
-- #########################################################################################

CREATE TABLE `wp_career_fair`.`ref_d2w21_webinar` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_d2w21_webinar (val) VALUES ('Take Charge! Charting Your Own Career Roadmap (3 May 2021, 10.00 am – 11.30 am)');
INSERT INTO wp_career_fair.ref_d2w21_webinar (val) VALUES ('Mental Resilience: From Stress to Strength (3 May 2021, 12.30 pm – 2.00 pm)');
INSERT INTO wp_career_fair.ref_d2w21_webinar (val) VALUES ('Good to Great: Optimising Your Potential (3 May 2021, 3.00 pm – 4.30 pm)');
INSERT INTO wp_career_fair.ref_d2w21_webinar (val) VALUES ('From Intern to Employee: Strategising Internship to Kick-start Your Career (4 May 2021, 10.00 am – 11.30 am)');
INSERT INTO wp_career_fair.ref_d2w21_webinar (val) VALUES ('Day in a Life of an Entrepreneur: Are You Up to It? (4 May 2021, 12.30 pm – 2.00 pm)');
INSERT INTO wp_career_fair.ref_d2w21_webinar (val) VALUES ('How to Make a Recruiter to Say Yes to Me? (4 May 2021, 3.00 pm – 5.00 pm)');
INSERT INTO wp_career_fair.ref_d2w21_webinar (val) VALUES ('Industry Insights by Clarivate (5 May 2021, 10.00 am – 11.30 am)');
INSERT INTO wp_career_fair.ref_d2w21_webinar (val) VALUES ('Industry Insights by Nestle (5 May 2021, 12.30 pm – 2.00 pm)');
INSERT INTO wp_career_fair.ref_d2w21_webinar (val) VALUES ('Industry Insights by e-Latih HRDF (5 May 2021, 3.00 pm – 4.30 pm)');
INSERT INTO wp_career_fair.ref_d2w21_webinar (val) VALUES ('Digitalisation: Where to Start? (6 May 2021, 10.00 am – 12.00 pm)');
INSERT INTO wp_career_fair.ref_d2w21_webinar (val) VALUES ('Working Remotely: Exploring Opportunities Across the Globe (6 May 2021, 2.00 pm – 4.00 pm)');


CREATE TABLE `wp_career_fair`.`multi_d2w21_webinar` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;

-- #########################################################################################
-- #########################################################################################
-- #########################################################################################

CREATE TABLE `wp_career_fair`.`ref_d2w21_reference` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;
INSERT INTO wp_career_fair.ref_d2w21_reference (val) VALUES ('Social Media');
INSERT INTO wp_career_fair.ref_d2w21_reference (val) VALUES ('Newspaper');
INSERT INTO wp_career_fair.ref_d2w21_reference (val) VALUES ('Ads');
INSERT INTO wp_career_fair.ref_d2w21_reference (val) VALUES ('Emails');
INSERT INTO wp_career_fair.ref_d2w21_reference (val) VALUES ('Friends');
INSERT INTO wp_career_fair.ref_d2w21_reference (val) VALUES ('University');


CREATE TABLE `wp_career_fair`.`multi_d2w21_reference` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;

-- #########################################################################################
-- #########################################################################################
-- #########################################################################################

CREATE TABLE `wp_career_fair`.`ref_d2w21_field_study` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Basic/broad, general programmes');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Literacy and numeracy');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Personal skills');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Teaching and training');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Education science');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Training for preschool teachers');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Training for teachers at basic levels');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Training for teachers with subject specialisation');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Training for teachers of vocational subjects');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Fine arts');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Music and performing arts');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Audio-visual techniques and media production');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Design');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Craft skills');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Religion');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Languages');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('National language');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Other languages');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('History and archaeology');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Philosophy and ethics');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('History, philosophy and related subject');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Psychology');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Sociology and cultural studies');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Political science and civics');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Economics');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Journalism and reporting');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Library, information, archive');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Wholesale and retail sales');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Marketing and advertising');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Finance, banking, insurance');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Accounting and taxation');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Management and administration');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Secretarial and office work');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Working life');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Syariah Law');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Biology and biochemistry');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Environmental science');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Physics');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Chemistry');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Earth science');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Mathematics');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Statistics');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Computer science');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Computer use');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Mechanics and metal work');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Electricity and energy');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Electronics and automation');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Chemical and process');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Motor vehicles, ships and aircraft');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Civil engineering');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Food processing');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Textiles, clothes, footwear and leather');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Materials (wood, paper, plastic and glass)');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Mining and extraction');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Applied science');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Architecture and town planning');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Building');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Crop and livestock production');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Horticulture');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Forestry');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Fisheries');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Veterinary');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Medicine');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Medical services');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Nursing and caring');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Dental studies');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Medical diagnostic and treatment technology');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Therapy and rehabilitation');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Pharmacy');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Child care and youth services');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Social work and counselling');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Hotel, restaurant and catering');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Travel, tourism and leisure');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Sports');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Domestic services');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Hair and beauty services');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Transport services');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Environmental protection technology');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Natural environments and wildlife');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Community sanitation services');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Protection of persons and property');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Occupational health and safety');
INSERT INTO wp_career_fair.ref_d2w21_field_study (val) VALUES ('Military and defence');




CREATE TABLE `wp_career_fair`.`ref_d2w21_qualification` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_d2w21_qualification (val) VALUES ('Pre-University');
INSERT INTO wp_career_fair.ref_d2w21_qualification (val) VALUES ('SKM');
INSERT INTO wp_career_fair.ref_d2w21_qualification (val) VALUES ('Diploma');
INSERT INTO wp_career_fair.ref_d2w21_qualification (val) VALUES ('Bachelor’s Degree');
INSERT INTO wp_career_fair.ref_d2w21_qualification (val) VALUES ('Master’s Degree');
INSERT INTO wp_career_fair.ref_d2w21_qualification (val) VALUES ('PhD');
INSERT INTO wp_career_fair.ref_d2w21_qualification (val) VALUES ('Others (Please specify in field below)');



CREATE TABLE `wp_career_fair`.`ref_d2w21_year_study` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT IGNORE INTO wp_career_fair.ref_d2w21_year_study (val) VALUES ('First Year');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_year_study (val) VALUES ('Second Year');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_year_study (val) VALUES ('Third Year');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_year_study (val) VALUES ('Fourth Year');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_year_study (val) VALUES ('Fresh Graduate');


CREATE TABLE `wp_career_fair`.`ref_d2w21_university` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Islam Antarabangsa Malaysia (UiAM)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Kebangsaan Malaysia (UKM)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Malaya (UM)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Malaysia Kelantan (UMK)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Malaysia Pahang (UMP)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Malaysia Perlis (UNIMAP)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Malaysia Sabah (UMS)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Malaysia Sarawak (UNIMAS)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Malaysia Terengganu (UMT)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Pendidikan Sultan Idris (UPSI)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Pertahanan Nasional Malaysia (UPNM)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Putra Malaysia (UPM)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Sains Islam Malaysia (USIM)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Sains Malaysia (USM)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Sultan Zainal Abidin (UNISZA)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Teknikal Malaysia Melaka (UTEM)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Teknologi Malaysia (UTM)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Teknologi MARA (UiTM)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Tun Hussein Onn (UTHM)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Utara Malaysia (UUM)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Ungku Omar (PUO)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Sultan Haji Ahmad Shah (POLISAS)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Sultan Abdul Halim Muadzam Shah (POLIMAS)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Kota Bharu (PKB)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Kuching Sarawak (PKS)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Port Dickson (PPD)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Kota Kinabalu (PKK)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Sultan Salahuddin Abdul Aziz Shah (PSA)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Ibrahim Sultan (PIS)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Seberang Perai (PSP)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Melaka (PMK)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Kuala Terengganu (PKT)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Sultan Mizan Zainal Abidin (PSMZA)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Merlimau (PMM)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Sultan Azlan Shah (PSAS)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Tuanku Sultanah Bahiyah (PTSB)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Sultan Idris Shah (PSIS)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Tuanku Syed Sirajuddin (PTSS)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Muadzam Shah (PMS)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Mukah Sarawak (PMU)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Balik Pulau (PBU)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Jeli (PJK)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Nilai (PNS)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Banting (PBS)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Mersing (PMJ)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Hulu Terengganu (PHT)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Sandakan (PSS)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik METrO Kuala Lumpur (PMKL)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik METrO Kuantan (PMKU)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik METrO Johor Bahru (PMJB)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik METrO Betong (PMBS)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik METrO Tasek Gelugor (PMTG)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Tun Syed Nasir Syed Ismail (PTSN)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Besut (PBT)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Bagan Datuk (PBD)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Politeknik Tawau (PTS)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Bagan Datoh');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Bagan Serai');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Batu Gajah');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Chenderoh');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Gerik');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Kuala Kangsar');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Manjung');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Pasir Salak');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti RTC Gopeng');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Sungai Siput');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Taiping');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Tapah');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Teluk Intan');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Baling Kedah');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Bandar Baharu');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Bandar Darulaman');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Jerai');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Kulim');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Padang Terap');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Sungai Petani');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Bukit Mertajam');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Bayan Baru');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Kepala Batas');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Nibong Tebal');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Seberang Jaya');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Tasek Gelugor');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Bentong');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Bera');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Jerantut');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Kuantan');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Lipis');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Paya Besar');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Pekan');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Raub');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Rompin');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Temerloh');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Besut');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Kemaman');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Kuala Terengganu');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Jeli');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Kok Lanas');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Pasir Mas');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Ampang');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Hulu Langat');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Hulu Selangor');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Klang');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Kuala Langat');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Sabak Bernam');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Selayang');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Shah Alam');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Tanjong Karang');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Jelebu');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Jempol');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Rembau');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Tampin');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Bukit Beruang');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Jasin');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Kota Melaka');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Masjid Tanah');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Selandar');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Tangga Batu');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Bandar Panawar');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti bandar Tenggara');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Batu Pahat');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Kluang');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Kota Tinggi');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Ledang');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Muar');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Pagoh');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Pasir Gudang');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Segamat');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Segamat 2');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Tanjung Piai');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Beaufort');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Lahad Datu');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Sandakan');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Semporna');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Tambunan');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Tawau');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Betong');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Kuching');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Mas Gading');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Miri');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Santubong');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Komuniti Sarikei');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Multimedia University (MMU), Cyberjaya');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Tenaga Nasional (UNITEN)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Tun Abdul Razak (UniRAZAK)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Teknologi Petronas (UTP)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('International Medical University (IMU)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Selangor (UNISEL)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Open University Malaysia (OUM)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Malaysia University of Science & Technology (MUST)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('AIMST University');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Tunku Abdul Rahman (UTAR)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Kuala Lumpur (UniKL)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Wawasan Open University');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Albukhary International University');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Al-Madinah International University (MEDIU)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('International Centre for Education in Islamic Finance (INCEIF)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Limkokwing University of Creative Technology');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Management and Science University (MSU)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Asia e University (AeU)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('UCSI University');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Quest International University Perak');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('INTI International University (IIU)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Taylor’s University');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Sunway University');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Manipal International University');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Perdana University');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('HELP University');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('UNITAR International University');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Raffles University Iskandar (RUI)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Malaysia Institute of Supply Chain Innovation (MISI)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Nilai University');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('SEGi University');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Asia Pacific University of Technology and Innovation (APU)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Binary University of Management and Entrepreneurship');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Infrastructure University Kuala Lumpur (IUKL)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Asia Metropolitan University');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Putra Business School');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Global NXT University');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('MAHSA University');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('International University of Malaya-Wales');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('University Malaysia of Computer Science and Engineering');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Islam Malaysia, Cyberjaya');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('DRB-HICOM University of Automotive Malaysia');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Asia School of Business');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('City University');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Meritus University');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Sultan Azlan Shan');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Universiti Islam Antarabangsa Sultan Abdul Halim Muadzam Shah');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('International University College of Technology Twintech (IUCTT)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('North Borneo University College, Sabah (formerly known as International University College of Technology Twintech, Sabah campus)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Selangor International Islamic University College (SIUC)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Cyberjaya University College of Medical Sciences (CUCMS)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kuala Lumpur Metropolitan University College (KLMUC)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('TATI University College');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Berjaya University College of Hospitality');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Melaka Islamic University College');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Linton University College');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('KDU University College');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Widad University College');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('KPJ Healthcare University College');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Lincoln University College');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Southern University College');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Bestari University College');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Vinayaka Mission International University College');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('University College of Technology Sarawak');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Tunku Abdul Rahman University College');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Islamic University College of Science & Technology');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Geomatika University College');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Islamic Unversity College of Perlis (KUIPs)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('University College Sabah Foundation (UCSF)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Universiti Agrosains Malaysia');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Universiti Islam Pahang Sultan Ahmad Shah');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Kolej Universiti Poly-Tech MARA');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('KDU University College');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('First City University College');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('New Era University College');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Fairview University College');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('International University College of Technology Twintech (IUCTT)');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Saito University College');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Han Chiang University College of Communication');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Genovasi University College');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('PICOMS International University College');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('University College of Yayasan Pahang');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Monash University Malaysia');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Curtin University, Sarawak');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('The University of Nottingham Malaysia Campus');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Swinburne University of Technology, Sarawak Campus');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Newcastle University Medicine Malaysia');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('University of Southampton Malaysia Campus');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Heriot-Watt University Malaysia');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('University of Reading Malaysia');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Xiamen University Malaysia Campus');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Royal College of Surgeons In Ireland And University College Dublin Malaysia Campus');
INSERT IGNORE INTO wp_career_fair.ref_d2w21_university (val) VALUES ('Others');

