'use strict';
const {GraphQLSchema} = require('graphql');
const {RootQuery} = require('./root.js');
const {Mutation} = require('./mutation.js');

//exports.. not export
module.exports = new GraphQLSchema({
    query: RootQuery
    , mutation: Mutation
});