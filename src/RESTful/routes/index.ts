import express = require('express')

import { ContactRoutes } from './ContactRoutes'

const setupRESTfulRoutes = (app: express.Application): any => {
	app.use(`/api/contact`, ContactRoutes())
	/* Put other routes below as a statement not ',' seperated */
}

export default setupRESTfulRoutes
