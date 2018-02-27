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
    , LogType
    //, CFType
    , DocLinkType } = require('./all-type.js');

const graphqlFields = require('graphql-fields');

//import all action for type
const { UserExec } = require('../model/user-query.js');
//const { CFExec } = require('../model/cf-query.js');
const { Queue, QueueExec } = require('../model/queue-query.js');
const { DashboardExec } = require('../model/dashboard-query.js');
const { CompanyExec } = require('../model/company-query.js');
const { PrescreenExec } = require('../model/prescreen-query.js');
const { VacancyExec } = require('../model/vacancy-query.js');
const { MetaExec } = require('../model/meta-query.js');
const { LogExec } = require('../model/log-query.js');
const { AuditoriumExec } = require('../model/auditorium-query');
const { PasswordResetExec } = require('../model/reset-password-query.js');
const { SessionExec, SessionNoteExec, SessionRatingExec } = require('../model/session-query.js');
const { MessageExec } = require('../model/message-query.js');
const { ResumeDropExec } = require('../model/resume-drop-query.js');
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
        search_student: { type: GraphQLString }
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
        page: { type: GraphQLInt },
        offset: { type: GraphQLInt },
        order_by: { type: GraphQLString },

        //search query
        student_name: { type: GraphQLString },
        student_email: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return PrescreenExec.prescreens(arg, graphqlFields(info));
    }
};

/*******************************************/
/* resume_drop ******************/
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
