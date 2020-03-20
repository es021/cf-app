//import all type
const {
  EventType,
  QueueType,
  FeedbackQsType,
  ZoomInviteType,
  ZoomMeetingType,
  LogType,
  AuditoriumType,
  DashboardType,
  MetaType,
  PasswordResetType,
  SessionNoteType,
  MessageType,
  VacancyType,
  SessionRatingType,
  CompanyType,
  UserType,
  SessionType,
  ResumeDropType,
  PrescreenType,
  DocLinkType,
  SkillType,
  AvailabilityType,
  SessionRequestType,
  ForumCommentType,
  ForumReplyType,
  GroupSessionJoinType,
  GroupSessionType,
  QsPopupType,
  QsPopupAnswerType,
  EntityRemovedType,
  NotificationType,
  HallGalleryType,
  MultiType,
  SingleType,
  InterestedType,
  VideoType
} = require("./all-type.js");

//import all action for type
const {
  Event,
  Message,
  Queue,
  ZoomMeeting,
  ZoomInvite,
  FeedbackQs,
  Availability,
  Log,
  Auditorium,
  Vacancy,
  Meta,
  PasswordReset,
  Dashboard,
  SessionNotes,
  Company,
  DocLink,
  SessionRating,
  Skill,
  ResumeDrop,
  Session,
  Prescreen,
  PrescreenEnum,
  ForumComment,
  ForumReply,
  SessionRequest,
  GroupSession,
  GroupSessionJoin,
  QsPopup,
  QsPopupAnswer,
  EntityRemoved,
  Notifications,
  HallGallery,
  SingleInput,
  Interested,
  Video
} = require("../../config/db-config");

const graphqlFields = require("graphql-fields");

const { UserExec } = require("../model/user-query.js");
const { QueueExec } = require("../model/queue-query.js");
const { MessageExec } = require("../model/message-query.js");
const { ResumeDropExec } = require("../model/resume-drop-query.js");
const { MultiExec } = require("../model/multi-query");
const DB = require("../model/DB.js");
const { __ } = require("../../config/graphql-config");

const {
  GraphQLObjectType,
  // GraphQLString,
  // GraphQLBoolean,
  GraphQLInt
  // GraphQLFloat,
  // GraphQLSchema,
  // GraphQLList,
  // GraphQLNonNull
} = require("graphql");

//------------------------------------------------------------------------------
// START CREATE FIELDS
var fields = {};

/* video  ******************/

