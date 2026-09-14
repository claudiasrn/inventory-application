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
const { requireAdmin } = require("../middleware/adminAuth");
const categoryRouter = Router();

categoryRouter.get("/", getCategories);
categoryRouter.get("/new", getCategoryForm);
categoryRouter.post("/new", requireAdmin, validateCategory, postCategoryForm);
categoryRouter.get("/:id", getCategory);
categoryRouter.get("/:id/edit", getCategoryEditForm);
categoryRouter.post("/:id/edit", requireAdmin, validateCategory, postCategoryEditForm);
categoryRouter.get("/:id/delete", getCategoryDeleteForm);
categoryRouter.post("/:id/delete", requireAdmin, postCategoryDeleteForm);

module.exports = categoryRouter;
