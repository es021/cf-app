const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLBoolean
} = require('graphql');

const SkillType = new GraphQLObjectType({
    name: 'Skill',
    fields: () => ({
        ID: { type: GraphQLInt },
        user_id: { type: GraphQLInt },
        label: { type: GraphQLString }
    })
});

const AvailabilityType = new GraphQLObjectType({
    name: 'Availability',
    fields: () => ({
        ID: { type: GraphQLInt },
        user_id: { type: GraphQLInt },
        timestamp: { type: GraphQLInt },
        is_booked: { type: GraphQLBoolean },
        company_id: { type: GraphQLInt },
        prescreen_id: { type: GraphQLInt },
        company : {type: CompanyType},
        prescreen : {type: PrescreenType}
    })
});


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        // all roles
        ID: { type: GraphQLInt },
        user_email: { type: GraphQLString },
        user_pass: { type: GraphQLString },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        description: { type: GraphQLString },
        img_url: { type: GraphQLString },
        img_pos: { type: GraphQLString },
        img_size: { type: GraphQLString },
        feedback: { type: GraphQLString },
        user_status: { type: GraphQLString },
        activation_key: { type: GraphQLString },
        role: { type: GraphQLString },
        cf: { type: new GraphQLList(GraphQLString) },
        user_registered: { type: GraphQLString },

        //active activity
        queues: { type: new GraphQLList(QueueType) },
        session_requests: { type: new GraphQLList(SessionRequestType) },
        registered_prescreens: { type: new GraphQLList(PrescreenType) },
        prescreens: { type: new GraphQLList(PrescreenType) },
        sessions: { type: new GraphQLList(SessionType) },
        zoom_invites: { type: new GraphQLList(ZoomInviteType) },
        group_sessions: { type: new GraphQLList(GroupSessionType) },
        group_session_joins: { type: new GraphQLList(GroupSessionJoinType) },

        // student listing
        // need to provide company_id
        booked_at : {type : new GraphQLList(AvailabilityType)},

        // student only        
        university: { type: GraphQLString },
        phone_number: { type: GraphQLString },
        graduation_month: { type: GraphQLString },
        graduation_year: { type: GraphQLString },
        available_month: { type: GraphQLString },
        available_year: { type: GraphQLString },
        sponsor: { type: GraphQLString },
        cgpa: { type: GraphQLString },
        major: { type: GraphQLString },
        minor: { type: GraphQLString },

        gender : {type: GraphQLString},
        
        mas_state: { type: GraphQLString },
        mas_postcode: { type: GraphQLString },
        relocate: { type: GraphQLString },
        study_place: { type: GraphQLString },
        looking_for: { type: GraphQLString },

        doc_links: { type: new GraphQLList(DocLinkType) },
        skills: { type: new GraphQLList(SkillType) },

        // rec only
        rec_company: { type: GraphQLInt },
        rec_position: { type: GraphQLString },
        company: { type: CompanyType },

        // indicator
        is_active : { type:GraphQLBoolean },
        is_profile_completed : { type:GraphQLBoolean }, // student only

    })
});

const FeedbackQsType = new GraphQLObjectType({
    name: 'FeedbackQs',
    fields: () => ({
        ID: { type: GraphQLInt },
        user_role: { type: GraphQLString },
        question: { type: GraphQLString },
        is_disabled: { type: GraphQLInt },
        created_by: { type: GraphQLInt },
        created_at: { type: GraphQLString },
        updated_by: { type: GraphQLInt },
        updated_at: { type: GraphQLString }
    })
});


const CfsType = new GraphQLObjectType({
    name: 'CfsType',
    fields: () => ({
        ID: { type: GraphQLInt },
        name: { type: GraphQLString },
        country: { type: GraphQLString },
        time: { type: GraphQLString },
        is_active: { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },

        // meta
        title: { type: GraphQLString },
        flag: { type: GraphQLString },
        banner: { type: GraphQLString },
        banner_pos: { type: GraphQLString },
        schedule: { type: GraphQLString },
        override_coming_soon: { type: GraphQLBoolean },
        logo: { type: GraphQLString },
        logo_height: { type: GraphQLString },
        logo_width: { type: GraphQLString },
        logo_position: { type: GraphQLString },
        logo_size: { type: GraphQLString },
        start: { type: GraphQLString },
        end: { type: GraphQLString },
        time_str: { type: GraphQLString },
        time_str_mas: { type: GraphQLString },
        test_start: { type: GraphQLString },
        test_end: { type: GraphQLString },
        page_url: { type: GraphQLString },
        page_banner: { type: GraphQLString },
        can_login: { type: GraphQLInt },
        can_register: { type: GraphQLInt },

        // for org
        Organizer: { type: GraphQLString },
        Collaborator: { type: GraphQLString },
        Powered: { type: GraphQLString },
     })
});



