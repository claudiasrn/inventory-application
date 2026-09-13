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
		heading: "New category",
		submitLabel: "Create category",
		formAction: "/categories/new",
	});
}

async function postCategoryForm(req, res) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).render("categoryForm", {
			category: req.body,
			errors: errors.array(),
			heading: "New category",
			submitLabel: "Create category",
			formAction: "/categories/new",
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

async function getCategoryEditForm(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	const category = await db.getCategoryById(id);

	if (!category) {
		return res.status(404).render("404");
	}

	res.render("categoryForm", {
		heading: "Edit category",
		submitLabel: "Save changes",
		formAction: `/categories/${id}/edit`,
		category,
		errors: [],
	});
}

async function postCategoryEditForm(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).render("categoryForm", {
			heading: "Edit category",
			submitLabel: "Save changes",
			formAction: `/categories/${id}/edit`,
			category: req.body,
			errors: errors.array(),
		});
	}

	await db.updateCategory(id, req.body.name, req.body.description);
	res.redirect(`/categories/${id}`);
}

async function getCategoryDeleteForm(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	const category = await db.getCategoryById(id);

	if (!category) {
		return res.status(404).render("404");
	}

	res.render("deleteConfirm", {
		heading: `Delete ${category.name}?`,
		message: "This can't be undone.",
		formAction: `/categories/${id}/delete`,
		cancelHref: `/categories/${id}`,
		error: null,
	});
}

async function postCategoryDeleteForm(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	try {
		await db.deleteCategory(id);
	} catch (err) {
		if (err.code === "23503") {
			const category = await db.getCategoryById(id);
			return res.status(409).render("deleteConfirm", {
				heading: `Delete ${category.name}?`,
				message: "This can't be undone.",
				formAction: `/categories/${id}/delete`,
				cancelHref: `/categories/${id}`,
				error:
					"This category still has items in it. Move or delete them first.",
			});
		}
		throw err;
	}

	res.redirect("/categories");
}

module.exports = {
	getCategories,
	getCategory,
	getCategoryForm,
	postCategoryForm,
	validateCategory,
	getCategoryEditForm,
	postCategoryEditForm,
	getCategoryDeleteForm,
	postCategoryDeleteForm,
};
