//import all type
const { QueueType, ZoomInviteType, LogType, AuditoriumType
    , DashboardType, MetaType, PasswordResetType, SessionNoteType
    , MessageType, VacancyType, SessionRatingType, CompanyType
    , UserType, SessionType, ResumeDropType
    , PrescreenType, DocLinkType, SkillType } = require('./all-type.js');


//import all action for type
const { Queue, ZoomInvite, Log, Auditorium, Vacancy, Meta, PasswordReset
    , Dashboard, SessionNotes, Company, DocLink, SessionRating
    , Skill, ResumeDrop, Session, Prescreen } = require('../../config/db-config');

const graphqlFields = require('graphql-fields');
const { UserExec } = require('../model/user-query.js');
const { QueueExec } = require('../model/queue-query.js');
const { MessageExec } = require('../model/message-query.js');
const { ResumeDropExec } = require('../model/resume-drop-query.js');
const DB = require('../model/DB.js');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');


//------------------------------------------------------------------------------
// START CREATE FIELDS
var fields = {};

/* message ******************/
fields["add_zoom_invite"] = {
    type: ZoomInviteType,
    args: {
        user_id: { type: new GraphQLNonNull(GraphQLInt) },
        zoom_meeting_id: { type: new GraphQLNonNull(GraphQLInt) },
        join_url: { type: new GraphQLNonNull(GraphQLString) },
        session_id: { type: new GraphQLNonNull(GraphQLInt) },
        host_id: { type: new GraphQLNonNull(GraphQLInt) },
        participant_id: { type: new GraphQLNonNull(GraphQLInt) }
    },
    resolve(parentValue, arg, context, info) {
        return DB.insert(ZoomInvite.TABLE, arg).then(function (res) {
            return res;
        });
    }
};


/* message ******************/
fields["add_message"] = {
    type: MessageType,
    args: {
        sender_id: { type: new GraphQLNonNull(GraphQLInt) },
        receiver_id: { type: new GraphQLNonNull(GraphQLInt) },
        message: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parentValue, arg, context, info) {
        return MessageExec.insert(arg.sender_id, arg.receiver_id, arg.message).then(function (res) {
            console.log("insee");
            console.log(res);
            return res;
        });
    }
};


/* company ******************/
fields["add_company"] = {
    type: CompanyType,
    args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        tagline: { type: GraphQLString },
        description: { type: GraphQLString },
        more_info: { type: GraphQLString },
        img_url: { type: GraphQLString },
        img_position: { type: GraphQLString },
        img_size: { type: GraphQLString },
        type: { type: GraphQLInt },
        is_confirmed: { type: GraphQLInt },
        accept_prescreen: { type: GraphQLInt }
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
        ID: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
        tagline: { type: GraphQLString },
        description: { type: GraphQLString },
        more_info: { type: GraphQLString },
        img_url: { type: GraphQLString },
        img_position: { type: GraphQLString },
        img_size: { type: GraphQLString },
        rec_privacy: { type: GraphQLString },
        sponsor_only: { type: GraphQLString },
        type: { type: GraphQLInt },
        is_confirmed: { type: GraphQLInt },
        accept_prescreen: { type: GraphQLString },
        cf: { type: new GraphQLList(GraphQLString) }
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
        ID: { type: new GraphQLNonNull(GraphQLInt) },
        user_email: { type: GraphQLString },
        user_pass: { type: GraphQLString },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        description: { type: GraphQLString },
        role: { type: GraphQLString },
        img_url: { type: GraphQLString },
        img_pos: { type: GraphQLString },
        img_size: { type: GraphQLString },
        feedback: { type: GraphQLString },
        user_status: { type: GraphQLString },
        activation_key: { type: GraphQLString },
        cf: { type: new GraphQLList(GraphQLString) },

        // student only
        university: { type: GraphQLString },
        phone_number: { type: GraphQLString },
        graduation_month: { type: GraphQLString },
        graduation_year: { type: GraphQLString },
        available_month: { type: GraphQLString },
        available_year: { type: GraphQLString },
        sponsor: { type: GraphQLString },
        cgpa: { type: GraphQLFloat },
        major: { type: GraphQLString },
        minor: { type: GraphQLString },

        // rec only
        company_id: { type: GraphQLInt },
        rec_position: { type: GraphQLString },
        rec_company: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        var ID = arg.ID;
        return UserExec.editUser(arg).then(function (res) {
            return UserExec.user({ ID: ID }, graphqlFields(info));
        }, (err) => {
            return err;
        });
    }
};