const SessionNoteType = new GraphQLObjectType({
    name: 'SessionNote',
    fields: () => ({
        ID: { type: GraphQLInt },
        session_id: { type: GraphQLInt },
        rec_id: { type: GraphQLInt },
        student_id: { type: GraphQLInt },
        note: { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString }
    })
});

const SessionRatingType = new GraphQLObjectType({
    name: 'SessionRating',
    fields: () => ({
        ID: { type: GraphQLInt },
        session_id: { type: GraphQLInt },
        rec_id: { type: GraphQLInt },
        student_id: { type: GraphQLInt },
        category: { type: GraphQLString },
        rating: { type: GraphQLInt },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString }
    })
});


const SessionType = new GraphQLObjectType({
    name: 'Session',
    fields: () => ({
        ID: { type: GraphQLInt },
        host_id: { type: GraphQLInt },
        participant_id: { type: GraphQLInt },
        company_id: { type: GraphQLInt },
        status: { type: GraphQLString },

        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        started_at: { type: GraphQLInt },
        ended_at: { type: GraphQLInt },

        session_notes: { type: new GraphQLList(SessionNoteType) },
        session_ratings: { type: new GraphQLList(SessionRatingType) },
        recruiter: { type: UserType },
        student: { type: UserType },
        company: { type: CompanyType }
    })
});


const LogType = new GraphQLObjectType({
    name: 'Log',
    fields: () => ({
        ID: { type: GraphQLInt },
        user_id: { type: GraphQLInt },
        event: { type: GraphQLString },
        data: { type: GraphQLString },
        created_at: { type: GraphQLString }
    })
});

const DashboardType = new GraphQLObjectType({
    name: 'Dashboard',
    fields: () => ({
        ID: { type: GraphQLInt },
        cf: { type: GraphQLString },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        type: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        created_at: { type: GraphQLString }
    })
});

const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        id_message_number: { type: GraphQLString },
        from_user_id: { type: GraphQLInt },
        message: { type: GraphQLString },
        created_at: { type: GraphQLString }
    })
});

const SessionRequestType = new GraphQLObjectType({
    name: 'SessionRequest',
    fields: () => ({
        ID: { type: GraphQLInt },
        student_id: { type: GraphQLInt },
        company_id: { type: GraphQLInt },
        status: { type: GraphQLString },
        created_at: { type: GraphQLString },

        student: { type: UserType },
        company: { type: CompanyType }
    })
});

const QueueType = new GraphQLObjectType({
    name: 'Queue',
    fields: () => ({
        ID: { type: GraphQLInt },
        student_id: { type: GraphQLInt },
        company_id: { type: GraphQLInt },
        status: { type: GraphQLString },
        created_at: { type: GraphQLString },
        queue_num: { type: GraphQLInt },

        student: { type: UserType },
        company: { type: CompanyType }
    })
});

const PrescreenType = new GraphQLObjectType({
    name: 'PreScreen',
    fields: () => ({
        ID: { type: GraphQLInt },
        student_id: { type: GraphQLInt },
        company_id: { type: GraphQLInt },
        status: { type: GraphQLString },
        special_type: { type: GraphQLString },
        appointment_time: { type: GraphQLInt },
        updated_at: { type: GraphQLString },
        created_at: { type: GraphQLString },
        created_by: { type: GraphQLInt },
        updated_by: { type: GraphQLInt },

        student: { type: UserType },
        company: { type: CompanyType }
    })
});

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        active_queues: { type: new GraphQLList(QueueType) },
        active_queues_count: { type: GraphQLInt },

        active_prescreens: { type: new GraphQLList(PrescreenType) },
        active_prescreens_count: { type: GraphQLInt },

        vacancies: { type: new GraphQLList(VacancyType) },
        vacancies_count: { type: GraphQLInt },

        active_sessions: { type: new GraphQLList(SessionType) },
        pending_requests: { type: new GraphQLList(SessionRequestType) },

        recruiters: { type: new GraphQLList(UserType) },
        doc_links: { type: new GraphQLList(DocLinkType) },
        ID: { type: GraphQLInt },
        cf: { type: new GraphQLList(GraphQLString) },
        name: { type: GraphQLString },
        tagline: { type: GraphQLString },
        description: { type: GraphQLString },
        more_info: { type: GraphQLString },
        
        img_url: { type: GraphQLString },
        img_size: { type: GraphQLString },
        img_position: { type: GraphQLString },
        
        banner_url: { type: GraphQLString },
        banner_size: { type: GraphQLString },
        banner_position: { type: GraphQLString },

        status: { type: GraphQLString },
        rec_privacy: { type: GraphQLInt },
        sponsor_only: { type: GraphQLInt },
        type: { type: GraphQLInt },
        accept_prescreen: { type: GraphQLInt },
        group_url: { type: GraphQLString },

        priviledge : {type : GraphQLString},

        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString }
    })
});

