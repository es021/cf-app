CREATE TABLE `wp_career_fair`.`ref_city_state_country` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
    `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
    `type` VARCHAR(10)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
    
    `city_id` INT, 
    `city` VARCHAR(700) CHARACTER SET latin1 COLLATE latin1_swedish_ci,

    `state_id` INT, 
    `state` VARCHAR(700) CHARACTER SET latin1 COLLATE latin1_swedish_ci,
    
    `country_id` INT, 
    `country` VARCHAR(700) CHARACTER SET latin1 COLLATE latin1_swedish_ci,

PRIMARY KEY (`ID`), 
    UNIQUE(`val`), 
    INDEX (`val`)
) ENGINE = InnoDB;

-- ########################################################################################################
-- ########################################################################################################

INSERT INTO ref_city_state_country (val, type, city_id, city, state_id, state, country_id, country)
select 
        concat(ct.val, ", ", st.val) as val,
        "city" as type,
        ct.ID as city_id, ct.val as city,
        st.ID as state_id, st.val as state,
        cn.ID as country_id, cn.val as country
        from ref_city ct, ref_state st, ref_country cn
        where 1=1 
        and ct.state_id = st.ID
        and ct.country_id = cn.ID
    
    UNION ALL
        select 
        concat(st.val, ", ", cn.val) as val,
        "state" as type,
        null as city_id, null as city,
        st.ID as state_id, st.val as state,
        cn.ID as country_id, cn.val as country
        from ref_state st, ref_country cn
        where 1=1 
        and st.country_id = cn.ID

    UNION ALL
        select 
        cn.val as val,
        "country" as type,
        null as city_id, null as city,
        null as state_id, null as state,
        cn.ID as country_id, cn.val as country
        from ref_country cn
        where 1=1