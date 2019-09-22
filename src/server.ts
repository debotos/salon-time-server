// To handle 'Unhandled promise rejections' error that caused by async/await inside route handler
require('express-async-errors')
import * as dotenv from 'dotenv'
// set ENV variables & Credentials
dotenv.config()
import app, { httpServer } from './app'
import models, { sequelize } from './GraphQL/models'
import { createUsersWithMessages } from './GraphQL/utils/createDummyData'

const PORT: Number = app.get('port')
const HOST: string = process.env.HOST_URL || 'http://localhost'
/* Change it to false in time of production or to make the data stable */
const eraseDatabaseOnSync: boolean = true

/* seed the database on every application startup if true */
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
	if (eraseDatabaseOnSync) {
		createUsersWithMessages(models) /* Generate dummy or initial data */
	}
	httpServer.listen(PORT, () => {
		console.log(` 🚀  RESTful Server is up on ${HOST}:${PORT}/api/*`)
		console.log(` 🚀  GraphQL Server is up on ${HOST}:${PORT}/graphql`)
		console.log(` ✔  Connected to Postgres Database`)
	})
})
