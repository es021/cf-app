//import all type
const {QueueType, UserType} = require('./all-type.js');

//import all action for type
const {Queue} = require('../model/queue-query.js');
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
            resolve(parentValue, arg) {
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
            resolve(parentValue, arg) {
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
                grad_month: {type: GraphQLString},
                grad_year: {type: GraphQLString},
                sponsor: {type: GraphQLString},
                cgpa: {type: GraphQLString},
                major: {type: GraphQLString},
                minor: {type: GraphQLString},

                // rec only
                company_id: {type: GraphQLInt}
            },
            resolve(parentValue, arg) {
                var ID = arg.ID;
                return UserExec.editUser(arg).then(function (res) {
                    console.log("finish editUser", ID);
                    return UserExec.user({ID: ID});
                }, (err) => {
                    return err;
                });
            }
        }

        /*,
         
         editCustomer: {
         type: CustomerType,
         args: {
         id: {type: new GraphQLNonNull(GraphQLString)},
         name: {type: GraphQLString},
         email: {type: GraphQLString},
         age: {type: GraphQLInt}
         },
         resolve(parentValue, args) {
         return axios.patch(jsonServer + "/customers/" + args.id, args)
         .then(res => res.data);
         }
         },
         deleteCustomer: {
         type: CustomerType,
         args: {
         id: {type: new GraphQLNonNull(GraphQLString)}
         },
         resolve(parentValue, args) {
         return axios.delete(jsonServer + "/customers/" + args.id).then(res => res.data);
         }
         }*/
    }
});


module.exports = {Mutation};