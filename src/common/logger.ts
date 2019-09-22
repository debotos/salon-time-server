import appRoot from 'app-root-path'
import { createLogger, format, transports } from 'winston'
import path from 'path'

const fileName: string = process.mainModule ? process.mainModule.filename : ''

// define the custom settings for each transport (file, console)
const options = {
	info: {
		level: 'info',
		filename: `${appRoot}/logs/all.log`,
		handleExceptions: true,
		json: true,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		colorize: false,
		format: format.combine(
			format.label({ label: path.basename(fileName) }),
			format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
		)
	},
	error: {
		level: 'error',
		filename: `${appRoot}/logs/error.log`,
		handleExceptions: true,
		json: true,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		colorize: false,
		format: format.combine(
			format.label({ label: path.basename(fileName) }),
			format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
		)
	},
	console: {
		prettyPrint: true,
		handleExceptions: true,
		json: false,
		colorize: true,
		level: 'debug',
		format: format.combine(
			format.label({ label: path.basename(fileName) }),
			format.colorize(),
			format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
		)
	}
}

// instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
	transports: [
		new transports.File(options.info),
		new transports.File(options.error),
		new transports.Console(options.console)
	],
	exitOnError: false // do not exit on handled exceptions
})

/* To use with 'morgan' lib */
export class LoggerStream {
	write(message: string) {
		/* Filter out the graphql entries */
		if (process.env.NODE_ENV === 'development') {
			if (!message.includes('POST /graphql 200')) {
				logger.info(message.substring(0, message.lastIndexOf('\n')))
			}
		} else {
			logger.info(message.substring(0, message.lastIndexOf('\n')))
		}
	}
}

/* Exposed logger. Example -> logger.info(msg), logger.error(msg) */
export default logger
