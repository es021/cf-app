CREATE TABLE `wp_career_fair`.`ref_usm_course` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `val` VARCHAR(700) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE(`val`),
  INDEX (`val`)
) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_usm_course (val) VALUES ('Aerospace Engineering'); 
INSERT INTO wp_career_fair.ref_usm_course (val) VALUES ('Civil Engineering'); 
INSERT INTO wp_career_fair.ref_usm_course (val) VALUES ('Electrical Engineering'); 
INSERT INTO wp_career_fair.ref_usm_course (val) VALUES ('Electronic Engineering'); 
INSERT INTO wp_career_fair.ref_usm_course (val) VALUES ('Mechatronics Engineering'); 
INSERT INTO wp_career_fair.ref_usm_course (val) VALUES ('Materials Engineering'); 
INSERT INTO wp_career_fair.ref_usm_course (val) VALUES ('Mineral Resources Engineering'); 
INSERT INTO wp_career_fair.ref_usm_course (val) VALUES ('Polymer Engineering'); 
INSERT INTO wp_career_fair.ref_usm_course (val) VALUES ('Chemical Engineering'); 
INSERT INTO wp_career_fair.ref_usm_course (val) VALUES ('Mechanical Engineering'); 
INSERT INTO wp_career_fair.ref_usm_course (val) VALUES ('Manufacturing Engineering with Management'); 
INSERT INTO wp_career_fair.ref_usm_course (val) VALUES ('Others');

CREATE TABLE `wp_career_fair`.`ref_usm_year_study` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `val` VARCHAR(700) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE(`val`),
  INDEX (`val`)
) ENGINE = InnoDB;
INSERT INTO wp_career_fair.ref_usm_year_study (val) VALUES ('Year 1');
INSERT INTO wp_career_fair.ref_usm_year_study (val) VALUES ('Year 2');
INSERT INTO wp_career_fair.ref_usm_year_study (val) VALUES ('Year 3');
INSERT INTO wp_career_fair.ref_usm_year_study (val) VALUES ('Year 4');
INSERT INTO wp_career_fair.ref_usm_year_study (val) VALUES ('Year 5');
INSERT INTO wp_career_fair.ref_usm_year_study (val) VALUES ('Year 6');
INSERT INTO wp_career_fair.ref_usm_year_study (val) VALUES ('Year 7');
INSERT INTO wp_career_fair.ref_usm_year_study (val) VALUES ('Master');
INSERT INTO wp_career_fair.ref_usm_year_study (val) VALUES ('PhD');
INSERT INTO wp_career_fair.ref_usm_year_study (val) VALUES ('Diploma');
INSERT INTO wp_career_fair.ref_usm_year_study (val) VALUES ('Graduate');
INSERT INTO wp_career_fair.ref_usm_year_study (val) VALUES ('Others');


CREATE TABLE `wp_career_fair`.`ref_usm_cgpa` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `val` VARCHAR(700) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE(`val`),
  INDEX (`val`)
) ENGINE = InnoDB;
INSERT INTO wp_career_fair.ref_usm_cgpa (val) VALUES ('4.00 - 3.50');
INSERT INTO wp_career_fair.ref_usm_cgpa (val) VALUES ('3.49 - 3.00');
INSERT INTO wp_career_fair.ref_usm_cgpa (val) VALUES ('2.99 - 2.50');
INSERT INTO wp_career_fair.ref_usm_cgpa (val) VALUES ('2.49 - 2.00');
INSERT INTO wp_career_fair.ref_usm_cgpa (val) VALUES ('Below 2.00');

