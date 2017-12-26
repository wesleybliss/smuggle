'use strict'

const path = require('path')

require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
})

module.exports = config => {
    
    const app = require('./app')
    
    app.config = config
    
    require('require-all')(path.resolve(__dirname, 'routes'))
    
    const host = process.env.HOST || '0.0.0.0'
    const port = process.env.PORT || 3100
    
    app.listen(port, host, console.info(
        `App listening at http://${host}:${port}`))
    
}
