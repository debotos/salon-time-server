import { PubSub } from 'apollo-server'

import * as MESSAGE_EVENTS from './message'

export const EVENTS = {
	MESSAGE: MESSAGE_EVENTS
}

/* publisher-subscriber mechanism (PubSub) */
export default new PubSub()