CREATE TABLE `wp_career_fair`.`ref_usm_year` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `val` VARCHAR(700) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE(`val`),
  INDEX (`val`)
) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_usm_year (val) VALUES ('2010');
INSERT INTO wp_career_fair.ref_usm_year (val) VALUES ('2011');
INSERT INTO wp_career_fair.ref_usm_year (val) VALUES ('2012');
INSERT INTO wp_career_fair.ref_usm_year (val) VALUES ('2013');
INSERT INTO wp_career_fair.ref_usm_year (val) VALUES ('2014');
INSERT INTO wp_career_fair.ref_usm_year (val) VALUES ('2015');
INSERT INTO wp_career_fair.ref_usm_year (val) VALUES ('2016');
INSERT INTO wp_career_fair.ref_usm_year (val) VALUES ('2017');
INSERT INTO wp_career_fair.ref_usm_year (val) VALUES ('2018');
INSERT INTO wp_career_fair.ref_usm_year (val) VALUES ('2019');
INSERT INTO wp_career_fair.ref_usm_year (val) VALUES ('2020');
INSERT INTO wp_career_fair.ref_usm_year (val) VALUES ('2021');
INSERT INTO wp_career_fair.ref_usm_year (val) VALUES ('2022');
INSERT INTO wp_career_fair.ref_usm_year (val) VALUES ('2023');
INSERT INTO wp_career_fair.ref_usm_year (val) VALUES ('2024');
INSERT INTO wp_career_fair.ref_usm_year (val) VALUES ('2025');
INSERT INTO wp_career_fair.ref_usm_year (val) VALUES ('2026');

-- #############################################################################################
-- #############################################################################################
-- #############################################################################################
CREATE TABLE `wp_career_fair`.`multi_job_category` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;

CREATE TABLE `wp_career_fair`.`ref_job_category` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `val` VARCHAR(700) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE(`val`),
  INDEX (`val`)
) ENGINE = InnoDB;
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Accounting/Finance - Audit & Taxation');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Accounting/Finance - Banking/Financial');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Accounting/Finance - Corporate Finance/Investment');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Accounting/Finance - General/Cost Accounting');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Admin/Human Resources  - Clerical/Administrative');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Admin/Human Resources  - Human Resources');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Admin/Human Resources  - Secretarial');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Admin/Human Resources  - Top Management');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Arts/Media/Communications - Advertising');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Arts/Media/Communications - Arts/Creative Design');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Arts/Media/Communications - Entertainment');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Arts/Media/Communications - Public Relations');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Building/Construction - Architect/Interior Design');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Building/Construction - Civil Engineering/Construction');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Building/Construction - Property/Real Estate');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Building/Construction - Quantity Surveying');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('IT - Hardware');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('IT - Network/Sys/DB Admin');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('IT - Software');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Engineering - Chemical Engineering');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Engineering - Electrical Engineering');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Engineering - Electronics Engineering');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Engineering - Environmental Engineering');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Engineering - Industrial Engineering');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Engineering - Mechanical/Automotive Engineering');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Engineering - Oil/Gas Engineering');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Engineering - Other Engineering');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Healthcare - Doctor/Diagnosis');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Healthcare - Pharmacy');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Healthcare - Nurse/Medical Support');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Manufacturing - Maintenance');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Manufacturing - Manufacturing');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Manufacturing - Process Design & Control');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Manufacturing - Purchasing/Material Management');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Manufacturing - Quality Assurance');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Sales/Marketing - Digital Marketing');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Sales/Marketing - Sales - Corporate');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Sales/Marketing - E-commerce');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Sales/Marketing - Marketing/Business Dev');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Sales/Marketing - Merchandising');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Sales/Marketing - Retail Sales Jobs');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Sales/Marketing - Sales - Eng/Tech/IT');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Sales/Marketing - Sales - Financial Services');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Sales/Marketing - Telesales/Telemarketing');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Sciences - Actuarial/Statistics');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Sciences - Aviation');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Sciences - Chemistry');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Sciences - Food Tech/Nutritionist');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Sciences - Science & Technology');
INSERT INTO wp_career_fair.ref_job_category (val) VALUES ('Others');


CREATE TABLE `wp_career_fair`.`multi_usm_purpose` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;

CREATE TABLE `wp_career_fair`.`ref_usm_purpose` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_usm_purpose (val) VALUES ('Full-Time Job'); 
INSERT INTO wp_career_fair.ref_usm_purpose (val) VALUES ('Part-Time Job'); 
INSERT INTO wp_career_fair.ref_usm_purpose (val) VALUES ('Internship'); 
INSERT INTO wp_career_fair.ref_usm_purpose (val) VALUES ('Visit'); 

