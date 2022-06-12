
DROP TABLE IF EXISTS wp_career_fair.ref_d2w2_university;

CREATE TABLE wp_career_fair.ref_d2w2_university 
( 
  ID INT NOT NULL AUTO_INCREMENT , 
  val VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
  PRIMARY KEY (ID), UNIQUE(val), INDEX (val)
) ENGINE = InnoDB;

INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Islam Antarabangsa Malaysia (UIAM)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Kebangsaan Malaysia (UKM)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Malaya (UM)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Malaysia Kelantan (UMK)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Malaysia Pahang (UMP)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Malaysia Perlis (UNIMAP)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Malaysia Sabah (UMS)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Malaysia Sarawak (UNIMAS)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Malaysia Terengganu (UMT)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Pendidikan Sultan Idris (UPSI)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Pertahanan Nasional Malaysia (UPNM)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Putra Malaysia (UPM)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Sains Islam Malaysia (USIM)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Sains Malaysia (USM)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Sultan Zainal Abidin (UNISZA)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Teknikal Malaysia Melaka (UTEM)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Teknologi Malaysia (UTM)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Teknologi MARA (UiTM)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Tun Hussein Onn (UTHM)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Utara Malaysia (UUM)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Ungku Omar (PUO)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Sultan Haji Ahmad Shah (POLISAS)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Sultan Abdul Halim Mu\'adzam Shah (POLIMAS)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Kota Bharu (PKB)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Kuching Sarawak (PKS)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Port Dickson (PPD)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Kota Kinabalu (PKK)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Sultan Salahuddin Abdul Aziz Shah (PSA)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Ibrahim Sultan (PIS)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Seberang Perai (PSP)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Melaka (PMK)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Kuala Terengganu (PKT)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Sultan Mizan Zainal Abidin (PSMZA)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Merlimau (PMM)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Sultan Azlan Shah (PSAS)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Tuanku Sultanah Bahiyah (PTSB)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Sultan Idris Shah (PSIS)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Tuanku Syed Sirajuddin (PTSS)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Muadzam Shah (PMS)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Mukah Sarawak (PMU)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Balik Pulau (PBU)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Jeli (PJK)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Nilai (PNS)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Banting (PBS)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Mersing (PMJ)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Hulu Terengganu (PHT)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Sandakan (PSS)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik METrO Kuala Lumpur (PMKL)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik METrO Kuantan (PMKU)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik METrO Johor Bahru (PMJB)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik METrO Betong (PMBS)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik METrO Tasek Gelugor (PMTG)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Tun Syed Nasir Syed Ismail (PTSN)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Besut (PBT)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Bagan Datuk (PBD)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Politeknik Tawau (PTS)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Bagan Datoh');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Bagan Serai');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Batu Gajah');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Chenderoh');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Gerik');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Kuala Kangsar');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Manjung');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Pasir Salak');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti RTC Gopeng');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Sungai Siput');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Taiping');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Tapah');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Teluk Intan');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Baling Kedah');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Bandar Baharu');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Bandar Darulaman');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Jerai');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Kulim');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Padang Terap');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Sungai Petani');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Bukit Mertajam');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Bayan Baru');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Kepala Batas');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Nibong Tebal');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Seberang Jaya');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Tasek Gelugor');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Bentong');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Bera');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Jerantut');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Kuantan');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Lipis');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Paya Besar');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Pekan');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Raub');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Rompin');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Temerloh');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Besut');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kemaman');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Kuala Terengganu');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Jeli');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Kok Lanas');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Pasir Mas');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Ampang');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Hulu Langat');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Hulu Selangor');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Klang');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Kuala Langat');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Sabak Bernam');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Selayang');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Shah Alam');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Tanjong Karang');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Jelebu');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Jempol');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Rembau');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Tampin');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Bukit Beruang');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Jasin');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Kota Melaka');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Masjid Tanah');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Selandar');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Tangga Batu');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Bandar Panawar');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti bandar Tenggara');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Batu Pahat');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Kluang');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Kota Tinggi');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Ledang');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Muar');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Pagoh');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Pasir Gudang');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Segamat');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Segamat 2');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Tanjung Piai');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Beaufort');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Lahad Datu');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Sandakan');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Semporna');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Tambunan');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Tawau');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Betong');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Kuching');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Mas Gading');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Miri');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Santubong');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Komuniti Sarikei');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Multimedia University (MMU), Cyberjaya');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Tenaga Nasional (UNITEN)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Tun Abdul Razak (UniRAZAK)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Teknologi Petronas (UTP)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('International Medical University (IMU)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Selangor (UNISEL)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Open University Malaysia (OUM)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Malaysia University of Science & Technology (MUST)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('AIMST University');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Tunku Abdul Rahman (UTAR)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Kuala Lumpur (UniKL)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Wawasan Open University');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Albukhary International University');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Al-Madinah International University (MEDIU)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('International Centre for Education in Islamic Finance (INCEIF)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Limkokwing University of Creative Technology');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Management and Science University (MSU)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Asia e University (AeU)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('UCSI University');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Quest International University Perak');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('INTI International University (IIU)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Taylor’s University');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Sunway University');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Manipal International University');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Perdana University');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('HELP University');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('UNITAR International University');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Raffles University Iskandar (RUI)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Malaysia Institute of Supply Chain Innovation (MISI)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Nilai University');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('SEGi University');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Asia Pacific University of Technology and Innovation (APU)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Binary University of Management and Entrepreneurship');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Infrastructure University Kuala Lumpur (IUKL)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Asia Metropolitan University');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Putra Business School');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Global NXT University');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('MAHSA University');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('International University of Malaya-Wales');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('University Malaysia of Computer Science and Engineering');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Islam Malaysia, Cyberjaya');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('DRB-HICOM University of Automotive Malaysia');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Asia School of Business');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('City University');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Meritus University');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Sultan Azlan Shan');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Universiti Islam Antarabangsa Sultan Abdul Halim Mu’adzam Shah');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('International University College of Technology Twintech (IUCTT)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('North Borneo University College, Sabah (formerly known as International University College of Technology Twintech, Sabah campus)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Selangor International Islamic University College (SIUC)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Cyberjaya University College of Medical Sciences (CUCMS)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kuala Lumpur Metropolitan University College (KLMUC)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('TATI University College');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Berjaya University College of Hospitality');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Melaka Islamic University College');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Linton University College');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('KDU University College');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Widad University College');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('KPJ Healthcare University College');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Lincoln University College');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Southern University College');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Bestari University College');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Vinayaka Mission International University College');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('University College of Technology Sarawak');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Tunku Abdul Rahman University College');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Islamic University College of Science & Technology');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Geomatika University College');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Islamic Unversity College of Perlis (KUIPs)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('University College Sabah Foundation (UCSF)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Universiti Agrosains Malaysia');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Universiti Islam Pahang Sultan Ahmad Shah');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Kolej Universiti Poly-Tech MARA');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('KDU University College');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('First City University College');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('New Era University College');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Fairview University College');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('International University College of Technology Twintech (IUCTT)');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Saito University College');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Han Chiang University College of Communication');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Genovasi University College');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('PICOMS International University College');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('University College of Yayasan Pahang');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Monash University Malaysia');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Curtin University, Sarawak');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('The University of Nottingham Malaysia Campus');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Swinburne University of Technology, Sarawak Campus');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Newcastle University Medicine Malaysia');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('University of Southampton Malaysia Campus');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Heriot-Watt University Malaysia');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('University of Reading Malaysia');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Xiamen University Malaysia Campus');
INSERT IGNORE INTO ref_d2w2_university (val) VALUES ('Royal College of Surgeons In Ireland And University College Dublin Malaysia Campus');





