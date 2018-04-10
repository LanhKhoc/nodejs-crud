const cookie = require("cookie");
const md5 = require("md5");
const ejs = require('ejs');
const util = require('util');
require("../config");

const Session = require("../utils/session").Session;
const session = new Session();
const { postDataRequest } = require("../utils/getDataRequest");
const LoginModel = require("../models/login");
const loginModel = new LoginModel();

let DATA = {
  title: "LanhKhoc - Node JS",
  css: "main.css",
  js: "script.js",
  error: false,
  userInfo: {},
  username: ""
}

const index = (req, res) => {
  const error = session.getSession("login_error");
  const remember = session.getSession("login_remember");
  session.delSession("login_error");
  session.delSession("login_remember");

  let dataRes;
  if(error) dataRes = {...DATA, ...error, ...remember};
  else dataRes = {...DATA};

  ejs.renderFile("src/app/views/login.ejs", dataRes, (error, content) => {
    if(error) {
      res.writeHead(404, {"Content-Type": "text/html"});
      res.end(error);
    } else {
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(content);
    }
  })
}

const check = (req, res) => {
  if(req.method.toLowerCase() === 'get') {
    res.writeHead(401, {"Content-Type": "text/html"});
    res.end("Unauthorized!");
    return ;
  }

  postDataRequest(req).then((data) => {
    const {username, password} = data;

    loginModel.checkLogin(username, password, (err) => {
      if(err) {
        session.setSession("login_error", err);
        session.setSession("login_remember", {username});

        res.writeHead(302, {
          'Location': `${process.env.HOST}:${process.env.PORT}/login`
          // TODO: Add other headers here...
        });
        res.end();
      } else {
        res.setHeader('Set-Cookie', [
          cookie.serialize('ss_user_token', String(md5(username)), {
            path: "/",
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7 // 1 week 
          }),
          cookie.serialize('user_info', String(JSON.stringify({username})), {
            path: "/",
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7 // 1 week 
          })
        ]);

        res.writeHead(302, {
          Location: `${process.env.HOST}:${process.env.PORT}/user`
        });
        res.end();
      }
    })
  });
}

const logout = (req, res) => {
  session.delSession("login_error");
  session.delSession("login_remember");

  res.setHeader('Set-Cookie', [
    cookie.serialize('ss_user_token', "", {
      path: "/",
      httpOnly: true,
      maxAge: new Date(0)
    }),
    cookie.serialize('user_info', "", {
      path: "/",
      httpOnly: true,
      maxAge: new Date(0)
    })
  ]);

  res.writeHead(302, {
    Location: `${process.env.HOST}:${process.env.PORT}/login`
  });
  res.end();
}

module.exports = {
  index,
  check,
  logout,
};