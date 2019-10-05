-- new table 
-- multi_interested_role
CREATE TABLE `wp_career_fair`.`multi_interested_role` ( `ID` BIGINT(20) NOT NULL AUTO_INCREMENT , 
`entity` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL , 
`entity_id` BIGINT(20) NOT NULL , 
`val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL , 
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
PRIMARY KEY (`ID`), UNIQUE (`entity`, `entity_id`, `val`)) ENGINE = InnoDB;

-- multi_ref (takde code column)
-- new table multi_ref_interested_role
CREATE TABLE `wp_career_fair`.`multi_ref_interested_role` 
( `ID` INT NOT NULL AUTO_INCREMENT , 
 `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
 `category` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
PRIMARY KEY (`ID`), INDEX (`val`), INDEX (`category`)) ENGINE = InnoDB;


-- same val diff category
select count(*) c, val , 
GROUP_CONCAT(category SEPARATOR ', '), GROUP_CONCAT(ID SEPARATOR ', ') from 
wp_career_fair.multi_ref_interested_role
group by val having c > 1

-- ################################################################################################################
-- ################################################################################################################
-- ################################################################################################################
-- ################################################################################################################

insert into wp_career_fair.multi_ref_interested_role (val, category) VALUES  ('Marketing Specialist','marketing'), 
 ('Marketing Manager','marketing'), 
 ('Marketing Director','marketing'), 
 ('Graphic Designer','marketing'), 
 ('Marketing Research Analyst','marketing'), 
 ('Marketing Communications Manager','marketing'), 
 ('Marketing Consultant','marketing'), 
 ('Product Manager','marketing'), 
 ('Public Relations','marketing'), 
 ('Social Media Assistant','marketing'), 
 ('Brand Manager','marketing'), 
 ('SEO Manager','marketing'), 
 ('Content Marketing Manager','marketing'), 
 ('Copywriter','marketing'), 
 ('Media Buyer','marketing'), 
 ('Digital Marketing Manager','marketing'), 
 ('eCommerce Marketing Specialist','marketing'), 
 ('Brand Strategist','marketing'), 
 ('Vice President of Marketing','marketing'), 
 ('Media Relations Coordinator','marketing'), 
 ('Administrative Assistant','business'), 
 ('Receptionist','business'), 
 ('Office Manager','business'), 
 ('Auditing Clerk','business'), 
 ('Bookkeeper','business'), 
 ('Account Executive','business'), 
 ('Branch Manager','business'), 
 ('Business Manager','business'), 
 ('Quality Control Coordinator','business'), 
 ('Administrative Manager','business'), 
 ('Chief Executive Officer','business'), 
 ('Business Analyst','business'), 
 ('Risk Manager','business'), 
 ('Human Resources','business'), 
 ('Office Assistant','business'), 
 ('Secretary','business'), 
 ('Office Clerk','business'), 
 ('File Clerk','business'), 
 ('Account Collector','business'), 
 ('Administrative Specialist','business'), 
 ('Executive Assistant','business'), 
 ('Program Administrator','business'), 
 ('Program Manager','business'), 
 ('Administrative Analyst','business'), 
 ('Data Entry','business'), 
 ('Computer Scientist','it'), 
 ('IT Professional','it'), 
 ('UX Designer &amp; UI Developer','it'), 
 ('SQL Developer','it'), 
 ('Web Designer','it'), 
 ('Web Developer','it'), 
 ('Help Desk Worker/Desktop Support','it'), 
 ('Software Engineer','it'), 
 ('Data Entry','it'), 
 ('DevOps Engineer','it'), 
 ('Computer Programmer','it'), 
 ('Network Administrator','it'), 
 ('Information Security Analyst','it'), 
 ('Artificial Intelligence Engineer','it'), 
 ('Cloud Architect','it'), 
 ('IT Manager','it'), 
 ('Technical Specialist','it'), 
 ('Application Developer','it'), 
 ('Chief Technology Officer (CTO)','it'), 
 ('Chief Information Officer (CIO)','it'), 
 ('Sales Associate','sales'), 
 ('Sales Representative','sales'), 
 ('Sales Manager','sales'), 
 ('Retail Worker','sales'), 
 ('Store Manager','sales'), 
 ('Real Estate Broker','sales'), 
 ('Cashier','sales'), 
 ('Account Executive','sales'), 
 ('Account Manager','sales'), 
 ('Area Sales Manager','sales'), 
 ('Direct Salesperson','sales'), 
 ('Director of Inside Sales','sales'), 
 ('Outside Sales Manager','sales'), 
 ('Sales Analyst','sales'), 
 ('Market Development Manager','sales'), 
 ('B2B Sales Specialist','sales'), 
 ('Sales Engineer','sales'), 
 ('Construction Worker','construction'), 
 ('Taper','construction'), 
 ('Plumber','construction'), 
 ('Heavy Equipment Operator','construction'), 
 ('Vehicle or Equipment Cleaner','construction'), 
 ('Carpenter','construction'), 
 ('Electrician','construction'), 
 ('Painter','construction'), 
 ('Welder','construction'), 
 ('Handyman','construction'), 
 ('Boilermaker','construction'), 
 ('Crane Operator','construction'), 
 ('Building Inspector','construction'), 
 ('Pipefitter','construction'), 
 ('Sheet Metal Worker','construction'), 
 ('Iron Worker','construction'), 
 ('Mason','construction'), 
 ('Roofer','construction'), 
 ('Solar Photovoltaic Installer','construction'), 
 ('Well Driller','construction'), 
 ('Team Leader','leadership'), 
 ('Manager','leadership'), 
 ('Assistant Manager','leadership'), 
 ('Executive','leadership'), 
 ('Director','leadership'), 
 ('Coordinator','leadership'), 
 ('Administrator','leadership'), 
 ('Controller','leadership'), 
 ('Officer','leadership'), 
 ('Organizer','leadership'), 
 ('Supervisor','leadership'), 
 ('Superintendent','leadership'), 
 ('Head','leadership'), 
 ('Overseer','leadership'), 
 ('Chief','leadership'), 
 ('Foreman','leadership'), 
 ('Principal','leadership'), 
 ('President','leadership'), 
 ('Lead','leadership'), 
 ('CEO','business_owner'), 
 ('Proprietor','business_owner'), 
 ('Principal','business_owner'), 
 ('Owner','business_owner'), 
 ('President','business_owner'), 
 ('Founder','business_owner'), 
 ('Administrator','business_owner'), 
 ('Director','business_owner'), 
 ('Managing Partner','business_owner'), 
 ('Managing Member','business_owner'), 
 ('CEO—Chief Executive Officer','c_level'), 
 ('COO—Chief Operating Officer','c_level'), 
 ('CFO—Chief Financial Officer','c_level'), 
 ('CIO—Chief Information Officer','c_level'), 
 ('CTO—Chief Technology Officer','c_level'), 
 ('CMO—Chief Marketing Officer','c_level'), 
 ('CHRO—Chief Human Resources Officer','c_level'), 
 ('CDO—Chief Data Officer','c_level'), 
 ('CPO—Chief Product Officer','c_level'), 
 ('CCO—Chief Customer Officer','c_level'), 
 ('Board of Directors','company'), 
 ('C-Level or C-Suite.','company'), 
 ('Shareholders','company'), 
 ('Managers','company'), 
 ('Supervisors','company'), 
 ('Front-Line Employees','company'), 
 ('Quality Control','company'), 
 ('Human Resources','company'), 
 ('Accounting Staff','company'), 
 ('Marketing Staff','company'), 
 ('Purchasing Staff','company'), 
 ('Shipping and Receiving Staff','company'), 
 ('Office Manager','company'), 
 ('Receptionist','company'), 
 ('Virtual Assistant','customer_service'), 
 ('Customer Service','customer_service'), 
 ('Customer Support','customer_service'), 
 ('Concierge','customer_service'), 
 ('Help Desk','customer_service'), 
 ('Customer Service Manager','customer_service'), 
 ('Technical Support Specialist','customer_service'), 
 ('Account Representative','customer_service'), 
 ('Client Service Specialist','customer_service'), 
 ('Customer Care Associate','customer_service'), 
 ('Operations Manager','operations'), 
 ('Operations Assistant','operations'), 
 ('Operations Coordinator','operations'), 
 ('Operations Analyst','operations'), 
 ('Operations Director','operations'), 
 ('Vice President of Operations','operations'), 
 ('Operations Professional','operations'), 
 ('Scrum Master','operations'), 
 ('Continuous Improvement Lead','operations'), 
 ('Continuous Improvement Consultant','operations'), 
 ('Credit Authorizer','finance'), 
 ('Benefits Manager','finance'), 
 ('Credit Counselor','finance'), 
 ('Accountant','finance'), 
 ('Bookkeeper','finance'), 
 ('Accounting Analyst','finance'), 
 ('Accounting Director','finance'), 
 ('Accounts Payable/Receivable Clerk','finance'), 
 ('Auditor','finance'), 
 ('Budget Analyst','finance'), 
 ('Financial Controller','finance'), 
 ('Financial Analyst','finance'), 
 ('Finance Manager','finance'), 
 ('Economist','finance'), 
 ('Payroll Manager','finance'), 
 ('Payroll Clerk','finance'), 
 ('Financial Planner','finance'), 
 ('Financial Services Representative','finance'), 
 ('Finance Director','finance'), 
 ('Commercial Loan Officer','finance'), 
 ('Engineer','engineering'), 
 ('Mechanical Engineer','engineering'), 
 ('Civil Engineer','engineering'), 
 ('Electrical Engineer','engineering'), 
 ('Assistant Engineer','engineering'), 
 ('Chemical Engineer','engineering'), 
 ('Chief Engineer','engineering'), 
 ('Drafter','engineering'), 
 ('Engineering Technician','engineering'), 
 ('Geological Engineer','engineering'), 
 ('Biological Engineer','engineering'), 
 ('Maintenance Engineer','engineering'), 
 ('Mining Engineer','engineering'), 
 ('Nuclear Engineer','engineering'), 
 ('Petroleum Engineer','engineering'), 
 ('Plant Engineer','engineering'), 
 ('Production Engineer','engineering'), 
 ('Quality Engineer','engineering'), 
 ('Safety Engineer','engineering'), 
 ('Sales Engineer','engineering'), 
 ('Chief People Officer','cool_titles'), 
 ('VP of Miscellaneous Stuff','cool_titles'), 
 ('Chief Robot Whisperer','cool_titles'), 
 ('Director of First Impressions','cool_titles'), 
 ('Culture Operations Manager','cool_titles'), 
 ('Director of Ethical Hacking','cool_titles'), 
 ('Software Ninjaneer','cool_titles'), 
 ('Director of Bean Counting','cool_titles'), 
 ('Digital Overlord','cool_titles'), 
 ('Director of Storytelling','cool_titles'), 
 ('Researcher','research'), 
 ('Research Assistant','research'), 
 ('Data Analyst','research'), 
 ('Business Analyst','research'), 
 ('Financial Analyst','research'), 
 ('Biostatistician','research'), 
 ('Title Researcher','research'), 
 ('Market Researcher','research'), 
 ('Title Analyst','research'), 
 ('Medical Researcher','research'), 
 ('Mentor','teacher'), 
 ('Tutor/Online Tutor','teacher'), 
 ('Teacher','teacher'), 
 ('Teaching Assistant','teacher'), 
 ('Substitute Teacher','teacher'), 
 ('Preschool Teacher','teacher'), 
 ('Test Scorer','teacher'), 
 ('Online ESL Instructor','teacher'), 
 ('Professor','teacher'), 
 ('Assistant Professor','teacher'), 
 ('Graphic Designer','artist'), 
 ('Artist','artist'), 
 ('Interior Designer','artist'), 
 ('Video Editor','artist'), 
 ('Video or Film Producer','artist'), 
 ('Playwright','artist'), 
 ('Musician','artist'), 
 ('Novelist/Writer','artist'), 
 ('Computer Animator','artist'), 
 ('Photographer','artist'), 
 ('Camera Operator','artist'), 
 ('Sound Engineer','artist'), 
 ('Motion Picture Director','artist'), 
 ('Actor','artist'), 
 ('Music Producer','artist'), 
 ('Director of Photography','artist'), 
 ('Nurse','healthcare'), 
 ('Travel Nurse','healthcare'), 
 ('Nurse Practitioner','healthcare'), 
 ('Doctor','healthcare'), 
 ('Caregiver','healthcare'), 
 ('CNA','healthcare'), 
 ('Physical Therapist','healthcare'), 
 ('Pharmacist','healthcare'), 
 ('Pharmacy Assistant','healthcare'), 
 ('Medical Administrator','healthcare'), 
 ('Medical Laboratory Tech','healthcare'), 
 ('Physical Therapy Assistant','healthcare'), 
 ('Massage Therapy','healthcare'), 
 ('Dental Hygienist','healthcare'), 
 ('Orderly','healthcare'), 
 ('Personal Trainer','healthcare'), 
 ('Phlebotomist','healthcare'), 
 ('Medical Transcriptionist','healthcare'), 
 ('Telework Nurse/Doctor','healthcare'), 
 ('Reiki Practitioner','healthcare'), 
 ('Housekeeper','hospitality'), 
 ('Flight Attendant','hospitality'), 
 ('Travel Agent','hospitality'), 
 ('Hotel Front Door Greeter','hospitality'), 
 ('Bellhop','hospitality'), 
 ('Cruise Director','hospitality'), 
 ('Entertainment Specialist','hospitality'), 
 ('Hotel Manager','hospitality'), 
 ('Front Desk Associate','hospitality'), 
 ('Front Desk Manager','hospitality'), 
 ('Concierge','hospitality'), 
 ('Group Sales','hospitality'), 
 ('Event Planner','hospitality'), 
 ('Porter','hospitality'), 
 ('Spa Manager','hospitality'), 
 ('Wedding Coordinator','hospitality'), 
 ('Cruise Ship Attendant','hospitality'), 
 ('Casino Host','hospitality'), 
 ('Hotel Receptionist','hospitality'), 
 ('Reservationist','hospitality'), 
 ('Events Manager','hospitality'), 
 ('Meeting Planner','hospitality'), 
 ('Lodging Manager','hospitality'), 
 ('Director of Maintenance','hospitality'), 
 ('Valet','hospitality'), 
 ('Waiter/Waitress','food_service'), 
 ('Server','food_service'), 
 ('Chef','food_service'), 
 ('Fast Food Worker','food_service'), 
 ('Barista','food_service'), 
 ('Line Cook','food_service'), 
 ('Cafeteria Worker','food_service'), 
 ('Restaurant Manager','food_service'), 
 ('Wait Staff Manager','food_service'), 
 ('Bus Person','food_service'), 
 ('Restaurant Chain Executive','food_service'), 
 ('Political Scientist','scientist'), 
 ('Chemist','scientist'), 
 ('Conservation Scientist','scientist'), 
 ('Sociologist','scientist'), 
 ('Biologist','scientist'), 
 ('Geologist','scientist'), 
 ('Physicist','scientist'), 
 ('Astronomer','scientist'), 
 ('Atmospheric Scientist','scientist'), 
 ('Molecular Scientist','scientist'), 
 ('Call Center Representative','on_the_phone'), 
 ('Customer Service','on_the_phone'), 
 ('Telemarketer','on_the_phone'), 
 ('Telephone Operator','on_the_phone'), 
 ('Phone Survey Conductor','on_the_phone'), 
 ('Dispatcher for Trucks or Taxis','on_the_phone'), 
 ('Customer Support Representative','on_the_phone'), 
 ('Over the Phone Interpreter','on_the_phone'), 
 ('Phone Sales Specialist','on_the_phone'), 
 ('Mortgage Loan Processor','on_the_phone'), 
 ('Counselor','counseling'), 
 ('Mental Health Counselor','counseling'), 
 ('Addiction Counselor','counseling'), 
 ('School Counselor','counseling'), 
 ('Speech Pathologist','counseling'), 
 ('Guidance Counselor','counseling'), 
 ('Social Worker','counseling'), 
 ('Therapist','counseling'), 
 ('Life Coach','counseling'), 
 ('Couples Counselor','counseling'), 
 ('Beautician','cosmetology'), 
 ('Hair Stylist','cosmetology'), 
 ('Nail Technician','cosmetology'), 
 ('Cosmetologist','cosmetology'), 
 ('Salon Manager','cosmetology'), 
 ('Makeup Artist','cosmetology'), 
 ('Esthetician','cosmetology'), 
 ('Skin Care Specialist','cosmetology'), 
 ('Manicurist','cosmetology'), 
 ('Barber','cosmetology'), 
 ('Journalist','writing'), 
 ('Copy Editor','writing'), 
 ('Editor/Proofreader','writing'), 
 ('Content Creator','writing'), 
 ('Speechwriter','writing'), 
 ('Communications Director','writing'), 
 ('Screenwriter','writing'), 
 ('Technical Writer','writing'), 
 ('Columnist','writing'), 
 ('Public Relations Specialist','writing'), 
 ('Proposal Writer','writing'), 
 ('Content Strategist','writing'), 
 ('Grant Writer','writing'), 
 ('Video Game Writer','writing'), 
 ('Translator','writing'), 
 ('Film Critic','writing'), 
 ('Copywriter','writing'), 
 ('Travel Writer','writing'), 
 ('Social Media Specialist','writing'), 
 ('Ghostwriter','writing'), 
 ('Warehouse Worker','physical'), 
 ('Painter','physical'), 
 ('Truck Driver','physical'), 
 ('Heavy Equipment Operator','physical'), 
 ('Welding','physical'), 
 ('Physical Therapy Assistant','physical'), 
 ('Housekeeper','physical'), 
 ('Landscaping Worker','physical'), 
 ('Landscaping Assistant','physical'), 
 ('Mover','physical'), 
 ('Animal Breeder','animals'), 
 ('Veterinary Assistant','animals'), 
 ('Farm Worker','animals'), 
 ('Animal Shelter Worker','animals'), 
 ('Dog Walker / Pet Sitter','animals'), 
 ('Zoologist','animals'), 
 ('Animal Trainer','animals'), 
 ('Service Dog Trainer','animals'), 
 ('Animal Shelter Manager','animals'), 
 ('Animal Control Officer','animals'), 
 ('Delivery Driver','driving'), 
 ('School Bus Driver','driving'), 
 ('Truck Driver','driving'), 
 ('Tow Truck Operator','driving'), 
 ('UPS Driver','driving'), 
 ('Mail Carrier','driving'), 
 ('Recyclables Collector','driving'), 
 ('Courier','driving'), 
 ('Bus Driver','driving'), 
 ('Cab Driver','driving'), 
 ('Animal Shelter Board Member','volunteer'), 
 ('Office Volunteer','volunteer'), 
 ('Animal Shelter Volunteer','volunteer'), 
 ('Hospital Volunteer','volunteer'), 
 ('Youth Volunteer','volunteer'), 
 ('Food Kitchen Worker','volunteer'), 
 ('Homeless Shelter Worker','volunteer'), 
 ('Conservation Volunteer','volunteer'), 
 ('Meals on Wheels Driver','volunteer'), 
 ('Habitat for Humanity Builder','volunteer'), 
 ('Emergency Relief Worker','volunteer'), 
 ('Red Cross Volunteer','volunteer'), 
 ('Community Food Project Worker','volunteer'), 
 ('Women’s Shelter Jobs','volunteer'), 
 ('Suicide Hotline Volunteer','volunteer'), 
 ('School Volunteer','volunteer'), 
 ('Community Volunteer Jobs','volunteer'), 
 ('Sports Volunteer','volunteer'), 
 ('Church Volunteer','volunteer'), 
 ('Archivist','other'), 
 ('Actuary','other'), 
 ('Architect','other'), 
 ('Personal Assistant','other'), 
 ('Entrepreneur','other'), 
 ('Security Guard','other'), 
 ('Mechanic','other'), 
 ('Recruiter','other'), 
 ('Mathematician','other'), 
 ('Locksmith','other'), 
 ('Management Consultant','other'), 
 ('Shelf Stocker','other'), 
 ('Caretaker or House Sitter','other'), 
 ('Library Assistant','other'), 
 ('Translator','other'), 
 ('HVAC Technician','other'), 
 ('Attorney','other'), 
 ('Paralegal','other'), 
 ('Executive Assistant','other'), 
 ('Bank Teller','other'), 
 ('Parking Attendant','other'), 
 ('Machinery Operator','other'), 
 ('Manufacturing Assembler','other'), 
 ('Funeral Attendant','other'), 
 ('Assistant Golf Professional','other'), 
 ('Yoga Instructor','other')

-- ##################################################################################################
-- ##################################################################################################
-- ##################################################################################################
