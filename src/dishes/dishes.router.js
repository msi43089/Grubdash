const router = require("express").Router();
const controller = require("./dishes.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")

router.route("/")
    .post(controller.create)
    .get(controller.list)
    .all(methodNotAllowed)
 
router.route("/:dishId")
    .put(controller.update)
    .get(controller.read)
    .all(methodNotAllowed)

// TODO: Implement the /dishes routes needed to make the tests pass

module.exports = router;
