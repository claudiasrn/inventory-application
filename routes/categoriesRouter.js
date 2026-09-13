const { Router } = require("express");
const {
	getCategories,
	getCategory,
	getCategoryForm,
	validateCategory,
	postCategoryForm,
	getCategoryEditForm,
	postCategoryEditForm,
} = require("../controllers/categoriesController");
const categoryRouter = Router();

categoryRouter.get("/", getCategories);
categoryRouter.get("/new", getCategoryForm);
categoryRouter.post("/new", validateCategory, postCategoryForm);
categoryRouter.get("/:id", getCategory);
categoryRouter.get("/:id/edit", getCategoryEditForm);
categoryRouter.post("/:id/edit", validateCategory, postCategoryEditForm);

module.exports = categoryRouter;
