const fs = require("fs");
const path = require("path");

class FileJSON {
  constructor(dir) {
    let ignoreDir = path.join(__dirname, "../server/ignore");
    this.DIR = ignoreDir + "/" + dir;

    // console.log(ignoreDir);
    // console.log(this.DIR);

    if (!fs.existsSync(ignoreDir)) {
      fs.mkdirSync(ignoreDir);
    }
    if (!fs.existsSync(this.DIR)) {
      fs.mkdirSync(this.DIR);
    }
  }
  read(fileName, success, error) {
    fs.readFile(this.getFilePath(fileName), (err, data) => {
      if (err) {
        error(err);
        return;
      }
      try {
        data = data.toString();
        data = JSON.parse(data);
      } catch (err) {
        data = {};
      }
      success(data);
    });
  }
  getFilePath(fileName) {
    return `${this.DIR}/${fileName}`;
  }
  write(fileName, data) {
    fs.writeFile(this.getFilePath(fileName), JSON.stringify(data), function(
      err
    ) {
      if (err) {
        console.error(err);
      }
    });
  }
  delete(fileName) {
    fs.unlink(this.getFilePath(fileName), function(err) {
      if (err) {
        console.error(err);
      }
    });
  }
}
const FileJSONProgress = new FileJSON("progress_log");

module.exports = {
  FileJSONProgress
};
