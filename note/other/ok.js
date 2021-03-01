single = `first_name
last_name
university
employment_status
faculty_utm21
field_study_other_utm21
field_study_utm21
graduation_month
graduation_utm21
graduation_year
id_utm
id_utm21
kpt
level_study_utm21
local_or_oversea_study
phone_number
qualification
sunway_faculty
sunway_program
unisza_course
working_availability_month
working_availability_year
country_study
field_study_main
grade
sponsor
where_in_malaysia
field_study_secondary
description
monash_school
gender
local_or_oversea_location
work_experience_year
monash_student_id
course_status
current_semester
id_unisza
unisza_faculty
birth_date`;

multi = `multi_extracurricular
multi_field_study
multi_interested_job_location
multi_interested_role
multi_looking_for_position
multi_skill
multi_webinar_utm21`


select = "";

single = single.split("\n");
for (let s of single) {
    select += `(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = 'user' 
    AND s.key_input = '${s}') as ${s},`
}

multi = multi.split("\n");
for (let m of multi) {
    select += `(SELECT GROUP_CONCAT(m.val) FROM ${m} m WHERE m.entity_id = X.ID AND m.entity = 'user') as ${m},`
}


q = `
SELECT 
uu.ID,
REPLACE(uu.user_email, "DELETED_", "") as email, 
${select}
X.cfs
FROM wp_cf_users uu,
(
select 
GROUP_CONCAT(m.cf) as cfs, 
u.ID 
FROM wp_cf_users u, cf_map m, wp_cf_usermeta mm
WHERE 1=1
AND mm.user_id = u.ID
AND mm.meta_key = 'wp_cf_capabilities'
AND mm.meta_value = 'a:1:{s:7:"student";b:1;}'    
AND u.user_email NOT LIKE 'test%' 
AND m.entity = 'user'
and m.entity_id = u.ID
GROUP BY u.ID
ORDER BY u.ID asc
)X
WHERE uu.ID = X.ID
`;


function prepareLimit(page, offset) {
    var start = (page - 1) * offset;
    var limit = (typeof page !== "undefined" && typeof offset !== "undefined") ?
        `LIMIT ${start},${offset}` : "";
    return limit;
};


qq = ""
for (var i = 1; i < 50; i++) {
    qq += `INSERT INTO 1_export_sql (ID, label, text_sql) VALUES (NULL, '[_General_] All Student Data - All Data Page ${i < 10 ? '0' : ''}${i}', 
   "SELECT uu.ID, REPLACE(uu.user_email, \'DELETED_\', \'\') as email, (SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'first_name\') as first_name,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'last_name\') as last_name,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'university\') as university,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'employment_status\') as employment_status,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'faculty_utm21\') as faculty_utm21,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'field_study_other_utm21\') as field_study_other_utm21,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'field_study_utm21\') as field_study_utm21,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'graduation_month\') as graduation_month,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'graduation_utm21\') as graduation_utm21,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'graduation_year\') as graduation_year,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'id_utm\') as id_utm,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'id_utm21\') as id_utm21,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'kpt\') as kpt,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'level_study_utm21\') as level_study_utm21,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'local_or_oversea_study\') as local_or_oversea_study,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'phone_number\') as phone_number,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'qualification\') as qualification,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'sunway_faculty\') as sunway_faculty,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'sunway_program\') as sunway_program,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'unisza_course\') as unisza_course,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'working_availability_month\') as working_availability_month,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'working_availability_year\') as working_availability_year,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'country_study\') as country_study,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'field_study_main\') as field_study_main,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'grade\') as grade,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'sponsor\') as sponsor,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'where_in_malaysia\') as where_in_malaysia,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'field_study_secondary\') as field_study_secondary,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'description\') as description,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'monash_school\') as monash_school,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'gender\') as gender,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'local_or_oversea_location\') as local_or_oversea_location,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'work_experience_year\') as work_experience_year,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'monash_student_id\') as monash_student_id,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'course_status\') as course_status,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'current_semester\') as current_semester,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'id_unisza\') as id_unisza,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'unisza_faculty\') as unisza_faculty,(SELECT s.val FROM single_input s WHERE s.entity_id = X.ID AND s.entity = \'user\' AND s.key_input = \'birth_date\') as birth_date,(SELECT GROUP_CONCAT(m.val) FROM multi_extracurricular m WHERE m.entity_id = X.ID AND m.entity = \'user\') as multi_extracurricular,(SELECT GROUP_CONCAT(m.val) FROM multi_field_study m WHERE m.entity_id = X.ID AND m.entity = \'user\') as multi_field_study,(SELECT GROUP_CONCAT(m.val) FROM multi_interested_job_location m WHERE m.entity_id = X.ID AND m.entity = \'user\') as multi_interested_job_location,(SELECT GROUP_CONCAT(m.val) FROM multi_interested_role m WHERE m.entity_id = X.ID AND m.entity = \'user\') as multi_interested_role,(SELECT GROUP_CONCAT(m.val) FROM multi_looking_for_position m WHERE m.entity_id = X.ID AND m.entity = \'user\') as multi_looking_for_position,(SELECT GROUP_CONCAT(m.val) FROM multi_skill m WHERE m.entity_id = X.ID AND m.entity = \'user\') as multi_skill,(SELECT GROUP_CONCAT(m.val) FROM multi_webinar_utm21 m WHERE m.entity_id = X.ID AND m.entity = \'user\') as multi_webinar_utm21, X.cfs FROM wp_cf_users uu, ( select GROUP_CONCAT(m.cf) as cfs, u.ID FROM wp_cf_users u, cf_map m, wp_cf_usermeta mm WHERE 1=1 AND mm.user_id = u.ID AND mm.meta_key = \'wp_cf_capabilities\' AND mm.meta_value LIKE \'%student%\' AND u.user_email NOT LIKE \'test%\' AND m.entity = \'user\' and m.entity_id = u.ID GROUP BY u.ID ORDER BY u.ID asc )X WHERE uu.ID = X.ID ${prepareLimit(i, 1000)}"
   );\n\n\n`
}
console.log(qq);