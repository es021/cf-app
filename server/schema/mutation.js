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
  IsSeenType,
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
  VideoType,
  TagType,
  CfsType,
  RefGeneral,
  HallLobbyType,
  AnnouncementType,
  UserNoteType,
  GroupCallType,
  GroupCallUserType,
  GlobalDatasetType,
  GlobalDatasetItemType
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
  Tag,
  IsSeen,
  IsSeenEnum,
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
  Video,
  HallLobby
} = require("../../config/db-config");

const graphqlFields = require("graphql-fields");

const { UserExec } = require("../model/user-query.js");
const { CFExec } = require("../model/cf-query.js");
const { QueueExec } = require("../model/queue-query.js");
const { MessageExec } = require("../model/message-query.js");
const { ResumeDropExec } = require("../model/resume-drop-query.js");
const { MultiExec } = require("../model/multi-query");
const DB = require("../model/DB.js");
const { __ } = require("../../config/graphql-config");
const Props = require("./props");

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
const { generateId, makeSnakeCase } = require("../../helper/general-helper.js");
const { GlobalDatasetExec } = require("../model/global-dataset-query.js");

//------------------------------------------------------------------------------
// START CREATE FIELDS
var fields = {};


/* tag  ******************/

fields["add_tag"] = {
  type: TagType,
  args: {
    entity: __.String,
    entity_id: __.Int,
    label: __.String
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Tag.TABLE, arg).then(function (res) {
      return res;
    });
  }
};

fields["edit_tag"] = {
  type: TagType,
  args: {
    ID: __.IntNonNull,
    label: __.String
  },
  resolve(parentValue, arg, context, info) {
    try {
      return DB.update(Tag.TABLE, arg).then(function (res) {
        return res;
      });
    } catch (err) {
      return {};
    }
  }
};

