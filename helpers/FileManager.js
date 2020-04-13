const { existsSync, createWriteStream, createReadStream } = require('fs');

class FileManager {
  static folderPath = '';

  static getInstance(folderPath) {
    if (!existsSync(folderPath)) {
      throw new Error(`There is no folder to save files! You should create folder by path ${folderPath}`);
    }

    FileManager.folderPath = folderPath;

    return FileManager;
  }

  static async save(fileName, fileData) {
    return new Promise(res => {
      const writeStream = createWriteStream(this.resolveFilePath(fileName));

      writeStream.write(fileData);
      writeStream.end();
      res();
    }).catch(e => {
      console.error(`Failed to open write stream to file ${fileName}, ${e}`);
    });
  }

  static resolveFilePath(fileName) {
    return `${this.folderPath}/${fileName}`;
  }

  static async read(fileName) {
    return new Promise(res => {
      const writeStream = createReadStream(this.resolveFilePath(fileName));

      let data = '';

      writeStream.on('data', chunk => {
        data += chunk;
      });

      writeStream.on('end', () => {
        writeStream.end();
        res(data);
      });
    }).catch(e => {
      console.error(`Failed to open write stream to file ${fileName}, ${e}`);
    });
  }
}

module.exports = { FileManager };
