//import all type
const {QueueType, UserType, DocLinkType} = require('./all-type.js');
const graphqlFields = require('graphql-fields');

//import all action for type
const {Queue, DocLink} = require('../../config/db-config');
const {UserExec} = require('../model/user-query.js');
const DB = require('../model/DB.js');


const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

//Mutations
const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        add_queue: {
            type: QueueType,
            args: {
                student_id: {type: new GraphQLNonNull(GraphQLInt)},
                company_id: {type: new GraphQLNonNull(GraphQLInt)},
                status: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, arg, context, info) {
                return DB.insert(Queue.TABLE, arg).then(function (res) {
                    return res;
                });
            }
        },
        edit_queue: {
            type: QueueType,
            args: {
                ID: {type: new GraphQLNonNull(GraphQLInt)},
                status: {type: GraphQLString}
            },
            resolve(parentValue, arg, context, info) {
                return DB.update(Queue.TABLE, arg).then(function (res) {
                    return res;
                });
            }
        },

        edit_user: {
            type: UserType,
            args: {
                // all roles
                ID: {type: new GraphQLNonNull(GraphQLInt)},
                user_email: {type: GraphQLString},
                user_pass: {type: GraphQLString},
                first_name: {type: GraphQLString},
                last_name: {type: GraphQLString},
                description: {type: GraphQLString},
                role: {type: GraphQLString},
                img_url: {type: GraphQLString},
                img_pos: {type: GraphQLString},
                img_size: {type: GraphQLString},
                feedback: {type: GraphQLString},
                user_status: {type: GraphQLString},
                activation_key: {type: GraphQLString},

                // student only
                university: {type: GraphQLString},
                phone_number: {type: GraphQLString},
                graduation_month: {type: GraphQLString},
                graduation_year: {type: GraphQLString},
                sponsor: {type: GraphQLString},
                cgpa: {type: GraphQLString},
                major: {type: GraphQLString},
                minor: {type: GraphQLString},

                // rec only
                company_id: {type: GraphQLInt}
            },
            resolve(parentValue, arg, context, info) {
                var ID = arg.ID;
                return UserExec.editUser(arg).then(function (res) {
                    return UserExec.user({ID: ID}, graphqlFields(info));
                }, (err) => {
                    return err;
                });
            }
        },

        add_doc_link: {
            type: DocLinkType,
            args: {
                user_id: {type: GraphQLInt},
                company_id: {type: GraphQLInt},
                type: {type: new GraphQLNonNull(GraphQLString)},
                label: {type: new GraphQLNonNull(GraphQLString)},
                url: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLString}
            },
            resolve(parentValue, arg, context, info) {
                return DB.insert(DocLink.TABLE, arg).then(function (res) {
                    return res;
                });
            }
        },

        edit_doc_link: {
            type: DocLinkType,
            args: {
                ID: {type: new GraphQLNonNull(GraphQLInt)},
                type: {type: GraphQLString},
                label: {type: GraphQLString},
                url: {type: GraphQLString},
                description: {type: GraphQLString}
            },
            resolve(parentValue, arg, context, info) {
                return DB.update(DocLink.TABLE, arg).then(function (res) {
                    return res;
                });
            }
        }
    }
});


module.exports = {Mutation};