const fs = require('fs');
const path = require('path');
const { Octokit } = require('octokit');
const projects = require('../angular.json').projects;

const ignore = ['demo', 'docs'];

const extract = (folderpath) => {
  let files = [];

  fs.readdirSync(folderpath).map(o => {
    if (o.includes('.')) {
      files.push(path.join(folderpath, o));
    } else {
      files = files.concat(extract(path.join(folderpath, o)));
    };
  });

  return files.filter(o => o.includes('.md'));
};

const convert = async (filepath) => {
  const text = fs.readFileSync(filepath, 'utf8')
  const octokit = new Octokit({ auth: '' });
  const response = await octokit.request('POST /markdown', { text });
  return response.data;
};

Object.keys(projects).filter(project => !ignore.includes(project)).map(project => {
  let base = path.join(__dirname, '../projects')
  let files = extract(path.join(base, project, 'src/lib'));
  files.map(async (filepath) => {
    filepath = filepath.replace(base, '').replace('/src/lib', '')
    filepath = filepath.substr(1)
    filepath = filepath.split('/')
    filepath.pop()
    filepath.map((value, index) => {
      if (index === 0) {
        
      } else if (index === 1) {
        
      } else if (index === 2) {
        
      } else {
        
      }
    })
    console.log(filepath);
    // let html = await convert(filepath);
    // console.log('Converted');
    // filepath = filepath.split('/');
    // filepath = filepath[filepath.length - 1].replace('.md', '.html');
    // console.log(filepath);
    // await fs.writeFileSync(`out/${filepath}`, html);
  })
});