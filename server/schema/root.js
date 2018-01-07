//import all type
const { UserType
    , CompanyType
    , QueueType
    , ResumeDropType
    , VacancyType
    , DocLinkType } = require('./all-type.js');

const graphqlFields = require('graphql-fields');

//import all action for type
const { UserExec } = require('../model/user-query.js');
const { Queue, QueueExec } = require('../model/queue-query.js');
const { CompanyExec } = require('../model/company-query.js');
const { VacancyExec } = require('../model/vacancy-query.js');
const { ResumeDropExec } = require('../model/resume-drop-query.js');
const DB = require('../model/DB.js');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');


//------------------------------------------------------------------------------
// START CREATE FIELDS
var fields = {};


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
        offset: { type: GraphQLInt }
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
        cf: { type: GraphQLString }
    },
    resolve(parentValue, arg, context, info) {
        return CompanyExec.companies(arg, graphqlFields(info));
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
/* vacancy ******************/
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
        student_id: { type: GraphQLInt }
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
