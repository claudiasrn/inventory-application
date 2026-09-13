const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

async function getSuppliers(req, res) {
	const suppliers = await db.getAllSuppliers();
	res.render("suppliers", { suppliers });
}

async function getSupplier(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	const [supplier, items] = await Promise.all([
		db.getSupplierById(id),
		db.getItemsBySupplier(id),
	]);

	if (!supplier) {
		return res.status(404).render("404");
	}

	res.render("supplier", { supplier, items });
}

function getSupplierForm(req, res) {
	res.render("supplierForm", {
		supplier: { name: "", contact_email: "", country: "" },
		errors: [],
	});
}

async function postSupplierForm(req, res) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).render("supplierForm", {
			supplier: req.body,
			errors: errors.array(),
		});
	}

	const id = await db.insertSupplier(
		req.body.name,
		req.body.contact_email,
		req.body.country,
	);
	res.redirect(`/suppliers/${id}`);
}

const validateSupplier = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Name is required")
		.isLength({ max: 100 })
		.withMessage("Name must be 100 characters or fewer"),
	body("contact_email")
		.trim()
		.optional({ values: "falsy" })
		.isEmail()
		.withMessage("Must be a valid email address"),
	body("country").trim(),
];

module.exports = {
	getSuppliers,
	getSupplier,
	getSupplierForm,
	postSupplierForm,
	validateSupplier,
};
