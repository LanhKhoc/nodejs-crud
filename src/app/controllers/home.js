const ejs = require('ejs');

const DATA = {
  title: "LanhKhoc - Node JS",
  css: "main.css",
  js: "script.js",
  error: false,
  userInfo: {},
  username: ""
}

const index = (req, res) => {
  ejs.renderFile("src/app/views/login.ejs", DATA, (error, content) => {
    if(error) {
      res.writeHead(404, {"Content-Type": "text/html"});
      res.end(error);
    } else {
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(content);
    }
  })
}

module.exports = {
  index,
};