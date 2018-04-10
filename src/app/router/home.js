const Router = require("../../express").Router;
const router = new Router();

// NOTE: Import controller
const homeController = require("../controllers/home");

router.get("", homeController.index);


module.exports = router;