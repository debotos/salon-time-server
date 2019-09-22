import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-express'

declare var process: { env: { [key: string]: string } }

export default async function(req: any) {
	const token = req.headers['x-token']

	if (token) {
		try {
			return await jwt.verify(token, process.env.JWT_SECRET)
		} catch (e) {
			throw new AuthenticationError('Your session expired. Sign in again.')
		}
	}

	return null
}
