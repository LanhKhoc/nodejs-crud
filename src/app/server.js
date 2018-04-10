const Express = require("../express").Express;
const { loggerMiddleware } = require("./middlewares/loggerMiddleware");
const { loginMiddleware } = require("./middlewares/loginMiddleware");
const { checkLogin } = require("./middlewares/checkLogin");
const server = new Express();

// NOTE: Import router
const homeRouter = require("./router/home");
const loginRouter = require("./router/login");
const userRouter = require("./router/user");
const loginController = require("./controllers/login");
const userController = require("./controllers/user");

// NOTE: Config
server.load("/assets");


// NOTE: Router
server.get("/", loginMiddleware, userController.index);
server.use("/user", loginMiddleware, userRouter);
server.use("/login", checkLogin, loginRouter);
server.get("/logout", loginController.logout);

module.exports = server;