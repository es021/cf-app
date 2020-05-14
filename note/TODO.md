AdminCf

<!-- 1. add remove (hidden) for all iv card -->
<!-- 2. filter and sort iv card -->
<!-- 3. cron job utk ended kan sume zoom call yg dah expired -->
<!-- 4. left bar design baru (jgn deploy - make it separate) -->
5. tengok design baru cheet huan


<!-- pagination for list
custom cosmetic for cf
showing student from cf mana -->

# // TODO_kena_amik_selectMultiMain_masuk_kat_sini
# browse student filter query
# browse student front end component

## #######################################################################
## #######################################################################
## #######################################################################
## #######################################################################
## #######################################################################


http://localhost:8085/cf-app/note/note-font/font.html
http://localhost/cf-app/note/note-font/font.html

socket to send progress
// write progress to file in cf-app
// then can read back in cf-socket

export.xls student listing with new student profile

## #######################################################################

## get user yang edit_interested
grep "/cf/graphql?&query=mutation+%7B+edit_interested+.*is_interested:1.*company" *


## get users ip
grep "/cf/graphql?&query=query%7B%0A++++++++++++++notifications(user_id+:+.*company" *


https://seedsjobfairapp.com/cf/graphql?&query=query%7B%0A++++++++++++++notifications(user_id+:+136,+is_read:0,+ttl:true)%7B%0A+++++++++++++++ttl%0A++++++++++++++%7D%0A++++++++++++%7D

recover
like company
https://seedsjobfairapp.com/cf/graphql?&query=mutation+%7B+add_interested+(%0A++++++++user_id:136,+%0A++++++++entity:%22companies%22,%0A++++++++entity_id:691%0A++++++++)+%7BID+is_interested%7D+%7D

grep * /cf/graphql?&query=mutation+%7B+add_interested+

INSERT INTO `interested` ( `user_id`, `entity`, `entity_id`, `is_interested`, `created_at`) 
select X.* from
(SELECT DISTINCT 
l.user_id,
'companies' as entity,
SUBSTRING_INDEX(l.data, '/', -1) as entity_id,
1  as is_interested,
'2019-09-09 10:10:10' as created_at
FROM `logs` l, wp_cf_usermeta m, cf_map cm
WHERE l.created_at >= '2019-11-25 21:21:21'
and l.event = 'open_page'  and l.data like '/company/%'
and m.user_id = l.user_id 
and m.meta_key = 'wp_cf_capabilities'
and m.meta_value like '%student%'
and cm.cf = 'MDEC'
and cm.entity = 'user'
and cm.entity_id = l.user_id) X

## #######################################################################


# InterestedUserList
# email notification if there is new chat message (linked in style)
# migrate 
#  - ref_skill -> mantain dataset but for suggestion, not random take the first 11
#  - ref_field_study

New Job posting card
- Is it not clickable to see more job description?
# - How do you adjust for the pictures? (bug) ?
# - Student only can like. 
# - Recruiter see list of student yg like 
#    - (ganti love button) - ada count, bila click kluar list of student
# - How to track students that like the job post? 

# where_in_malaysia bug with country_study
# implement
# field_study => input_type::select for input_multi

## ######################################################################################
## ######################################################################################
## ######################################################################################

# integrate form.js dgn input suggestion (REQUIRED FIELD HANDLER)

## EFECTED MODULE - new user profile ###
## -user popup
# -edit user 
#  - skills (kena drop)
# -student listing
#  - list card
#  - filter by graduation month

###############################################

## - smbung done handler untuk check apa lagi yang required tak isi
## - design css unutk required
## - done handler untuk complete manage user profile
##   - handler ni kat sign-up
## - siap gabung ref list (suggestion) n multi list kat input-multi

new sign up

Page 1
1. Email 
2. Password
4. (Single) First Name
5. (Single) Last Name

Page 2 
What is your name?
When is your graduation date?
What are you looking for? (Note for sarhan: Full time, internship)
Where are you studying? (country)
What is your university? - https://github.com/gedex/World-University-Names-Database
What is your highest level of certificate?
What is your field of study?
What is your grade? (Note for sarhan: text/number)
What is your phone number? (In case we need to reach you ASAP!)
Where would you like to work in Malaysia?
What types of jobs will you be searching for?
What skills would you bring to your next job?
Are you a scholar


