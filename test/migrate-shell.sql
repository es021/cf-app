-- cfs
INSERT INTO `cfs` (`ID`, `name`, `country`, `time`, `is_active`, `is_load`, `cf_order`, `created_at`, `updated_at`) 
VALUES (NULL, 'SHELL', 'SHELL', '15, April 2020', '1', '1', '5', '2019-03-31 18:04:51', '2019-05-25 11:25:00');

-- cfs_map
INSERT INTO `cfs_meta` (`ID`, `cf_name`, `meta_key`, `meta_value`) VALUES (NULL, 'SHELL', 'title', 'Shell Virtual Career Fair @ UK'), 
(NULL, 'SHELL', 'flag', 'null'), (NULL, 'SHELL', 'banner', 'NZL.jpg'), 
(NULL, 'SHELL', 'schedule_time_start', 'Feb 22 2020 09:00:00 GMT +0800 (+08)'), 
(NULL, 'SHELL', 'schedule_time_end', 'Feb 23 2020 21:00:00 GMT +0800 (+08)'), 
(NULL, 'SHELL', 'start', 'Feb 22 2020 09:00:00 GMT +0800 (+08)'), 
(NULL, 'SHELL', 'end', 'Feb 23 2020 21:00:00 GMT +0800 (+08)'), 
(NULL, 'SHELL', 'time_str', '9AM - 1PM & 5PM - 9PM (MYT)'), 
(NULL, 'SHELL', 'test_start', 'Apr 01 2018 04:30:00 GMT +0800 (+08)'), 
(NULL, 'SHELL', 'test_end', 'Apr 01 2018 11:00:00 GMT +0800 (+08)'), 
(NULL, 'SHELL', 'can_register', '1'), (NULL, 'SHELL', 'can_login', '1'), 
(NULL, 'SHELL', 'schedule', '{\"timezone\":\"GMT +0800 (+08)\",\"data\":[]}'), 
(NULL, 'SHELL', 'organizations', '[{\"label\":\"Host Universities\",\"icon_size\":\"150\",\"data\":[{\"name\":\"Universiti Teknologi MARA\",\"logo\":\"UITM.jpg\",\"shortname\":\"UITM\"},{\"name\":\"Universiti Tunku Abdul Rahman\",\"shortname\":\"UTAR\",\"logo\":\"UTAR.jpg\"},{\"name\":\"Universiti Teknologi Malaysia\",\"shortname\":\"UTM\",\"logo\":\"UTM.jpg\"}]},{\"label\":\"Championed By\",\"icon_size\":\"200\",\"data\":[{\"name\":\"Malaysia Digital Economy Corporation\",\"logo\":\"MDEC.jpg\",\"shortname\":\"MDEC\"}]},{\"label\":\"Strategic Partner\",\"icon_size\":\"150\",\"data\":[{\"name\":\"Seeds Job Fair\",\"logo\":\"logo.png\"}]}]'), 
(NULL, 'SHELL', 'custom_style', '{\"header_icon\":\"shell_icon.png\",\"header_icon_url\":\"zz\",\"header_desc\":\"zz\"}');