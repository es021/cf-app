

CREATE TABLE wp_career_fair.ref_d2w2_looking_for 
( 
  ID INT NOT NULL AUTO_INCREMENT , 
  val VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
  PRIMARY KEY (ID), UNIQUE(val), INDEX (val)
) ENGINE = InnoDB;

INSERT IGNORE INTO ref_d2w2_looking_for (val) VALUES ('Full Time');
INSERT IGNORE INTO ref_d2w2_looking_for (val) VALUES ('Internship');

INSERT IGNORE INTO ref_d2w2_year_of_study (val) VALUES ('Final Year');
INSERT IGNORE INTO ref_d2w2_year_of_study (val) VALUES ('Fresh Grad');
INSERT IGNORE INTO ref_d2w2_year_of_study (val) VALUES ('Not Applicable');