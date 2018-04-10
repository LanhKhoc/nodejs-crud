const fs = require("fs");
const { CONTENT_TYPE } = require("../config");

const load = (pathName, request, response) => {
  const extension = pathName.split(".").pop();
  const realPath = pathName.split("assets/").pop();

  fs.readFile(`src/app/assets/${realPath}`, (error, data) => {
    if(!error) {
      response.writeHead(200,  {"Content-Type": CONTENT_TYPE[extension]});
      response.end(data);
    } else {
      response.writeHead(404,  {"Content-Type": "text/plain"});
      response.end("Not found " + pathName);
    }
  });
  
};

module.exports = {
  load,
};