fields["add_video"] = {
  type: VideoType,
  args: {
    entity: __.String,
    entity_id: __.Int,
    meta_key: __.String,
    url: __.String,
    created_at: __.String,
    updated_at: __.String
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Video.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_video"] = {
  type: VideoType,
  args: {
    entity: __.String,
    entity_id: __.Int,
    meta_key: __.String,
    url: __.String,
    created_at: __.String,
    updated_at: __.String
  },
  resolve(parentValue, arg, context, info) {
    try {
      return DB.update(Video.TABLE, arg).then(function(res) {
        return res;
      });
    } catch (err) {
      return {};
    }
  }
};

fields["delete_video"] = {
  type: GraphQLInt,
  args: {
    ID: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.delete(Video.TABLE, arg.ID);
  }
};

/* multi_  ******************/
fields["add_interested"] = {
  type: InterestedType,
  args: {
    user_id: __.IntNonNull,
    entity: __.StringNonNull,
    entity_id: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Interested.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_interested"] = {
  type: InterestedType,
  args: {
    ID: __.IntNonNull,
    is_interested: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    try {
      return DB.update(Interested.TABLE, arg).then(function(res) {
        return res;
      });
    } catch (err) {
      return {};
    }
  }
};

/* single  ******************/
fields["add_single"] = {
  type: SingleType,
  args: {
    key_input: __.StringNonNull,
    entity: __.StringNonNull,
    entity_id: __.IntNonNull,
    val: __.StringNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(SingleInput.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_single"] = {
  type: SingleType,
  args: {
    ID: __.IntNonNull,
    val: __.StringNonNull
  },
  resolve(parentValue, arg, context, info) {
    try {
      return DB.update(SingleInput.TABLE, arg).then(function(res) {
        return res;
      });
    } catch (err) {
      return {};
    }
  }
};

/* multi_  ******************/
fields["add_multi"] = {
  type: MultiType,
  args: {
    table_name: __.StringNonNull,
    entity: __.StringNonNull,
    entity_id: __.IntNonNull,
    val: __.StringNonNull
  },
  resolve(parentValue, arg, context, info) {
    let param = {
      entity: arg.entity,
      entity_id: arg.entity_id,
      val: arg.val
    };
    let table_name = "multi_" + arg.table_name;
    return DB.insert(table_name, param).then(function(res) {
      return res;
    });
  }
};

fields["delete_multi"] = {
  type: GraphQLInt,
  args: {
    table_name: __.StringNonNull,
    ID: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    let table_name = "multi_" + arg.table_name;
    return DB.delete(table_name, arg.ID);
  }
};

/* notification  ******************/
fields["add_notification"] = {
  type: NotificationType,
  args: {
    user_id: __.IntNonNull,
    text: __.StringNonNull,
    type: __.StringNonNull,
    param: __.String,
    cf: __.StringNonNull,
    img_entity: __.StringNonNull,
    img_id: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Notifications.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_notification"] = {
  type: NotificationType,
  args: {
    ID: __.IntNonNull,
    is_read: __.Int
  },
  resolve(parentValue, arg, context, info) {
    try {
      return DB.update(Notifications.TABLE, arg).then(function(res) {
        return res;
      });
    } catch (err) {
      return {};
    }
  }
};

/* entity_removed  ******************/
fields["add_entity_removed"] = {
  type: EntityRemovedType,
  args: {
    entity: __.StringNonNull,
    entity_id: __.IntNonNull,
    user_id: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(EntityRemoved.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

/* hall_gallery  ******************/
fields["add_hall_gallery"] = {
  type: HallGalleryType,
  args: {
    cf: __.StringNonNull,
    type: __.StringNonNull,
    item_order: __.Int,
    is_active: __.Int,
    title: __.String,
    description: __.String,
    img_url: __.String,
    img_pos: __.String,
    img_size: __.String,
    video_url: __.String,
    created_by: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(HallGallery.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_hall_gallery"] = {
  type: HallGalleryType,
  args: {
    ID: __.IntNonNull,
    cf: __.String,
    type: __.String,
    item_order: __.Int,
    is_active: __.Int,
    title: __.String,
    description: __.String,
    img_url: __.String,
    img_pos: __.String,
    img_size: __.String,
    video_url: __.String,
    updated_by: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    try {
      return DB.update(HallGallery.TABLE, arg).then(function(res) {
        return res;
      });
    } catch (err) {
      return {};
    }
  }
};

/* qs_popup  ******************/
fields["add_qs_popup"] = {
  type: QsPopupType,
  args: {
    type: __.StringNonNull,
    for_student: __.Int,
    for_rec: __.Int,
    label: __.StringNonNull,
    answers: __.String,
    created_by: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(QsPopup.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_qs_popup"] = {
  type: QsPopupType,
  args: {
    ID: __.IntNonNull,
    is_disabled: __.Int,
    for_student: __.Int,
    for_rec: __.Int,
    label: __.String,
    answers: __.String,
    updated_by: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    try {
      return DB.update(QsPopup.TABLE, arg).then(function(res) {
        return res;
      });
    } catch (err) {
      return {};
    }
  }
};

fields["add_qs_popup_answer"] = {
  type: QsPopupAnswerType,
  args: {
    user_id: __.IntNonNull,
    qs_popup_id: __.IntNonNull,
    answer: __.StringNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(QsPopupAnswer.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

/* group session ******************/
fields["add_group_session"] = {
  type: GroupSessionType,
  args: {
    company_id: __.IntNonNull,
    title: __.StringNonNull,
    start_time: __.IntNonNull,
    limit_join: __.IntNonNull,
    created_by: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(GroupSession.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_group_session"] = {
  type: GroupSessionType,
  args: {
    ID: __.IntNonNull,
    title: __.String,
    is_expired: __.Int,
    is_canceled: __.Int,
    join_url: __.String,
    start_url: __.String,
    updated_by: __.Int
  },
  resolve(parentValue, arg, context, info) {
    try {
      return DB.update(GroupSession.TABLE, arg).then(function(res) {
        return res;
      });
    } catch (err) {
      return {};
    }
  }
};

/* group session join ******************/
fields["add_group_session_join"] = {
  type: GroupSessionJoinType,
  args: {
    group_session_id: __.IntNonNull,
    user_id: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(GroupSessionJoin.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_group_session_join"] = {
  type: GroupSessionJoinType,
  args: {
    ID: __.IntNonNull,
    is_canceled: __.Int
  },
  resolve(parentValue, arg, context, info) {
    try {
      return DB.update(GroupSessionJoin.TABLE, arg).then(function(res) {
        return res;
      });
    } catch (err) {
      return {};
    }
  }
};


/*******************************************/
/* zoom_meeting ******************/
fields["add_zoom_meeting"] = {
  type: ZoomMeetingType,
  args: {
		session_id: __.Int,
		group_session_id: __.Int,
		pre_screen_id: __.Int,
		host_id: __.Int,
		zoom_host_id: __.String,
		zoom_meeting_id: __.Int,
		start_url: __.String,
		join_url: __.String,
		started_at: __.Int,
		is_expired: __.String
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(ZoomMeeting.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_zoom_meeting"] = {
  type: ZoomMeetingType,
  args: {
    ID: __.IntNonNull,
    is_expired: __.String
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(ZoomMeeting.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

/* add_zoom_invite ******************/
fields["add_zoom_invite"] = {
  type: ZoomInviteType,
  args: {
    user_id: __.IntNonNull,
    zoom_meeting_id: __.IntNonNull,
    join_url: __.StringNonNull,
    session_id: __.IntNonNull,
    host_id: __.IntNonNull,
    participant_id: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(ZoomInvite.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

/* add_message ******************/
fields["add_message"] = {
  type: MessageType,
  args: {
    sender_id: __.IntNonNull,
    receiver_id: __.IntNonNull,
    message: __.StringNonNull,
    which_company: __.String
  },
  resolve(parentValue, arg, context, info) {
    return MessageExec.insert(
      arg.sender_id,
      arg.receiver_id,
      arg.message,
      arg.which_company
    ).then(function(res) {
      return res;
    });
  }
};

fields["edit_message"] = {
  type: MessageType,
  args: {
    id_message_number: __.StringNonNull,
    has_read: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    try {
      return DB.update(Message.TABLE, arg, "id_message_number").then(function(
        res
      ) {
        return res;
      });
    } catch (err) {
      return {};
    }
  }
};

/* availability ******************/
fields["add_availability"] = {
  type: AvailabilityType,
  args: {
    user_id: __.IntNonNull,
    timestamp: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Availability.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_availability"] = {
  type: AvailabilityType,
  args: {
    ID: __.IntNonNull,
    is_booked: __.Int,
    company_id: __.Int,
    prescreen_id: __.Int
  },
  resolve(parentValue, arg, context, info) {
    try {
      return DB.update(Availability.TABLE, arg).then(function(res) {
        return res;
      });
    } catch (err) {
      return {};
    }
  }
};

fields["delete_availability"] = {
  type: GraphQLInt,
  args: {
    ID: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.delete(Availability.TABLE, arg.ID);
  }
};

/* company ******************/
fields["add_company"] = {
  type: CompanyType,
  args: {
    name: __.StringNonNull,
    tagline: __.String,
    description: __.String,
    more_info: __.String,
    img_url: __.String,
    img_position: __.String,
    img_size: __.String,
    type: __.Int,
    is_confirmed: __.Int,
    accept_prescreen: __.Int
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Company.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_company"] = {
  type: CompanyType,
  args: {
    ID: __.IntNonNull,
    name: __.String,
    tagline: __.String,
    description: __.String,
    more_info: __.String,
    img_url: __.String,
    img_position: __.String,
    img_size: __.String,
    banner_url: __.String,
    banner_position: __.String,
    banner_size: __.String,
    rec_privacy: __.String,
    sponsor_only: __.String,
    status: __.String,
    type: __.Int,
    is_confirmed: __.Int,
    accept_prescreen: __.String,
    message_drop_resume: __.String,
    group_url: __.String,
    priviledge: __.String,
    cf: __.StringList
  },
  resolve(parentValue, arg, context, info) {
    try {
      return DB.update(Company.TABLE, arg).then(function(res) {
        return res;
      });
    } catch (err) {
      return {};
    }
  }
};

/* user ******************/
fields["edit_user"] = {
  type: UserType,
  args: {
    // all roles
    ID: __.IntNonNull,
    user_email: __.String,
    user_pass: __.String,
    first_name: __.String,
    last_name: __.String,
    description: __.String,
    role: __.String,
    img_url: __.String,
    img_pos: __.String,
    img_size: __.String,
    feedback: __.String,
    user_status: __.String,
    activation_key: __.String,
    skip_delete_cf: __.Boolean,
    cf: __.StringList,
    // student only
    university: __.String,
    phone_number: __.String,
    graduation_month: __.String,
    graduation_year: __.String,
    available_month: __.String,
    available_year: __.String,
    sponsor: __.String,
    cgpa: __.String,
    study_field: __.String,
    degree_level: __.String,
    major: __.String,
    minor: __.String,

    mas_state: __.String,
    mas_postcode: __.String,
    relocate: __.String,
    study_place: __.String,
    looking_for: __.String,
    gender: __.String,

    // rec only
    company_id: __.Int,
    rec_position: __.String,
    rec_company: __.String
  },
  resolve(parentValue, arg, context, info) {
    var ID = arg.ID;
    return UserExec.editUser(arg).then(
      function(res) {
        return UserExec.user(
          {
            ID: ID
          },
          graphqlFields(info)
        );
      },
      err => {
        return err;
      }
    );
  }
};

/*******************************************/
/* doc_link ******************/
fields["add_doc_link"] = {
  type: DocLinkType,
  args: {
    user_id: __.Int,
    company_id: __.Int,
    type: __.StringNonNull,
    label: __.StringNonNull,
    url: __.StringNonNull,
    description: __.String
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(DocLink.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_doc_link"] = {
  type: DocLinkType,
  args: {
    ID: __.IntNonNull,
    type: __.String,
    label: __.String,
    url: __.String,
    description: __.String
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(DocLink.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["delete_doc_link"] = {
  type: GraphQLInt,
  args: {
    ID: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.delete(DocLink.TABLE, arg.ID);
  }
};

/*******************************************/
/* session_notes ******************/
fields["add_session_note"] = {
  type: SessionNoteType,
  args: {
    session_id: __.IntNonNull,
    rec_id: __.IntNonNull,
    student_id: __.IntNonNull,
    note: __.StringNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(SessionNotes.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_session_note"] = {
  type: SessionNoteType,
  args: {
    ID: __.IntNonNull,
    note: __.String
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(SessionNotes.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["delete_session_note"] = {
  type: GraphQLInt,
  args: {
    ID: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.delete(SessionNotes.TABLE, arg.ID);
  }
};

/*******************************************/
/* session_rating ******************/
fields["add_session_rating"] = {
  type: SessionRatingType,
  args: {
    session_id: __.IntNonNull,
    student_id: __.IntNonNull,
    rec_id: __.IntNonNull,
    category: __.StringNonNull,
    rating: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(SessionRating.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_session_rating"] = {
  type: SessionRatingType,
  args: {
    ID: __.IntNonNull,
    rating: __.Int
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(SessionRating.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

/*******************************************/
/* password_reset ******************/
fields["add_password_reset"] = {
  type: PasswordResetType,
  args: {
    user_id: __.IntNonNull,
    token: __.StringNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(PasswordReset.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_password_reset"] = {
  type: PasswordResetType,
  args: {
    ID: __.IntNonNull,
    is_expired: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(PasswordReset.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

/*******************************************/
/* log ******************/
fields["add_log"] = {
  type: LogType,
  args: {
    event: __.StringNonNull,
    data: __.String,
    user_id: __.Int
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Log.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

/*******************************************/
/* dashboard ******************/
fields["add_dashboard"] = {
  type: DashboardType,
  args: {
    title: __.StringNonNull,
    type: __.StringNonNull,
    content: __.StringNonNull,
    cf: __.StringNonNull,
    created_by: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Dashboard.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_dashboard"] = {
  type: DashboardType,
  args: {
    ID: __.IntNonNull,
    title: __.String,
    content: __.String,
    type: __.String
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(Dashboard.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["delete_dashboard"] = {
  type: GraphQLInt,
  args: {
    ID: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.delete(Dashboard.TABLE, arg.ID);
  }
};

/*******************************************/
/* vacancy ******************/
fields["add_vacancy"] = {
  type: VacancyType,
  args: {
    company_id: __.IntNonNull,
    title: __.StringNonNull,
    type: __.StringNonNull,
    created_by: __.IntNonNull,
    location: __.String,
    description: __.String,
    requirement: __.String,
    application_url: __.String,
    ref_city: __.Int,
    ref_state: __.Int,
    ref_country: __.Int
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Vacancy.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_vacancy"] = {
  type: VacancyType,
  args: {
    ID: __.IntNonNull,
    title: __.String,
    type: __.String,
    location: __.String,
    description: __.String,
    requirement: __.String,
    application_url: __.String,
    ref_city: __.Int,
    ref_state: __.Int,
    ref_country: __.Int
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(Vacancy.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["delete_vacancy"] = {
  type: GraphQLInt,
  args: {
    ID: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.delete(Vacancy.TABLE, arg.ID);
  }
};

/*******************************************/
/* skills ******************/
fields["add_skill"] = {
  type: SkillType,
  args: {
    user_id: __.IntNonNull,
    label: __.StringNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Skill.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["delete_skill"] = {
  type: GraphQLInt,
  args: {
    ID: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.delete(Skill.TABLE, arg.ID);
  }
};

/*******************************************/
/* session ******************/
fields["add_session"] = {
  type: SessionType,
  args: {
    participant_id: __.IntNonNull,
    host_id: __.IntNonNull,
    status: __.StringNonNull,
    entity: __.StringNonNull,
    entity_id: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Session.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_session"] = {
  type: SessionType,
  args: {
    ID: __.IntNonNull,
    status: __.String,
    ended_at: __.Int,
    started_at: __.Int
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(Session.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

/*******************************************/
/* session_request ******************/
fields["add_session_request"] = {
  type: SessionRequestType,
  args: {
    student_id: __.IntNonNull,
    company_id: __.IntNonNull,
    status: __.StringNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(SessionRequest.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_session_request"] = {
  type: SessionRequestType,
  args: {
    ID: __.IntNonNull,
    status: __.String,
    updated_by: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(SessionRequest.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

/*******************************************/
/* queue ******************/
fields["add_queue"] = {
  type: QueueType,
  args: {
    student_id: __.IntNonNull,
    company_id: __.IntNonNull,
    status: __.StringNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Queue.TABLE, arg).then(function(res) {
      return QueueExec.queues(
        {
          ID: res.ID
        },
        graphqlFields(info),
        {
          single: true
        }
      );
    });
  }
};

fields["edit_queue"] = {
  type: QueueType,
  args: {
    ID: __.IntNonNull,
    status: __.String
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(Queue.TABLE, arg).then(function(res) {
      return QueueExec.queues(
        {
          ID: res.ID
        },
        graphqlFields(info),
        {
          single: true
        }
      );
    });
  }
};

/*******************************************/
/* forum_comment ******************/
fields["add_forum_comment"] = {
  type: ForumCommentType,
  args: {
    user_id: __.IntNonNull,
    forum_id: __.StringNonNull,
    content: __.StringNonNull,
    is_owner: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    console.log(arg);
    return DB.insert(ForumComment.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_forum_comment"] = {
  type: ForumCommentType,
  args: {
    ID: __.IntNonNull,
    content: __.StringNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(ForumComment.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["delete_forum_comment"] = {
  type: GraphQLInt,
  args: {
    ID: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    arg["is_deleted"] = 1;
    return DB.update(ForumComment.TABLE, arg).then(function(res) {
      return arg.ID;
    });
  }
};

/*******************************************/
/* forum_reply ******************/
fields["add_forum_reply"] = {
  type: ForumReplyType,
  args: {
    user_id: __.IntNonNull,
    comment_id: __.IntNonNull,
    content: __.StringNonNull,
    is_owner: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(ForumReply.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_forum_reply"] = {
  type: ForumReplyType,
  args: {
    ID: __.IntNonNull,
    content: __.StringNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(ForumReply.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["delete_forum_reply"] = {
  type: GraphQLInt,
  args: {
    ID: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    arg["is_deleted"] = 1;
    return DB.update(ForumReply.TABLE, arg).then(function(res) {
      return arg.ID;
    });
  }
};


/*******************************************/
/* event ******************/
fields["add_event"] = {
  type: EventType,
  args: {
    company_id: __.IntNonNull,
    type: __.StringNonNull,
    title: __.StringNonNull,
    pic: __.String,
    location: __.String,
    description: __.String,
    start_time: __.IntNonNull,
    end_time: __.IntNonNull,
    created_by: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Event.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_event"] = {
  type: EventType,
  args: {
    ID: __.IntNonNull,
    cf: __.StringList,
    company_id: __.Int,
    type: __.String,
    pic: __.String,
    title: __.String,
    location: __.String,
    description: __.String,
    start_time: __.Int,
    end_time: __.Int,
    updated_by: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(Event.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["delete_event"] = {
  type: GraphQLInt,
  args: {
    ID: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.delete(Event.TABLE, arg.ID);
  }
};

/*******************************************/
/* auditorium ******************/
fields["add_auditorium"] = {
  type: AuditoriumType,
  args: {
    company_id: __.IntNonNull,
    cf: __.StringNonNull,
    type: __.StringNonNull,
    title: __.StringNonNull,
    link: __.String,
    recorded_link: __.String,
    moderator: __.String,
    start_time: __.IntNonNull,
    end_time: __.IntNonNull,
    created_by: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Auditorium.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_auditorium"] = {
  type: AuditoriumType,
  args: {
    ID: __.IntNonNull,
    company_id: __.Int,
    cf: __.String,
    type: __.String,
    link: __.String,
    recorded_link: __.String,
    title: __.String,
    moderator: __.String,
    start_time: __.Int,
    end_time: __.Int,
    updated_by: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(Auditorium.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["delete_auditorium"] = {
  type: GraphQLInt,
  args: {
    ID: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.delete(Auditorium.TABLE, arg.ID);
  }
};

/*******************************************/
/* feedback_qs ******************/
fields["add_feedback_qs"] = {
  type: FeedbackQsType,
  args: {
    user_role: __.StringNonNull,
    question: __.StringNonNull,
    created_by: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(FeedbackQs.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_feedback_qs"] = {
  type: FeedbackQsType,
  args: {
    ID: __.IntNonNull,
    user_role: __.String,
    question: __.String,
    is_disabled: __.Int,
    updated_by: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(FeedbackQs.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

/*******************************************/
/* prescreen ******************/
fields["add_prescreen"] = {
  type: PrescreenType,
  args: {
    student_id: __.IntNonNull,
    company_id: __.IntNonNull,
    status: __.StringNonNull,
    special_type: __.String,
    is_onsite_call: __.Int,
    appointment_time: __.Int,
    updated_by: __.Int
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Prescreen.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

fields["edit_prescreen"] = {
  type: PrescreenType,
  args: {
    ID: __.IntNonNull,
    updated_by: __.IntNonNull,
    status: __.String,
    special_type: __.String,
    pic: __.String,
    join_url: __.String,
    start_url: __.String,
    is_onsite_call: __.Int,
    is_expired: __.Int,
    appointment_time: __.Int
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(Prescreen.TABLE, arg).then(function(res) {
      // to update Availability if rejected
      if (res[Prescreen.STATUS] == PrescreenEnum.STATUS_REJECTED) {
        let updAvQuery = `UPDATE ${Availability.TABLE} av
                SET is_booked = 0, company_id = null, prescreen_id = null 
                WHERE 1=1
                AND av.prescreen_id = '${res[Prescreen.ID]}'
                AND av.company_id = '${res[Prescreen.COMPANY_ID]}'
                AND av.user_id = '${res[Prescreen.STUDENT_ID]}'
                AND av.timestamp = '${res[Prescreen.APPNMENT_TIME]}' `;
        DB.query(updAvQuery);
      }

      return res;
    });
  }
};

fields["delete_prescreen"] = {
  type: GraphQLInt,
  args: {
    ID: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.delete(Prescreen.TABLE, arg.ID);
  }
};

/*******************************************/
/* resume_drop ******************/
fields["add_resume_drop"] = {
  type: ResumeDropType,
  args: {
    student_id: __.IntNonNull,
    company_id: __.IntNonNull,
    doc_links: __.StringNonNull,
    message: __.String
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(ResumeDrop.TABLE, arg).then(function(res) {
      return ResumeDropExec.resume_drops(
        {
          ID: res.ID
        },
        graphqlFields(info),
        {
          single: true
        }
      );
    });
  }
};

fields["edit_resume_drop"] = {
  type: ResumeDropType,
  args: {
    ID: __.IntNonNull,
    doc_links: __.String,
    message: __.String
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(ResumeDrop.TABLE, arg).then(function(res) {
      return ResumeDropExec.resume_drops(
        {
          ID: res.ID
        },
        graphqlFields(info),
        {
          single: true
        }
      );
    });
  }
};

fields["delete_resume_drop"] = {
  type: GraphQLInt,
  args: {
    ID: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.delete(ResumeDrop.TABLE, arg.ID);
  }
};

/*******************************************/
/* meta ******************/
fields["add_meta"] = {
  type: MetaType,
  args: {
    meta_key: __.StringNonNull,
    meta_value: __.StringNonNull,
    source: __.StringNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Meta.TABLE, arg).then(function(res) {
      return res;
    });
  }
};

//------------------------------------------------------------------------------
// EXPORT TYPE
//Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: fields
});

module.exports = {
  Mutation
};
