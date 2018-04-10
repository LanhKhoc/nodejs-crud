const querystring = require("querystring");

const postDataRequest = (request) => {
  let postData = "";
  
  return new Promise((resolve, reject) => {
    request.addListener("data", chunk => postData += chunk);
    request.addListener("end", () => {
      resolve(querystring.parse(postData));
    })
  });
}

module.exports = {
  postDataRequest,
};