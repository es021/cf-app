-- ######################
-- cf
-- D2W21

-- ######################
-- start date
-- 2021-05-03

-- ######################
-- end date
-- 2021-05-06



INSERT IGNORE INTO 1_export_sql (ID, label, text_sql) VALUES (NULL, '[D2W21] Shortlisted', 'select c.ID as company_id, c.name as company, u.ID as user_id, u.user_email, i.updated_at as created_at from companies c, interested i, wp_cf_users u where 1=1 and c.ID = i.user_id and i.is_interested = 1 and u.ID = i.entity_id and i.entity = "student_listing" and u.ID IN (select m.entity_id from cf_map m where m.entity = "user" and m.entity_id = u.ID and m.cf = "D2W21" ) and c.ID IN (select m.entity_id from cf_map m where m.entity = "company" and m.entity_id = c.ID and m.cf = "D2W21" ) order by c.ID, i.updated_at');
INSERT IGNORE INTO 1_export_sql (ID, label, text_sql) VALUES (NULL, '[D2W21] Company Total Click', 'SELECT c.name, u.user_email, COUNT(l.ID) as total_click, MIN(convert_tz(l.created_at, \'+00:00\', \'+08:00\')) as first_click FROM logs l, cf_map m, wp_cf_users u, companies c where 1=1 and SUBSTRING(l.data, 10, 9) = c.ID and u.ID = l.user_id and l.user_id = m.entity_id and m.entity = "user" and m.cf = "D2W21" and l.event = "open_page" and l.data like "/company/%" and u.user_email not like \'test%\' and l.created_at >= "2021-05-03 00:00:00" and l.created_at <= "2021-05-06 23:00:00" and c.ID in (select entity_id from cf_map where entity = "company" and cf = "D2W21") group by u.user_email, c.name order by c.name, total_click desc ');
INSERT IGNORE INTO 1_export_sql (ID, label, text_sql) VALUES (NULL, '[D2W21] Chat', 'select XC.name as company, XU.user_email as student_email, convert_tz(m.created_at, \'+00:00\', \'+08:00\') as chat_created from message_count m, (select c.ID, c.name from companies c where c.ID IN (select m.entity_id from cf_map m where m.entity = "company" and m.entity_id = c.ID and m.cf = "D2W21" )) XC, (select u.ID, u.user_email from wp_cf_users u where u.ID IN (select m.entity_id from cf_map m where m.entity = "user" and m.entity_id = u.ID and m.cf = "D2W21")) XU where 1=1 AND m.id = CONCAT("company", XC.ID, ":", "user", XU.ID) order by XC.ID');
INSERT IGNORE INTO 1_export_sql (ID, label, text_sql) VALUES (NULL, '[D2W21] Job Post - Applicants List', 'select i.user_id, u.user_email, v.ID as vacancy_id, v.title as vacancy_title, c.ID as company_id, c.name as company_name, i.updated_at as applied_at from vacancies v , companies c, interested i, wp_cf_users u where 1=1 and u.ID = i.user_id and i.is_interested = 1 and v.ID = i.entity_id and i.entity = "vacancies" and i.user_id IN (select m.entity_id from cf_map m where m.entity = "user" and m.entity_id = i.user_id and m.cf = "D2W21" ) and v.company_id IN (select m.entity_id from cf_map m where m.entity = "company" and m.entity_id = v.company_id and m.cf = "D2W21" ) and v.company_id = c.ID order by i.user_id, c.ID, i.updated_at');
INSERT IGNORE INTO 1_export_sql (ID, label, text_sql) VALUES (NULL, '[D2W21] Job Post - All', 'select c.name as company_name, (select COUNT(i.ID) from interested i where 1=1 and i.is_interested = 1 and v.ID = i.entity_id and i.entity = "vacancies" and i.user_id IN (select m.entity_id from cf_map m where m.entity = "user" and m.entity_id = i.user_id and m.cf = "D2W21" ) ) as total_applicants, v.* from vacancies v , companies c where 1=1 and v.company_id IN (select m.entity_id from cf_map m where m.entity = "company" and m.entity_id = v.company_id and m.cf = "D2W21" ) and v.company_id = c.ID');
INSERT IGNORE INTO 1_export_sql (ID, label, text_sql) VALUES (NULL, '[D2W21] Interviews', 'select c.name as company, CONCAT( (select s.val from single_input s where s.entity = "user" and s.entity_id = u.ID and s.key_input = "first_name"), " ", (select s.val from single_input s where s.entity = "user" and s.entity_id = u.ID and s.key_input = "last_name") ) as student_name, u.user_email as student_email, convert_tz(from_unixtime(p.appointment_time), \'+00:00\', \'+08:00\') as interview_time, p.status as interview_status from pre_screens p, companies c, wp_cf_users u where p.company_id = c.ID and p.student_id = u.ID and u.ID IN (select m.entity_id from cf_map m where m.entity = "user" and m.entity_id = u.ID and m.cf = "D2W21" ) and c.ID IN (select m.entity_id from cf_map m where m.entity = "company" and m.entity_id = c.ID and m.cf = "D2W21" ) order by c.ID, p.appointment_time');
INSERT IGNORE INTO 1_export_sql (ID, label, text_sql) VALUES (NULL, '[D2W21] Feedbacks', 'SELECT u.ID as user_id, u.user_email as user_email, (select f.question from feedback_qs f where f.ID = 1) as q1, SUBSTRING_INDEX(SUBSTRING_INDEX(m.meta_value,\'"1":"\',-1),\'","\',1) as answer_q1, (select f.question from feedback_qs f where f.ID = 2) as q2, SUBSTRING_INDEX(SUBSTRING_INDEX(m.meta_value,\'"2":"\',-1),\'","\',1) as answer_q2, (select f.question from feedback_qs f where f.ID = 3) as q3, SUBSTRING_INDEX(SUBSTRING_INDEX(m.meta_value,\'"3":"\',-1),\'","\',1) as answer_q3, (select f.question from feedback_qs f where f.ID = 7) as q7, SUBSTRING_INDEX(SUBSTRING_INDEX(m.meta_value,\'"7":"\',-1),\'","\',1) as answer_q7, (select f.question from feedback_qs f where f.ID = 8) as q8, SUBSTRING_INDEX(SUBSTRING_INDEX(m.meta_value,\'"8":"\',-1),\'","\',1) as answer_q8, (select f.question from feedback_qs f where f.ID = 10) as q10, SUBSTRING_INDEX(SUBSTRING_INDEX(m.meta_value,\'"10":"\',-1),\'"}\',1) as answer_q10 from wp_cf_usermeta m, wp_cf_users u, cf_map cf where 1=1 and u.ID = m.user_id and m.meta_key = "feedback" and cf.cf = "D2W21" and cf.entity_id = u.ID and cf.entity = "user" order by m.umeta_id desc ');

