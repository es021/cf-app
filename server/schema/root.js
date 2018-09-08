//import all type
const { UserType
    , CompanyType
    , QueueType
    , ResumeDropType
    , VacancyType
    , DashboardType
    , PrescreenType
    , SessionType
    , SessionRatingType
    , SessionNoteType
    , MessageType
    , AuditoriumType
    , PasswordResetType
    , MetaType
    , SupportSessionType
    , LogType
    , ForumCommentType
    , ForumReplyType
    , FeedbackQsType
    , SessionRequestType
    , ZoomInviteType
    , AvailabilityType
    , StudentListingType
    , GroupSessionJoinType
    , GroupSessionType
    , DocLinkType
    , QsPopupType
    , QsPopupAnswerType } = require('./all-type.js');

const graphqlFields = require('graphql-fields');

//import all action for type
const { UserExec } = require('../model/user-query.js');
//const { CFExec } = require('../model/cf-query.js');
const { Queue, QueueExec } = require('../model/queue-query.js');
const { DashboardExec } = require('../model/dashboard-query.js');
const { CompanyExec } = require('../model/company-query.js');
const { PrescreenExec } = require('../model/prescreen-query.js');
const { VacancyExec } = require('../model/vacancy-query.js');
const { AvailabilityExec } = require('../model/availability-query.js');
const { MetaExec } = require('../model/meta-query.js');
const { LogExec } = require('../model/log-query.js');
const { FeedbackQsExec } = require('../model/feedback-qs-query.js');
const { SessionRequestExec } = require('../model/session-request-query.js');
const { SupportSessionExec } = require('../model/support-session-query.js');
const { ZoomExec } = require('../model/zoom-query.js');
const { AuditoriumExec } = require('../model/auditorium-query');
const { PasswordResetExec } = require('../model/reset-password-query.js');
const { SessionExec, SessionNoteExec, SessionRatingExec } = require('../model/session-query.js');
const { MessageExec } = require('../model/message-query.js');
const { ResumeDropExec } = require('../model/resume-drop-query.js');
const { ForumExec } = require('../model/forum-query.js');
const { StudentListingExec } = require('../model/student-listing-query.js');
const { GroupSessionExec } = require('../model/group-session-query.js');
const { QsPopupExec } = require('../model/qs-popup-query.js');
const DB = require('../model/DB.js');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');


//------------------------------------------------------------------------------
// START CREATE FIELDS
var fields = {};

/*******************************************/
/* qs_popup ******************/
fields["qs_popups"] = {
    type: new GraphQLList(QsPopupType),
    args: {
        for_student: { type: GraphQLInt},
        for_rec: { type: GraphQLInt },
        order_by : {type: GraphQLString},
        is_disabled : { type: GraphQLInt },
        page : { type: GraphQLInt },
        type : { type: GraphQLString },
        offset : { type: GraphQLInt },
     },
    resolve(parentValue, arg, context, info) {
        return QsPopupExec.qs_popups(arg, graphqlFields(info));
    }
};

fields["qs_popup"] = {
    type: QsPopupType,
    args: {
        ID: { type: GraphQLInt},
        user_id: { type: GraphQLInt },
        for_student: { type: GraphQLInt},
        for_rec: { type: GraphQLInt },     
        type : { type: GraphQLString },    
        is_disabled: { type: GraphQLInt },         
    },
    resolve(parentValue, arg, context, info) {
        return QsPopupExec.qs_popup(arg, graphqlFields(info));
    }
};


fields["qs_popup_answers"] = {
    type: new GraphQLList(QsPopupAnswerType),
    args: {
        qs_popup_id: { type: GraphQLInt },
        user_role: { type: GraphQLString},
        order_by : {type: GraphQLString},
        page : { type: GraphQLInt },
        type : { type: GraphQLString },
        offset : { type: GraphQLInt },
     },
    resolve(parentValue, arg, context, info) {
        return QsPopupExec.qs_popup_answers(arg, graphqlFields(info));
    }
};


/*******************************************/
/* group_sessions ******************/
fields["group_session"] = {
    type: GroupSessionType,
    args: {
        ID: { type: new GraphQLNonNull(GraphQLInt)},
    },
    resolve(parentValue, arg, context, info) {
        return GroupSessionExec.group_session(arg, graphqlFields(info));
    }
};

fields["group_sessions"] = {
    type: new GraphQLList(GroupSessionType),
    args: {
        company_id: { type: GraphQLInt},
        user_id: { type: GraphQLInt },
        discard_expired : {type : GraphQLBoolean},
        discard_canceled : {type : GraphQLBoolean},
        order_by : {type: GraphQLString}
    },
    resolve(parentValue, arg, context, info) {
        return GroupSessionExec.group_sessions(arg, graphqlFields(info));
    }
};

