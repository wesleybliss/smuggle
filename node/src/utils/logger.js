'use strict'

const os = require("os")
const path = require('path')
const winston = require('winston')
const transports = []

winston.emitErrs = true

const simplifiedStackTrace = err => err.stack
    .split('\n')
    .filter(x => !x.includes('node_modules'))
    .filter(x => !x.includes(path.resolve(__filename)))
    .join('\n')

transports.push(new winston.transports.Console({
    level:             process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    handleExceptions:  true,
    json:              false,
    colorize:          true,
    prettyPrint:       true,
    formatter: function(options) {
        winston.Transport.call(this, options)
        return winston.config.colorize(
            options.level, options.level) + ': ' +
            '[' + os.hostname() + '] ' +
            /*stackTrace() + ' ' +*/
            (options.message ? options.message : '') +
            (options.meta && Object.keys(options.meta).length ? '\n\t' +
                JSON.stringify(options.meta, null, '    ') : '' ) +
            (options.level === 'error' ? '\n' + simplifiedStackTrace(new Error()) : '')
    }
}))

/**
 * An instance of Winston for logging to both console and file.
 * 
 * @type {Winston}
 */
const logger = new winston.Logger({
    transports,
    exitOnError: false
})


module.exports = logger
