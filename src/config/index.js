const path = require('path')
const _ = require('lodash')

const ROOT = path.resolve(__dirname, '../')
const NODE_ENV = _.defaultTo(process.env.NODE_ENV, 'development')

const isProd = NODE_ENV === 'production'
const isTest = NODE_ENV === 'test'
const isDev = NODE_ENV === 'development'

module.exports = {
  repo: {
    repoDir: path.join(ROOT, '../', '/rp'),
    remote: 'github.com/HanSight-Dev/pentagon-entry.git',
    username: 'zedwang',
    email: 'zedong_wang@hansight.com',
    passwd: 'wangzd0818'
  },
  server: {
    port: normalizePort(_.defaultTo(process.env.PORT, 3000)),
    host: _.defaultTo(process.env.HOST, '0.0.0.0'),
    root: ROOT,
    data: path.join(ROOT, '../', '/data'),
    view: path.join(ROOT, '/views'),
    static: path.join(ROOT, '/assets'),
    
  },

  env: {
    isDev,
    isProd,
    isTest
  },

  cors: {
    origin: '*',
    exposeHeaders: ['Authorization'],
    credentials: true,
    allowMethods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowHeaders: ['Authorization', 'Content-Type'],
    keepHeadersOnError: true
  },

  bodyParser: {
    multipart: true,
    formidable:{
      hash: 'md5',
      keepExtensions: true,
      uploadDir: path.join(ROOT, '../', '/data'),
    }
  },

  secret: _.defaultTo(process.env.SECRET, 'secret'),

  jwtSecret: _.defaultTo(process.env.JWT_SECRET, 'secret'),

  jwtOptions: {
    expiresIn: '7d'
  }
}

function normalizePort (val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}
