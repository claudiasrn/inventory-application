const { Router } = require("express");
const {
	getCategories,
	getCategory,
	getCategoryForm,
	validateCategory,
	postCategoryForm,
} = require("../controllers/categoriesController");
const categoryRouter = Router();

categoryRouter.get("/", getCategories);
categoryRouter.get("/new", getCategoryForm);
categoryRouter.post("/new", validateCategory, postCategoryForm);
categoryRouter.get("/:id", getCategory);

module.exports = categoryRouter;
