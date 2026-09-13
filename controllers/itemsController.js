const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

async function getItems(req, res) {
	const items = await db.getAllItems();
	res.render("items", { items });
}

async function getItem(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	const [item, suppliers] = await Promise.all([
		db.getItemById(id),
		db.getSuppliersByItem(id),
	]);

	if (!item) {
		return res.status(404).render("404");
	}

	res.render("item", { item, suppliers });
}

async function getItemForm(req, res) {
	const categories = await db.getAllCategories();
	res.render("itemForm", {
		item: {
			name: "",
			description: "",
			price: "",
			stock: "",
			category_id: req.query.category || "",
		},
		categories,
		errors: [],
	});
}

async function postItemForm(req, res) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const categories = await db.getAllCategories();
		return res.status(400).render("itemForm", {
			item: req.body,
			categories,
			errors: errors.array(),
		});
	}

	const id = await db.insertItem(
		req.body.name,
		req.body.description,
		req.body.price,
		req.body.stock,
		req.body.category_id,
	);
	res.redirect(`/items/${id}`);
}

const validateItem = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Name is required")
		.isLength({ max: 100 })
		.withMessage("Name must be 100 characters or fewer"),
	body("description").trim(),
	body("price")
		.trim()
		.notEmpty()
		.withMessage("Price is required")
		.isFloat({ min: 0 })
		.withMessage("Price must be a number of 0 or more"),
	body("stock")
		.trim()
		.notEmpty()
		.withMessage("Stock is required")
		.isInt({ min: 0 })
		.withMessage("Stock must be a whole number of 0 or more"),
	body("category_id")
		.notEmpty()
		.withMessage("Category is required")
		.isInt()
		.withMessage("Category is invalid"),
];

module.exports = {
	getItems,
	getItem,
	getItemForm,
	postItemForm,
	validateItem,
};
