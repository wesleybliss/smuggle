'use strict'

const restify = require('restify')
const corsMiddleware = require('restify-cors-middleware')
const log = require('./utils/logger')

const app = restify.createServer({
    name:    'Smuggle',
    version: '1.0.0'
})

const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: ['*'],
    allowHeaders: [
        'Authorization',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Headers'
    ],
    exposeHeaders: ['API-Token-Expiry']
})

app.use(restify.plugins.acceptParser(app.acceptable))
app.use(restify.plugins.fullResponse())
app.use(restify.plugins.queryParser())
app.use(restify.plugins.bodyParser({ extended: true }))
app.use(restify.plugins.gzipResponse())
app.use(restify.plugins.authorizationParser())
app.pre(cors.preflight)
app.use(cors.actual)
//app.use(basicAuth(app.name, 'foo', 'NitradeDemo2017'))

app.on('InternalError', (req, res, err) => {
    console.error(err)
    res.send(err.statusCode || 500, { error: err })
})

app.use((req, res, next) => {
    const clientAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    log.info(`[${clientAddress}]`, req.method, req.url, JSON.stringify(req.query))
    next()
})

app.on('after', (req, res, route, err) => {
    if (err) console.error(err)
})

module.exports = app