// const CFType = new GraphQLObjectType({
//     name: 'CF',
//     fields: () => ({
//         ID: { type: GraphQLString },
//         start: { type: GraphQLString },
//         end: { type: GraphQLString },
//         banner_url: { type: GraphQLString },
//         flag: { type: GraphQLString },
//         can_register: { type: GraphQLInt },
//         can_login: { type: GraphQLInt },
//         organizer: { type: GraphQLString },
//         collaborator: { type: GraphQLString }
//     })
// });


const PasswordResetType = new GraphQLObjectType({
    name: 'PasswordReset',
    fields: () => ({
        ID: { type: GraphQLInt },
        user_id: { type: GraphQLInt },
        token: { type: GraphQLString },
        is_expired: { type: GraphQLInt }
    })
});


const DocLinkType = new GraphQLObjectType({
    name: 'DocLink',
    fields: () => ({
        ID: { type: GraphQLInt },
        user_id: { type: GraphQLInt },
        company_id: { type: GraphQLInt },
        type: { type: GraphQLString },
        label: { type: GraphQLString },
        url: { type: GraphQLString },
        description: { type: GraphQLString }
    })
});

const VacancyType = new GraphQLObjectType({
    name: 'Vacancy',
    fields: () => ({
        ID: { type: GraphQLInt },
        company_id: { type: GraphQLInt },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        requirement: { type: GraphQLString },
        type: { type: GraphQLString },
        application_url: { type: GraphQLString },
        updated_at: { type: GraphQLString },

        company: { type: CompanyType }
    })
});

const ResumeDropType = new GraphQLObjectType({
    name: 'ResumeDrop',
    fields: () => ({
        ID: { type: GraphQLInt },
        student_id: { type: GraphQLInt },
        company_id: { type: GraphQLInt },
        message: { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        doc_links: { type: new GraphQLList(DocLinkType) },
        student: { type: UserType },
        company: { type: CompanyType }
    })
});

const GroupSessionType = new GraphQLObjectType({
    name: 'GroupSession',
    fields: () => ({
        ID: { type: GraphQLInt },
        company_id: { type: GraphQLInt },
        company: { type: CompanyType },
        title: { type: GraphQLString },

        start_time : { type:GraphQLInt },
        join_url: { type: GraphQLString },
        start_url: { type: GraphQLString },
        limit_join: { type: GraphQLInt },
        is_expired: { type: GraphQLInt },
        is_canceled: { type: GraphQLInt },
        join_id: { type: GraphQLInt },

        joiners : {type: new GraphQLList(GroupSessionJoinType)},

        created_at: { type: GraphQLString },
        created_by: { type: GraphQLInt },
        updated_at: { type: GraphQLString },
        updated_by: { type: GraphQLInt },
    })
});

const GroupSessionJoinType = new GraphQLObjectType({
    name: 'GroupSessionJoin',
    fields: () => ({
        ID: { type: GraphQLInt },
        group_session_id: { type: GraphQLInt },
        group_session : {type : GroupSessionType},
        is_canceled : { type:GraphQLInt },
        user_id : { type:GraphQLInt },
        user : { type: UserType },
        created_at: { type: GraphQLString }
    })
});


const StudentListingType = new GraphQLObjectType({
    name: 'StudentListing',
    fields: () => ({
        // all roles
        student_id: { type: GraphQLInt },
        created_at: { type: GraphQLString },
        student: { type: UserType },
        company: { type: CompanyType },
    })
});


const MetaType = new GraphQLObjectType({
    name: 'Meta',
    fields: () => ({
        ID: { type: GraphQLInt },
        meta_key: { type: GraphQLString },
        meta_value: { type: GraphQLString },
        source: { type: GraphQLString },
        created_at: { type: GraphQLString }
    })
});

const AuditoriumType = new GraphQLObjectType({
    name: 'Auditorium',
    fields: () => ({
        ID: { type: GraphQLInt },
        cf: { type: GraphQLString },
        company_id: { type: GraphQLInt },
        type: { type: GraphQLString },
        title: { type: GraphQLString },
        link: { type: GraphQLString },
        recorded_link: { type: GraphQLString },
        moderator: { type: GraphQLString },
        start_time: { type: GraphQLInt },
        end_time: { type: GraphQLInt },
        created_by: { type: GraphQLInt },
        updated_by: { type: GraphQLInt },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },

        company: { type: CompanyType }
    })
});

