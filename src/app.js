const config = require('./config')
const http = require('http')
const Koa = require('koa')

const app = new Koa()

app.keys = [config.secret]

const render = require('koa-ejs')
const assets = require('koa-static')
const responseTime = require('koa-response-time')
const helmet = require('koa-helmet')
const logger = require('koa-logger')
const error = require('./middleware/error-middleware')
const bodyParser = require('koa-body')
const routes = require('./routes')

if (!config.env.isTest) {
  app.use(responseTime())
  app.use(helmet())
}

render(app, {
  root: config.server.view,
  layout: 'layout/index',
  cache: false
})

app.use(assets(config.server.static))

app.use(logger())

app.use(error)
app.use(bodyParser(config.bodyParser))

app.use(routes.routes())
app.use(routes.allowedMethods())

app.server = require('http-shutdown')(http.createServer(app.callback()))

app.shutDown = function shutDown () {
  let err

  console.log('Shutdown')

  if (this.server.listening) {
    this.server.shutdown(error => {
      if (error) {
        console.error(error)
        err = error
      }
    })
  }
}

module.exports = app
