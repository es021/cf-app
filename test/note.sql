SELECT *
FROM (
        -- select "cf" as _key,
        --     c.name as _val,
        --     (
        --         select m.meta_value
        --         from cfs_meta m
        --         where m.cf_name = c.name
        --             and m.meta_key = "title"
        --     ) as _val_label,
        --     COUNT(s.entity) as _total
        -- from cf_map s,
        --     cfs c
        -- where 1 = 1
        --     and s.cf = c.name
        --     and s.entity = 'user'
        --     and c.is_load = 1
        --     and c.name != "TEST"
        --     and 1 = 1
        --     AND (
        --         'INTELDD21' IN (
        --             select ms.cf
        --             from cf_map ms
        --             where ms.entity = 'user'
        --                 and ms.entity_id = s.entity_id
        --         )
        --     )
        --     AND (1 = 1)
        --     AND (1 = 1)
        --     AND (
        --         select mm2.meta_value
        --         FROM wp_cf_usermeta mm2
        --         WHERE 1 = 1
        --             AND mm2.user_id = s.entity_id
        --             AND mm2.meta_key = "wp_cf_capabilities"
        --     ) = 'a:1:{s:7:"student";b:1;}'
        -- GROUP BY s.cf
        -- UNION ALL
        SELECT s.key_input as _key,
            s.val as _val,
            "" as _val_label,
            COUNT(*) as _total
        FROM single_input s
        where (
                1 = 0
                OR 1 = 0
                OR 1 = 0
                OR 1 = 0
                OR 1 = 0
                OR (
                    s.key_input = "field_study_secondary"
                    AND s.val IN (
                        select r.val
                        from ref_field_study r
                    )
                )
                OR (
                    s.key_input = "field_study_main"
                    AND s.val IN (
                        select r.val
                        from ref_field_study r
                    )
                )
                OR (
                    s.key_input = "gender"
                    AND s.val IN (
                        select r.val
                        from ref_gender r
                    )
                )
                OR (
                    s.key_input = "work_experience_year"
                    AND s.val IN (
                        select r.val
                        from ref_work_experience_year r
                    )
                )
                OR 1 = 0
                OR 1 = 0
                OR 1 = 0
                OR (
                    s.key_input = "local_or_oversea_study"
                    AND s.val IN (
                        select r.val
                        from ref_local_or_oversea r
                    )
                )
                OR (
                    s.key_input = "local_or_oversea_location"
                    AND s.val IN (
                        select r.val
                        from ref_local_or_oversea r
                    )
                )
                OR 1 = 0
                OR 1 = 0
                OR 1 = 0
            )
            AND s.entity = 'user'
            AND (
                'INTELDD21' IN (
                    select ms.cf
                    from cf_map ms
                    where ms.entity = 'user'
                        and ms.entity_id = s.entity_id
                )
            )
            AND (1 = 1)
            AND (1 = 1)
            AND (
                select mm2.meta_value
                FROM wp_cf_usermeta mm2
                WHERE 1 = 1
                    AND mm2.user_id = s.entity_id
                    AND mm2.meta_key = "wp_cf_capabilities"
            ) = 'a:1:{s:7:"student";b:1;}'
        group by _key,
            _val
        UNION ALL
        SELECT s.key_input as _key,
            r.val as _val,
            r.state as _val_label,
            COUNT(*) as _total
        FROM single_input s,
            ref_city_state_country r
        where 1 = 1
            AND s.key_input = "where_in_malaysia"
            AND s.val = r.val
            AND s.entity = 'user'
            AND r.city IS NULL
            AND r.state IS NOT NULL
            AND (
                'INTELDD21' IN (
                    select ms.cf
                    from cf_map ms
                    where ms.entity = 'user'
                        and ms.entity_id = s.entity_id
                )
            )
            AND (1 = 1)
            AND (1 = 1)
            AND (
                select mm2.meta_value
                FROM wp_cf_usermeta mm2
                WHERE 1 = 1
                    AND mm2.user_id = s.entity_id
                    AND mm2.meta_key = "wp_cf_capabilities"
            ) = 'a:1:{s:7:"student";b:1;}'
        group by s.key_input,
            s.val
        -- UNION ALL
        -- select 'skill' as _key,
        --     s.val as _val,
        --     "" as _val_label,
        --     COUNT(s.ID) as _total
        -- from multi_skill s
        -- WHERE s.entity = 'user'
        --     AND (
        --         'INTELDD21' IN (
        --             select ms.cf
        --             from cf_map ms
        --             where ms.entity = 'user'
        --                 and ms.entity_id = s.entity_id
        --         )
        --     )
        --     AND (1 = 1)
        --     AND (1 = 1)
        --     AND (
        --         select mm2.meta_value
        --         FROM wp_cf_usermeta mm2
        --         WHERE 1 = 1
        --             AND mm2.user_id = s.entity_id
        --             AND mm2.meta_key = "wp_cf_capabilities"
        --     ) = 'a:1:{s:7:"student";b:1;}'
        -- GROUP BY s.val
        UNION ALL
        select 'looking_for_position' as _key,
            s.val as _val,
            "" as _val_label,
            COUNT(s.ID) as _total
        from multi_looking_for_position s
        WHERE s.entity = 'user'
            AND (
                'INTELDD21' IN (
                    select ms.cf
                    from cf_map ms
                    where ms.entity = 'user'
                        and ms.entity_id = s.entity_id
                )
            )
            AND (1 = 1)
            AND (1 = 1)
            AND (
                select mm2.meta_value
                FROM wp_cf_usermeta mm2
                WHERE 1 = 1
                    AND mm2.user_id = s.entity_id
                    AND mm2.meta_key = "wp_cf_capabilities"
            ) = 'a:1:{s:7:"student";b:1;}'
            AND (
                s.val = 'Full-Time'
                OR s.val = 'Internship'
            )
        GROUP BY s.val
    ) X
ORDER BY X._key,
    X._val_label asc,
    X._val asc,
    X._total desc