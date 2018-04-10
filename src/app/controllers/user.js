const ejs = require('ejs');
const md5 = require('md5');
const cookie = require("cookie");

const userModel = new (require("../models/user"))();
const { postDataRequest } = require("../utils/getDataRequest");
const { dateToDMY, dateToYMD } = require("../utils/date");

const DATA = {
  title: "LanhKhoc - Node JS",
  css: "main.css",
  js: "script.js",
  userInfo: {},
  error: false
}

const index = (req, res) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const userInfo = JSON.parse(cookies.user_info);

  userModel.getAll((error, result) => {
    const listUsers = result.map(item => {
      if(item.birthday) item.birthday = dateToDMY(item.birthday);
      return item;
    });
    let dataRes = {...DATA, userInfo, listUsers};

    ejs.renderFile("src/app/views/user.ejs", dataRes, (error, content) => {
      if(error) {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end(error);
      } else {
        // res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
      }
    })
  })
}

const create = (req, res) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const userInfo = JSON.parse(cookies.user_info);
  const dataRes = {...DATA, userInfo};

  ejs.renderFile("src/app/views/create.ejs", dataRes, (error, content) => {
    if(error) {
      res.writeHead(404, {"Content-Type": "text/html"});
      res.end(error);
    } else {
      // res.writeHead(200, {"Content-Type": "text/html"});
      res.end(content);
    }
  })
}

const store = (req, res) => {
  if(req.method.toLowerCase() === 'get') {
    res.writeHead(401, {"Content-Type": "text/html"});
    res.end("Unauthorized!");
    return ;
  }

  postDataRequest(req).then((data) => {
    userModel.store({...data, password: md5(data.password)}, (error) => {
      if(error) {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end(error);
      } else {
        res.writeHead(302, {
          Location: `${process.env.HOST}:${process.env.PORT}/user`
        });
        res.end();
      }
    });
  })
}

const show = (req, res) => {
  userModel.getWithConditions(`id='${req.params.id}'`, (error, results) => {
    if(error) throw error;

    const cookies = cookie.parse(req.headers.cookie || '');
    const userInfo = JSON.parse(cookies.user_info);
    let userEdit = {...results[0]};
    Object.keys(userEdit).forEach((item) => {
      if(item === "birthday" && userEdit[item]) userEdit[item] = dateToYMD(userEdit[item]);
    })
    const dataRes = {...DATA, userInfo, userEdit};

    ejs.renderFile("src/app/views/show.ejs", dataRes, (error, content) => {
      if(error) {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end(error);
      } else {
        // res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
      }
    })
  })
}

const update = (req, res) => {
  if(req.method.toLowerCase() === 'get') {
    res.writeHead(401, {"Content-Type": "text/html"});
    res.end("Unauthorized!");
    return ;
  }

  postDataRequest(req).then((data) => {
    userModel.update(`id='${req.params.id}'`, {...data}, (error) => {
      if(error) throw error;

      res.writeHead(302, {
        Location: `${process.env.HOST}:${process.env.PORT}/user`
      });
      res.end();
    });
  })
}

const destroy = (req, res) => {
  if(req.method.toLowerCase() === 'get') {
    res.writeHead(401, {"Content-Type": "text/html"});
    res.end("Unauthorized!");
    return ;
  }

  userModel.destroy(`id='${req.params.id}'`, (error) => {
    if(error) throw error;

    res.writeHead(302, {
      Location: `${process.env.HOST}:${process.env.PORT}/user`
    });
    res.end();
  })
}

module.exports = {
  index,
  create,
  store,
  show,
  update,
  destroy
};