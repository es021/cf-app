CREATE TABLE `wp_career_fair`.`ref_unisza_faculty` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;
INSERT INTO wp_career_fair.ref_unisza_faculty (val) VALUES 
('Fakulti Pengajian Kontemporari Islam'),
('Fakulti Perniagaan Dan Pengurusan'),
('Fakulti Sains Kesihatan'),
('Fakulti Informatik Dan Komputeran'),
('Fakulti Sains Sosial Gunaan'),
('Fakulti Bahasa Dan Komunikasi'),
('Fakulti Undang-Undang Dan Hubungan Antarabangsa Fakulti Biosumber Dan Industri Makanan'),
('Fakulti Perubatan'),
('Fakulti Rekabentuk Inovatif Dan Teknologi'),
('Pusat Asasi Sains Dan Perubatan Unisza'),
('Fakulti Farmasi');

-- ###############################################################################################
-- ###############################################################################################

CREATE TABLE `wp_career_fair`.`ref_unisza_course` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;
INSERT INTO wp_career_fair.ref_unisza_course (val) VALUES 
('Ijazah Sarjana Muda Pengajian Islam (Syariah) Dengan Kepujian Ijazah Sarjana Muda Pengajian Islam (Dakwah) Dengan Kepujian Ijazah Sarjana Muda Pengajian Islam (Usuluddin) Dengan Kepujian Ijazah Sarjana Muda Usuluddin Dengan Kaunseling Dengan Kepujian Ijazah Sarjana Muda Al-Quran Dan As-Sunnah (Qiraat) Dengan Kepujian Ijazah Sarjana Muda Pendidikan (Pendidikan Islam) Dengan Kepujian Diploma Pendidikan (Lepasan Ijazah)'),
('Diploma Syariah'),
('Diploma Al-Quran Dan As-Sunnah'),
('Diploma Pentadbiran Islam'),
('Diploma Pengajian Islam Dengan Teknologi Maklumat'),
('Diploma Bahasa Dan Kesusasteraan Arab'),
('Diploma Dakwah'),
('Diploma Sejarah Dan Tamadun Islam'),
('Diploma Usuluddin'),
('Ijazah Sarjana Muda Perakaunan Dengan Kepujian'),
('Ijazah Sarjana Muda Pentadbiran Perniagaan (Kewangan Islam) Dengan Kepujian Ijazah Sarjana Muda Pentadbiran Perniagaan (Pengurusan Risiko Dan Takaful) Dengan Kepujian Ijazah Sarjana Muda Pengurusan Kekayaan Islam Dengan Kepujian'),
('Diploma Perakaunan'),
('Diploma Pengurusan Sumber Manusia'),
('Diploma Kewangan'),
('Diploma Pengajian Bank'),
('Diploma Perdagangan Antarabangsa'),
('Diploma Pemasaran'),
('Diploma Pengajian Insurans'),
('Ijazah Sarjana Muda Undang-Undang Dengan Kepujian'),
('Ijazah Sarjana Muda Hubungan Antarabangsa Dengan Kepujian'),
('Diploma Undang-Undang'),
('Ijazah Sarjana Muda Sains Komputer (Pembangunan Perisian) Dengan Kepujian Ijazah Sarjana Muda Teknologi Maklumat (Informatik Media) Dengan Kepujian'),
('Ijazah Sarjana Muda Sains Komputer (Keselamatan Rangkaian Komputer) Dengan Kepujian Ijazah Sarjana Muda Sains Komputer (Komputeran Internet) Dengan Kepujian Diploma Teknologi Maklumat'),
('Diploma Teknologi Maklumat (Multimedia)'),
('Ijazah Sarjana Muda Pengajian Bahasa Arab (Dengan Kepujian)'),
('Ijazah Sarjana Muda Bahasa Inggeris Dengan Komunikasi (Kepujian)'),
('Ijazah Sarjana Muda Pengajian Bahasa Arab (Dengan Kepujian)-Program Pesisir Diploma Pengajaran Bahasa Inggeris Sebagai Bahasa Kedua (Tesl)'),
('Ijazah Sarjana Muda Teknologi Makanan Dengan Kepujian'),
('Ijazah Sarjana Muda Produksi Dan Kesihatan Haiwan Dengan Kepujian Ijazah Sarjana Muda Bioteknologi Pertanian Dengan Kepujian'),
('Ijazah Sarjana Muda Sains(Kepujian) Sains Akuatik'),
('Ijazah Sarjana Muda Perniagaantani Dengan Kepujian'),
('Ijazah Sarjana Muda Sains Bioperubatan Dengan Kepujian'),
('Ijazah Sarjana Muda Dietetik Dengan Kepujian'),
('Ijazah Sarjana Muda Pengimejan Perubatan (Kepujian)'),
('Ijazah Sarjana Muda Sains Pemakanan (Kepujian)'),
('Diploma Fisioterapi'),
('Diploma Teknologi Makmal Perubatan'),
('Diploma Radiografi'),
('Ijazah Sarjana Muda Perubatan Dan Pembedahan'),
('Diploma Sains Kejururawatan'),
('Ijazah Sarjana Muda Sains Sosial (Antropologi Dan Dakwah) Dengan Kepujian Ijazah Sarjana Muda Kerja Sosial Dengan Kepujian'),
('Pusat Asasi Sains Dan Perubatan Unisza'),
('Asasi Sains Dan Perubatan'),
('Ijazah Sarjana Muda Reka Bentuk Perindustrian Dengan Kepujian'),
('Ijazah Sarjana Muda Teknologi Kejuruteraan Pembuatan Dengan Kepujian (Reka Bentuk Produk) Diploma Rekabentuk Perindustrian'),
('Diploma Teknologi Pembuatan'),
('Sarjana Muda Farmasi (Kepujian)');
-- ###############################################################################################
-- ###############################################################################################

CREATE TABLE `wp_career_fair`.`ref_current_semester` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;
INSERT INTO wp_career_fair.ref_current_semester (val) VALUES 
('1'),
('2'),
('3'),
('4'),
('5'),
('6'),
('7'),
('8');

-- ###############################################################################################
-- ###############################################################################################

CREATE TABLE `wp_career_fair`.`ref_course_status` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;
INSERT INTO wp_career_fair.ref_course_status (val) VALUES 
('In-Progress'),
('Completed');

-- ###############################################################################################
-- ###############################################################################################

CREATE TABLE `wp_career_fair`.`ref_employment_status` 
( 
  `ID` INT NOT NULL AUTO_INCREMENT , 
  `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
PRIMARY KEY (`ID`), UNIQUE(`val`), INDEX (`val`)) ENGINE = InnoDB;
INSERT INTO wp_career_fair.ref_employment_status (val) VALUES 
('Employed'),
('Unemployed');

-- ###############################################################################################
-- ###############################################################################################
