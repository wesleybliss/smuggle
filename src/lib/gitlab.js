'use strict'

const log = require('../utils/logger')
const chalk = require('chalk')
const supportedActions = require('../supported-actions')

module.exports = (name, repo) => {
    
    const {
        path,
        reset,
        action,
        branch
    } = repo
    
    if (!supportedActions.includes(action))
        return log.warn('Unsupported action', action,
            '- must be one of', chalk.bold(supportedActions.join(', ')))
    
    if (!fs.existsSync(path))
        return log.warn('Repositiry path not accessible at', path)
    
    if (reset === true) {
        log.info(chalk.red('Reset'), path)
    }
    
    //switch
    log.info('action:', action)
    
    log.info('branch', branch)
    
    log.info('path', path)
    
}
