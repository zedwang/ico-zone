const {server} = require('../config')
const fs = require('fs')
const path = require('path')

module.exports = async (ctx) => {
  let svgList = []
  if (fs.existsSync(server.data)) {
    const files = fs.readdirSync(server.data)
    files.forEach(file => {
      if (path.extname(file) === '.svg') {
        const stream = fs.readFileSync(path.join(server.data, file))
        const id = path.basename(file, '.svg')
        svgList.unshift({id: id, path: stream})
      }
    })
  }
  await ctx.render('/home', {
    title: 'Ico Zone App',
    files: svgList
  })
}