DROP TABLE IF EXISTS wp_career_fair.ref_d2w2_state;

CREATE TABLE wp_career_fair.ref_d2w2_state 
( 
  ID INT NOT NULL AUTO_INCREMENT , 
  val VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
  PRIMARY KEY (ID), UNIQUE(val), INDEX (val)
) ENGINE = InnoDB;

INSERT IGNORE INTO ref_d2w2_state (val) VALUES ('Federal Territory/ Kuala Lumpur');
INSERT IGNORE INTO ref_d2w2_state (val) VALUES ('Federal territory/ Labuan');
INSERT IGNORE INTO ref_d2w2_state (val) VALUES ('Federal Territory/ Putrajaya');
INSERT IGNORE INTO ref_d2w2_state (val) VALUES ('Johor');
INSERT IGNORE INTO ref_d2w2_state (val) VALUES ('Kedah');
INSERT IGNORE INTO ref_d2w2_state (val) VALUES ('Kelantan');
INSERT IGNORE INTO ref_d2w2_state (val) VALUES ('Melaka');
INSERT IGNORE INTO ref_d2w2_state (val) VALUES ('Negeri Sembilan');
INSERT IGNORE INTO ref_d2w2_state (val) VALUES ('Pahang');
INSERT IGNORE INTO ref_d2w2_state (val) VALUES ('Penang');
INSERT IGNORE INTO ref_d2w2_state (val) VALUES ('Perak');
INSERT IGNORE INTO ref_d2w2_state (val) VALUES ('Perlis');
INSERT IGNORE INTO ref_d2w2_state (val) VALUES ('Sabah');
INSERT IGNORE INTO ref_d2w2_state (val) VALUES ('Sarawak');
INSERT IGNORE INTO ref_d2w2_state (val) VALUES ('Selangor');
INSERT IGNORE INTO ref_d2w2_state (val) VALUES ('Terengganu');
INSERT IGNORE INTO ref_d2w2_state (val) VALUES ('Others (Please specify in field below)');


DROP TABLE IF EXISTS wp_career_fair.ref_d2w2_year_of_study;

CREATE TABLE wp_career_fair.ref_d2w2_year_of_study 
( 
  ID INT NOT NULL AUTO_INCREMENT , 
  val VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
  PRIMARY KEY (ID), UNIQUE(val), INDEX (val)
) ENGINE = InnoDB;