Page 2
- (Single) Country
- (Single) University
- Major 
- (Single) Level (degree, master , phd)

Page 3
-Looking For 
   ** (FT/Internship)
- (Multi) Relevant Course
- Graduation Date
- (Multi) What industry would you like to work in
- (Multi) Where do you want to work? 
    ** local n oversea
- (Multi) What kind of company do you want to work in?


vacancy_id  |	  cf
-----------------------
35			        SEEDS
35			        IMPACT
36			        SEEDS

** vacancy yg takde tagging by cf akan displayed in all cf **


##############################################

vacancy-suggestion implementation
(relevence?)
do research

####################################################
ssh root@104.131.105.183
ssh root@159.65.10.64

save-dev not found problem
solution :
npm cache verify
####################################################

SET PRIVILEDGES
<!-- 
1. Ubah all Students
- buang interested candidates
All Students : ANE, EUR, NZL
Shell
All Students : ANE 
-->

<!-- 2 When Are you live?
- kalau ada : Next Live at xxxxx
- kalau takde : Click here to set your live session -->

<!-- 3. Online Student indicator kat card activity tukar mcam kat chat -->

<!-- 4. letak company booth kat recruiter punya page gak -->

####################################################

Create Time Converter To Local Page
  http://www.convert-unix-time.com/
  converter page
  1558159200
  - Nanti tukar kat notification-cf-app/lib/config.php


-Video gallery click change item kalau bukan kat center
#DONE -schdule call takyah load student info

Company Booth 
    # Ada bagde macam GraduateLand
    # boleh bukak lepas event start je
  - live session count kat company booth?
  - or easy access to rsvp for live session if there is any
  - access to chat with rec
  - or access to drop resume?

Go Live 
  - kena bukak indicator yang student boleh masuk
  - col baru (last_live_time)
  - dalam masa 30 minit
  - go to link (group_url)

- Hall Gallery
    - video clickable
#DONE - daily.co

    

#Clean Up Recruiter Page
#- empty state 'Your Live Session' (dalam popup create new)
#- 

#deploy link baru utk test

# Push Live TODO list
#10 June
#- migrate new table in database
#- disable chat with rec n live session kalau preEvent
#- gambar hall gallery

# Live Session
# When are you live 
  # - create time to go live. 
  #  - time (can choose multiple) (time event only)
  #  - no title
  #  - list of upcoming live session (with rsvp count)

# Socket tak offline kalau kita tutup window

#Pages 
# - student listing

#Company Page
#  - Recruiter view 
#    - takde live session
#  - Student view 
#    - Wording - Live With (company_name)
#    - One button to join
#   - Time n RSVP

# Custom Message For Each Company After student drop resume

#Forum
#  - remove
#  - ask question remove

#Messaging
#  - unread message indicator
#  - notification
#  - boleh lepas start event je

# IMPORTANT REMINDER
#-- try coming soon page
#-- control what rec can see when clicked on company page

# Pending
- Log Error in api-helper alert() : create new db
# - Manage Hall Gallery
#- Inbox
# - design inbox list better (cater too many items in list)
#    - notification (new messages)
#- Company Page
#    - Go Live feature - how to create?
#    - Rsvp go live (for student)
#- Hall 
# - Time converter
#    - Action button for recruiter
# - admin manage page

# Buang perkataan sponsor

# POST USA19 CHANGES
RM 350.94 - new domain
RM 55.24 - digital ocean
RM 74.34 - renewal domain
--------------------------
RM 480.52

# Timeline
04/20 - 1,2,3,4,5
05/20 - 6,7,8
06/20 - 9,10
07/01 - UAT
07/15 - Pilot

# New TODO

########################################################################

1. Bug Fixing
  - https://docs.google.com/document/d/14foK88Y3RqloZhxWw1qvGVHCuQTtuRgYpK7tw98eXjU/edit
# - “About” - remove
# - Announcement - hide dulu
# - After feedback page not found - /cf/app/career-fair
#- Webinar
  # copy data production auditorium dulu
  # When creating a new one, admin needs to put link in “recorded field”
  # Webinar box disappears when start date has passed. 
  # Issue is to show recorded webinar not possible as we need to adjust start date to a future point in time
  # - Prescreening is broken kalau create from user popup
  - Online chat support
    # Offline - online bug, when support account already logged i

