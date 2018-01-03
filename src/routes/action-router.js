const Router = require('koa-router')
const ctrl = require('../controllers').action
const router = new Router()
router.param('id', (id, ctx, next) => {
  ctx.params.id = id
  return next()
})

router.post('/upload', ctrl.upload)
router.get('/pull', ctrl.pull)
router.post('/push/:id', ctrl.push)
router.delete('/delete/:id', ctrl.remove)

module.exports = router.routes()
