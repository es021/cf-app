//import all type
const {QueueType} = require('./all-type.js');

//import all action for type
const {Queue} = require('../model/queue-query.js');
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
                status: {type: new GraphQLNonNull(GraphQLString)},
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