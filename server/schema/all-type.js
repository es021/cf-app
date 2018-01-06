const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const SkillType = new GraphQLObjectType({
    name: 'Skill',
    fields: () => ({
        ID: { type: GraphQLInt },
        user_id: { type: GraphQLInt },
        label: { type: GraphQLString }
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
        prescreens: { type: new GraphQLList(PrescreenType) },
        sessions: { type: new GraphQLList(SessionType) },

        // student only
        university: { type: GraphQLString },
        phone_number: { type: GraphQLString },
        graduation_month: { type: GraphQLString },
        graduation_year: { type: GraphQLString },
        sponsor: { type: GraphQLString },
        cgpa: { type: GraphQLString },
        major: { type: GraphQLString },
        minor: { type: GraphQLString },
        doc_links: { type: new GraphQLList(DocLinkType) },
        skills: { type: new GraphQLList(SkillType) },

        // rec only
        rec_company: { type: GraphQLInt },
        rec_position: { type: GraphQLString },
        company: { type: CompanyType }

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
        created_at: { type: GraphQLString },

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
        rec_privacy: { type: GraphQLInt },
        type: { type: GraphQLInt },
        accept_prescreen: { type: GraphQLInt },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString }
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


module.exports = {
    UserType
    , CompanyType
    , QueueType
    , PrescreenType
    , DocLinkType
    , VacancyType
    , SkillType
    , SessionType
    , ResumeDropType
};