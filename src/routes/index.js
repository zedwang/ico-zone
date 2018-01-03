const Router = require('koa-router')
const router = new Router()
const api = new Router()

const home = require('./home-router')
const action = require('./action-router')

router.use(home)
api.use(action)
router.use('/api',api.routes())
module.exports = router
