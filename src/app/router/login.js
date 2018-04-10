const Router = require("../../express").Router;
const router = new Router();

// NOTE: Import controller
const loginController = require("../controllers/login");

router.get("", loginController.index);
router.post("/check", loginController.check);


module.exports = router;