const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull,
	GraphQLInt,
	GraphQLBoolean
} = require('graphql');

const __ = {
	ListOf: (listEntity) => {
		return {
			type: new GraphQLList(listEntity)
		}
	},
	IsType: (entity) => {
		return {
			type: entity
		}
	},
	String: {
		type: GraphQLString
	},
	Int: {
		type: GraphQLInt
	},
	Boolean: {
		type: GraphQLBoolean
	},
	StringList: {
		type: new GraphQLList(GraphQLString)
	},
	StringNonNull: {
		type: new GraphQLNonNull(GraphQLString)
	},
	IntNonNull: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	BooleanNonNull: {
		type: new GraphQLNonNull(GraphQLBoolean)
	},
}
module.exports = {
	__
}