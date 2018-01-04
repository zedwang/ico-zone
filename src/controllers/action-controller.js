const path = require('path')
const fs = require('fs')
const {parseManifest, createManifest, writeManifest} = require('../lib/utils')
const {server, repo} = require('../config')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const remote = `https://${repo.username}:${repo.passwd}@${repo.remote}`

module.exports = {

  async upload (ctx) {
    let files = ctx.request.body.files.files
    let isExistsDir = fs.existsSync(server.data)
    if (!isExistsDir) {
      fs.mkdir(server.data)
    }
    createManifest()

    let jsonStr = parseManifest()
    if (!files.length) {
      files = [files]
    }
    for (let i = 0; i < files.length; i++) {
      let f = files[i]
      jsonStr[path.basename(f.path, '.svg')] = f.name
    }
    writeManifest(jsonStr)
    ctx.redirect('/')
  },
  async pull (ctx) {
    ctx.body = {}
  },
  async push (ctx) {
    const query = ctx.query
    const ids = ctx.params.id.split(',')
    const manifest = parseManifest()
    const REPO = path.join(server.root, '../','pentagon-entry')
    const option = {cwd: REPO}
    
    // clone
    if (!fs.existsSync(REPO)) {
      const cmd = `git clone ${remote}`
      await exec(cmd,{cwd: process.cwd()})
      console.log('clone finished')
      await exec('git checkout -b dev-icon', option)
      console.log('switched dev-icon')
    }
    // pull --rebase
    await exec('git pull origin dev-icon:dev-icon', option)
    console.log('update origin/dev-icon finished')
    console.log('start cp files to workingDir')
    // cp
    for (let i = 0; i < ids.length; i++) {
      let id = ids[i]
      const svg = manifest[id]
      const src = path.join(REPO, `/data/${id}.svg`)
      const target = path.join(REPO, `component/icon/svg/`)
      const cmd = `cp ${src} ${target}`
      console.log('copy cmd:', cmd)
      await exec(cmd, option)
      // rename
      const before = path.join(REPO, `component/icon/svg/${id}.svg`)
      const after = path.join(REPO, `component/icon/svg/${svg}`)
      console.log('rename before:', before)
      console.log('rename after:', after)
      fs.renameSync(before, after)
    }

    console.log('copy finished')
    // add
    console.log('add files to git')
    await exec('git add ./', option)
    console.log('adde completed')
    // commit and push
    await exec('git commit -m "add icon svg"', option)
    console.log('commit completed')
    // push
    await exec('git push origin dev-icon', option)
    console.log('push completed')
    // unlink file
    ids.forEach(id => {
      fs.unlinkSync(path.join(server.data,id + '.svg'))
      delete manifest[id]
    })
    writeManifest(manifest)

    if (query.isMerge) {
      console.log('merge remote branch')
      // await exec('git merge ')
    }

    ctx.body = {'msg': '推送完成'}
  },

  async remove (ctx) {
    let json = parseManifest()
    let id = ctx.params.id.split(',')
    id.forEach(file => {
      const url = path.join(server.data, file + '.svg')
      fs.unlinkSync(url)
      delete json[file]
    })
    writeManifest(JSON.stringify(json))
    ctx.body = {}
  }

}
