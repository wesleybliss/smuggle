'use strict'

const app = require('../app')

app.get('/', (req, res) => {
    res.send(200, {
        name: app.name,
        version: app.version
    })
})
