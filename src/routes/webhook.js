'use strict'

const app = require('../app')
const log = require('../utils/logger')
const chalk = require('chalk')
const { config } = app
const supportedHosts = require('../supported-hosts')
const { processRepo } = require('../lib/git')

const verify = (req, res, next) => {
    
    const { name } = req.params
    
    if (!config.repos.hasOwnProperty(name)) {
        log.warn(chalk.red.bold('Error:'), 'no repo by the name', name, 'found in config')
        return res.send(404)
    }
    
    const repo = config.repos[name]
    
    if (!supportedHosts.includes(repo.type)) {
        log.warn(`Unsupported Git host (in config, at "${name}.type": "` + chalk.red(repo.type) + '"')
        return res.send(500)
    }
    
    for (let key in repo.requiredHeaders) {
        
        // All headers must exist
        if (!req.headers.hasOwnProperty(key)) {
            log.warn('Missing header', key, req.headers)
            return res.send(422)
        }
        
        // Headers not null need to value match
        if (repo.requiredHeaders[key] != null &&
            repo.requiredHeaders[key] !== req.headers[key]) {
            log.warn('Header exists, but doesn\'t match required value', key,
                '(' + repo.requiredHeaders[key], '!==', req.headers[key] + ')')
            return res.send(422)
        }
        
    }
    
    next()
    
}

app.post('/:name', verify, (req, res) => {
    
    const { name } = req.params
    const repo = config.repos[name]
    
    log.info(
        chalk.blue.bold('POST HOOK'),
        chalk.yellow.bold(name),
        `(${chalk.magenta(repo.type)})`/*,
        JSON.stringify(req.headers, null, 4),
        JSON.stringify(req.body, null, 4)*/
    )
    
    processRepo(name, repo, req.body)
    
    res.send(200)
    
})
