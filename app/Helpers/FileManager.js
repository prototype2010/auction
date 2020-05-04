/* eslint-disable */
const { createReadStream, createWriteStream, existsSync, unlink, stat } = require('fs');
const path = require('path');

class FileManager {
  constructor(folderPath = '../../tmp/lots') {
    const resolvedPath = path.resolve(__dirname, folderPath);

    if (!existsSync(resolvedPath)) {
      throw new Error(`There is no folder to save files! You should create folder by path ${resolvedPath}`);
    }

    this.folderPath = resolvedPath;
  }

  async exists(fileName) {
    return new Promise(res => {
      stat(this.resolveFilePath(fileName), (err, stats) => {
        res(!!stats);
      });
    });
  }

  async save(fileName, fileData) {
    return new Promise(res => {
      const writeStream = createWriteStream(this.resolveFilePath(fileName));

      writeStream.write(fileData);
      writeStream.end();
      res();
    }).catch(e => {
      console.error(`Failed to open write stream to file ${fileName}, ${e}`);
    });
  }

  resolveFilePath(fileName) {
    return `${this.folderPath}/${fileName}`;
  }

  async read(fileName) {
    return new Promise(res => {
      const writeStream = createReadStream(this.resolveFilePath(fileName));

      let data = '';

      writeStream.on('data', chunk => {
        data += chunk;
      });

      writeStream.on('end', () => {
        res(data);
      });
    }).catch(e => {
      console.error(`Failed to open write stream to file ${fileName}, ${e}`);
    });
  }

  async delete(fileName) {
    return new Promise((res, rej) => {
      unlink(this.resolveFilePath(fileName), err => {
        if (err) {
          rej(err);
        } else {
          return res();
        }
      });
    }).catch(e => {
      console.error(`Failed to delete file ${fileName}, ${e}`);
    });
  }
}

module.exports = FileManager;
