import fs from 'fs';
import Promise from 'bluebird';
import lodash from 'lodash';
import path from 'path';

const currentDir = __dirname;
const currentFileName = path.basename(__filename);
let filenames = [];

fs.readdirSync(currentDir).forEach(file => {
    if(file !== currentFileName) filenames.push(file);
});

class DataSource {
  constructor() {
    this.sources = filenames.map(filename => {
        const path = currentDir + '/' + filename;
        filename = require(path).default;
        return filename;
    });
  }

  getFlats() {
    const prs = this.sources.map(source => source());

    return Promise
      .all(prs)
      .then((results) => {
        results = lodash.flatten(results);
        results = lodash.uniqBy(results, 'Address');
        return results;
      });
     // could be more actions like
     // .then(unique);
  }
}

export default DataSource;
