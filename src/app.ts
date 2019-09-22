import express = require('express')
import * as bodyParser from 'body-parser'
import http from 'http'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import mongoose from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
/* For RESTful API */
import setupRESTfulRoutes from './RESTful/routes'
/* For GraphQL API */
import schema from './GraphQL/schema'
import resolvers from './GraphQL/resolvers'
import models from './GraphQL/models'
import * as loaders from './GraphQL/loaders'
/* Others */
import { LoggerStream } from './common/logger'
import getMe from './GraphQL/utils/getMe'

class App {
	public app: express.Application

	constructor() {
		this.app = express()
		this.config() // middleware & other configuration
		this.setupMongoDB() // MongoDB
		this.setupRoutes() // Routes
	}

	private setupRoutes(): void {
		setupRESTfulRoutes(this.app)
	}

	private config(): void {
		// set PORT
		this.app.set('port', process.env.PORT || 5000)
		// cross-origin request
		this.app.use(cors())
		// request log
		this.app.use(morgan('tiny', { stream: new LoggerStream() }))
		// support application/json type post data
		this.app.use(bodyParser.json())
		// support application/x-www-form-urlencoded post data
		this.app.use(bodyParser.urlencoded({ extended: false }))
		// compression and to secure the endpoint
		this.app.use(compression())
		this.app.use(helmet())
		// Handle The unhandledRejection Event
		process.on('unhandledRejection', error => {
			console.log(` ❎  Error: unhandledRejection => `, error)
		})
	}

	private setupMongoDB(): void {
		if (process.env.USE_MONGO_DB) {
			const mongoURI: string = process.env.MONGO_DB_URI || ''
			mongoose
				.connect(mongoURI, {
					useNewUrlParser: true,
					useCreateIndex: true,
					useFindAndModify: false
				})
				.then(() => console.log(` ✔  Connected to MongoDB`))
				.catch((error: any) => console.error(` ❎  Error: Unable to connect MongoDB!`, error))
		}
	}
}

const app = new App().app

/* Creating a GraphQL Server */
const graphqlServer = new ApolloServer({
	introspection: true /* To Solve, GraphQL schema is not available in GraphQL Playground for application in production */,
	playground: true,
	typeDefs: schema,
	// @ts-ignore: 'resolvers' should accept 'Array<IResolvers>'
	resolvers,
	formatError: error => {
		// remove the internal sequelize(ORM) error message
		// leave only the important validation error
		const message = error.message
			.replace('SequelizeValidationError: ', '')
			.replace('Validation error: ', '')

		return {
			...error,
			message
		}
	},
	context: async ({ req, connection }: any) => {
		/* HTTP requests come with a req and res object, but the subscription comes with a connection object */
		/* For Subscription Case */
		if (connection) {
			return { models }
		}
		/* Regular Case */
		if (req) {
			const me = await getMe(req)
			return {
				models,
				me,
				jwtSecret: process.env.JWT_SECRET,
				loaders: { user: loaders.userLoader }
			}
		}

		return
	}
})

export const httpServer = http.createServer(app) /* For Apollo Server Subscription Setup */
/* Putting RESTful Express Server in it. So that it can work together */
graphqlServer.applyMiddleware({ app }) /* Default open in PORT 5000 */
graphqlServer.installSubscriptionHandlers(httpServer)

export default app
