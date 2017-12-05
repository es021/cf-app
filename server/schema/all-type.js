const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({

            // all roles
            ID: {type: GraphQLInt},
            user_email: {type: GraphQLString},
            user_pass: {type: GraphQLString},
            first_name: {type: GraphQLString},
            last_name: {type: GraphQLString},
            description: {type: GraphQLString},
            img_url: {type: GraphQLString},
            img_pos: {type: GraphQLString},
            img_size: {type: GraphQLString},
            feedback: {type: GraphQLString},
            user_status: {type: GraphQLString},
            activation_key: {type: GraphQLString},
            role: {type: GraphQLString},

            // student only
            university: {type: GraphQLString},
            phone_number: {type: GraphQLString},
            graduation_month: {type: GraphQLString},
            graduation_year: {type: GraphQLString},
            sponsor: {type: GraphQLString},
            cgpa: {type: GraphQLString},
            major: {type: GraphQLString},
            minor: {type: GraphQLString},
            queues: {type: new GraphQLList(QueueType)},
            doc_links: {type: new GraphQLList(DocLinkType)},

            // rec only
            company_id: {type: GraphQLInt},
            company: {type: CompanyType}

        })
});

const QueueType = new GraphQLObjectType({
    name: 'Queue',
    fields: () => ({
            ID: {type: GraphQLInt},
            student_id: {type: GraphQLInt},
            student: {type: UserType},
            company_id: {type: GraphQLInt},
            status: {type: GraphQLString},
            created_at: {type: GraphQLString}
        })
});

const PrescreenType = new GraphQLObjectType({
    name: 'PreScreen',
    fields: () => ({
            ID: {type: GraphQLInt},
            student_id: {type: GraphQLInt},
            company_id: {type: GraphQLInt},
            status: {type: GraphQLString},
            special_type: {type: GraphQLString},
            appointment_time: {type: GraphQLInt},
            created_at: {type: GraphQLString}
        })
});

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
            active_queues: {type: new GraphQLList(QueueType)},
            active_queues_count: {type: GraphQLInt},
            active_prescreens: {type: new GraphQLList(PrescreenType)},
            active_prescreens_count: {type: GraphQLInt},
            vacancies: {type: new GraphQLList(VacancyType)},
            vacancies_count: {type: GraphQLInt},
            ID: {type: GraphQLInt},
            name: {type: GraphQLString},
            tagline: {type: GraphQLString},
            description: {type: GraphQLString},
            more_info: {type: GraphQLString},
            img_url: {type: GraphQLString},
            img_size: {type: GraphQLString},
            img_position: {type: GraphQLString},
            type: {type: GraphQLInt},
            accept_prescreen: {type: GraphQLInt},
            created_at: {type: GraphQLString},
            updated_at: {type: GraphQLString}
        })
});

const DocLinkType = new GraphQLObjectType({
    name: 'DocLink',
    fields: () => ({
            ID: {type: GraphQLInt},
            user_id: {type: GraphQLInt},
            company_id: {type: GraphQLInt},
            type: {type: GraphQLString},
            label: {type: GraphQLString},
            url: {type: GraphQLString},
            description: {type: GraphQLString}
        })
});

const VacancyType = new GraphQLObjectType({
    name: 'Vacancy',
    fields: () => ({
            ID: {type: GraphQLInt},
            company_id: {type: GraphQLInt},
            title: {type: GraphQLString},
            description: {type: GraphQLString},
            requirement: {type: GraphQLString},
            type: {type: GraphQLString},
            application_url: {type: GraphQLString},
            updated_at: {type: GraphQLString}
        })
});


module.exports = {UserType
    , CompanyType
    , QueueType
    , PrescreenType
    , DocLinkType
    , VacancyType
};