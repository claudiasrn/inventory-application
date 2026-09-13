const db = require("../db/queries");

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

module.exports = {
	getSuppliers,
	getSupplier,
};
