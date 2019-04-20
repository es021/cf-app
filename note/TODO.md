# POST USA19 CHANGES
RM 350.94 - new domain
RM 55.24 - digital ocean
RM 74.34 - renewal domain
--------------------------
RM 480.52

# Timeline
April 20 - 1,2,3,4,5
May 20 - 6,7,8
June 20 - 9,10
July 1 - UAT
July 15 - Pilot

# New Todo
1. Bug Fixing
  - https://docs.google.com/document/d/14foK88Y3RqloZhxWw1qvGVHCuQTtuRgYpK7tw98eXjU/edit
  - Webinar
    # When creating a new one, admin needs to put link in “recorded field”
    # Webinar box disappears when start date has passed. 
      Issue is to show recorded webinar not possible as we need to adjust start date to a future point in time


2. Registration
  - buang activation email limitation

3. Homepage skeleton
  - https://drive.google.com/drive/folders/1vj3lwZqzIf9Q6kqr5zKYaGh7eRILG0rC?ths=true
  - Sponsor
  - Header
    # bar sume kat atas (macam linked in)
  - Placeholer for home gallery
  - etc

4. Home Student
  - https://drive.google.com/drive/folders/1vj3lwZqzIf9Q6kqr5zKYaGh7eRILG0rC?ths=true
  - Scheduled Session Placeholder
  - Webinar
  - Company Booth 
    # Ada bagde macam GraduateLand
    # boleh bukak lepas event start je
    
5. Home Recruiter
  - https://drive.google.com/drive/folders/1vj3lwZqzIf9Q6kqr5zKYaGh7eRILG0rC?ths=true
  - Interested Candidate
    # Scheduling boleh buat bila2(sekat by lepas current time)
  - Scheduled Session Placeholder
  - Webinar
  - Go Live

6. Home Gallery
  - Twitch.com
  - Video/Image (Hover Desc)
  - Admin Management 

7. Daily.co (Activity)
  - Time zone converter in activity card (toggle timing mcm coachella)
  - Live Session
  - 1-1
    # 1-1 session
    # recruiter window id
    # student lepas 15 min tukar ke join video call, btn join tu hilang

8. Company Page
  - https://drive.google.com/drive/folders/1vj3lwZqzIf9Q6kqr5zKYaGh7eRILG0rC?ths=true
  - redesign
  - new page
  - no popup
  - Chat button place holder

9. Chat/Inbox
  - Chat view for recruiter
    # macam facebook?
    # Macam GraduateLand

10. Mock Interview
  - Register -> Pilih Schedule ->  Join
  - Find -> Set Availabilty -> Join
  - Admin yang set availability

##############################################################
# DETAILS

$ New Homepage
  - https://drive.google.com/drive/folders/1vj3lwZqzIf9Q6kqr5zKYaGh7eRILG0rC?ths=true
  - limit by time event je boleh bukak
  - click company booth -> pegi new company page

$ Company Booth
  - Ada bagde macam GraduateLand

$ Timing kat Activity
  - Ada toggle timing mcm coachella

$ Chat View For Rec
  
$ Bug Fixes
  - Post US VICAF Platform Notes with Raffiq and Aiman
  - https://docs.google.com/document/d/14foK88Y3RqloZhxWw1qvGVHCuQTtuRgYpK7tw98eXjU/edit

$ Daily.co
  - 1-1 session
    - recruiter window id
    - student lepas 15 min tukar ke join video call, btn join tu hilang

$ Chat Macam GraduateLand

$ right bar layout buang
  - makan spaces

$ company page
  - Ask Us Question -> 

$ Flow Changes
  - Scheduling boleh buat bila2

$ Mock Interview
  - Register -> Pilih Schedule ->  Join
  - Find -> Set Availabilty -> Join
  - Admin yang set availability

$ Buang activation email limitation

# DONE // Flow Video call baru => 1-1 session macam group session
# DONE // header title by career fair
# // ask a question dlm company booth (drop resume click here)
# // go to forum kecik je
// 
# Study Field
ActivitySingle btn action tak reload view -- 1_Waiting

##### List On Notification (Facebook style notification) ---------------------
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


