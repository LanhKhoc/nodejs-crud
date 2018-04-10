const fs = require("fs");
const http = require("http");
const Base = require("./base");

class Express extends Base {
  constructor() {
    super();

    this.pathAssets = "/assets";

    this.handleRequest = this.handleRequest.bind(this);
    this.listen = this.listen.bind(this);
    this.use = this.use.bind(this);
    this.load = this.load.bind(this);
  }

  /**
   * NOTE:
   * Load resource: CSS, JS, IMG
   */
  load(url) {
    this.pathAssets = url;

    // NOTE: Function handle load resource
    const loadResource = (req, res) => {
      const prePath = "src/app";
      fs.createReadStream(prePath + req.url).pipe(res);
    }

    this.get(url, loadResource);
  }

  // NOTE: handleRequest invoke after solve method get or post
  // next reference to "the next" function will be excuted
  handleRequest(req, res, ...middlewares) {
    // let middlewaresTmp = [...middlewares];
    // console.log(middlewares);
    let next = middlewares.pop().bind(this, req, res);

    middlewares.reverse().forEach((item) => {
      next = item.bind(this, req, res, next);
    })

    next();
  }

  listen(port) {
    http.createServer((request, response) => {
      let userRequest;
      let requestUrl;

      // NOTE: If request is /home or /home/, its same
      if(request.url.length > 1 && request.url[request.url.length - 1] === "/") requestUrl = request.url.slice(0, request.url.length - 1);
      else requestUrl = request.url;

      // NOTE: Load resource
      if(requestUrl.indexOf(this.pathAssets) == 0) {
        userRequest = {...this.getRoutes[this.pathAssets]};
      } else {
        if(request.method.toLowerCase() === "get") {
          /**
           * NOTE:
           * If requestUrl has params and route same element in getRoutesWithParams
           * Then make request.params is an object which its params are in URL
           */
          for(let [key, value] of Object.entries(this.getRoutesWithParams)) {
            if(requestUrl.indexOf(key) == 0 && 
              (requestUrl.split("/").length === key.split("/").length + value.params.length)) {
              const url = requestUrl.split("/");

              // NOTE: {[value.params]: url}
              // value.params is key, url is value
              // Ex: /user/show/:id --- /user/show/1 ===> {id: 1}
              request.params = value.params
                                .reverse()
                                .reduce((acc, val, index) => ({...acc, [val]: url.pop()}), {});
              userRequest = {...this.getRoutesWithParams[key]};
            }
          } 
          
          if(!userRequest && this.getRoutes[requestUrl]) {
            userRequest = {...this.getRoutes[requestUrl]};
          }
        }
  
        if(request.method.toLowerCase() === "post") {
          for(let [key, value] of Object.entries(this.postRoutesWithParams)) {
            if(requestUrl.indexOf(key) == 0 && 
              (requestUrl.split("/").length === key.split("/").length + value.params.length)) {
              const url = requestUrl.split("/");

              // NOTE: {[value.params]: url}
              // value.params is key, url is value
              // Ex: /user/show/:id --- /user/show/1 ===> {id: 1}
              request.params = value.params
                                .reverse()
                                .reduce((acc, val, index) => ({...acc, [val]: url.pop()}), {});
              userRequest = {...this.postRoutesWithParams[key]};
            }
          } 

          if(!userRequest && this.postRoutes[requestUrl]) {
            userRequest = {...this.postRoutes[requestUrl]};
          }
        }
      }

      if(userRequest && requestUrl.indexOf(".ico") == -1) {
        // console.log({userRequest});
        // console.log(...userRequest.middlewares);
      }
      
      if(userRequest) {
        this.handleRequest(request, response, ...userRequest.middlewares);
      } else {
        response.end("404 Not Found");
      }
    }).listen(port);

    console.log("Server start on port: " + port);
  }
}

module.exports = Express;