########################################################################
2. Registration
# - Buang activation email limitation (Buang Drop Resume limitation)
  - Field of study
      # How did we get the list
      # Find list that is easy for us
#- Degree level
  # Doctoral
  # Executive
  # Master
  # Bachelor
  # Foundation
  # SPM
  - Degree name
      # Can add
  - Last page is what the should do next
      # Business team Have to write 

########################################################################
3. Homepage skeleton
  - https://drive.google.com/drive/folders/1vj3lwZqzIf9Q6kqr5zKYaGh7eRILG0rC?ths=true
  - Siapkan Notification
    # 
#- Right and left bar layout buang
#- Sponsor
#- Header
  # bar sume kat atas (macam linked in)
#- Placeholer for home gallery
#- etc

########################################################################
4. Home Student
  - https://drive.google.com/drive/folders/1vj3lwZqzIf9Q6kqr5zKYaGh7eRILG0rC?ths=true
  - Scheduled Session Placeholder
#- Webinar
  #- Join, Watch, 1 Apr 10.00PM

    
########################################################################

5. Home Recruiter
  - https://drive.google.com/drive/folders/1vj3lwZqzIf9Q6kqr5zKYaGh7eRILG0rC?ths=true
#  - Interested Candidate
#    # Scheduling boleh buat bila2(sekat by lepas current time)
#  - Scheduled Session Placeholder
#  - Webinar
#  - Go Live
    
########################################################################

#6. Home Gallery
#  - Twitch.com
#  - Video/Image (Hover Desc)
#  - Admin Management 

########################################################################

7. Daily.co (Activity)
  - Time zone converter in activity card (toggle timing mcm coachella)
  - Live Session
  - 1-1
    # 1-1 sessiond
    # recruiter window id
    # student lepas 15 min tukar ke join video call, btn join tu hilang

########################################################################

8. Company Page
  - https://drive.google.com/drive/folders/1vj3lwZqzIf9Q6kqr5zKYaGh7eRILG0rC?ths=true
  - redesign
  - new page
  - no popup
  - Chat button place holder

########################################################################

9. Chat/Inbox
  - Chat view for recruiter
    # macam facebook?
    # Macam GraduateLand

########################################################################

10. Mock Interview
  - Register -> Pilih Schedule ->  Join
  - Find -> Set Availabilty -> Join
  - Admin yang set availability

##############################################################################
##### Notification Details (Facebook style notification) ---------------------
ActivitySingle btn action tak reload view -- 1_Waiting

Mark as Read All
Other User Trigger :
- 1-1 session created by rec -> popup card (tempat yg sama dgn socket action)

Server Trigger :
- A few minutes before 1-1 session
- A few minutes before group session

tengok dasboard camne kita fire event utk auto update
kena update kat left bar ade number warna merah

hantar trigger utk fetch new notification je

query{
  notifications(user_id : 136){
    ID
    user_id
    text
    cf
    is_read
    img_obj{
      img_url
      img_pos
      img_size
    }
  }
}

###########################################################################################
###########################################################################################
###########################################################################################
# OLD STUFF

##### Student Listing Export -------------------------------------------------
## DONE - Download All As Excel  
## DONE - format sama student listing excel kecuali takde sponsor
- Download All Documents 
    (Renamed => Aiman_Resume, Aiman_Recommendation) *less priority*

##### Notification -----------------------------------------------------------
- SMS ?
- Whatsapp Project
#- Informing What's Next Lepas Drop Resume 
#    - You will be notified

##### Entity Removed -----------------------------------------------------------
## DONE
## DONE create table in prod
## DONE create mutation add for entity removed
## DONE add delete button for 
## DONE - gs(entity_id = join_id) - GroupSessionJoin.TABLE n 
## DONE - ps(entity_id = ID) - Prescreen.TABLE


##### Group Session -----------------------------------------------------------
#- Remove Limits (And 2 mores - show all participant)
- order of display tukar?
#- letak tajuk kat card cf
#- Whats Next Lepas Join Group Session

Company Profile
- new page - instead of popup
- more space

# Register
# - Major ad selection n free text (like document label)
 
##### Resume Drop ---------------------------------------------------------------
#- Whats Next Lepas Drop Resume

##### Card GS and 1-1 Session ---------------------------------------------------
#- Happening in 10 minutes
#- Waiting for recruiters


