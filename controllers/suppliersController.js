const db = require("../db/queries");

async function getSuppliers(req, res) {
	const suppliers = await db.getAllSuppliers();
	res.render("suppliers", { suppliers });
}

async function getSupplier(req, res) {
	const id = Number(req.params.id);

	const [supplier, items] = await Promise.all([
		db.getSupplierById(id),
		db.getItemsBySupplier(id),
	]);

	res.render("supplier", { supplier, items });
}

module.exports = {
	getSuppliers,
	getSupplier,
};