// Recruiter invite other recruiter for panel interview
const ZoomInviteType = new GraphQLObjectType({
    name: 'ZoomInvite',
    fields: () => ({
        ID: { type: GraphQLInt },
        zoom_meeting_id: { type: GraphQLInt },
        join_url: { type: GraphQLString },
        session_id: { type: GraphQLInt },
        host_id: { type: GraphQLInt },
        participant_id: { type: GraphQLInt },
        created_at: { type: GraphQLString },

        is_expired: { type: GraphQLBoolean },

        // participant
        student: { type: UserType },
        //host
        recruiter: { type: UserType }
    })
});

const ForumCommentType = new GraphQLObjectType({
    name: 'ForumComment',
    fields: () => ({
        ID: { type: GraphQLInt },
        forum_id: { type: GraphQLString },
        user_id: { type: GraphQLInt },
        content: { type: GraphQLString },
        is_deleted: { type: GraphQLBoolean },
        is_owner: { type: GraphQLBoolean },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },

        user: { type: UserType },
        replies_count: { type: GraphQLInt },
        replies: { type: new GraphQLList(ForumReplyType) }
    })
});

const ForumReplyType = new GraphQLObjectType({
    name: 'ForumReply',
    fields: () => ({
        ID: { type: GraphQLInt },
        comment_id: { type: GraphQLInt },
        user_id: { type: GraphQLInt },
        content: { type: GraphQLString },
        is_deleted: { type: GraphQLBoolean },
        is_owner: { type: GraphQLBoolean },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        user: { type: UserType }
    })
});

const SupportSessionType = new GraphQLObjectType({
    name: 'SupportSession',
    fields: () => ({
        ID: { type: GraphQLInt },
        user_id: { type: GraphQLInt },
        support_id: { type: GraphQLInt },
        message_count_id: { type: GraphQLString },

        // the updated time in message count id
        last_message_time: { type: GraphQLString },

        // the message content
        last_message: { type: GraphQLString },

        created_at: { type: GraphQLString },
        user: { type: UserType }
    })
});


const QsPopupType = new GraphQLObjectType({
    name: 'QsPopup',
    fields: () => ({
        ID: { type: GraphQLInt },
        type: { type: GraphQLString },
        for_student: { type: GraphQLInt },
        for_rec: { type: GraphQLInt },
        is_disabled: { type: GraphQLInt },
        label: { type: GraphQLString },
        answers: { type: GraphQLString },
    })
});


const QsPopupAnswerType = new GraphQLObjectType({
    name: 'QsPopupAnswer',
    fields: () => ({
        ID: { type: GraphQLInt },
        user_id: { type: GraphQLInt },
        qs_popup_id: { type: GraphQLInt },
        answer: { type: GraphQLString },
    })
});


module.exports = {
    QsPopupType, QsPopupAnswerType
    , UserType
    , ForumCommentType, ForumReplyType
    , ZoomInviteType
    , CompanyType
    , QueueType
    , MessageType
    , PrescreenType
    , DocLinkType
    , VacancyType
    , SkillType
    , SessionType
    , DashboardType
    , SessionNoteType
    , SessionRatingType
    , PasswordResetType
    , ResumeDropType
    , MetaType
    , AuditoriumType
    , SessionRequestType
    , LogType
    , FeedbackQsType
    , SupportSessionType
    , AvailabilityType
    , StudentListingType
    , GroupSessionType
    , GroupSessionJoinType
    , CfsType
    //, CFType
};