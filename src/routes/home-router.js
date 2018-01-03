const Router = require('koa-router')
const ctrl = require('../controllers').home
const router = new Router()

router.get('/', ctrl)
module.exports = router.routes()
