## Add User Data
### File to Change
1. all-type :: UserType
2. mutation :: edit_user
3. db-config :: UserMeta
4. sign-up :: this.formItems
5. edit-profile :: loadUser() & this.formItems


## Data Structure Change
### 22/09/2018
ALTER TABLE `group_session` ADD `title` VARCHAR(500) NULL AFTER `company_id`; 