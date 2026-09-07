const { Router } = require("express");
const { indexGet } = require("../controllers/indexController");
const indexRouter = Router();

indexRouter.get("/", indexGet)

module.exports = indexRouter;