fields["group_session_joins"] = {
    type: new GraphQLList(GroupSessionJoinType),
    args: {
        user_id: { type: GraphQLInt },
        group_session_id: { type: GraphQLInt },
        is_canceled: { type: GraphQLInt },
        order_by : {type: GraphQLString}
    },
    resolve(parentValue, arg, context, info) {
        return GroupSessionExec.group_session_joins(arg, graphqlFields(info));
    }
};

/*******************************************/
/* student_listing ******************/
fields["student_listing"] = {
    type: new GraphQLList(StudentListingType),
    args: {
        company_id: { type: new GraphQLNonNull(GraphQLInt) },
        page: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        search_student: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return StudentListingExec.student_listing(arg, graphqlFields(info));
    }
};

/*******************************************/
/* feedback_qs ******************/
fields["feedback_qs"] = {
    type: new GraphQLList(FeedbackQsType),
    args: {
        ID: { type: GraphQLInt },
        is_disabled: { type: GraphQLInt },
        user_role: { type: GraphQLString },
        order_by: { type: GraphQLString },

        page: { type: GraphQLInt },
        offset: { type: GraphQLInt }
    },
    resolve(parentValue, arg, context, info) {
        return FeedbackQsExec.feedback_qs(arg, graphqlFields(info));
    }
};

/*******************************************/
/* has_feedback ******************/
fields["has_feedback"] = {
    type: GraphQLInt,
    args: {
        user_id: { type: new GraphQLNonNull(GraphQLInt) }
    },
    resolve(parentValue, arg, context, info) {
        return UserExec.hasFeedback(arg.user_id);
    }
};

/*******************************************/
/* session_requests ******************/
fields["session_requests"] = {
    type: new GraphQLList(SessionRequestType),
    args: {
        company_id: { type: GraphQLInt },
        status: { type: GraphQLString },
        order_by: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return SessionRequestExec.session_requests(arg, graphqlFields(info));
    }
};


/*******************************************/
/* support_sessions ******************/
fields["support_sessions"] = {
    type: new GraphQLList(SupportSessionType),
    args: {
        support_id: { type: GraphQLInt }
    },
    resolve(parentValue, arg, context, info) {
        return SupportSessionExec.support_sessions(arg, graphqlFields(info));
    }
};

/*******************************************/
/* zoom ******************/
fields["zoom_invites"] = {
    type: new GraphQLList(ZoomInviteType),
    args: {
        user_id: { type: GraphQLInt },
        is_expired: { type: GraphQLBoolean }
    },
    resolve(parentValue, arg, context, info) {
        return ZoomExec.zoom_invites(arg, graphqlFields(info));
    }
};

/*******************************************/
/* auditorium ******************/
fields["auditoriums"] = {
    type: new GraphQLList(AuditoriumType),
    args: {
        page: { type: new GraphQLNonNull(GraphQLInt) },
        offset: { type: new GraphQLNonNull(GraphQLInt) },
        now_only: { type: GraphQLBoolean },
        cf: { type: GraphQLString },
        order_by: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return AuditoriumExec.auditoriums(arg, graphqlFields(info));
    }
};

fields["auditorium"] = {
    type: AuditoriumType,
    args: {
        ID: { type: new GraphQLNonNull(GraphQLInt) }
    },
    resolve(parentValue, arg, context, info) {
        return AuditoriumExec.auditoriums(arg, graphqlFields(info), { single: true });
    }
};

/*******************************************/
/* dashboards ******************/
fields["password_reset"] = {
    type: PasswordResetType,
    args: {
        user_id: { type: new GraphQLNonNull(GraphQLInt) },
        token: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parentValue, arg, context, info) {
        return PasswordResetExec.password_reset(arg, graphqlFields(info), { single: true });
    }
};
/*******************************************/
/* dashboards ******************/
fields["dashboard"] = {
    type: DashboardType,
    args: {
        ID: { type: new GraphQLNonNull(GraphQLInt) }
    },
    resolve(parentValue, arg, context, info) {
        return DashboardExec.dashboards(arg, graphqlFields(info), { single: true });
    }
};

