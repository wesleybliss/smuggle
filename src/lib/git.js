'use strict'

const fs = require('fs')
const log = require('../utils/logger')
const chalk = require('chalk')
const supportedActions = require('../supported-actions')
const shell = require('shelljs')
const dot = require('dot-object')
const {
    cd,
    exec
} = shell

/**
 * Verifies expected body/payload keys & values,
 * according to the Smuggle config provided
 * 
 * @param  {Object} repo Repository config (from smuggle.json)
 * @param  {Object} body Request body (from Restify)
 * @return {Boolean}     True if all key/value pairs match
 */
const verifyProps = (repo, body) => {
    
    for (let key in repo.requiredProps) {
        
        const givenValue = dot.pick(key, body)
        const requiredValue = repo.requiredProps[key]
        
        if (givenValue !== requiredValue) {
            console.warn(
                `Expected ${chalk.bold(key)} to be ${chalk.bold(requiredValue)} ` +
                `but got ${chalk.bold(givenValue)} instead`
            )
            return false
        }
        
    }
    
    return true
    
}

/**
 * Updates a Git repository according to the Smuggle config provided
 * 
 * @param  {Object} repo Repository config (from smuggle.json)
 * @return {Void}        Logs it's own errors; doesn't return anything actionable
 */
const updateRepo = (repo, path, reset, action, branch) => {
    
    log.info('Updating repo as user', process.env.USER)
    
    cd(path)
    
    let res = exec('git status', { silent: true })
    
    if (res.stderr || !res.stdout.includes('On branch'))
        return log.warn('\t', chalk.red.bold('Error:'),
            'Status check failed -', res.stderr, '/', res.stdout)
    
    if (reset === true) {
        log.info('\t', `Resetting ${path}`)
        res = exec('git reset --hard', { silent: true })
        if (res.stderr || !res.stdout.includes('HEAD is now at'))
            return log.warn('\t', chalk.red.bold('Error:'),
                'Reset failed -', res.stderr, '/', res.stdout)
    }
    
    log.info('\t', `Checking out ${branch}`)
    
    res = exec(`git checkout ${branch}`, { silent: true })
    
    if (res.stderr &&
        !res.stderr.includes(`Switched to branch '${branch}'`) &&
        !res.stderr.includes(`Already on '${branch}'`))
        return log.warn('\t', chalk.red.bold('Error:'),
            `Failed to checkout branch ${branch} - ${res.stderr}`)
    
    log.info('\t', `Performing ${action}`)
    
    switch (action) {
        
        case 'pull':
            res = exec('git pull', { silent: true})
            if (res.stderr /* @todo || check output*/)
                return log.warn('\t', chalk.red.bold('Error:'),
                    `Failed to pull ${branch} - ${res.stderr}`)
            break
        
        default:
            return log.warn('\t', chalk.red.bold('Error:'), 'Unsuported action')
        
    }
    
    if (repo.postActions)
        repo.postActions.forEach(cmd => {
            
            // Log any non 'echo' commands (but still process them,
            // since they might include expansions like $PWD, etc.)
            if (cmd && !cmd.trim().startsWith('echo'))
                log.info('\t', chalk.cyan('Post Action:'), cmd)
            
            res = exec(cmd, { silent: true })
            
            if (res.stderr)
                log.info('\t\t' + chalk.red(res.stderr))
            
            if (res.stdout.endsWith('\n'))
                res.stdout = res.stdout.substring(0, res.stdout.length - 1)
            
            log.info('\t\t' + chalk.green(res.stdout || '(no output)'))
            
        })
    
} // updateRepo

const processRepo = (name, repo, body) => {
    
    const {
        path,
        reset,
        action,
        branch
    } = repo
    
    if (!supportedActions.includes(action))
        return log.warn('\t', 'Unsupported action', action,
            '- must be one of', chalk.bold(supportedActions.join(', ')))
    
    if (!fs.existsSync(path))
        return log.warn('\t', 'Repositiry path not accessible at', path)
    
    // Verify required props match
    if (!verifyProps(repo, body))
        return log.warn('\t', 'Required props failed - aborting')
    
    updateRepo(repo, path, reset, action, branch)
    
}

module.exports.processRepo = processRepo