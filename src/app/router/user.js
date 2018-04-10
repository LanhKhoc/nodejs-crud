const Router = require("../../express").Router;
const router = new Router();

// NOTE: Import controller
const userController = require("../controllers/user");

router.get("", userController.index);
router.get("/create", userController.create);
router.post("/store", userController.store);
router.get("/show/:id", userController.show);
router.post("/update/:id", userController.update);
router.post("/destroy/:id", userController.destroy);


module.exports = router;