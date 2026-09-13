const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

async function getCategories(req, res) {
	const categories = await db.getAllCategories();
	res.render("categories", { categories });
}

async function getCategory(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	const [category, items] = await Promise.all([
		db.getCategoryById(id),
		db.getItemsByCategory(id),
	]);

	if (!category) {
		return res.status(404).render("404");
	}

	res.render("category", { category, items });
}

function getCategoryForm(req, res) {
	res.render("categoryForm", {
		category: { name: "", description: "" },
		errors: [],
	});
}

async function postCategoryForm(req, res) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).render("categoryForm", {
			category: req.body,
			errors: errors.array(),
		});
	}

	const id = await db.insertCategory(req.body.name, req.body.description);
	res.redirect(`/categories/${id}`);
}

const validateCategory = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Name is required")
		.isLength({ max: 100 })
		.withMessage("Name must be 100 characters or fewer"),
	body("description").trim(),
];

module.exports = { getCategories, getCategory, getCategoryForm, postCategoryForm, validateCategory };
