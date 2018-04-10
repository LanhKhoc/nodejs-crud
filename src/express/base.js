class Base {
  constructor() {
    this.getRoutes = {};  // Includes all get routes both router and express
    this.postRoutes = {}; // Includes all post routes both router and express
    this.getRoutesWithParams = {};
    this.postRoutesWithParams = {};

    // Method add request
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.use = this.use.bind(this);
  }

  get(path, ...middlewares) {
    if(path.indexOf("/:") != -1) {
      let params = path.split("/:");
      this.getRoutesWithParams[params.shift()] = {
        params,
        middlewares
      };
    } else {
      this.getRoutes[path] = {
        middlewares
      }
    }
  }

  post(path, ...middlewares) {
    if(path.indexOf("/:") != -1) {
      let params = path.split("/:");
      this.postRoutesWithParams[params.shift()] = {
        params,
        middlewares
      };
    } else {
      this.postRoutes[path] = {
        middlewares
      }
    }
  }

  use(path, ...middlewares) {
    const router = middlewares.pop();
    const getRoutes = router.getRoutes;
    const getRoutesWithParams = router.getRoutesWithParams;
    const postRoutes = router.postRoutes;
    const postRoutesWithParams = router.postRoutesWithParams;

    for(let [key, value] of Object.entries(getRoutes)) {
      this.get(path + key, ...middlewares, ...value.middlewares);
    }

    for(let [key, value] of Object.entries(postRoutes)) {
      this.post(path + key, ...middlewares, ...value.middlewares);
    }

    for(let [key, value] of Object.entries(getRoutesWithParams)) {
      this.getRoutesWithParams[path + key] = {
        params: [...value.params],
        middlewares: [...middlewares, ...value.middlewares]
      }
    }

    for(let [key, value] of Object.entries(postRoutesWithParams)) {
      this.postRoutesWithParams[path + key] = {
        params: [...value.params],
        middlewares: [...middlewares, ...value.middlewares]
      }
    }
  }
}

module.exports = Base;