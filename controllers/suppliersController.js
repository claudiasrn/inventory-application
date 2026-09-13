const db = require("../db/queries");

async function getSuppliers(req, res) {
	const suppliers = await db.getAllSuppliers();
	res.render("suppliers", { suppliers });
}

module.exports = {
	getSuppliers,
};