fields["dashboards"] = {
    type: new GraphQLList(DashboardType),
    args: {
        cf: { type: GraphQLString },
        type: { type: GraphQLString },
        page: { type: GraphQLInt },
        offset: { type: GraphQLInt }
    },
    resolve(parentValue, arg, context, info) {
        return DashboardExec.dashboards(arg, graphqlFields(info));
    }
};
/*******************************************/
/* messages ******************/
fields["messages"] = {
    type: new GraphQLList(MessageType),
    args: {
        user_1: { type: new GraphQLNonNull(GraphQLInt) },
        user_2: { type: new GraphQLNonNull(GraphQLInt) },
        page: { type: GraphQLInt },
        offset: { type: GraphQLInt }
    },
    resolve(parentValue, arg, context, info) {
        return MessageExec.messages(arg, graphqlFields(info));
    }
};


/*******************************************/
/* user ******************/
fields["user"] = {
    type: UserType,
    args: {
        ID: { type: GraphQLInt },
        user_email: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return UserExec.user(arg, graphqlFields(info));
    }
};

fields["users"] = {
    type: new GraphQLList(UserType),
    args: {
        role: { type: GraphQLString },
        page: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        order_by: { type: GraphQLString },
        cf: { type: GraphQLString },
        new_only: { type: GraphQLInt },
        has_feedback: { type: GraphQLInt },
        //search query
        search_user: { type: GraphQLString } // name and email
        , search_degree: { type: GraphQLString } // major and minor
        , search_university: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return UserExec.users(arg, graphqlFields(info));
    }
};


/*******************************************/
/* queues ******************/
fields["queues"] = {
    type: new GraphQLList(QueueType),
    args: {
        student_id: { type: GraphQLInt },
        status: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return QueueExec.queues(arg, graphqlFields(info));
    }
};


/*******************************************/
/* CF ******************/
// fields["cf"] = {
//     type: CFType,
//     args: {
//         ID: { type: new GraphQLNonNull(GraphQLString) }
//     },
//     resolve(parentValue, arg, context, info) {
//         return CFExec.cfs(arg, graphqlFields(info), { single: true });
//     }
// };

// fields["cfs"] = {
//     type: new GraphQLList(CFType),
//     args: {
//         can_login: { type: GraphQLInt },
//         can_register: { type: GraphQLInt }
//     },
//     resolve(parentValue, arg, context, info) {
//         return CFExec.cfs(arg, graphqlFields(info), {});
//     }
// };

/*******************************************/
/* company ******************/
fields["company"] = {
    type: CompanyType,
    args: {
        ID: { type: new GraphQLNonNull(GraphQLInt) }
    },
    resolve(parentValue, arg, context, info) {
        return CompanyExec.company(arg.ID, graphqlFields(info));
    }
};

fields["companies"] = {
    type: new GraphQLList(CompanyType),
    args: {
        type: { type: GraphQLInt },
        cf: { type: GraphQLString },
        accept_prescreen: { type: GraphQLInt },
        include_sponsor: { type: GraphQLInt },
        ignore_type: { type: GraphQLString },
        order_by: { type: GraphQLString }

    },
    resolve(parentValue, arg, context, info) {
        return CompanyExec.companies(arg, graphqlFields(info));
    }
};

/*******************************************/
/* session ******************/
fields["session"] = {
    type: SessionType,
    args: {
        ID: { type: GraphQLInt }
    },
    resolve(parentValue, arg, context, info) {
        return SessionExec.sessions(arg, graphqlFields(info), extra = { single: true });
    }
};

fields["sessions"] = {
    type: new GraphQLList(SessionType),
    args: {
        company_id: { type: GraphQLInt },
        participant_id: { type: GraphQLInt },
        status: { type: GraphQLString },
        distinct: { type: GraphQLString },
        page: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        order_by: { type: GraphQLString },
        search_student: { type: GraphQLString },
        search_university: { type: GraphQLString }
        //search_company: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return SessionExec.sessions(arg, graphqlFields(info));
    }
};

/*******************************************/
/* session_notes ******************/
fields["session_notes"] = {
    type: new GraphQLList(SessionNoteType),
    args: {
        session_id: { type: GraphQLInt },
        page: { type: GraphQLInt },
        offset: { type: GraphQLInt }
    },
    resolve(parentValue, arg, context, info) {
        return SessionNoteExec.session_notes(arg, graphqlFields(info), {});
    }
};

fields["session_note"] = {
    type: SessionNoteType,
    args: {
        ID: { type: GraphQLInt }
    },
    resolve(parentValue, arg, context, info) {
        return SessionNoteExec.session_notes(arg, graphqlFields(info), { single: true });
    }
};

