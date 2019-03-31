#DONE // Flow Video call baru => 1-1 session macam group session
// header title by career fair
// ask a question dlm company booth (drop resume click here)
// go to forum kecik je
// bar sume kat atas (macam linked in)

##### List On Notification (Facebook style notification) ---------------------
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

Register
- Major ad selection n free text (like document label)
 
##### Resume Drop ---------------------------------------------------------------
#- Whats Next Lepas Drop Resume

##### Card GS and 1-1 Session ---------------------------------------------------
#- Happening in 10 minutes
#- Waiting for recruiters


