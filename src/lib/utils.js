const {server} = require('config')
const fs = require('fs')
const path = require('path')
const jsonfile = require('jsonfile')
const {exec, spawn} = require('child_process')

const repo = path.join(server.root, '../','pentagon-entry')
const manifest = path.join(server.data, 'manifest.json')

function readFiles () {
  let svg_list = []
  if (fs.existsSync(server.data)) {
    const files = fs.readdirSync(server.data)
    files.forEach(file => {
      if (path.extname(file) === '.svg') {
        const stream = fs.readFileSync(path.join(server.data, file))
        svg_list.unshift(stream)
      }
    })
  }
  return svg_list
}

function parseManifest () {
  return jsonfile.readFileSync(manifest)
}

function writeManifest (data) {
  jsonfile.writeFileSync(manifest, data, {space: 2})
}

function createManifest () {
  const isExistsFile = fs.existsSync(manifest)
  if (!isExistsFile) {
    fs.writeFileSync(manifest, JSON.stringify({}))
  }
}

async function execHander (cmd,cwd = repo) {
  await exec(cmd, {cwd:cwd}, (error, stdout, stderr)=>{
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  })
}



exports.readFiles = readFiles
exports.execSync = execHander
exports.parseManifest = parseManifest
exports.writeManifest = writeManifest
exports.createManifest = createManifest
