const cookie = require("cookie");
const md5 = require("md5");
const LoginModel = require("../models/login");
const loginModel = new LoginModel();

const checkLogin = (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const ss_user_token = cookies.ss_user_token;

  loginModel.getAll((error, results) => {
    if(error) throw error;

    const userLogged = results.filter(item => {
      if(md5(item.username) === ss_user_token) return item;
    });

    if(userLogged.length > 0) {
      res.writeHead(302, {
        'Location': `${process.env.HOST}:${process.env.PORT}/user`
        // TODO: Add other headers here...
      });
      res.end();
    } else {
      next()
    }
  });
}

module.exports = {
  checkLogin,
};