const { Router } = require("express");
const {
	getCategories,
	getCategory,
	getCategoryForm,
	validateCategory,
	postCategoryForm,
	getCategoryEditForm,
	postCategoryEditForm,
	getCategoryDeleteForm,
	postCategoryDeleteForm,
} = require("../controllers/categoriesController");
const categoryRouter = Router();

categoryRouter.get("/", getCategories);
categoryRouter.get("/new", getCategoryForm);
categoryRouter.post("/new", validateCategory, postCategoryForm);
categoryRouter.get("/:id", getCategory);
categoryRouter.get("/:id/edit", getCategoryEditForm);
categoryRouter.post("/:id/edit", validateCategory, postCategoryEditForm);
categoryRouter.get("/:id/delete", getCategoryDeleteForm);
categoryRouter.post("/:id/delete", postCategoryDeleteForm);

module.exports = categoryRouter;
