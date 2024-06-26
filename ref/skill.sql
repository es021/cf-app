CREATE TABLE `wp_career_fair`.`ref_skill` 
( `ID` INT NOT NULL AUTO_INCREMENT , 
 `val` VARCHAR(700)  CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL ,
 `category` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
PRIMARY KEY (`ID`), UNIQUE(`val`,`category`), INDEX (`val`), INDEX (`category`)) ENGINE = InnoDB;

-- ###############################################################################################
-- ###############################################################################################

truncate wp_career_fair.ref_skill;

insert into wp_career_fair.ref_skill (val, category) VALUES  
 ('Typing','technical_skill'), 
 ('Microsoft Word','technical_skill'), 
 ('Microsoft Excel','technical_skill'), 
 ('Research','technical_skill'), 
 ('Project Planning','technical_skill'), 
 ('Data Analysis','technical_skill'), 
 ('C++','technical_skill'), 
 ('Adobe Photoshop','technical_skill'), 
 ('Leadership','soft_skill'), 
 ('Creativity','soft_skill'), 
 ('Communication','soft_skill');


insert into wp_career_fair.ref_skill (val, category) VALUES  ('Verbal Communication','soft_skill'), 
 ('Non-Verbal Communication','soft_skill'), 
 ('Visual Communication','soft_skill'), 
 ('Written Communication','soft_skill'), 
 ('Active Listening','soft_skill'), 
 ('Clarity','soft_skill'), 
 ('Confidence','soft_skill'), 
 ('Interviewing','soft_skill'), 
 ('Negotiation','soft_skill'), 
 ('Personal Branding','soft_skill'), 
 ('Persuasion','soft_skill'), 
 ('Presentation Skills','soft_skill'), 
 ('Public Speaking','soft_skill'), 
 ('Storytelling','soft_skill'), 
 ('Diplomacy','soft_skill'), 
 ('Empathy','soft_skill'), 
 ('Friendliness','soft_skill'), 
 ('Humor','soft_skill'), 
 ('Networking','soft_skill'), 
 ('Patience','soft_skill'), 
 ('Positive Reinforcement','soft_skill'), 
 ('Sensitivity','soft_skill'), 
 ('Tolerance','soft_skill'), 
 ('Analysis','soft_skill'), 
 ('Artistic Sense','soft_skill'), 
 ('Brainstorming','soft_skill'), 
 ('Design','soft_skill'), 
 ('Design Sense','soft_skill'), 
 ('Divergent Thinking','soft_skill'), 
 ('Experimenting','soft_skill'), 
 ('Imagination','soft_skill'), 
 ('Innovation','soft_skill'), 
 ('Insight','soft_skill'), 
 ('Inspiration','soft_skill'), 
 ('Lateral Thinking','soft_skill'), 
 ('Logical Reasoning','soft_skill'), 
 ('Mind Mapping','soft_skill'), 
 ('Observation','soft_skill'), 
 ('Persistence','soft_skill'), 
 ('Questioning','soft_skill'), 
 ('Reframing','soft_skill'), 
 ('Troubleshooting','soft_skill'), 
 ('People Management','soft_skill'), 
 ('Project Management','soft_skill'), 
 ('Remote Team Management','soft_skill'), 
 ('Talent Management','soft_skill'), 
 ('Virtual Team Management','soft_skill'), 
 ('Meeting Management','soft_skill'), 
 ('Agility','soft_skill'), 
 ('Coaching','soft_skill'), 
 ('Conflict or Dispute Resolution','soft_skill'), 
 ('Cultural Intelligence','soft_skill'), 
 ('Deal-Making','soft_skill'), 
 ('Decision-Making','soft_skill'), 
 ('Delegation','soft_skill'), 
 ('Facilitating','soft_skill'), 
 ('Give Clear Feedback','soft_skill'), 
 ('Managing Difficult Conversations','soft_skill'), 
 ('Mentoring','soft_skill'), 
 ('Strategic Planning','soft_skill'), 
 ('Supervising','soft_skill'), 
 ('Team-Building','soft_skill'), 
 ('Versatility','soft_skill'), 
 ('Authenticity','soft_skill'), 
 ('Encouraging','soft_skill'), 
 ('Generosity','soft_skill'), 
 ('Humility','soft_skill'), 
 ('Inspiring','soft_skill'), 
 ('Selflessness','soft_skill'), 
 ('Attentive','soft_skill'), 
 ('Business Ethics','soft_skill'), 
 ('Calm','soft_skill'), 
 ('Commitment','soft_skill'), 
 ('Competitiveness','soft_skill'), 
 ('Curiosity','soft_skill'), 
 ('Dependability','soft_skill'), 
 ('Discipline','soft_skill'), 
 ('Emotion Management','soft_skill'), 
 ('Highly Organized','soft_skill'), 
 ('Independence','soft_skill'), 
 ('Initiative','soft_skill'), 
 ('Integrity','soft_skill'), 
 ('Motivated','soft_skill'), 
 ('Open-Minded','soft_skill'), 
 ('Optimistic','soft_skill'), 
 ('Perseverant','soft_skill'), 
 ('Professional','soft_skill'), 
 ('Punctual','soft_skill'), 
 ('Reliable','soft_skill'), 
 ('Resilient','soft_skill'), 
 ('Responsible','soft_skill'), 
 ('Results-Oriented','soft_skill'), 
 ('Taking Criticism','soft_skill'), 
 ('Tolerance of Change and Uncertainty','soft_skill'), 
 ('Trainable','soft_skill'), 
 ('Accept Feedback','soft_skill'), 
 ('Collaborative','soft_skill'), 
 ('Cooperation','soft_skill'), 
 ('Coordination','soft_skill'), 
 ('Deal with Difficult Situations','soft_skill'), 
 ('Disability Awareness','soft_skill'), 
 ('Diversity Awareness','soft_skill'), 
 ('Emotional Intelligence','soft_skill'), 
 ('Idea Exchange','soft_skill'), 
 ('Influential','soft_skill'), 
 ('Intercultural Competence','soft_skill'), 
 ('Interpersonal Relationships Skills','soft_skill'), 
 ('Mediation','soft_skill'), 
 ('Office Politics Management','soft_skill'), 
 ('Personality Conflicts Management','soft_skill'), 
 ('Respectfulness','soft_skill'), 
 ('Sales Skills','soft_skill'), 
 ('Self-Awareness','soft_skill'), 
 ('Social Skills','soft_skill'), 
 ('Acuity','soft_skill'), 
 ('Allocating Resources','soft_skill'), 
 ('Coping','soft_skill'), 
 ('Critical Observation','soft_skill'), 
 ('Focus','soft_skill'), 
 ('Goal-Setting','soft_skill'), 
 ('Introspection','soft_skill'), 
 ('Memory','soft_skill'), 
 ('Organization','soft_skill'), 
 ('Personal Time Management','soft_skill'), 
 ('Planning','soft_skill'), 
 ('Prioritization','soft_skill'), 
 ('Recall','soft_skill'), 
 ('Scheduling','soft_skill'), 
 ('Sense of Urgency','soft_skill'), 
 ('Streamlining','soft_skill'), 
 ('Stress Management','soft_skill'), 
 ('Task Planning','soft_skill'), 
 ('Task Tracking','soft_skill'), 
 ('Time Awareness','soft_skill'), 
 ('Work-Life Balance','soft_skill');


 
INSERT INTO `ref_skill` (`val`) VALUES
('React'),
('GraphQL'),
('PHP'),
('Oracle'),
('MySQL'),
('Software Development'),
('Wordpress'),
('Javascript'),
('Redux'),
('Test'),
('Web Development'),
('Java'),
('C'),
('C#'),
('MATLAB'),
('ImageJ'),
('NX 11.0'),
('Python'),
('HTML/CSS'),
('SolidWorks'),
('AutoCAD'),
('Photoshop'),
('Illustrator'),
('Vector CANoe'),
('Microsoft Project'),
('Microsoft PowerPoint'),
('Microsoft Visio'),
('Microsoft Excel with Macro'),
('Autodesk Inventor'),
('SQL'),
('English'),
('Malay'),
('Mandarin');


UPDATE ref_skill set category = 'technical_skill' where category = '' or category is null ;

