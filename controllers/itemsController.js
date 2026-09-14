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
		heading: "New item",
		submitLabel: "Create item",
		formAction: "/items/new",
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
			heading: "New item",
			submitLabel: "Create item",
			formAction: "/items/new",
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

async function getItemEditForm(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	const [item, categories] = await Promise.all([
		db.getItemById(id),
		db.getAllCategories(),
	]);

	if (!item) {
		return res.status(404).render("404");
	}

	res.render("itemForm", {
		heading: "Edit item",
		submitLabel: "Save changes",
		formAction: `/items/${id}/edit`,
		item,
		categories,
		errors: [],
	});
}

async function postItemEditForm(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const categories = await db.getAllCategories();
		return res.status(400).render("itemForm", {
			heading: "Edit item",
			submitLabel: "Save changes",
			formAction: `/items/${id}/edit`,
			item: req.body,
			categories,
			errors: errors.array(),
		});
	}

	await db.updateItem(
		id,
		req.body.name,
		req.body.description,
		req.body.price,
		req.body.stock,
		req.body.category_id,
	);
	res.redirect(`/items/${id}`);
}

async function getItemDeleteForm(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	const item = await db.getItemById(id);

	if (!item) {
		return res.status(404).render("404");
	}

	res.render("deleteConfirm", {
		heading: `Delete ${item.name}?`,
		message: "This can't be undone. Any supplier links will be removed too.",
		confirmLabel: "Delete",
		formAction: `/items/${id}/delete`,
		cancelHref: `/items/${id}`,
		error: null,
	});
}

async function postItemDeleteForm(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	await db.deleteItem(id);
	res.redirect("/items");
}

const validateLink = [
	body("supplier_id")
		.notEmpty()
		.withMessage("Supplier is required")
		.isInt()
		.withMessage("Supplier is invalid"),
	body("wholesale_price")
		.trim()
		.notEmpty()
		.withMessage("Wholesale price is required")
		.isFloat({ min: 0 })
		.withMessage("Wholesale price must be a number of 0 or more"),
];

async function getItemLinkForm(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	const [item, suppliers] = await Promise.all([
		db.getItemById(id),
		db.getUnlinkedSuppliersForItem(id),
	]);

	if (!item) {
		return res.status(404).render("404");
	}

	res.render("itemLinkForm", {
		item,
		suppliers,
		link: { supplier_id: "", wholesale_price: "" },
		errors: [],
	});
}

async function postItemLinkForm(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id)) {
		return res.status(404).render("404");
	}

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const [item, suppliers] = await Promise.all([
			db.getItemById(id),
			db.getUnlinkedSuppliersForItem(id),
		]);
		return res.status(400).render("itemLinkForm", {
			item,
			suppliers,
			link: req.body,
			errors: errors.array(),
		});
	}

	await db.linkItemSupplier(id, req.body.supplier_id, req.body.wholesale_price);
	res.redirect(`/items/${id}`);
}

async function postItemSupplierRemove(req, res) {
	const id = Number(req.params.id);
	const supplierId = Number(req.params.supplierId);
	if (!Number.isInteger(id) || !Number.isInteger(supplierId)) {
		return res.status(404).render("404");
	}

	await db.unlinkItemSupplier(id, supplierId);
	res.redirect(`/items/${id}`);
}

async function getItemSupplierRemove(req, res) {
	const id = Number(req.params.id);
	const supplierId = Number(req.params.supplierId);
	if (!Number.isInteger(id) || !Number.isInteger(supplierId)) {
		return res.status(404).render("404");
	}

	const [item, supplier] = await Promise.all([
		db.getItemById(id),
		db.getSupplierById(supplierId),
	]);

	if (!item || !supplier) {
		return res.status(404).render("404");
	}

	res.render("deleteConfirm", {
		heading: `Unlink ${supplier.name} from ${item.name}?`,
		message: "The item and the supplier both stay, only the link is removed.",
		confirmLabel: "Unlink",
		formAction: `/items/${id}/suppliers/${supplierId}/remove`,
		cancelHref: `/items/${id}`,
		error: null,
	});
}

module.exports = {
	getItems,
	getItem,
	getItemForm,
	postItemForm,
	validateItem,
	getItemEditForm,
	postItemEditForm,
	getItemDeleteForm,
	postItemDeleteForm,
	validateLink,
	getItemLinkForm,
	postItemLinkForm,
	postItemSupplierRemove,
	getItemSupplierRemove,
};
