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
		heading: "New supplier",
		submitLabel: "Create supplier",
		formAction: "/suppliers/new",
		supplier: { name: "", contact_email: "", country: "" },
		errors: [],
	});
}

async function postSupplierForm(req, res) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).render("supplierForm", {
			heading: "New supplier",
			submitLabel: "Create supplier",
			formAction: "/suppliers/new",
			supplier: req.body,
			errors: errors.array(),
		});
	}

	let id;
	try {
		id = await db.insertSupplier(
			req.body.name,
			req.body.contact_email,
			req.body.country,
		);
	} catch (err) {
		if (err.code === "23505") {
			return res.status(400).render("supplierForm", {
				heading: "New supplier",
				submitLabel: "Create supplier",
				formAction: "/suppliers/new",
				supplier: req.body,
				errors: [{ msg: "A supplier with that name already exists" }],
			});
		}
		throw err;
	}

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

async function getSupplierEditForm(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	const supplier = await db.getSupplierById(id);

	if (!supplier) {
		return res.status(404).render("404");
	}

	res.render("supplierForm", {
		heading: "Edit supplier",
		submitLabel: "Save changes",
		formAction: `/suppliers/${id}/edit`,
		supplier,
		errors: [],
	});
}

async function postSupplierEditForm(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).render("supplierForm", {
			heading: "Edit supplier",
			submitLabel: "Save changes",
			formAction: `/suppliers/${id}/edit`,
			supplier: req.body,
			errors: errors.array(),
		});
	}

	try {
		await db.updateSupplier(
			id,
			req.body.name,
			req.body.contact_email,
			req.body.country,
		);
	} catch (err) {
		if (err.code === "23505") {
			return res.status(400).render("supplierForm", {
				heading: "Edit supplier",
				submitLabel: "Save changes",
				formAction: `/suppliers/${id}/edit`,
				supplier: req.body,
				errors: [{ msg: "A supplier with that name already exists" }],
			});
		}
		throw err;
	}

	res.redirect(`/suppliers/${id}`);
}

async function getSupplierDeleteForm(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	const supplier = await db.getSupplierById(id);

	if (!supplier) {
		return res.status(404).render("404");
	}

	res.render("deleteConfirm", {
		heading: `Delete ${supplier.name}?`,
		message: "This can't be undone. Any item links will be removed too.",
		confirmLabel: "Delete",
		formAction: `/suppliers/${id}/delete`,
		cancelHref: `/suppliers/${id}`,
		error: null,
	});
}

async function postSupplierDeleteForm(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	await db.deleteSupplier(id);
	res.redirect("/suppliers");
}

const validateLink = [
	body("item_id")
		.notEmpty()
		.withMessage("Item is required")
		.isInt()
		.withMessage("Item is invalid"),
	body("wholesale_price")
		.trim()
		.notEmpty()
		.withMessage("Wholesale price is required")
		.isFloat({ min: 0 })
		.withMessage("Wholesale price must be a number of 0 or more"),
];

async function getSupplierLinkForm(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	const [supplier, items] = await Promise.all([
		db.getSupplierById(id),
		db.getUnlinkedItemsForSupplier(id),
	]);

	if (!supplier) {
		return res.status(404).render("404");
	}

	res.render("supplierLinkForm", {
		supplier,
		items,
		link: { item_id: "", wholesale_price: "" },
		errors: [],
	});
}

async function postSupplierLinkForm(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const [supplier, items] = await Promise.all([
			db.getSupplierById(id),
			db.getUnlinkedItemsForSupplier(id),
		]);
		return res.status(400).render("supplierLinkForm", {
			supplier,
			items,
			link: req.body,
			errors: errors.array(),
		});
	}

	await db.linkItemSupplier(req.body.item_id, id, req.body.wholesale_price);
	res.redirect(`/suppliers/${id}`);
}

async function postSupplierItemRemove(req, res) {
	const id = Number(req.params.id);
	const itemId = Number(req.params.itemId);
	if (!Number.isInteger(id) || !Number.isInteger(itemId)) {
		return res.status(404).render("404");
	}

	await db.unlinkItemSupplier(itemId, id);
	res.redirect(`/suppliers/${id}`);
}

async function getSupplierItemRemove(req, res) {
	const id = Number(req.params.id);
	const itemId = Number(req.params.itemId);
	if (!Number.isInteger(id) || !Number.isInteger(itemId)) {
		return res.status(404).render("404");
	}

	const [supplier, item] = await Promise.all([
		db.getSupplierById(id),
		db.getItemById(itemId),
	]);

	if (!supplier || !item) {
		return res.status(404).render("404");
	}

	res.render("deleteConfirm", {
		heading: `Unlink ${item.name} from ${supplier.name}?`,
		message: "The item and the supplier both stay, only the link is removed.",
		confirmLabel: "Unlink",
		formAction: `/suppliers/${id}/items/${itemId}/remove`,
		cancelHref: `/suppliers/${id}`,
		error: null,
	});
}

module.exports = {
	getSuppliers,
	getSupplier,
	getSupplierForm,
	postSupplierForm,
	validateSupplier,
	getSupplierEditForm,
	postSupplierEditForm,
	getSupplierDeleteForm,
	postSupplierDeleteForm,
	validateLink,
	getSupplierLinkForm,
	postSupplierLinkForm,
	postSupplierItemRemove,
	getSupplierItemRemove,
};
