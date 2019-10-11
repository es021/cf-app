CREATE TABLE `wp_career_fair`.`single_input` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`key_input` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
`updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `key_input`)) ENGINE = InnoDB;
