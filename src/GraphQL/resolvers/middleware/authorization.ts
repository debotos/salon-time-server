/*
  This file works as an abstraction layer for protecting GraphQL operations, 
  with solutions called combined resolvers or resolver middleware.
  Using the package graphql-resolvers

  Alternatively, (this becomes repetitive and error prone for this we use upper solution)
  you can do following in every resolvers- 
  import { ForbiddenError } from 'apollo-server'
  -> pull out the 'me' var from 'context' then 
  if (!me) {
			throw new ForbiddenError('Not authenticated as user.')
  }
*/

import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server'
import { combineResolvers, skip } from 'graphql-resolvers'

/* The isAuthenticated() resolver function acts as middleware */
export const isAuthenticated = (_: any, __: any, { me }: any) =>
	me ? skip : new AuthenticationError('Not authenticated as user.')

export const isAdmin = combineResolvers(
	isAuthenticated,
	async (_: any, __: any, { me: { id, role }, models }) => {
		/* 
        This step (role === 'ADMIN' at very first) 
        may not required but this will make the calculation fast.
        Because if this fails then an additional DB query will not execute
      */
		if (role === 'ADMIN') {
			const user = await models.User.findByPk(id)
			if (user && user.role === 'ADMIN') {
				return skip
			} else {
				/*
            In this case, user browser has the token that is sent to the server.
            Server treated it as a valid token because it contains valid signature.
            But the problem is in the back some other admin deleted this account.
            So we are checking that although this user have valid token but in the DB he exist or not. 
          */
				return new AuthenticationError(
					'Your are no longer authorized to perform any admin actions. Your admin account has been deleted.'
				)
			}
		} else {
			return new ForbiddenError('Not authorized as admin.')
		}
	}
)

export const isMessageOwner = async (_: any, { id }: any, { models, me }: any) => {
	const message = await models.Message.findByPk(id, { raw: true })
	if (!message) throw new UserInputError('Invalid message id.')
	if (message.userId !== me.id) {
		throw new ForbiddenError('Not authenticated as owner.')
	}

	return skip
}
