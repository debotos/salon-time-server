import { gql } from 'apollo-server-express'

/*
	In cursor-based pagination, the offset is given an identifier 
	called a cursor rather counting items like offset/limit pagination.
	The cursor can be used to express “give me a limit of X items from cursor Y”. 
	A common approach to use dates (e.g. creation date of an entity in the database) 
	to identify an item in the list. In our case, 
	each message already has a createdAt date that is assigned to the entity 
	when it is written to the database and we expose it already in the schema of the message entity. 
	That’s the creation date of each message that will be the cursor.
*/

export default gql`
	extend type Query {
		messages(offset: Int, cursor: String, limit: Int): MessageConnection!
		message(id: ID!): Message!
	}

	extend type Mutation {
		createMessage(text: String!): Message!
		deleteMessage(id: ID!): Boolean!
	}

	type MessageConnection {
		edges: [Message!]!
		pageInfo: PageInfo!
	}

	type PageInfo {
		hasNextPage: Boolean!
		endCursor: String!
	}

	type Message {
		id: ID!
		text: String!
		createdAt: Date!
		updatedAt: Date!
		user: User!
	}

	extend type Subscription {
		messageCreated: MessageCreated!
	}

	type MessageCreated {
		message: Message!
	}
`