/*******************************************/
/* doc_link ******************/
fields["add_doc_link"] = {
    type: DocLinkType,
    args: {
        user_id: { type: GraphQLInt },
        company_id: { type: GraphQLInt },
        type: { type: new GraphQLNonNull(GraphQLString) },
        label: { type: new GraphQLNonNull(GraphQLString) },
        url: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString }
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
        ID: { type: new GraphQLNonNull(GraphQLInt) },
        type: { type: GraphQLString },
        label: { type: GraphQLString },
        url: { type: GraphQLString },
        description: { type: GraphQLString }
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
        ID: { type: new GraphQLNonNull(GraphQLInt) }
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
        session_id: { type: new GraphQLNonNull(GraphQLInt) },
        rec_id: { type: new GraphQLNonNull(GraphQLInt) },
        student_id: { type: new GraphQLNonNull(GraphQLInt) },
        note: { type: new GraphQLNonNull(GraphQLString) }
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
        ID: { type: new GraphQLNonNull(GraphQLInt) },
        note: { type: GraphQLString }
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
        ID: { type: new GraphQLNonNull(GraphQLInt) }
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
        session_id: { type: new GraphQLNonNull(GraphQLInt) },
        student_id: { type: new GraphQLNonNull(GraphQLInt) },
        rec_id: { type: new GraphQLNonNull(GraphQLInt) },
        category: { type: new GraphQLNonNull(GraphQLString) },
        rating: { type: new GraphQLNonNull(GraphQLInt) }
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
        ID: { type: new GraphQLNonNull(GraphQLInt) },
        rating: { type: GraphQLInt }
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
        user_id: { type: new GraphQLNonNull(GraphQLInt) },
        token: { type: new GraphQLNonNull(GraphQLString) }
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
        ID: { type: new GraphQLNonNull(GraphQLInt) },
        is_expired: { type: new GraphQLNonNull(GraphQLInt) }
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
        event: { type: new GraphQLNonNull(GraphQLString) },
        data: { type: GraphQLString },
        user_id: { type: GraphQLInt }
    },
    resolve(parentValue, arg, context, info) {
        return DB.insert(Log.TABLE, arg).then(function (res) {
            return res;
        });
    }
};

/*******************************************/
/* dashboard ******************/
fields["add_dashboard"] = {
    type: DashboardType,
    args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        cf: { type: new GraphQLNonNull(GraphQLString) },
        created_by: { type: new GraphQLNonNull(GraphQLInt) }
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
        ID: { type: new GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        type: { type: GraphQLString }
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
        ID: { type: new GraphQLNonNull(GraphQLInt) }
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
        company_id: { type: new GraphQLNonNull(GraphQLInt) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: new GraphQLNonNull(GraphQLString) },
        created_by: { type: new GraphQLNonNull(GraphQLInt) },
        description: { type: GraphQLString },
        requirement: { type: GraphQLString },
        application_url: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return DB.insert(Vacancy.TABLE, arg).then(function (res) {
            return res;
        });
    }
};

fields["edit_vacancy"] = {
    type: VacancyType,
    args: {
        ID: { type: new GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLString },
        type: { type: GraphQLString },
        description: { type: GraphQLString },
        requirement: { type: GraphQLString },
        application_url: { type: GraphQLString }
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
        ID: { type: new GraphQLNonNull(GraphQLInt) }
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
        user_id: { type: new GraphQLNonNull(GraphQLInt) },
        label: { type: new GraphQLNonNull(GraphQLString) }
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
        ID: { type: new GraphQLNonNull(GraphQLInt) }
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
        participant_id: { type: new GraphQLNonNull(GraphQLInt) },
        host_id: { type: new GraphQLNonNull(GraphQLInt) },
        status: { type: new GraphQLNonNull(GraphQLString) },
        entity: { type: new GraphQLNonNull(GraphQLString) },
        entity_id: { type: new GraphQLNonNull(GraphQLInt) }
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
        ID: { type: new GraphQLNonNull(GraphQLInt) },
        status: { type: GraphQLString },
        ended_at: { type: GraphQLInt },
        started_at: { type: GraphQLInt }
    },
    resolve(parentValue, arg, context, info) {
        return DB.update(Session.TABLE, arg).then(function (res) {
            return res;
        });
    }
};