INSERT IGNORE INTO ref_d2w2_year_of_study (val) VALUES ('First Year');
INSERT IGNORE INTO ref_d2w2_year_of_study (val) VALUES ('Second Year');
INSERT IGNORE INTO ref_d2w2_year_of_study (val) VALUES ('Third Year');
INSERT IGNORE INTO ref_d2w2_year_of_study (val) VALUES ('Fourth Year');




DROP TABLE IF EXISTS wp_career_fair.ref_d2w2_level_of_study;

CREATE TABLE wp_career_fair.ref_d2w2_level_of_study 
( 
  ID INT NOT NULL AUTO_INCREMENT , 
  val VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
  PRIMARY KEY (ID), UNIQUE(val), INDEX (val)
) ENGINE = InnoDB;

INSERT IGNORE INTO ref_d2w2_level_of_study (val) VALUES ('SKM 1');
INSERT IGNORE INTO ref_d2w2_level_of_study (val) VALUES ('SKM 2');
INSERT IGNORE INTO ref_d2w2_level_of_study (val) VALUES ('SKM 3');
INSERT IGNORE INTO ref_d2w2_level_of_study (val) VALUES ('SKM 4');
INSERT IGNORE INTO ref_d2w2_level_of_study (val) VALUES ('SKM 5');
INSERT IGNORE INTO ref_d2w2_level_of_study (val) VALUES ('Diploma');
INSERT IGNORE INTO ref_d2w2_level_of_study (val) VALUES ('Professional Certificate');
INSERT IGNORE INTO ref_d2w2_level_of_study (val) VALUES ('Bachelor’s Degree');
INSERT IGNORE INTO ref_d2w2_level_of_study (val) VALUES ('Master’s Degree');
INSERT IGNORE INTO ref_d2w2_level_of_study (val) VALUES ('PhD');





DROP TABLE IF EXISTS wp_career_fair.ref_d2w2_field_of_study;

CREATE TABLE wp_career_fair.ref_d2w2_field_of_study 
( 
  ID INT NOT NULL AUTO_INCREMENT , 
  val VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
  PRIMARY KEY (ID), UNIQUE(val), INDEX (val)
) ENGINE = InnoDB;

INSERT IGNORE INTO ref_d2w2_field_of_study (val) VALUES ('Education');
INSERT IGNORE INTO ref_d2w2_field_of_study (val) VALUES ('Arts and Humanities');
INSERT IGNORE INTO ref_d2w2_field_of_study (val) VALUES ('Languages');
INSERT IGNORE INTO ref_d2w2_field_of_study (val) VALUES ('Social and behavioural sciences');
INSERT IGNORE INTO ref_d2w2_field_of_study (val) VALUES ('Journalism, information and communication');
INSERT IGNORE INTO ref_d2w2_field_of_study (val) VALUES ('Business, Administration and Law');
INSERT IGNORE INTO ref_d2w2_field_of_study (val) VALUES ('Natural Sciences, Mathematics and Statistics');
INSERT IGNORE INTO ref_d2w2_field_of_study (val) VALUES ('Information and Communication Technologies');
INSERT IGNORE INTO ref_d2w2_field_of_study (val) VALUES ('Engineering, Manufacturing and Construction');
INSERT IGNORE INTO ref_d2w2_field_of_study (val) VALUES ('Agriculture, Forestry, Fisheries and Veterinary');
INSERT IGNORE INTO ref_d2w2_field_of_study (val) VALUES ('Health and Welfare');
INSERT IGNORE INTO ref_d2w2_field_of_study (val) VALUES ('Services');




DROP TABLE IF EXISTS wp_career_fair.ref_d2w2_intern_duration;

CREATE TABLE wp_career_fair.ref_d2w2_intern_duration 
( 
  ID INT NOT NULL AUTO_INCREMENT , 
  val VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
  PRIMARY KEY (ID), UNIQUE(val), INDEX (val)
) ENGINE = InnoDB;

INSERT IGNORE INTO ref_d2w2_intern_duration (val) VALUES ('1 month');
INSERT IGNORE INTO ref_d2w2_intern_duration (val) VALUES ('2 months');
INSERT IGNORE INTO ref_d2w2_intern_duration (val) VALUES ('3 months');
INSERT IGNORE INTO ref_d2w2_intern_duration (val) VALUES ('4 months');
INSERT IGNORE INTO ref_d2w2_intern_duration (val) VALUES ('5 months');
INSERT IGNORE INTO ref_d2w2_intern_duration (val) VALUES ('6 months');
INSERT IGNORE INTO ref_d2w2_intern_duration (val) VALUES ('7 months');
INSERT IGNORE INTO ref_d2w2_intern_duration (val) VALUES ('8 months');
INSERT IGNORE INTO ref_d2w2_intern_duration (val) VALUES ('9 months');
INSERT IGNORE INTO ref_d2w2_intern_duration (val) VALUES ('10 months');
INSERT IGNORE INTO ref_d2w2_intern_duration (val) VALUES ('11 months');
INSERT IGNORE INTO ref_d2w2_intern_duration (val) VALUES ('12 months');
INSERT IGNORE INTO ref_d2w2_intern_duration (val) VALUES ('More than 12 months');