fields["delete_tag"] = {
  type: GraphQLInt,
  args: {
    ID: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.delete(Tag.TABLE, arg.ID);
  }
};


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
    return DB.insert(Video.TABLE, arg).then(function (res) {
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
      return DB.update(Video.TABLE, arg).then(function (res) {
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
fields["add_announcement"] = {
  type: AnnouncementType,
  args: {
    cf: __.StringNonNull,
    title: __.StringNonNull,
    body: __.String,
    created_by: __.IntNonNull,
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert("announcements", arg).then(function (res) {
      return res;
    });
  }
};

// fields["edit_announcement"] = {
//   type: AnnouncementType,
//   args: {
//     ID: __.IntNonNull,
//     title: __.String,
//     body: __.String,
//     updated_by: __.IntNonNull
//   },
//   resolve(parentValue, arg, context, info) {
//     return DB.update("announcement", arg).then(function (res) {
//       return res;
//     });
//   }
// };

/* multi_  ******************/
fields["add_interested"] = {
  type: InterestedType,
  args: {
    user_id: __.IntNonNull,
    // recruiter_id: __.Int,
    entity: __.StringNonNull,
    entity_id: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Interested.TABLE, arg).then(function (res) {
      return res;
    });
  }
};

fields["edit_interested"] = {
  type: InterestedType,
  args: {
    ID: __.IntNonNull,
    is_interested: __.Int,
    application_status: __.String,
  },
  resolve(parentValue, arg, context, info) {
    try {
      console.log("arg", arg);

      let param = { ID: arg.ID }
      if (arg.application_status) {
        param["application_status"] = arg.application_status
      } else {
        param["is_interested"] = arg.is_interested
      }
      console.log("param", param);

      return DB.update(Interested.TABLE, param).then(function (res) {
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
    let onDuplicate = ` val="${arg.val}" `;
    return DB.insert(SingleInput.TABLE, arg, "ID", onDuplicate).then(function (res) {
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
      return DB.update(SingleInput.TABLE, arg).then(function (res) {
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
      key_input: arg.table_name,
      entity: arg.entity,
      entity_id: arg.entity_id,
      val: arg.val
    };
    return DB.insert("multi_input", param).then(function (res) {
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
    return DB.delete("multi_input", arg.ID);
  }
};

/* notification  ******************/
fields["add_notification"] = {
  type: NotificationType,
  args: {
    user_id: __.IntNonNull,
    type: __.StringNonNull,
    cf: __.StringNonNull,

    user_role: __.String,
    param: __.String,
    img_entity: __.String,
    img_id: __.Int
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Notifications.TABLE, arg).then(function (res) {
      return res;
    });
  }
};

fields["edit_notification"] = {
  type: NotificationType,
  args: {
    ID: __.IntNonNull,
    user_id: __.IntNonNull,
    is_read: __.Int
  },
  resolve(parentValue, arg, context, info) {
    try {
      if (arg.is_read == 1) {
        return DB.insert("notifications_read_receipt", {
          notification_id: arg.ID,
          user_id: arg.user_id,
        }).then(function (res) {
          return DB.getByID(Notifications.TABLE, arg.ID);
        });
      }

    } catch (err) {
      return {};
    }
  }
};

/* hall_lobby  ******************/
fields["add_hall_lobby"] = {
  type: HallLobbyType,
  args: {
    cf: __.StringNonNull,
    item_order: __.Int,
    is_active: __.Int,
    title: __.String,
    color: __.String,
    url: __.String,
    created_by: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(HallLobby.TABLE, arg).then(function (res) {
      return res;
    });
  }
};

fields["edit_hall_lobby"] = {
  type: HallLobbyType,
  args: {
    ID: __.IntNonNull,
    cf: __.String,
    item_order: __.Int,
    is_active: __.Int,
    title: __.String,
    color: __.String,
    url: __.String,
    updated_by: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    try {
      return DB.update(HallLobby.TABLE, arg).then(function (res) {
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
    return DB.insert(EntityRemoved.TABLE, arg).then(function (res) {
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
    click_url: __.String,
    is_open_new_tab: __.Int,
    created_by: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(HallGallery.TABLE, arg).then(function (res) {
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
    click_url: __.String,
    is_open_new_tab: __.Int,
    updated_by: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    try {
      return DB.update(HallGallery.TABLE, arg).then(function (res) {
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
    return DB.insert(QsPopup.TABLE, arg).then(function (res) {
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
      return DB.update(QsPopup.TABLE, arg).then(function (res) {
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
    return DB.insert(QsPopupAnswer.TABLE, arg).then(function (res) {
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
    return DB.insert(GroupSession.TABLE, arg).then(function (res) {
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
      return DB.update(GroupSession.TABLE, arg).then(function (res) {
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
    return DB.insert(GroupSessionJoin.TABLE, arg).then(function (res) {
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
      return DB.update(GroupSessionJoin.TABLE, arg).then(function (res) {
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
    chat_user_id: __.Int,
    host_id: __.Int,
    zoom_host_id: __.String,
    zoom_meeting_id: __.String,
    start_url: __.String,
    join_url: __.String,
    started_at: __.Int,
    is_expired: __.String
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(ZoomMeeting.TABLE, arg).then(function (res) {
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
    return DB.update(ZoomMeeting.TABLE, arg).then(function (res) {
      return res;
    });
  }
};

/* add_zoom_invite ******************/
fields["add_zoom_invite"] = {
  type: ZoomInviteType,
  args: {
    user_id: __.IntNonNull,
    zoom_meeting_id: __.StringNonNull,
    join_url: __.StringNonNull,
    session_id: __.IntNonNull,
    host_id: __.IntNonNull,
    participant_id: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(ZoomInvite.TABLE, arg).then(function (res) {
      return res;
    });
  }
};

/* add_message ******************/
fields["add_message"] = {
  type: MessageType,
  args: {
    recruiter_id: __.Int,
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
      arg.which_company,
      arg.recruiter_id
    ).then(function (res) {
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
      return DB.update(Message.TABLE, arg, "id_message_number").then(function (
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
    return DB.insert(Availability.TABLE, arg).then(function (res) {
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
      return DB.update(Availability.TABLE, arg).then(function (res) {
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
    return DB.insert(Company.TABLE, arg).then(function (res) {
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
    priority: __.Int,
    cf: __.StringList
  },
  resolve(parentValue, arg, context, info) {
    try {
      return DB.update(Company.TABLE, arg).then(function (res) {
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


    kpt: __.String,// @kpt_validation
    id_utm: __.String,// @id_utm_validation

    user_email: __.String,
    user_login: __.String,
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
    has_feedback_external: __.String,

    mas_state: __.String,
    mas_postcode: __.String,
    relocate: __.String,
    study_place: __.String,
    looking_for: __.String,
    gender: __.String,

    // rec only
    company_id: __.Int,
    rec_position: __.String,
    rec_company_id: __.Int,
    rec_company: __.String,
    wp_cf_capabilities: __.String,
  },
  resolve(parentValue, arg, context, info) {
    var ID = arg.ID;
    return UserExec.editUser(arg).then(
      function (res) {
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

/* cf ******************/
fields["edit_cf"] = {
  type: CfsType,
  args: Props.Cfs,
  resolve(parentValue, arg, context, info) {
    return CFExec.editCf(arg).then(
      function (res) {
        return CFExec.cfs(
          { name: arg.name },
          graphqlFields(info),
          { single: true }
        );
      },
      function (err) {
        return err;
      }
    );
  }
};

/*******************************************/
/* global_dataset ******************/
fields["add_global_dataset"] = {
  type: GlobalDatasetType,
  args: {
    cf: __.StringNonNull,
    name: __.StringNonNull,
    created_by: __.Int,
  },
  resolve(parentValue, arg, context, info) {
    arg["source"] = GlobalDatasetExec.generateSourceFromName(arg["name"], arg["cf"])
    // arg["source"] = `${makeSnakeCase(arg["name"])}_${arg["cf"]}_${generateId(6)}`;
    // arg["source"] = arg["source"].toLowerCase();
    return DB.insert("global_dataset", arg).then(function (res) {
      return res;
    });
  }
};

fields["edit_global_dataset"] = {
  type: GlobalDatasetType,
  args: {
    ID: __.IntNonNull,
    name: __.StringNonNull,
  },
  resolve(parentValue, arg, context, info) {
    return DB.update("global_dataset", arg).then(function (res) {
      return res;
    });
  }
};
fields["delete_global_dataset"] = {
  type: GraphQLInt,
  args: {
    ID: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.delete("global_dataset", arg.ID);
  }
};




/*******************************************/
/* global_dataset_item ******************/
fields["add_bundle_global_dataset_item"] = {
  type: GraphQLInt,
  args: {
    source: __.StringNonNull,
    val: __.StringNonNull,
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert("global_dataset_item", arg).then(function (res) {
      return res;
    });
  }
};

fields["edit_global_dataset_item"] = {
  type: GlobalDatasetItemType,
  args: {
    ID: __.IntNonNull,
    val: __.StringNonNull,
  },
  resolve(parentValue, arg, context, info) {
    return DB.update("global_dataset_item", arg).then(function (res) {
      return res;
    });
  }
};
fields["delete_global_dataset_item"] = {
  type: GraphQLInt,
  args: {
    ID: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.delete("global_dataset_item", arg.ID);
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
    return DB.insert(DocLink.TABLE, arg).then(function (res) {
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
    return DB.update(DocLink.TABLE, arg).then(function (res) {
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
    return DB.insert(SessionNotes.TABLE, arg).then(function (res) {
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
    return DB.update(SessionNotes.TABLE, arg).then(function (res) {
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
    return DB.insert(SessionRating.TABLE, arg).then(function (res) {
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
    return DB.update(SessionRating.TABLE, arg).then(function (res) {
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
    return DB.insert(PasswordReset.TABLE, arg).then(function (res) {
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
    return DB.update(PasswordReset.TABLE, arg).then(function (res) {
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
    return DB.insert(Log.TABLE, arg).then(function (res) {
      return res;
    });
  }
};


/*******************************************/
/* is_seen ******************/
fields["add_is_seen"] = {
  type: IsSeenType,
  args: {
    user_id: __.IntNonNull,
    type: __.StringNonNull,
    entity_id: __.IntNonNull,
    is_seen: __.IntNonNull,
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(IsSeen.TABLE, arg).then(function (res) {
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
    return DB.insert(Dashboard.TABLE, arg).then(function (res) {
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
    return DB.update(Dashboard.TABLE, arg).then(function (res) {
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

// @custom_vacancy_info
fields["add_vacancy"] = {
  type: VacancyType,
  args: {
    company_id: __.IntNonNull,
    title: __.StringNonNull,
    type: __.StringNonNull,
    created_by: __.IntNonNull,
    location: __.String,
    description: __.String,
    specialization: __.String,
    requirement: __.String,
    application_url: __.String,
    open_position: __.Int,
    ref_city: __.Int,
    ref_state: __.Int,
    ref_country: __.Int
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Vacancy.TABLE, arg).then(function (res) {
      return res;
    });
  }
};

// @custom_vacancy_info
fields["edit_vacancy"] = {
  type: VacancyType,
  args: {
    ID: __.IntNonNull,
    title: __.String,
    type: __.String,
    location: __.String,
    specialization: __.String,
    description: __.String,
    requirement: __.String,
    application_url: __.String,
    open_position: __.Int,
    ref_city: __.Int,
    ref_state: __.Int,
    ref_country: __.Int
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(Vacancy.TABLE, arg).then(function (res) {
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
    return DB.insert(Skill.TABLE, arg).then(function (res) {
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
    return DB.insert(Session.TABLE, arg).then(function (res) {
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
    return DB.update(Session.TABLE, arg).then(function (res) {
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
    return DB.insert(SessionRequest.TABLE, arg).then(function (res) {
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
    return DB.update(SessionRequest.TABLE, arg).then(function (res) {
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
    return DB.insert(Queue.TABLE, arg).then(function (res) {
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
    return DB.update(Queue.TABLE, arg).then(function (res) {
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
    return DB.insert(ForumComment.TABLE, arg).then(function (res) {
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
    return DB.update(ForumComment.TABLE, arg).then(function (res) {
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
    return DB.update(ForumComment.TABLE, arg).then(function (res) {
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
    return DB.insert(ForumReply.TABLE, arg).then(function (res) {
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
    return DB.update(ForumReply.TABLE, arg).then(function (res) {
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
    return DB.update(ForumReply.TABLE, arg).then(function (res) {
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
    url_recorded: __.String,
    url_join: __.String,
    url_rsvp: __.String,
    description: __.String,
    start_time: __.IntNonNull,
    end_time: __.IntNonNull,
    created_by: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Event.TABLE, arg).then(function (res) {
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
    url_recorded: __.String,
    url_join: __.String,
    url_rsvp: __.String,
    description: __.String,
    start_time: __.Int,
    end_time: __.Int,
    updated_by: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(Event.TABLE, arg).then(function (res) {
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
    return DB.insert(Auditorium.TABLE, arg).then(function (res) {
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
    return DB.update(Auditorium.TABLE, arg).then(function (res) {
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
    return DB.insert(FeedbackQs.TABLE, arg).then(function (res) {
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
    return DB.update(FeedbackQs.TABLE, arg).then(function (res) {
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
    recruiter_id: __.Int,
    company_id: __.IntNonNull,
    status: __.StringNonNull,
    special_type: __.String,
    is_onsite_call: __.Int,
    appointment_time: __.Int,
    reschedule_time: __.Int,
    updated_by: __.Int
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(Prescreen.TABLE, arg).then(function (res) {
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
    cancel_reason: __.String,
    special_type: __.String,
    join_url: __.String,
    pic: __.String,
    note: __.String,
    start_url: __.String,
    is_onsite_call: __.Int,
    is_expired: __.Int,
    appointment_time: __.Int,
    reschedule_time: __.Int
  },
  resolve(parentValue, arg, context, info) {
    return DB.update(Prescreen.TABLE, arg).then(function (res) {
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
/* ref_kpt_jpa ******************/
// fields["add_ref_kpt_jpa"] = {
//   type: RefKptJpaType,
//   args: {
//     val: __.StringNonNull
//   },
//   resolve(parentValue, arg, context, info) {
//     let onDuplicate = ` val="${arg.val}" `;
//     return DB.insert("ref_kpt_jpa", arg, "ID", onDuplicate).then(function (res) {
//       return res;
//     });
//   }
// };

fields["add_ref_general"] = {
  type: RefGeneral,
  args: {
    table: __.StringNonNull,
    val: __.StringNonNull
  },
  resolve(parentValue, arg, context, info) {
    let onDuplicate = ` val="${arg.val}" `;
    return DB.insert(arg.table, { val: arg.val }, "ID", onDuplicate).then(function (res) {
      return res;
    });
  }
};

/*******************************************/
/* resume_drop ******************/
fields["add_resume_drop"] = {
  type: ResumeDropType,
  args: {
    student_id: __.IntNonNull,
    company_id: __.IntNonNull,
    cf: __.StringNonNull,
    doc_links: __.StringNonNull,
    message: __.String
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert(ResumeDrop.TABLE, arg).then(function (res) {
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
    return DB.update(ResumeDrop.TABLE, arg).then(function (res) {
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
    return DB.insert(Meta.TABLE, arg).then(function (res) {
      return res;
    });
  }
};


/* user_note  ******************/
fields["add_user_note"] = {
  type: UserNoteType,
  args: {
    user_id: __.IntNonNull,
    company_id: __.IntNonNull,
    note: __.StringNonNull,
    created_by: __.IntNonNull,
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert("user_note", arg).then(function (res) {
      return res;
    });
  }
};

fields["edit_user_note"] = {
  type: UserNoteType,
  args: {
    ID: __.IntNonNull,
    note: __.StringNonNull,
    updated_by: __.IntNonNull,
  },
  resolve(parentValue, arg, context, info) {
    return DB.update("user_note", arg).then(function (res) {
      return res;
    });
  }
};


/* group_call_user  ******************/
fields["add_group_call_user"] = {
  type: GroupCallUserType,
  args: {
    group_call_id: __.IntNonNull,
    user_id: __.IntNonNull,
    created_by: __.IntNonNull,
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert("group_call_user", arg).then(function (res) {
      return res;
    });
  }
};

fields["edit_group_call_user"] = {
  type: GroupCallUserType,
  args: {
    ID: __.IntNonNull,
    is_removed: __.Int,
    updated_by: __.IntNonNull,
  },
  resolve(parentValue, arg, context, info) {
    return DB.update("group_call_user", arg).then(function (res) {
      return res;
    });
  }
};

/* group_call  ******************/
fields["add_group_call"] = {
  type: GroupCallType,
  args: {
    company_id: __.IntNonNull,
    name: __.StringNonNull,
    cf: __.StringNonNull,
    appointment_time: __.IntNonNull,
    url: __.String,
    created_by: __.IntNonNull,
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert("group_call", arg).then(function (res) {
      return res;
    });
  }
};

fields["edit_group_call"] = {
  type: GroupCallType,
  args: {
    ID: __.IntNonNull,

    name: __.String,
    appointment_time: __.Int,
    url: __.String,
    is_canceled: __.Int,

    updated_by: __.IntNonNull,
  },
  resolve(parentValue, arg, context, info) {
    return DB.update("group_call", arg).then(function (res) {
      return res;
    });
  }
};

/* company_email  ******************/
fields["add_company_email"] = {
  type: UserNoteType,
  args: {
    company_id: __.IntNonNull,
    email: __.StringNonNull,
    created_by: __.IntNonNull,
  },
  resolve(parentValue, arg, context, info) {
    return DB.insert("company_emails", arg).then(function (res) {
      return res;
    });
  }
};

fields["edit_company_email"] = {
  type: UserNoteType,
  args: {
    ID: __.IntNonNull,
    email: __.StringNonNull,
    updated_by: __.IntNonNull,
  },
  resolve(parentValue, arg, context, info) {
    return DB.update("company_emails", arg).then(function (res) {
      return res;
    });
  }
};

fields["delete_company_email"] = {
  type: GraphQLInt,
  args: {
    ID: __.IntNonNull
  },
  resolve(parentValue, arg, context, info) {
    return DB.delete("company_emails", arg.ID);
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
