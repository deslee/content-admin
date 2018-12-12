const express = require('express')
const next = require('next')
const { parse } = require('url')

const dev = process.env.NODE_ENV !== 'production'

const nextApp = next({ dev })
const handler = nextApp.getRequestHandler()

const loader = () => nextApp.prepare().then(() => {
    const app = express()

    app.get('*', (req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url, true)
        handler(req, res, parsedUrl)
    })

    return app;
})

module.exports = {
    loader
}