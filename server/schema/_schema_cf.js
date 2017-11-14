'use strict';

//import all type
const {UserType
    , CompanyType
    , QueueType
            //, PrescreenType
} = require('./all-type.js');

//import all action for type
const {UserExec} = require('../model/user-query.js');
const {Queue, QueueExec} = require('../model/queue-query.js');
const {CompanyExec} = require('../model/company-query.js');
const DB = require('../model/DB.js');
//const {PrescreenExec} = require('../model/prescreen-query.js');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');



//Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {
                ID: {type: GraphQLInt},
                user_email: {type: GraphQLString}
            },
            resolve(parentValue, arg) {
                return UserExec.user(arg);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            args: {
                role: {type: GraphQLString},
                page: {type: GraphQLInt},
                offset: {type: GraphQLInt}
            },
            resolve(parentValue, arg) {
                return UserExec.users(arg);
            }
        },
        queues: {
            type: new GraphQLList(QueueType),
            args: {
                student_id: {type: GraphQLInt},
                status: {type: GraphQLString}
            },
            resolve(parentValue, arg) {
                return QueueExec.queues(arg);
            }
        },
        company: {
            type: CompanyType,
            args: {
                ID: {type: GraphQLInt}
            },
            resolve(parentValue, arg) {
                return CompanyExec.company(arg.ID);
            }
        },
        companies: {
            type: new GraphQLList(CompanyType),
            args: {
                type: {type: GraphQLInt}
            },
            resolve(parentValue, arg) {
                return CompanyExec.companies(arg.type);
            }
        }

    }
});


const {Mutation} = require('./mutation.js');

//exports.. not export
module.exports = new GraphQLSchema({
    query: RootQuery
    , mutation: Mutation
});