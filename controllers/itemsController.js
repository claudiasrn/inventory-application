const db = require("../db/queries");

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

module.exports = {
	getItems,
	getItem,
};