-- #############################################################################################
-- #############################################################################################
-- #############################################################################################
-- #############################################################################################
-- #############################################################################################
-- #############################################################################################
-- #############################################################################################
-- #############################################################################################
-- #############################################################################################

CREATE TABLE `wp_career_fair`.`ref_usm_university` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `val` VARCHAR(700) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE(`val`),
  INDEX (`val`)
) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Malaya (UM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Islam Antarabangsa Malaysia (UIAM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Kebangsaan Malaysia (UKM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Malaysia Kelantan (UMK)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Malaysia Pahang (UMP)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Malaysia Perlis (UniMAP)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Malaysia Sabah (UMS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Malaysia Sarawak (UNIMAS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Malaysia Terengganu (UMT)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Pendidikan Sultan Idris (UPSI)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Pertahanan Nasional Malaysia (UPNM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Putra Malaysia (UPM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Sains Islam Malaysia (USIM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Sains Malaysia (USM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Sultan Zainal Abidin (UniSZA)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Teknikal Malaysia Melaka (UTeM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Teknologi Malaysia (UTM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Teknologi MARA (UiTM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Tun Hussein Onn Malaysia (UTHM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Utara Malaysia (UUM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('AIMST University (AIMST)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Al – Madinah International University (MEDIU)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Albukhary International University (AIU)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Asia e University (AeU)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Asia Metropolitan University (AMU)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Asia Pacific University of Technology and Innovation (APU)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Asia School of Business (ASB)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Binary University of Management and Entrepreneurship (Binary)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('City University, Malaysia (CityU)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Curtin University (Curtin)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('DRB – HICOM University of Automotive Malaysia (DHU)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Global NXT University (GNU)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Gugusan University (GUM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('HELP University (HELP)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Heriot – Watt University Malaysia (HWUM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Infrastructure University Kuala Lumpur (IUKL)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('International Centre for Education in Islamic Finance (INCEIF)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('International Medical University (IMU)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('International University of Malaya – Wales (IUMW)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('INTI International University (INTI)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Limkokwing University of Creative Technology (LUCT)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('MAHSA University (MAHSA)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Malaysia Institute of Supply Chain Innovation (MISI)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Malaysia University of Science & Technology (MUST)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Management and Science University (MSU)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Manipal International University (MIU)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Monash University Malaysia');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Multimedia University (MMU)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Newcastle University Medicine Malaysia (NUMed)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Nilai University');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Open University Malaysia (OUM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Perdana University');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Putra Business School (PBS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Quest International University Perak (QIUP)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Raffles University Iskandar (RUI)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('SEGI University (SEGi)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Sultan Azlan Shan University (USAS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Sunway University');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Swinburne University of Technology');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Taylors University');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('The University of Nottingham Malaysia Campus (UNMC)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Tunku International University');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('UCSI University');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('UNITAR International University (UNITAR)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Islam Antarabangsa Sultan Abdul Halim Muadzam Shah (UniSHAMS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Islam Malaysia (UIM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Kuala Lumpur (UniKL)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Selangor (UNISEL)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Sultan Azlan Shah (USAS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Teknologi Petronas (UTP)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Tenaga Nasional (UNITEN)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Tun Abdul Razak (UNIRAZAK)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Universiti Tunku Abdul Rahman (UTAR)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('University Malaysia of Computer Science and Engineering (UNIMY)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('University of Reading Malaysia');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('University of Southampton Malaysia');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Wawasan Open University');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Xiamen University Malaysia Campus (XMUM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Berjaya University College of Hospitality');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('City University College of Science and Technology (CUCST)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Cyberjaya University College of Medical Sciences (CUCMS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('First City University College');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Geomatika University College');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('INSANIAH University College (KUIN)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('International Islamic University College Selangor (KUIS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('International University College of Arts and Science (I-UCAS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Islamic University College of Melaka (KUIM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Islamic University College of Perlis (KUIPs)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Islamic University College of Science & Technology (IUCST)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('KDU University College');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Kolej Universiti Agrosains Malaysia (UCAM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Kolej Universiti Islam Pahang Sultan Ahmad Shah (KUIPSAS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Kolej Universiti Poly – Tech MARA (KUPTM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('KPJ Healthcare University College');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Kuala Lumpur Metropolitan University College (KLMUC)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Lincoln University College');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Linton University College');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Masterskill University College of Health Sciences');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Royal College of Surgeons in Ireland and University College Dublin Malaysia Campus (RUMC)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Southern University College');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Technology Twintech (IUCTT)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Tunku Abdul Rahman University College');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('University College Bestari (UC Bestari)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('University College of Technology Sarawak');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('University College Sabah Foundation (UCSF)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('University College TATI (UC TATI)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Vinayaka Missions International University College (VMIUC)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Widad University College');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Balik Pulau (PBU)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Banting (PBS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Hulu Terengganu (PHT)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Ibrahim Sultan (PIS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Jeli (PJK)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Kota Bharu (PKB)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Kota Kinabalu (PKK)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Kuala Terengganu (PKT)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Kuching Sarawak (PKS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Melaka (PMK)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Merlimau (PMM)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Mersing (PMJ)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik METrO Betong (PMBS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik METrO Johor Bahru (PMJB)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik METrO Kuala Lumpur (PMKL)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik METrO Kuantan (PMKu)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik METrO Tasek Gelugor (PMTG)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Muadzam Shah (PMS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Mukah Sarawak (PMU)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Nilai (PNS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Port Dickson (PPD)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Sandakan Sabah (PSS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Seberang Perai (PSP)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Sultan Abdul Halim Muadzam Shah (POLIMAS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Sultan Azlan Shah (PSAS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Sultan Haji Ahmad Shah (POLISAS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Sultan Idris Shah (PSIS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Sultan Mizan Zainal Abidin (PSMZA)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Sultan Salahuddin Abdul Aziz Shah (PSA)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Tuanku Sultanah Bahiyah (PTSB)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Tuanku Syed Sirajuddin (PTSS)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Tun Syed Nasir (PTSN)');
INSERT INTO wp_career_fair.ref_usm_university (val) VALUES ('Politeknik Ungku Omar (PUO)');



-- #############################################################################################
-- #############################################################################################
-- #############################################################################################
-- #############################################################################################
-- #############################################################################################
-- #############################################################################################
-- #############################################################################################
-- #############################################################################################
-- #############################################################################################

CREATE TABLE `wp_career_fair`.`ref_usm_faculty` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `val` VARCHAR(700) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE(`val`),
  INDEX (`val`)
) ENGINE = InnoDB;

INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UM - Faculty of Arts and Social Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UM - Faculty of Computer Science and Information Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UM - Faculty of Business and Accountancy');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UM - Faculty of Dentistry');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UM - Faculty of Economics and Administration');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UM - Faculty of Education');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UM - Faculty of Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UM - Faculty of Language and Linguistics');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UM - Faculty of Law');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UM - Faculty of Medicine');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UM - Faculty of Built Environment');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UM - Faculty of Science');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UM - Faculty of Pharmacy');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UM - Academy of Islamic Studies');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UM - Academy of Malay Studies');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UIAM - Ahmad Ibrahim Kulliyyah of Laws');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UIAM - Kulliyyah of Architecture and Environmental Design');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UIAM - Kulliyyah of Education');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UIAM - Kulliyyah of Economics and Management Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UIAM - Kulliyyah of Information and Communication Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UIAM - Kulliyyah of Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UIAM - Kulliyyah of Islamic Revealed Knowledge and Human Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UIAM - Kulliyyah of Allied Health Science');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UIAM - Kulliyyah of Medicine');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UIAM - Kulliyyah of Nursing');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UIAM - Kulliyyah of Science');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UIAM - Kulliyyah of Pharmacy');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UIAM - Kulliyyah of Dentistry');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UIAM - Kulliyyah of Languages and Management');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UKM - Faculty of Social Sciences and Humanities');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UKM - Faculty of Science and Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UKM - Faculty of Economics and Management');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UKM - Faculty of Pharmacy');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UKM - Faculty of Islamic Studies');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UKM - Faculty of Health Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UKM - Faculty of Engineering and Built Environment');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UKM - Faculty of Law');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UKM - Faculty of Dentistry');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UKM - Faculty of Education');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UKM - Faculty of Medicine');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UKM - Faculty of Information Science and Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMK - Faculty of Veterinary Medicine');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMK - Faculty of Entrepreneurship and Business');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMK - Faculty of Agro Based Industry');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMK - Faculty of Earth Science');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMK - Faculty of Hospitality, Tourism and Wellness');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMK - Faculty of Architecture and Ekistics');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMK - Faculty of Technology Creative and Heritage');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMK - Faculty of Bioengineering and Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMP - Faculty of Chemical and Process Engineering Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMP - Faculty of Civil Engineering Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMP - Faculty of Electrical and Electronic Engineering Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMP - Faculty of Manufacturing and Mechatronic Engineering Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMP - Faculty of Mechanical and Automotive Engineering Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMP - Faculty of Computing');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMP - Faculty of Industrial Sciences and Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMP - Centre for Mathematical Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMP - Center for Human Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMP - Center for Modern Languages');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMP - Faculty of Industrial Management');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UniMAP - Faculty of Electronic Engineering Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UniMAP - Faculty of Electrical Engineering Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UniMAP - Faculty of Mechanical Engineering Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UniMAP - Faculty of Civil Engineering Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UniMAP - Faculty of Chemical Engineering Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UniMAP - Faculty of Applied Sciences & Humanities');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UniMAP - Institute of Nano Electronic Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMS - Faculty of Business, Economics and Accountancy');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMS - Faculty of Computing and Informatics');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMS - Faculty of Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMS - Faculty of Food Science and Nutrition');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMS - Faculty of Humanities, Art and Heritage');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMS - Faculty of Medicine and Health Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMS - Faculty of Psychology and Education');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMS - Faculty of Science and Natural Resources');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMS - Faculty of Sustainable Agriculture');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMS - Labuan Faculty of International Finance');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UNIMAS - Faculty of Computer Science and Information Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UNIMAS - Faculty of Applied and Creative Arts');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UNIMAS - Faculty of Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UNIMAS - Faculty of Cognitive Sciences and Human Development');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UNIMAS - Faculty of Social Sciences and Humanities');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UNIMAS - Faculty of Economics and Business');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UNIMAS - Faculty of Resource Science and Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UNIMAS - Faculty of Medicine and Health Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UNIMAS - Faculty of Language and Communication');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMT - Faculty of Maritime Studies');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMT - Faculty of Science & Marine Environment');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMT - Faculty of Ocean Engineering Technology & Informatics');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMT - Faculty of Fisheries & Food Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UMT - Faculty of Business, Economics & Social Development');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPSI - Faculty of Languages and Communications');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPSI - Faculty of Music and Performing Arts');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPSI - Faculty of Management and Economics');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPSI - Faculty of Human Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPSI - Faculty of Sciences and Mathematics');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPSI - Faculty of Sports Sciences and Coaching');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPSI - Faculty of Arts, Computing and Industry Creative');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPSI - Faculty of Human Development');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPSI - Faculty of Technical and Vocational');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPNM - Faculty of Defence Studies and Management');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPNM - Faculty of Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPNM - Faculty of Defence Science and Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPNM - Faculty of Medicine and Defence Health');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPM - Faculty of Agriculture');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPM - Faculty of Forestry');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPM - Faculty of Veterinary Medicine');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPM - Faculty of Medicine and Health Science');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPM - Faculty of Human Ecology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPM - Faculty of Economics and Management');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPM - Faculty of Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPM - Faculty of Food Science and Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPM - Faculty of Educational Studies');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPM - Faculty of Science');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPM - Faculty of Design and Architecture');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPM - Faculty of Modern Languages and Communication');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPM - Faculty of Computer Science and Information Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPM - Faculty of Biotechnology and Biomolecular Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPM - Faculty of Environmental Studies');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UPM - Faculty of Agriculture and Food Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USIM - Faculty of Quranic and Sunnah Studies');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USIM - Faculty of Leadership and Management');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USIM - Faculty of Syariah and Law');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USIM - Faculty of Economics and Muamalat');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USIM - Faculty of Science and Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USIM - Faculty of Medicine and Health Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USIM - Faculty of Major Language and Studies');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USIM - Faculty of Dentistry');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USIM - Faculty of Engineering and Built Environment');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Aerospace Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Civil Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Electrical and Electronic Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Materials and Mineral Resources Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Chemical Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Mechanical Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Housing, Building and Planning');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Industrial Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Pharmaceutical Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Computer Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Educational Studies');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Management');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - Graduate School of Business (GSB)');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Communication');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of the Art');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Languages, Literacies and Translation');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Humanities');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Social Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Biological Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Chemical Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Mathematical Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Physics');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Medical Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Dental Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Heath Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('USM - School of Distance Education');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UniSZA - Faculty of Languages and Communication');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UniSZA - Faculty of Islamic Contemporary Studies');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UniSZA - Faculty of Informatics and Computing');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UniSZA - Faculty of Economics, Accountancy and Management Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UniSZA - Faculty of Bioresources and Food Industry');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UniSZA - Faculty of Innovative Design and Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UniSZA - Faculty of Health Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UniSZA - Faculty of Medicine');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UniSZA - Faculty of Law and International Relations');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UniSZA - Faculty of Applied Social Science');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTeM - Faculty of Electronics and Computer Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTeM - Faculty of Electrical Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTeM - Faculty of Mechanical Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTeM - Faculty of Manufacturing Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTeM - Faculty of Information and Communications Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTeM - Faculty of Technology Management and Technopreneurship');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTeM - Faculty of Mechanical and Manufacturing Engineering Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTeM - Faculty of Electrical and Electronic Engineering Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTM - Faculty of Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTM - Faculty of Social Science and Humanities');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTM - Faculty of Built Environment and Surveying');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTM - Faculty of Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTM - Azman Hashim International Business School');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTM - Malaysia-Japan International Institute of Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTM - Razak Faculty of Technology and Informatics');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Electrical Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Mechanical Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Chemical Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Civil Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Pharmacy');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Medicine');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Dentistry');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Health Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Applied Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Computer and Mathematical Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Architecture, Planning and Surveying');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Sports Science and Recreation');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Plantation and Agrotechnology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Law');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Administrative Science and Policy Studies');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Communication and Media Studies');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Art and Design');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Film, Theater and Animation');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Music');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Education');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Academy of Contemporary Islamic Studies (ACIS)');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Academy of Language Studies (APB)');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Accountancy');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Business and Management');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Hotel and Tourism Management');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UiTM - Faculty of Information Management');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTHM - Faculty of Civil Engineering and Built Environmental');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTHM - Faculty of Electrical and Electronic Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTHM - Faculty of Mechanical and Manufacturing Engineering');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTHM - Faculty of Technology Management and Business');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTHM - Faculty of Technical and Vocational Education');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTHM - Faculty of Computer Science Technology and Information');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTHM - Faculty of Applied Science and Technology (FAST)');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UTHM - Faculty of Engineering Technology');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UUM - School of Accountancy');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UUM - School of Government');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UUM - School of Quantitative Sciences');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UUM - School of Business Management');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UUM - School of International Studies');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UUM - School of Applied Psychology, Social Work and Policy');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UUM - School of Computing');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UUM - School of Islamic Business');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UUM - School of Technology Management and Logistics');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UUM - School of Economics, Finance and Banking');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UUM - School of Law');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UUM - School of Tourism, Hospitality and Event Management');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UUM - School of Education and Modern Language');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UUM - School of Multimedia Technology and Communication');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UUM - School of Language, Civilization and Philosophy');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('UUM - School of Creative Industry Management and Performing Arts');
INSERT INTO wp_career_fair.ref_usm_faculty (val) VALUES ('Other');