import { Request, Response } from 'express'

import Contact from '../models/ContactModel'

export class ContactController {
	public addNewContact(req: Request, res: Response) {
		let newContact = new Contact(req.body)

		newContact.save((err, contact) => {
			if (err) {
				res.send(err)
			}
			res.json(contact)
		})
	}

	public getContacts(_: any, res: Response) {
		Contact.find({}, (err, contact) => {
			if (err) {
				res.send(err)
			}
			res.json(contact)
		})
	}

	public getContactWithID(req: Request, res: Response) {
		Contact.findById(req.params.contactId, (err, contact) => {
			if (err) {
				res.send(err)
			}
			res.json(contact)
		})
	}

	public updateContact(req: Request, res: Response) {
		Contact.findOneAndUpdate(
			{ _id: req.params.contactId },
			req.body,
			{ new: true },
			(err, contact) => {
				if (err) {
					res.send(err)
				}
				res.json(contact)
			}
		)
	}

	public deleteContact(req: Request, res: Response) {
		Contact.remove({ _id: req.params.contactId }, err => {
			if (err) {
				res.send(err)
			}
			res.json({ message: 'Successfully deleted contact!' })
		})
	}
}
