DROP TABLE IF EXISTS `wp_career_fair`.`ref_cso_gender`;

CREATE TABLE `wp_career_fair`.`ref_cso_gender` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_cso_gender (val) VALUES ('Male 男'); 
INSERT INTO ref_cso_gender (val) VALUES ('Female 女'); 


-- ##############################################################################################################
-- ##############################################################################################################

DROP TABLE IF EXISTS `wp_career_fair`.`ref_cso_province`;

CREATE TABLE `wp_career_fair`.`ref_cso_province` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_cso_province (val) VALUES ('马来西亚留学北京学生会 AMSIB'); 
INSERT INTO ref_cso_province (val) VALUES ('湖北省马来西亚同学会 AMSIH'); 
INSERT INTO ref_cso_province (val) VALUES ('马来西亚旅秦同学会 AMSISX'); 
INSERT INTO ref_cso_province (val) VALUES ('福建省马来西亚学生会 MSAFJ'); 
INSERT INTO ref_cso_province (val) VALUES ('广东省马来西亚同学会 MSAGD'); 
INSERT INTO ref_cso_province (val) VALUES ('广西壮族自治区马来西亚同学会 MSAGX'); 
INSERT INTO ref_cso_province (val) VALUES ('黑龙江省马来西亚学生会 MSAH'); 
INSERT INTO ref_cso_province (val) VALUES ('河南省马来西亚同学会 MSAHN'); 
INSERT INTO ref_cso_province (val) VALUES ('湖南省马来西亚同学会 MSAHUN'); 
INSERT INTO ref_cso_province (val) VALUES ('江苏省马来西亚同学会 MSAJS'); 
INSERT INTO ref_cso_province (val) VALUES ('马来西亚驻上海同学会 MSAS'); 
INSERT INTO ref_cso_province (val) VALUES ('四川省马来西亚留华同学会 MSASC'); 
INSERT INTO ref_cso_province (val) VALUES ('山东省马来西亚学生会 MSASD'); 
INSERT INTO ref_cso_province (val) VALUES ('天津马来西亚留学生会 MSAT'); 
INSERT INTO ref_cso_province (val) VALUES ('浙江省马来西亚同学会 MSAZ'); 
INSERT INTO ref_cso_province (val) VALUES ('其他 Others'); 

-- ##############################################################################################################
-- ##############################################################################################################

DROP TABLE IF EXISTS `wp_career_fair`.`ref_cso_field_study`;

CREATE TABLE `wp_career_fair`.`ref_cso_field_study` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_cso_field_study (val) VALUES ('哲学 Philosophy'); 
INSERT INTO ref_cso_field_study (val) VALUES ('历史学 History'); 
INSERT INTO ref_cso_field_study (val) VALUES ('文学 Literature'); 
INSERT INTO ref_cso_field_study (val) VALUES ('艺术学 Arts'); 
INSERT INTO ref_cso_field_study (val) VALUES ('教育学 Education'); 
INSERT INTO ref_cso_field_study (val) VALUES ('法学 Law'); 
INSERT INTO ref_cso_field_study (val) VALUES ('经济学 Economics'); 
INSERT INTO ref_cso_field_study (val) VALUES ('管理学 Management'); 
INSERT INTO ref_cso_field_study (val) VALUES ('理学 Science'); 
INSERT INTO ref_cso_field_study (val) VALUES ('工学 Engineering'); 
INSERT INTO ref_cso_field_study (val) VALUES ('农学 Agriculture'); 
INSERT INTO ref_cso_field_study (val) VALUES ('医学 Medicine'); 
INSERT INTO ref_cso_field_study (val) VALUES ('军事学 Military Science'); 
INSERT INTO ref_cso_field_study (val) VALUES ('其他 Others'); 


-- ##############################################################################################################
-- ##############################################################################################################

DROP TABLE IF EXISTS `wp_career_fair`.`ref_cso_grade`;

CREATE TABLE `wp_career_fair`.`ref_cso_grade` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_cso_grade (val) VALUES ('大一本科生 Year 1 Undergraduate'); 
INSERT INTO ref_cso_grade (val) VALUES ('大二本科生 Year 2 Undergraduate'); 
INSERT INTO ref_cso_grade (val) VALUES ('大三本科生 Year 3 Undergraduate'); 
INSERT INTO ref_cso_grade (val) VALUES ('大四本科生 Year 4 Undergraduate'); 
INSERT INTO ref_cso_grade (val) VALUES ('大五本科生 Year 5 Undergraduate'); 
INSERT INTO ref_cso_grade (val) VALUES ('大六本科生 Year 6 Undergraduate'); 
INSERT INTO ref_cso_grade (val) VALUES ('研究/硕士生 Master’s'); 
INSERT INTO ref_cso_grade (val) VALUES ('博士生 PhD'); 
INSERT INTO ref_cso_grade (val) VALUES ('其他 Others'); 
 

-- ##############################################################################################################
-- ##############################################################################################################

DROP TABLE IF EXISTS `wp_career_fair`.`ref_cso_year_grad`;

CREATE TABLE `wp_career_fair`.`ref_cso_year_grad` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_cso_year_grad (val) VALUES ('在2022年之前 Graduating before 2022'); 
INSERT INTO ref_cso_year_grad (val) VALUES ('2022'); 
INSERT INTO ref_cso_year_grad (val) VALUES ('2023'); 
INSERT INTO ref_cso_year_grad (val) VALUES ('2024'); 
INSERT INTO ref_cso_year_grad (val) VALUES ('2025'); 
INSERT INTO ref_cso_year_grad (val) VALUES ('2026'); 
INSERT INTO ref_cso_year_grad (val) VALUES ('其他 Others'); 