/*******************************************/
/* queue ******************/
fields["add_queue"] = {
    type: QueueType,
    args: {
        student_id: { type: new GraphQLNonNull(GraphQLInt) },
        company_id: { type: new GraphQLNonNull(GraphQLInt) },
        status: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parentValue, arg, context, info) {
        return DB.insert(Queue.TABLE, arg).then(function (res) {
            return QueueExec.queues({ ID: res.ID }, graphqlFields(info), { single: true });
        });
    }
};

fields["edit_queue"] = {
    type: QueueType,
    args: {
        ID: { type: new GraphQLNonNull(GraphQLInt) },
        status: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return DB.update(Queue.TABLE, arg).then(function (res) {
            return QueueExec.queues({ ID: res.ID }, graphqlFields(info), { single: true });
        });
    }
};


/*******************************************/
/* auditorium ******************/
fields["add_auditorium"] = {
    type: AuditoriumType,
    args: {
        company_id: { type: new GraphQLNonNull(GraphQLInt) },
        cf: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        link: { type: GraphQLString },
        moderator: { type: GraphQLString },
        start_time: { type: new GraphQLNonNull(GraphQLInt) },
        end_time: { type: new GraphQLNonNull(GraphQLInt) },
        created_by: { type: new GraphQLNonNull(GraphQLInt) }
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
        ID: { type: new GraphQLNonNull(GraphQLInt) },
        company_id: { type: GraphQLInt },
        cf: { type: GraphQLString },
        type: { type: GraphQLString },
        link: { type: GraphQLString },
        title: { type: GraphQLString },
        moderator: { type: GraphQLString },
        start_time: { type: GraphQLInt },
        end_time: { type: GraphQLInt },
        updated_by: { type: new GraphQLNonNull(GraphQLInt) }
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
        ID: { type: new GraphQLNonNull(GraphQLInt) }
    },
    resolve(parentValue, arg, context, info) {
        return DB.delete(Auditorium.TABLE, arg.ID);
    }
};

/*******************************************/
/* prescreen ******************/
fields["add_prescreen"] = {
    type: PrescreenType,
    args: {
        student_id: { type: new GraphQLNonNull(GraphQLInt) },
        company_id: { type: new GraphQLNonNull(GraphQLInt) },
        status: { type: new GraphQLNonNull(GraphQLString) },
        special_type: { type: GraphQLString },
        appointment_time: { type: GraphQLInt },
        updated_by: { type: GraphQLInt }
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
        ID: { type: new GraphQLNonNull(GraphQLInt) },
        updated_by: { type: new GraphQLNonNull(GraphQLInt) },
        status: { type: GraphQLString },
        special_type: { type: GraphQLString },
        appointment_time: { type: GraphQLInt }
    },
    resolve(parentValue, arg, context, info) {
        return DB.update(Prescreen.TABLE, arg).then(function (res) {
            return res;
        });
    }
};

fields["delete_prescreen"] = {
    type: GraphQLInt,
    args: {
        ID: { type: new GraphQLNonNull(GraphQLInt) }
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
        student_id: { type: new GraphQLNonNull(GraphQLInt) },
        company_id: { type: new GraphQLNonNull(GraphQLInt) },
        doc_links: { type: new GraphQLNonNull(GraphQLString) },
        message: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return DB.insert(ResumeDrop.TABLE, arg).then(function (res) {
            return ResumeDropExec.resume_drops({ ID: res.ID }, graphqlFields(info), { single: true });
        });
    }
};

fields["edit_resume_drop"] = {
    type: ResumeDropType,
    args: {
        ID: { type: new GraphQLNonNull(GraphQLInt) },
        doc_links: { type: GraphQLString },
        message: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return DB.update(ResumeDrop.TABLE, arg).then(function (res) {
            return ResumeDropExec.resume_drops({ ID: res.ID }, graphqlFields(info), { single: true });
        });
    }
};

fields["delete_resume_drop"] = {
    type: GraphQLInt,
    args: {
        ID: { type: new GraphQLNonNull(GraphQLInt) }
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
        meta_key: { type: new GraphQLNonNull(GraphQLString) },
        meta_value: { type: new GraphQLNonNull(GraphQLString) },
        source: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parentValue, arg, context, info) {
        return DB.insert(Meta.TABLE, arg).then(function (res) {
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


module.exports = { Mutation };