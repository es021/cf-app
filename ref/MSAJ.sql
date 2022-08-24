DROP TABLE IF EXISTS `wp_career_fair`.`ref_msaj_prefecture`;

CREATE TABLE `wp_career_fair`.`ref_msaj_prefecture` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Hokkaido');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Aomori');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Iwate');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Miyagi');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Akita');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Yamagata');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Fukushima');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Ibaraki');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Tochigi');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Gunma');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Saitama');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Chiba');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Tokyo');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Kanagawa');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Niigata');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Toyama');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Ishikawa');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Fukui');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Yamanashi');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Nagano');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Gifu');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Shizuoka');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Aichi');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Mie');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Shiga');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Kyoto');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Osaka');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Hyogo');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Nara');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Wakayama');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Tottori');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Shimane');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Okayama');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Hiroshima');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Yamaguchi');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Tokushima');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Kagawa');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Ehime');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Kochi');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Fukuoka');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Saga');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Nagasaki');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Kumamoto');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Oita');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Miyazaki');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Kagoshima');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Okinawa');
INSERT IGNORE INTO ref_msaj_prefecture (val) VALUES ('Not Applicable');






DROP TABLE IF EXISTS wp_career_fair.ref_nationality;

CREATE TABLE wp_career_fair.ref_nationality 
( 
  ID INT NOT NULL AUTO_INCREMENT , 
  val VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
  PRIMARY KEY (ID), UNIQUE(val), INDEX (val)
) ENGINE = InnoDB;

INSERT IGNORE INTO ref_nationality (val) VALUES ('Malaysian');
INSERT IGNORE INTO ref_nationality (val) VALUES ('Others (Please specify in field below)');