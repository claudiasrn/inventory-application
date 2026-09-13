const { Router } = require("express");
const { getCategories } = require("../controllers/categoriesController");
const categoryRouter = Router();

categoryRouter.get("/", getCategories);

module.exports = categoryRouter;
