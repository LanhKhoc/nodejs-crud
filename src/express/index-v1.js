const http = require("http");

const Router = () => {
  let __gets = [],
      __posts = [];

  const get = (path, ...middlewares) => {
    __gets.push({
      path,
      middlewares
    });
  }

  const post = (path, ...middlewares) => {
    __posts.push({
      path,
      middlewares
    });
  }

  return {
    __gets,
    __posts,
    get,
    post
  }
}

const express = () => {
  let __gets = [],
      __posts = [];

  const handleRequest = (req, res, path, middlewares) => {
    middlewares.every((middleware, index) => {
      let flag = false;

      if(index < middlewares.length - 1) {
        middleware(req, res, () => flag = true);
        return flag;
      }
      else {
        middleware(req, res);
      }
    })
  }

  const listen = (port) => {
    console.log("Server start!");
    http.createServer((request, response) => {
      let userRequest;
      if(request.method.toLowerCase() === "get") {
        userRequest = __gets.filter(item => item.path === request.url).pop();
        // console.log({__gets});
        // if(userRequest && request.url.indexOf(".ico") == -1) 
          // console.log({userRequest, __gets: userRequest.middlewares});
      }

      if(request.method.toLowerCase() === "post") {
        userRequest = __posts.filter(item => item.path === request.url).pop();
      }

      if(userRequest) handleRequest(request, response, userRequest.path, userRequest.middlewares);
      response.end("404 Not Found");
    }).listen(port);
  }

  const get = (path, ...middlewares) => {
    __gets.push({
      path,
      middlewares
    })
  }

  const post = (path, ...middlewares) => {
    __posts.push({
      path,
      middlewares
    })
  }

  const use = (path, ...middlewares) => {
    const router = middlewares.pop();
    const getRoutes = router.__gets;
    const postRoutes = router.__posts;

    getRoutes.forEach((item) => {
      __gets.push({
        path: path + item.path,
        middlewares: [...middlewares, ...item.middlewares]
      })
    });
  }

  return {
    listen,
    get,
    post,
    use,
  }
}

module.exports = express;
module.exports.Router = Router