-- ##############################################################################################################
-- ##############################################################################################################

DROP TABLE IF EXISTS `wp_career_fair`.`ref_cso_field_to_work`;

CREATE TABLE `wp_career_fair`.`ref_cso_field_to_work` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_cso_field_to_work (val) VALUES ('哲学类 Philosophy'); 
INSERT INTO ref_cso_field_to_work (val) VALUES ('历史学类 History'); 
INSERT INTO ref_cso_field_to_work (val) VALUES ('文学类 Literature'); 
INSERT INTO ref_cso_field_to_work (val) VALUES ('艺术学类 Arts'); 
INSERT INTO ref_cso_field_to_work (val) VALUES ('教育学类 Education'); 
INSERT INTO ref_cso_field_to_work (val) VALUES ('法学类 Laws'); 
INSERT INTO ref_cso_field_to_work (val) VALUES ('经济学类 Economics'); 
INSERT INTO ref_cso_field_to_work (val) VALUES ('管理学类 Management'); 
INSERT INTO ref_cso_field_to_work (val) VALUES ('理学类 Science'); 
INSERT INTO ref_cso_field_to_work (val) VALUES ('工学类 Engineering'); 
INSERT INTO ref_cso_field_to_work (val) VALUES ('农学类 Agriculture'); 
INSERT INTO ref_cso_field_to_work (val) VALUES ('医学类 Medicine'); 
INSERT INTO ref_cso_field_to_work (val) VALUES ('军事学类 Military Science'); 
INSERT INTO ref_cso_field_to_work (val) VALUES ('其他 Others'); 



-- ##############################################################################################################
-- ##############################################################################################################

DROP TABLE IF EXISTS `wp_career_fair`.`ref_cso_plan_after_grad`;

CREATE TABLE `wp_career_fair`.`ref_cso_plan_after_grad` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_cso_plan_after_grad (val) VALUES ('升学（本地或国外）Further studies (local or foreign)'); 
INSERT INTO ref_cso_plan_after_grad (val) VALUES ('就业（本地或国外）Employment (local or foreign)'); 

-- ##############################################################################################################
-- ##############################################################################################################

DROP TABLE IF EXISTS `wp_career_fair`.`ref_cso_employ_intention`;

CREATE TABLE `wp_career_fair`.`ref_cso_employ_intention` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_cso_employ_intention (val) VALUES ('回马来西亚发展 Back to Malaysia for development'); 
INSERT INTO ref_cso_employ_intention (val) VALUES ('留在中国发展 Stay in China for development'); 
INSERT INTO ref_cso_employ_intention (val) VALUES ('到其他国家发展  To develop in other countries'); 

DROP TABLE IF EXISTS `wp_career_fair`.`multi_cso_employ_intention`;

CREATE TABLE `wp_career_fair`.`multi_cso_employ_intention` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;

-- ##############################################################################################################
-- ##############################################################################################################

DROP TABLE IF EXISTS `wp_career_fair`.`ref_cso_salary`;

CREATE TABLE `wp_career_fair`.`ref_cso_salary` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_cso_salary (val) VALUES ('RM2000以下 Below RM2000'); 
INSERT INTO ref_cso_salary (val) VALUES ('RM2000-RM3000'); 
INSERT INTO ref_cso_salary (val) VALUES ('RM3000-RM4000'); 
INSERT INTO ref_cso_salary (val) VALUES ('RM4000-RM5000'); 
INSERT INTO ref_cso_salary (val) VALUES ('RM5000以上 Above RM5000'); 


-- ##############################################################################################################
-- ##############################################################################################################

DROP TABLE IF EXISTS `wp_career_fair`.`ref_cso_career_priority`;

CREATE TABLE `wp_career_fair`.`ref_cso_career_priority` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_cso_career_priority (val) VALUES ('工资收入及福利 Salary income and benefits'); 
INSERT INTO ref_cso_career_priority (val) VALUES ('个人发展机会 Personal development opportunities'); 
INSERT INTO ref_cso_career_priority (val) VALUES ('专业对口 Match of major'); 
INSERT INTO ref_cso_career_priority (val) VALUES ('工作地点 Work place'); 
INSERT INTO ref_cso_career_priority (val) VALUES ('个人兴趣爱好 Personal interests'); 
INSERT INTO ref_cso_career_priority (val) VALUES ('企业管理及企业文化 Corporate management and corporate culture'); 

DROP TABLE IF EXISTS `wp_career_fair`.`multi_cso_career_priority`;

CREATE TABLE `wp_career_fair`.`multi_cso_career_priority` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;


-- ##############################################################################################################
-- ##############################################################################################################

DROP TABLE IF EXISTS `wp_career_fair`.`ref_cso_activity`;

CREATE TABLE `wp_career_fair`.`ref_cso_activity` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;

INSERT INTO ref_cso_activity (val) VALUES ('开幕典礼 Opening Ceremony'); 
INSERT INTO ref_cso_activity (val) VALUES ('论坛 Forum Session'); 
INSERT INTO ref_cso_activity (val) VALUES ('主题讲座 Theme Talk Session'); 
INSERT INTO ref_cso_activity (val) VALUES ('茶谈会 Coffee Chat Session'); 
INSERT INTO ref_cso_activity (val) VALUES ('一对一面试  One-on-one Interview Session'); 
INSERT INTO ref_cso_activity (val) VALUES ('闭幕典礼 Closing Ceremony'); 
 
DROP TABLE IF EXISTS `wp_career_fair`.`multi_cso_activity`;

CREATE TABLE `wp_career_fair`.`multi_cso_activity` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;