'use strict'

const fs = require('fs')
const path = require('path')

const template = JSON.stringify({
    repos: {
        'my-gitlab-project': {
            path: '/path/to/my-gitlab-project',
            requiredHeaders: {
                'x-gitlab-event': null,
                'x-gitlab-token': 'my-secret-key'
            }
        }
    }
}, null, 4)

module.exports = () => {
    
    const file = path.join(process.cwd(), 'smuggle.json')
    
    if (fs.existsSync(file))
        throw new Error('Smuggle config already exists at ' + file)
    
    fs.writeFileSync(file, template, 'utf8')
    
    return file
    
}
