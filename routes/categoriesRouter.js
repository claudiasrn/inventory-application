const { Router } = require("express");
const { getCategories, getCategory } = require("../controllers/categoriesController");
const categoryRouter = Router();

categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategory);

module.exports = categoryRouter;
