const db = require("../db/queries");

async function getItems(req, res) {
	const items = await db.getAllItems();
	res.render("items", { items });
}

async function getItem(req, res) {
	const id = Number(req.params.id);

	const [item, suppliers] = await Promise.all([
		db.getItemById(id),
		db.getSuppliersByItem(id),
	]);

	res.render("item", { item, suppliers });
}

module.exports = {
	getItems,
	getItem,
};
