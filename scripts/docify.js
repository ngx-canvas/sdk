const fs = require('fs')
const path = require('path')
const projects = require('../angular.json').projects

const ignore = ['demo', 'docs']

const extract = (folderpath) => {
  let files = []

  fs.readdirSync(folderpath).forEach(o => {
    if (o.includes('.')) {
      files.push(path.join(folderpath, o))
    } else {
      files = files.concat(extract(path.join(folderpath, o)))
    };
  })

  return files.filter(o => o.includes('.json'))
}

console.log('Creating Documentation!')
const docs = Object.keys(projects).filter(project => !ignore.includes(project)).map(project => {
  const base = path.join(__dirname, '../projects')
  const files = extract(path.join(base, project, 'src/lib'))
  const result = files.map((filepath) => {
    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'))
    if (data.extends) {
      const extendpath = filepath.split('/')
      extendpath.pop()
      const extender = JSON.parse(fs.readFileSync(path.join(extendpath.join('/'), data.extends), 'utf8'))
      data.folder = extender.folder
      data.inputs = data.inputs.concat(extender.inputs).sort((a, b) => {
        if (a.name.length < b.name.length) {
          return -1
        } else if (a.name.length > b.name.length) {
          return 1
        } else {
          return 0
        };
      })
      data.outputs = data.outputs.concat(extender.outputs).sort((a, b) => {
        if (a.name.length < b.name.length) {
          return -1
        } else if (a.name.length > b.name.length) {
          return 1
        } else {
          return 0
        };
      })
    };
    delete data.extends
    return data
  })
  const folders = result.filter((a) => a.subfolder).map((a) => {
    const items = result.filter((b) => !b.ignore && !b.subfolder && b.folder === a.name.toLowerCase()).sort((a, b) => {
      if (a.title < b.title) {
        return -1
      } else if (a.title > b.title) {
        return 1
      } else {
        return 0
      };
    })
    return {
      ...a,
      items
    }
  })
  return {
    project,
    folders
  }
})

console.log('Writing file into assets!')
fs.writeFileSync(path.join(__dirname, '../projects/docs/src/assets/data.json'), JSON.stringify(docs, null, 2))