/*******************************************/
/* session_notes ******************/
fields["session_ratings"] = {
    type: new GraphQLList(SessionRatingType),
    args: {
        session_id: { type: GraphQLInt }
    },
    resolve(parentValue, arg, context, info) {
        return SessionRatingExec.session_ratings(arg, graphqlFields(info), {});
    }
};



/*******************************************/
/* logs ******************/
fields["logs"] = {
    type: new GraphQLList(LogType),
    args: {
        event: { type: new GraphQLNonNull(GraphQLString) },
        start: { type: GraphQLInt },
        end: { type: GraphQLInt },
        order_by: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return LogExec.logs(arg, graphqlFields(info));
    }
};


/*******************************************/
/* metas ******************/
fields["metas"] = {
    type: new GraphQLList(MetaType),
    args: {
        meta_key: { type: GraphQLString },
        meta_value: { type: GraphQLString },
        page: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        order_by: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return MetaExec.metas(arg, graphqlFields(info));
    }
};


/*******************************************/
/* availability ******************/
fields["availabilities"] = {
    type: new GraphQLList(AvailabilityType),
    args: {
        user_id: { type: GraphQLInt },
        timestamp: { type: GraphQLInt },
    },
    resolve(parentValue, arg, context, info) {
        return AvailabilityExec.availabilities(arg, graphqlFields(info));
    }
};

/*******************************************/
/* vacancy ******************/
fields["vacancy"] = {
    type: VacancyType,
    args: {
        ID: { type: GraphQLInt }
    },
    resolve(parentValue, arg, context, info) {
        return VacancyExec.vacancy(arg, graphqlFields(info));
    }
};

fields["vacancies"] = {
    type: new GraphQLList(VacancyType),
    args: {
        title: { type: GraphQLString },
        type: { type: GraphQLString },
        company_id: { type: GraphQLInt },
        page: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        order_by: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return VacancyExec.vacancies(arg, graphqlFields(info));
    }
};

/*******************************************/
/* resume_drop ******************/
fields["prescreen"] = {
    type: PrescreenType,
    args: {
        ID: { type: new GraphQLNonNull(GraphQLInt) }
    },
    resolve(parentValue, arg, context, info) {
        return PrescreenExec.prescreens(arg, graphqlFields(info), { single: true });
    }
};

fields["prescreens"] = {
    type: new GraphQLList(PrescreenType),
    args: {
        company_id: { type: GraphQLInt },
        student_id: { type: GraphQLInt },
        status: { type: GraphQLString },
        special_type: { type: GraphQLString },
        page: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        not_prescreen: { type: GraphQLInt },
        order_by: { type: GraphQLString },

        //search query
        student_name: { type: GraphQLString },
        student_email: { type: GraphQLString },
        student_university: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return PrescreenExec.prescreens(arg, graphqlFields(info));
    }
};

/*******************************************/
/* forum ******************/
fields["forum_comments"] = {
    type: new GraphQLList(ForumCommentType),
    args: {
        forum_id: { type: GraphQLString },
        page: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        order_by: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return ForumExec.forum_comments(arg, graphqlFields(info));
    }
};

fields["forum_replies"] = {
    type: new GraphQLList(ForumReplyType),
    args: {
        comment_id: { type: GraphQLString },
        page: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        order_by: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return ForumExec.forum_replies(arg, graphqlFields(info));
    }
};

/*******************************************/
/* resume_drop ******************/
// return limit if feedback is empty
// return null if still not over limit or feedback is filled
fields["resume_drops_limit"] = {
    type: GraphQLString,
    args: {
        user_id: { type: new GraphQLNonNull(GraphQLInt) }
    },
    resolve(parentValue, arg, context, info) {
        return ResumeDropExec.resume_drops_limit(arg, graphqlFields(info));
    }
};

fields["resume_drop"] = {
    type: ResumeDropType,
    args: {
        ID: { type: GraphQLInt },
        company_id: { type: GraphQLInt },
        student_id: { type: GraphQLInt }
    },
    resolve(parentValue, arg, context, info) {
        return ResumeDropExec.resume_drops(arg, graphqlFields(info), { single: true });
    }
};


fields["resume_drops"] = {
    type: new GraphQLList(ResumeDropType),
    args: {
        ID: { type: GraphQLInt },
        company_id: { type: GraphQLInt },
        student_id: { type: GraphQLInt },

        page: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        order_by: { type: GraphQLString },
        search_student: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return ResumeDropExec.resume_drops(arg, graphqlFields(info));
    }
};

//------------------------------------------------------------------------------
// EXPORT TYPE
//Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: fields
});
module.exports = { RootQuery };
