const axios = require('axios');
const jsonServer = "http://localhost:3000";
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');
//Customer Type
const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
            id: {type: GraphQLString},
            name: {type: GraphQLString},
            email: {type: GraphQLString},
            age: {type: GraphQLInt}
        })
});
//Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        customer: {
            type: CustomerType,
            args: {
                id: {type: GraphQLString}
            },
            //resolve the response
            resolve(parentValue, args) {
                return axios.get(jsonServer + "/customers/" + args.id)
                        .then(res => res.data);
            }
        },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args) {
                return axios.get(jsonServer + "/customers")
                        .then(res => res.data);
            }
        }
    }
});

//Mutations
const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addCustomer: {
            type: CustomerType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args) {
                return axios.post(jsonServer + "/customers", {
                    name: args.name,
                    email: args.email,
                    age: args.age
                }).then(res => res.data);
            }
        },
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
        }
    }
});



//exports.. not export
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation
});