const cookie = require("cookie");
const md5 = require("md5");
const LoginModel = require("../models/login");
const loginModel = new LoginModel();

const loginMiddleware = (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const ss_user_token = cookies.ss_user_token;

  loginModel.getAll((error, results) => {
    if(error) throw error;

    const userLogged = results.filter(item => {
      if(md5(item.username) === ss_user_token) return item;
    });

    const cookies = cookie.parse(req.headers.cookie || '');
    const userInfo = JSON.parse(cookies.user_info);

    // If user change cookie or user didn't logged then go back to login page
    if((userInfo && userLogged[0] && userInfo.username != userLogged[0].username) || userLogged.length < 1) {
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
        'Location': `${process.env.HOST}:${process.env.PORT}/login`
        // TODO: Add other headers here...
      });
      res.end();
    } else {
      next();
    }
  });
}

module.exports = {
  loginMiddleware,
};