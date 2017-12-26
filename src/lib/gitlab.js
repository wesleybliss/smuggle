'use strict'

const fs = require('fs')
const log = require('../utils/logger')
const chalk = require('chalk')
const supportedActions = require('../supported-actions')
const shell = require('shelljs')
const {
    cd,
    exec
} = shell

module.exports = (name, repo) => {
    
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
    
    //
    // @todo Move this generic git init to a shared file
    //
    
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
            
            log.info('\t', chalk.cyan('Post Action:'), cmd)
            res = exec(cmd, { silent: true })
            
            if (res.stderr)
                log.info('\t\t' + chalk.red(res.stderr))
            
            if (res.stdout.endsWith('\n'))
                res.stdout = res.stdout.substring(0, res.stdout.length - 1)
            
            log.info('\t\t' + chalk.green(res.stdout || '(no output)'))
            
        })
    
}
