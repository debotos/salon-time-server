import express = require('express')

import { ContactController } from '../controllers/ContactController'

const router = express.Router()
const Controller: ContactController = new ContactController()

export function ContactRoutes(): any {
	return router
		.get('/', Controller.getContacts)
		.post('/', Controller.addNewContact)
		.get('/:contactId', Controller.getContactWithID)
		.put('/:contactId', Controller.updateContact)
		.delete('/:contactId', Controller.deleteContact)
}
