/**
 // for company list
 query{
  group_calls(company_id:1739){
    name
    appointment_time
    user_count
    users {
      ID
      user{ID first_name last_name}
    }
 
  }
}

// for student list
query{
  group_calls(user_id:46384){
    name
    appointment_time
    user_count
    company {
      ID
      name
      img_url
      img_size
      img_position
    }
  }
}

 */