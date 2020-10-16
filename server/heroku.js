// TODO: set environment variables

// Pre-instillation will have to involve setting this token
const Heroku = require('heroku-client')
const heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN })